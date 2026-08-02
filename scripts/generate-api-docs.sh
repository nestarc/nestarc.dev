#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
WORK_DIR="$ROOT_DIR/.typedoc-work"
API_DIR="$ROOT_DIR/api"
BASE_CONFIG="$ROOT_DIR/typedoc.base.json"

PACKAGES=(
  "nestjs-tenancy:tenancy"
  "nestjs-safe-response:safe-response"
  "nestjs-audit-log:audit-log"
  "nestjs-feature-flag:feature-flag"
  "nestjs-soft-delete:soft-delete"
  "nestjs-pagination:pagination"
  "idempotency:idempotency"
  "outbox:outbox"
  "webhook:webhook"
  "api-keys:api-keys"
  "data-subject:data-subject"
  "jobs:jobs"
  "rbac:rbac"
)

REQUESTED_PACKAGES=("$@")

package_is_selected() {
  local repo="$1"
  local package="$2"

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

rm -rf "$WORK_DIR"
mkdir -p "$WORK_DIR"

npm install \
  --prefix "$WORK_DIR" \
  --no-save \
  --ignore-scripts \
  typedoc \
  typedoc-plugin-markdown

TYPEDOC_BIN="$WORK_DIR/node_modules/.bin/typedoc"

for entry in "${PACKAGES[@]}"; do
  REPO="${entry%%:*}"
  PKG="${entry##*:}"

  if ! package_is_selected "$REPO" "$PKG"; then
    continue
  fi

  PKG_DIR="$WORK_DIR/$REPO"
  OUT_DIR="$API_DIR/$PKG"

  echo "--- Generating API docs for @nestarc/$PKG ---"

  # Shallow clone
  git clone --depth 1 "https://github.com/nestarc/$REPO.git" "$PKG_DIR" 2>/dev/null

  # Install dependencies
  cd "$PKG_DIR"
  npm install --ignore-scripts 2>/dev/null

  # Determine entry points
  ENTRY_POINTS=("src/index.ts")

  for subpath in testing client; do
    if [ -f "src/$subpath.ts" ]; then
      ENTRY_POINTS+=("src/$subpath.ts")
    elif [ -f "src/$subpath/index.ts" ]; then
      ENTRY_POINTS+=("src/$subpath/index.ts")
    fi
  done

  if [ -f "src/prisma.ts" ]; then
    ENTRY_POINTS+=("src/prisma.ts")
  fi

  if [ -d "src/integrations" ]; then
    while IFS= read -r integration; do
      ENTRY_POINTS+=("$integration")
    done < <(find src/integrations -maxdepth 1 -type f -name '*.ts' | sort)
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
  fi

  cd "$ROOT_DIR"
  echo "--- Done: @nestarc/$PKG ---"
done

# Clean up work directory
rm -rf "$WORK_DIR"

echo "API docs generated in $API_DIR"
