#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
WORK_DIR="$ROOT_DIR/.typedoc-work"
API_DIR="$ROOT_DIR/api"
BASE_CONFIG="$ROOT_DIR/typedoc.base.json"
TYPEDOC_BIN="$ROOT_DIR/node_modules/.bin/typedoc"
ANCHOR_FIXER="$ROOT_DIR/scripts/fix-api-anchors.mjs"
PACKAGE_LISTER="$ROOT_DIR/scripts/list-api-packages.mjs"
API_VALIDATOR="$ROOT_DIR/scripts/validate-api-docs.mjs"
ENTRY_POINT_LISTER="$ROOT_DIR/scripts/list-package-entry-points.mjs"
PROVENANCE_VERIFIER="$ROOT_DIR/scripts/verify-release-provenance.mjs"
STAGING_API_DIR="$WORK_DIR/api"
VALIDATION_API_DIR="$WORK_DIR/validation-api"

PACKAGE_TSV="$(node "$PACKAGE_LISTER")"
if [ -z "$PACKAGE_TSV" ]; then
  echo "Error: package catalog did not return any generated API packages" >&2
  exit 1
fi

PACKAGES=()
while IFS=$'\t' read -r repository package version tag release_provenance; do
  PACKAGES+=(
    "$repository"$'\t'"$package"$'\t'"$version"$'\t'"$tag"$'\t'"$release_provenance"
  )
done <<< "$PACKAGE_TSV"

REQUESTED_PACKAGES=("$@")

package_is_selected() {
  local repo="$1"
  local package="$2"
  local requested

  if [ "${#REQUESTED_PACKAGES[@]}" -eq 0 ]; then
    return 0
  fi

  for requested in "${REQUESTED_PACKAGES[@]}"; do
    if [ "$requested" = "$repo" ] || [ "$requested" = "$package" ]; then
      return 0
    fi
  done

  return 1
}

validate_requested_packages() {
  local requested
  local entry
  local repo
  local package
  local ignored_version
  local ignored_tag
  local ignored_release_provenance
  local match_count

  if [ "${#REQUESTED_PACKAGES[@]}" -eq 0 ]; then
    return 0
  fi

  for requested in "${REQUESTED_PACKAGES[@]}"; do
    match_count=0
    for entry in "${PACKAGES[@]}"; do
      IFS=$'\t' read -r \
        repo package ignored_version ignored_tag ignored_release_provenance <<< "$entry"
      if [ "$requested" = "$repo" ] || [ "$requested" = "$package" ]; then
        match_count=$((match_count + 1))
      fi
    done

    if [ "$match_count" -eq 0 ]; then
      echo "Error: package selector '$requested' did not match any catalog package" >&2
      return 1
    fi
    if [ "$match_count" -ne 1 ]; then
      echo "Error: package selector '$requested' matched $match_count catalog packages" >&2
      return 1
    fi
  done
}

validate_requested_packages

# The workspace path is fixed above; refuse cleanup if it ever resolves to an
# unexpected location.
if [ -z "$WORK_DIR" ] || [ "$WORK_DIR" = "/" ] ||
  [ "$(dirname "$WORK_DIR")" != "$ROOT_DIR" ]; then
  echo "Error: refusing to use unsafe TypeDoc work directory: $WORK_DIR" >&2
  exit 1
fi

if [ ! -x "$TYPEDOC_BIN" ]; then
  echo "Error: TypeDoc is not installed. Run 'npm ci' first." >&2
  exit 1
fi

rm -rf -- "$WORK_DIR"
mkdir -p "$STAGING_API_DIR"
trap 'rm -rf -- "$WORK_DIR"' EXIT

SELECTED_COUNT=0

