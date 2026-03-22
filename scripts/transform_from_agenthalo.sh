#!/usr/bin/env bash
set -euo pipefail

# Usage: transform_from_agenthalo.sh <agenthalo-repo-path> [<output-dir>]
# Idempotent: same input commit produces same output (except build-info timestamp)

AGENTHALO="${1:?Usage: transform_from_agenthalo.sh <agenthalo-path> [<output-dir>]}"
OUTPUT="${2:-$(cd "$(dirname "$0")/.." && pwd)/dashboard}"

echo "[transform] Source: $AGENTHALO"
echo "[transform] Output: $OUTPUT"

# Validate source
test -f "$AGENTHALO/dashboard/index.html" || { echo "ERROR: not an agenthalo repo (missing dashboard/index.html)"; exit 1; }
test -f "$AGENTHALO/dashboard/app.js"     || { echo "ERROR: dashboard/app.js missing"; exit 1; }

# --- Step 1: Copy dashboard assets verbatim ---
rm -rf "$OUTPUT"
mkdir -p "$OUTPUT"
cp -r "$AGENTHALO/dashboard/"* "$OUTPUT/"

# --- Step 2: Inject demo scripts into index.html ---
# demo-api.js MUST load BEFORE app.js (it overrides window.fetch)
# demo-banner.js adds the overlay
if ! grep -q 'demo-api.js' "$OUTPUT/index.html"; then
  # Insert demo scripts before the first app-level script (app.js)
  sed -i '/<script src="app.js"><\/script>/i \  <script src="demo-api.js"><\/script>\n  <script src="demo-banner.js"><\/script>' "$OUTPUT/index.html"
fi

# --- Step 2b: Force all nav sections open and sub-items visible ---
# In demo mode, nav sections collapse via localStorage which is empty/stale for visitors.
# Inject CSS that overrides the collapsed state so all items are always visible.
if ! grep -q 'demo-nav-force' "$OUTPUT/index.html"; then
  sed -i '/<\/head>/i \  <style id="demo-nav-force">\
    /* Demo: force all nav sections and sub-items always visible */\
    li.nav-section-hidden {\
      max-height: 50px !important;\
      opacity: 1 !important;\
      padding: 0 12px !important;\
      pointer-events: auto !important;\
    }\
    .nav-sub-item {\
      max-height: 50px !important;\
      opacity: 1 !important;\
      overflow: visible !important;\
    }\
  </style>' "$OUTPUT/index.html"
fi

# --- Step 3: Strip production-only meta tags ---
# CSP is set by the Rust server via HTTP headers; the meta tags are unnecessary in static hosting
sed -i '/<meta http-equiv="Cache-Control"/d' "$OUTPUT/index.html"
sed -i '/<meta http-equiv="Pragma"/d' "$OUTPUT/index.html"
sed -i '/<meta http-equiv="Expires"/d' "$OUTPUT/index.html"

# --- Step 3b: Rewrite ALL absolute paths to relative ---
# When served inside an iframe at /agenthalo-demo/, absolute paths like /vendor/...
# resolve to the webapp root (404). Rewrite everything to relative.

# HTML: page links + importmap + any absolute src/href
for html_file in "$OUTPUT"/index.html "$OUTPUT"/gates.html "$OUTPUT"/codeguard.html "$OUTPUT"/forge.html; do
  if [ -f "$html_file" ]; then
    sed -i 's|href="/gates.html"|href="gates.html"|g' "$html_file"
    sed -i 's|href="/codeguard.html"|href="codeguard.html"|g' "$html_file"
    sed -i 's|href="/forge.html"|href="forge.html"|g' "$html_file"
    # Importmap and script src: "/vendor/" → "./vendor/"
    sed -i 's|"/vendor/|"./vendor/|g' "$html_file"
    # "← Dashboard" back link: href="/" → href="index.html"
    sed -i 's|href="/"|href="index.html"|g' "$html_file"
    # CodeGuard link inside gates page
    sed -i 's|href="/codeguard.html"|href="codeguard.html"|g' "$html_file"
  fi
done

