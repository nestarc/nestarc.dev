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
)

rm -rf "$WORK_DIR"
mkdir -p "$WORK_DIR"

npm install -g typedoc typedoc-plugin-markdown 2>/dev/null || true

for entry in "${PACKAGES[@]}"; do
  REPO="${entry%%:*}"
  PKG="${entry##*:}"
  PKG_DIR="$WORK_DIR/$REPO"
  OUT_DIR="$API_DIR/$PKG"

  echo "--- Generating API docs for @nestarc/$PKG ---"

  # Shallow clone
  git clone --depth 1 "https://github.com/nestarc/$REPO.git" "$PKG_DIR" 2>/dev/null

  # Install dependencies
  cd "$PKG_DIR"
  npm install --ignore-scripts 2>/dev/null

  # Determine entry points
  ENTRY_POINTS="src/index.ts"
  if [ -f "src/testing/index.ts" ]; then
    ENTRY_POINTS="$ENTRY_POINTS src/testing/index.ts"
  fi
  if [ -f "src/client/index.ts" ]; then
    ENTRY_POINTS="$ENTRY_POINTS src/client/index.ts"
  fi

  # Use tsconfig.build.json to exclude test files
  TSCONFIG="tsconfig.json"
  if [ -f "tsconfig.build.json" ]; then
    TSCONFIG="tsconfig.build.json"
  fi

  # Run TypeDoc (skipErrorChecking to handle missing dev types)
  npx typedoc \
    --options "$BASE_CONFIG" \
    --tsconfig "$TSCONFIG" \
    --skipErrorChecking \
    --entryPoints $ENTRY_POINTS \
    --out "$OUT_DIR" \
    --name "@nestarc/$PKG" \
    2>&1 || echo "Warning: TypeDoc had issues for $PKG"

  cd "$ROOT_DIR"
  echo "--- Done: @nestarc/$PKG ---"
done

# Clean up work directory
rm -rf "$WORK_DIR"

echo "API docs generated in $API_DIR"