for entry in "${PACKAGES[@]}"; do
  IFS=$'\t' read -r REPO PKG VERSION TAG RELEASE_PROVENANCE <<< "$entry"

  if ! package_is_selected "$REPO" "$PKG"; then
    continue
  fi

  SELECTED_COUNT=$((SELECTED_COUNT + 1))
  PKG_DIR="$WORK_DIR/$REPO"
  OUT_DIR="$STAGING_API_DIR/$PKG"

  echo "--- Generating API docs for @nestarc/$PKG $TAG ---"

  if ! PUBLISHED_METADATA="$(
    npm view \
      "@nestarc/$PKG@$VERSION" \
      version \
      gitHead \
      dist \
      --json
  )"; then
    echo "Error: @nestarc/$PKG@$VERSION is not available from npm" >&2
    exit 1
  fi

  # Generate from the published release rather than a moving default branch.
  git -c advice.detachedHead=false clone \
    --depth 1 \
    --branch "$TAG" \
    --single-branch \
    "https://github.com/nestarc/$REPO.git" \
    "$PKG_DIR"

  SOURCE_COMMIT="$(git -C "$PKG_DIR" rev-parse "HEAD^{commit}")"
  if [[ ! "$SOURCE_COMMIT" =~ ^[0-9a-f]{40}$ ]]; then
    echo "Error: $REPO $TAG resolved to an invalid commit: $SOURCE_COMMIT" >&2
    exit 1
  fi

  if ! TAG_COMMIT="$(
    git -C "$PKG_DIR" rev-parse --verify "refs/tags/$TAG^{commit}" 2>/dev/null
  )"; then
    echo "Error: $REPO checkout does not contain the expected tag ref refs/tags/$TAG" >&2
    exit 1
  fi
  if [[ ! "$TAG_COMMIT" =~ ^[0-9a-f]{40}$ ]]; then
    echo "Error: $REPO tag $TAG resolved to an invalid commit: $TAG_COMMIT" >&2
    exit 1
  fi
  if [ "$SOURCE_COMMIT" != "$TAG_COMMIT" ]; then
    echo "Error: $REPO checkout HEAD $SOURCE_COMMIT does not match tag $TAG commit $TAG_COMMIT" >&2
    exit 1
  fi

  AUDITED_VERSION=""
  AUDITED_INTEGRITY=""
  case "$RELEASE_PROVENANCE" in
    gitHead)
      ;;
    slsa)
      # The repository-owned catalog, not mutable registry metadata, selects
      # the stronger trusted-publisher policy. npm verifies the registry
      # signature as defense in depth; the verifier independently validates the
      # exact fetched SLSA bundle and binds it to this installed lock entry.
      PROVENANCE_AUDIT_DIR="$WORK_DIR/.provenance-audit/$PKG"
      mkdir -p "$PROVENANCE_AUDIT_DIR"
      node -e '
        const { writeFileSync } = require("node:fs");
        const [outputPath, packageName, version] = process.argv.slice(1);
        writeFileSync(outputPath, `${JSON.stringify({
          private: true,
          dependencies: { [packageName]: version },
        }, null, 2)}\n`);
      ' \
        "$PROVENANCE_AUDIT_DIR/package.json" \
        "@nestarc/$PKG" \
        "$VERSION"

      (
        cd "$PROVENANCE_AUDIT_DIR"
        npm install \
          --ignore-scripts \
          --no-audit \
          --no-fund \
          --legacy-peer-deps
        npm audit signatures
      )

      if ! AUDITED_ARTIFACT="$(node -e '
        const { readFileSync } = require("node:fs");
        const [lockPath, packageName, expectedVersion] = process.argv.slice(1);
        const lock = JSON.parse(readFileSync(lockPath, "utf8"));
        const declaredVersion = lock.packages?.[""]?.dependencies?.[packageName];
        const installed = lock.packages?.[`node_modules/${packageName}`];
        if (
          declaredVersion !== expectedVersion ||
          installed?.version !== expectedVersion ||
          typeof installed?.integrity !== "string" ||
          installed.integrity.length === 0
        ) {
          throw new Error(
            `audited lock entry for ${packageName}@${expectedVersion} is missing or mismatched`,
          );
        }
        process.stdout.write(`${installed.version}\t${installed.integrity}`);
      ' \
        "$PROVENANCE_AUDIT_DIR/package-lock.json" \
        "@nestarc/$PKG" \
        "$VERSION"
      )"; then
        echo "Error: failed to read the audited lock entry for @nestarc/$PKG@$VERSION" >&2
        exit 1
      fi
      IFS=$'\t' read -r AUDITED_VERSION AUDITED_INTEGRITY <<< "$AUDITED_ARTIFACT"
      if [ -z "$AUDITED_VERSION" ] || [ -z "$AUDITED_INTEGRITY" ]; then
        echo "Error: audited lock entry for @nestarc/$PKG@$VERSION was incomplete" >&2
        exit 1
      fi
      ;;
    *)
      echo "Error: unsupported release provenance policy '$RELEASE_PROVENANCE' for @nestarc/$PKG" >&2
      exit 1
      ;;
  esac

  node "$PROVENANCE_VERIFIER" \
    "$PUBLISHED_METADATA" \
    "$VERSION" \
    "$SOURCE_COMMIT" \
    "@nestarc/$PKG" \
    "$REPO" \
    "$TAG" \
    "$RELEASE_PROVENANCE" \
    "$AUDITED_VERSION" \
    "$AUDITED_INTEGRITY"

  EXISTING_PROVENANCE="$API_DIR/$PKG/.generated.json"
  if [ -d "$API_DIR/$PKG" ] && [ ! -f "$EXISTING_PROVENANCE" ]; then
    echo "Error: existing API output for @nestarc/$PKG is missing .generated.json" >&2
    exit 1
  fi
  if [ -f "$EXISTING_PROVENANCE" ]; then
    EXISTING_SOURCE="$(node -e '
      const provenance = require(process.argv[1]);
      process.stdout.write(
        `${provenance.version ?? ""}\t${provenance.tag ?? ""}\t${provenance.commit ?? ""}`,
      );
    ' "$EXISTING_PROVENANCE")"
    IFS=$'\t' read -r EXISTING_VERSION EXISTING_TAG EXISTING_COMMIT <<< "$EXISTING_SOURCE"
    if [ "$EXISTING_VERSION" = "$VERSION" ] &&
      [ "$EXISTING_TAG" = "$TAG" ] &&
      [ "$EXISTING_COMMIT" != "$SOURCE_COMMIT" ]; then
      echo "Error: immutable tag $REPO $TAG moved from $EXISTING_COMMIT to $SOURCE_COMMIT" >&2
      exit 1
    fi
  fi

  SOURCE_METADATA="$(node -e '
    const packageJson = require(process.argv[1]);
    process.stdout.write(`${packageJson.name ?? ""}\t${packageJson.version ?? ""}`);
  ' "$PKG_DIR/package.json")"
  IFS=$'\t' read -r SOURCE_NAME SOURCE_VERSION <<< "$SOURCE_METADATA"
  if [ "$SOURCE_NAME" != "@nestarc/$PKG" ] || [ "$SOURCE_VERSION" != "$VERSION" ]; then
    echo "Error: $REPO $TAG contains $SOURCE_NAME@$SOURCE_VERSION; expected @nestarc/$PKG@$VERSION" >&2
    exit 1
  fi

  # Respect each release's lockfile when one is available.
  cd "$PKG_DIR"
  if [ -f "package-lock.json" ]; then
    npm ci --ignore-scripts --no-audit --no-fund
  else
    npm install --ignore-scripts --no-audit --no-fund
  fi

  # Follow the package's public exports so every supported subpath receives
  # API coverage. The lister fails closed when an export cannot be mapped to
  # a source entry point instead of silently omitting it.
  if ! ENTRY_POINT_OUTPUT="$(node "$ENTRY_POINT_LISTER" "$PKG_DIR")"; then
    echo "Error: failed to resolve public entry points for @nestarc/$PKG" >&2
    exit 1
  fi
  ENTRY_POINTS=()
  while IFS= read -r source_entry; do
    ENTRY_POINTS+=("$source_entry")
  done <<< "$ENTRY_POINT_OUTPUT"
  if [ "${#ENTRY_POINTS[@]}" -eq 0 ] || [ -z "${ENTRY_POINTS[0]}" ]; then
    echo "Error: @nestarc/$PKG did not expose any TypeScript API entry points" >&2
    exit 1
  fi

  # Use tsconfig.build.json to exclude test files
  TSCONFIG="tsconfig.json"
  if [ -f "tsconfig.build.json" ]; then
    TSCONFIG="tsconfig.build.json"
  fi

  # Run TypeDoc (skipErrorChecking to handle missing dev types)
  "$TYPEDOC_BIN" \
    --options "$BASE_CONFIG" \
    --tsconfig "$TSCONFIG" \
    --skipErrorChecking \
    --entryPoints "${ENTRY_POINTS[@]}" \
    --out "$OUT_DIR" \
    --name "@nestarc/$PKG"

  # A single root entry point can be emitted as globals.md by TypeDoc.
  # Keep the package directory URL stable for VitePress and existing links.
  if [ ! -f "$OUT_DIR/index.md" ] && [ -f "$OUT_DIR/globals.md" ]; then
    mv "$OUT_DIR/globals.md" "$OUT_DIR/index.md"
  fi

  if [ ! -s "$OUT_DIR/index.md" ]; then
    echo "Error: @nestarc/$PKG did not generate a non-empty index.md" >&2
    exit 1
  fi

  # TypeDoc names some single-module pages "index" even when --name is set.
  # Give every package entry page a meaningful, stable title.
  if [ "$(head -n 1 "$OUT_DIR/index.md")" = "# index" ]; then
    sed "1s|^# index$|# @nestarc/$PKG|" \
      "$OUT_DIR/index.md" > "$OUT_DIR/index.md.tmp"
    mv "$OUT_DIR/index.md.tmp" "$OUT_DIR/index.md"
  fi

  # Source URLs emitted by TypeDoc must not expose this site's temporary
  # checkout path.
  while IFS= read -r generated_markdown; do
    sed "s#\.typedoc-work/$REPO/##g" \
      "$generated_markdown" > "$generated_markdown.tmp"
    mv "$generated_markdown.tmp" "$generated_markdown"
  done < <(find "$OUT_DIR" -type f -name '*.md' | sort)

  # TypeDoc may copy a referenced example directory into _media with README.md
  # only. Add the sibling page expected by VitePress extensionless links.
  if [ -d "$OUT_DIR/_media" ]; then
    while IFS= read -r media_readme; do
      media_page="$(dirname "$media_readme").md"
      if [ ! -f "$media_page" ]; then
        cp "$media_readme" "$media_page"
      fi
    done < <(find "$OUT_DIR/_media" -type f -name 'README.md' | sort)

    # VitePress resolves extensionless links as Markdown pages. TypeDoc can
    # copy files such as LICENSE without an extension, so add a page sibling.
    while IFS= read -r extensionless_media; do
      if [ ! -f "$extensionless_media.md" ]; then
        cp "$extensionless_media" "$extensionless_media.md"
      fi
    done < <(find "$OUT_DIR/_media" -type f ! -name '*.*' | sort)

    # TypeDoc relocates localized READMEs into _media without rebasing their
    # link back to the package README. Keep that local link resolvable.
    while IFS= read -r localized_readme; do
      if grep -Fq '](./README.md)' "$localized_readme"; then
        sed 's#](\./README\.md)#](../README.md)#g' \
          "$localized_readme" > "$localized_readme.tmp"
        mv "$localized_readme.tmp" "$localized_readme"
      fi
    done < <(find "$OUT_DIR/_media" -maxdepth 1 -type f -name 'README.*.md' | sort)

    # Historical specs can link back to the release changelog. TypeDoc copies
    # the spec into _media but does not materialize that root-level target.
    MEDIA_CHANGELOG_LINKED=0
    while IFS= read -r media_markdown; do
      if grep -Eq '\]\(\.\./CHANGELOG\.md([)#?]|$)' "$media_markdown"; then
        MEDIA_CHANGELOG_LINKED=1
        break
      fi
    done < <(find "$OUT_DIR/_media" -type f -name '*.md' | sort)

    if [ "$MEDIA_CHANGELOG_LINKED" -eq 1 ]; then
      if [ ! -s "$PKG_DIR/CHANGELOG.md" ]; then
        echo "Error: @nestarc/$PKG generated media links to ../CHANGELOG.md, but the source changelog is missing or empty" >&2
        exit 1
      fi
      cp "$PKG_DIR/CHANGELOG.md" "$OUT_DIR/CHANGELOG.md"
    fi

  fi

  # The Markdown plugin can preserve a README license-badge link as
  # ./LICENSE without copying that target. Materialize the source license as
  # a VitePress Markdown page instead of hiding the dead link.
  if [ -f "$OUT_DIR/README.md" ] &&
    grep -Eq '\]\(\./LICENSE([)#?]|$)' "$OUT_DIR/README.md"; then
    if [ ! -f "$PKG_DIR/LICENSE" ]; then
      echo "Error: @nestarc/$PKG links to ./LICENSE, but the source file is missing" >&2
      exit 1
    fi

    cp "$PKG_DIR/LICENSE" "$OUT_DIR/LICENSE.md"
  fi

  # typedoc-plugin-markdown and VitePress use different slug rules for
  # duplicate headings and underscores. Normalize generated local fragments
  # against the IDs VitePress will actually render.
  node "$ANCHOR_FIXER" "$OUT_DIR"

  node -e '
    const { writeFileSync } = require("node:fs");
    const [outputPath, packageName, slug, repository, version, tag, commit] =
      process.argv.slice(1);
    const provenance = {
      package: packageName,
      slug,
      repository,
      version,
      tag,
      commit,
    };
    writeFileSync(outputPath, `${JSON.stringify(provenance, null, 2)}\n`);
  ' \
    "$OUT_DIR/.generated.json" \
    "@nestarc/$PKG" \
    "$PKG" \
    "$REPO" \
    "$VERSION" \
    "$TAG" \
    "$SOURCE_COMMIT"

  cd "$ROOT_DIR"
  echo "--- Done: @nestarc/$PKG ---"