# JS: dynamic import('/vendor/...') and fetch('/vendor/...') and fetch('/proof-lattice...')
for js_file in "$OUTPUT"/*.js; do
  sed -i "s|import('/vendor/|import('./vendor/|g" "$js_file" 2>/dev/null || true
  sed -i 's|import("/vendor/|import("./vendor/|g' "$js_file" 2>/dev/null || true
  sed -i "s|fetch('/vendor/|fetch('./vendor/|g" "$js_file" 2>/dev/null || true
  sed -i "s|fetch('/proof-lattice|fetch('./proof-lattice|g" "$js_file" 2>/dev/null || true
  # Fix iframe src="/forge.html" and similar absolute HTML page refs in JS
  sed -i 's|src="/forge.html"|src="forge.html"|g' "$js_file" 2>/dev/null || true
  sed -i 's|src="/gates.html"|src="gates.html"|g' "$js_file" 2>/dev/null || true
  sed -i 's|src="/codeguard.html"|src="codeguard.html"|g' "$js_file" 2>/dev/null || true
done

# --- Step 4: Extract route manifest from Rust source ---
# Only extract paths from actual axum route registrations (.route, .get, .post, etc.),
# NOT every quoted slash-string (which would include /bin/bash, filesystem paths, etc.)
ROUTE_FILES=(
  "$AGENTHALO/src/dashboard/api.rs"
  "$AGENTHALO/src/dashboard/codeguard_api.rs"
  "$AGENTHALO/src/dashboard/gates_api.rs"
  "$AGENTHALO/src/dashboard/forge_api.rs"
  "$AGENTHALO/src/dashboard/editor_api.rs"
  "$AGENTHALO/src/dashboard/explorer_api.rs"
)

: > "$OUTPUT/route-manifest.txt"

# Helper: extract routes from a Rust source file.
# axum registrations may span multiple lines (.route(\n  "/path",\n  handler))
# so we use -A2 context and filter to API-looking paths.
extract_routes() {
  local file="$1"
  local prefix="$2"  # e.g., "/codeguard" for nested routers
  grep -A2 -P '\.(route|get|post|put|delete|patch)\(' "$file" 2>/dev/null \
    | grep -ohP '"/[a-z][a-z0-9_/{}.:-]*"' \
    | tr -d '"' \
    | grep -P '^/[a-z]' \
    | grep -vP '^/(bin|usr|home|tmp|etc|var|dev|proc|sys)/' \
    | sed "s|^|${prefix}|" || true
}

# Main API router — routes are already fully qualified
if [ -f "$AGENTHALO/src/dashboard/api.rs" ]; then
  extract_routes "$AGENTHALO/src/dashboard/api.rs" "" >> "$OUTPUT/route-manifest.txt"
fi

# Nested sub-routers: their internal routes need the parent prefix.
# These nesting relationships are defined in api.rs via .nest("/prefix", sub::router())
declare -A NESTED_ROUTERS=(
  ["codeguard_api.rs"]="/codeguard"
  ["gates_api.rs"]="/gates"
  ["forge_api.rs"]="/forge"
  ["editor_api.rs"]="/files"
  ["explorer_api.rs"]="/explorer"
)

for file in "${!NESTED_ROUTERS[@]}"; do
  full_path="$AGENTHALO/src/dashboard/$file"
  prefix="${NESTED_ROUTERS[$file]}"
  if [ -f "$full_path" ]; then
    extract_routes "$full_path" "$prefix" >> "$OUTPUT/route-manifest.txt"
  fi
done
sort -u -o "$OUTPUT/route-manifest.txt" "$OUTPUT/route-manifest.txt"

echo "[transform] $(wc -l < "$OUTPUT/route-manifest.txt") API routes extracted"

# --- Step 5: Copy demo-specific files from playground repo ---
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PLAYGROUND_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

for f in demo-api.js demo-banner.js; do
  if [ -f "$PLAYGROUND_ROOT/src/$f" ]; then
    cp "$PLAYGROUND_ROOT/src/$f" "$OUTPUT/$f"
  fi
done

# Copy fixtures
if [ -d "$PLAYGROUND_ROOT/src/demo-fixtures" ]; then
  rm -rf "$OUTPUT/demo-fixtures"
  cp -r "$PLAYGROUND_ROOT/src/demo-fixtures" "$OUTPUT/demo-fixtures"
fi

# --- Step 6: Generate build info ---
SRC_COMMIT="$(git -C "$AGENTHALO" rev-parse --short HEAD 2>/dev/null || echo "unknown")"
cat > "$OUTPUT/build-info.json" <<BUILDEOF
{
  "source_repo": "Abraxas1010/agenthalo",
  "source_commit": "${SRC_COMMIT}",
  "transformed_at": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "route_count": $(wc -l < "$OUTPUT/route-manifest.txt"),
  "demo_mode": true,
  "wasm_enabled": false
}
BUILDEOF

echo "[transform] Done. $(find "$OUTPUT" -type f | wc -l) files."
echo "[transform] Size: $(du -sh "$OUTPUT" | cut -f1)"