done

if [ "$SELECTED_COUNT" -eq 0 ]; then
  echo "Error: no package matched the requested selection" >&2
  exit 1
fi

# Validate the exact tree that would be published. A partial generation keeps
# unselected package output from the current API tree while replacing selected
# packages with their staged output.
if [ ! -d "$API_DIR" ]; then
  echo "Error: existing API documentation directory is missing: $API_DIR" >&2
  exit 1
fi

mkdir -p "$VALIDATION_API_DIR"
cp -R "$API_DIR/." "$VALIDATION_API_DIR/"

for entry in "${PACKAGES[@]}"; do
  IFS=$'\t' read -r REPO PKG VERSION TAG RELEASE_PROVENANCE <<< "$entry"

  if ! package_is_selected "$REPO" "$PKG"; then
    continue
  fi

  rm -rf -- "$VALIDATION_API_DIR/$PKG"
  cp -R "$STAGING_API_DIR/$PKG" "$VALIDATION_API_DIR/$PKG"
done

echo "--- Validating merged API docs before publish ---"
API_DOCS_DIR="$VALIDATION_API_DIR" node "$API_VALIDATOR"

# Publish only after every selected package generated and the merged API tree
# validated successfully. Existing API output is untouched before this point.
for entry in "${PACKAGES[@]}"; do
  IFS=$'\t' read -r REPO PKG VERSION TAG RELEASE_PROVENANCE <<< "$entry"

  if ! package_is_selected "$REPO" "$PKG"; then
    continue
  fi

  rm -rf -- "$API_DIR/$PKG"
  mv "$STAGING_API_DIR/$PKG" "$API_DIR/$PKG"
done

echo "API docs generated in $API_DIR"
