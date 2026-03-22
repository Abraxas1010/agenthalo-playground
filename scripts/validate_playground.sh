#!/usr/bin/env bash
set -euo pipefail

# Validate the playground dashboard output is ready for deployment.
# Run this before pushing or as a pre-commit hook.

DASHBOARD="${1:-$(cd "$(dirname "$0")/.." && pwd)/dashboard}"
ERRORS=0

echo "=== AgentHALO Playground Validation ==="
echo "Dashboard: $DASHBOARD"
echo

# --- Gate 1: Required files exist ---
echo "[Gate 1] Required files..."
for f in index.html app.js style.css demo-api.js demo-banner.js route-manifest.txt build-info.json; do
  if [ ! -f "$DASHBOARD/$f" ]; then
    echo "  FAIL: $f missing"
    ERRORS=$((ERRORS + 1))
  fi
done
test -d "$DASHBOARD/demo-fixtures" || { echo "  FAIL: demo-fixtures/ missing"; ERRORS=$((ERRORS + 1)); }
test -d "$DASHBOARD/vendor"        || { echo "  FAIL: vendor/ missing"; ERRORS=$((ERRORS + 1)); }
echo "  $([ $ERRORS -eq 0 ] && echo "PASS" || echo "FAIL")"

# --- Gate 2: Injection order ---
echo "[Gate 2] Script injection order..."
DEMO_LINE=$(grep -n 'demo-api.js' "$DASHBOARD/index.html" | head -1 | cut -d: -f1)
APP_LINE=$(grep -n 'src="app.js"' "$DASHBOARD/index.html" | head -1 | cut -d: -f1)
if [ -n "$DEMO_LINE" ] && [ -n "$APP_LINE" ] && [ "$DEMO_LINE" -lt "$APP_LINE" ]; then
  echo "  PASS (demo-api.js:$DEMO_LINE < app.js:$APP_LINE)"
else
  echo "  FAIL: demo-api.js must load before app.js"
  ERRORS=$((ERRORS + 1))
fi

# --- Gate 3: Fixture coverage (route manifest vs interceptor) ---
echo "[Gate 3] Fixture coverage..."
ROUTE_COUNT=$(wc -l < "$DASHBOARD/route-manifest.txt" 2>/dev/null || echo "0")
FIXTURE_COUNT=$(find "$DASHBOARD/demo-fixtures" -name '*.json' 2>/dev/null | wc -l)
echo "  Routes in manifest: $ROUTE_COUNT"
echo "  Fixture files: $FIXTURE_COUNT"
if [ "$FIXTURE_COUNT" -ge 30 ]; then
  echo "  PASS (fixture count)"
else
  echo "  FAIL: expected >=30 fixtures"
  ERRORS=$((ERRORS + 1))
fi

# Verify manifest has no junk (no /bin/, /usr/, /home/, /tmp/ paths)
JUNK_LINES=$(grep -P '^/(bin|usr|home|tmp|etc|var|dev|proc|sys)/' "$DASHBOARD/route-manifest.txt" 2>/dev/null || true)
if [ -z "$JUNK_LINES" ]; then
  JUNK=0
else
  JUNK=$(echo "$JUNK_LINES" | wc -l)
fi
if [ "$JUNK" -gt 0 ]; then
  echo "  FAIL: route manifest contains $JUNK junk entries (filesystem paths)"
  echo "$JUNK_LINES" | head -5 | sed 's/^/    /'
  ERRORS=$((ERRORS + 1))
else
  echo "  PASS (no junk in manifest)"
fi

# Verify every manifest route family is covered by demo-api.js interceptor
# Extract top-level route families from manifest (e.g., /cockpit, /sessions, /costs)
UNCOVERED=0
DEMO_API_SRC="$DASHBOARD/demo-api.js"
if [ -f "$DEMO_API_SRC" ] && [ -f "$DASHBOARD/route-manifest.txt" ]; then
  while IFS= read -r route; do
    # Extract the first two segments: /cockpit/sessions → /cockpit
    FAMILY=$(echo "$route" | grep -oP '^/[^/{]+' | head -1)
    [ -z "$FAMILY" ] && continue
    # Check if demo-api.js has a route covering /api$FAMILY
    if ! grep -qP "\"/api${FAMILY}" "$DEMO_API_SRC"; then
      echo "  UNCOVERED: /api${route} (family: /api${FAMILY})"
      UNCOVERED=$((UNCOVERED + 1))
    fi
  done < "$DASHBOARD/route-manifest.txt"
  if [ "$UNCOVERED" -gt 0 ]; then
    echo "  FAIL: $UNCOVERED manifest routes not covered by demo-api.js"
    ERRORS=$((ERRORS + UNCOVERED))
  else
    echo "  PASS (all route families covered by interceptor)"
  fi
fi

# --- Gate 4: All fixtures are valid JSON ---
echo "[Gate 4] Fixture JSON validity..."
INVALID=0
for f in "$DASHBOARD"/demo-fixtures/*.json; do
  if ! python3 -c "import json; json.load(open('$f'))" 2>/dev/null; then
    echo "  INVALID: $f"
    INVALID=$((INVALID + 1))
  fi
done
if [ "$INVALID" -eq 0 ]; then
  echo "  PASS ($FIXTURE_COUNT files valid)"
else
  echo "  FAIL: $INVALID invalid fixtures"
  ERRORS=$((ERRORS + INVALID))
fi

# --- Gate 5: No secrets ---
echo "[Gate 5] Secret scan..."
if grep -rPi '(sk-[a-zA-Z0-9]{20,}|pk_live_|Bearer [a-zA-Z0-9]{30,})' "$DASHBOARD/demo-fixtures/" 2>/dev/null; then
  echo "  FAIL: possible secrets detected"
  ERRORS=$((ERRORS + 1))
else
  echo "  PASS"
fi

# --- Gate 6: No empty fixtures ---
echo "[Gate 6] No empty fixtures..."
EMPTY=0
for f in "$DASHBOARD"/demo-fixtures/*.json; do
  size=$(wc -c < "$f")
  if [ "$size" -lt 20 ]; then
    echo "  TOO SMALL: $f ($size bytes)"
    EMPTY=$((EMPTY + 1))
  fi
done
if [ "$EMPTY" -eq 0 ]; then
  echo "  PASS"
else
  echo "  FAIL: $EMPTY fixtures too small"
  ERRORS=$((ERRORS + EMPTY))
fi

# --- Gate 7: Bundle size ---
echo "[Gate 7] Bundle size..."
SIZE_KB=$(du -sk "$DASHBOARD" | cut -f1)
SIZE_MB=$((SIZE_KB / 1024))
echo "  Size: ${SIZE_MB}MB"
if [ "$SIZE_MB" -lt 100 ]; then
  echo "  PASS"
else
  echo "  FAIL: >100MB"
  ERRORS=$((ERRORS + 1))
fi

echo
echo "=== Result: $([ $ERRORS -eq 0 ] && echo "ALL GATES PASSED" || echo "$ERRORS FAILURES") ==="
exit $ERRORS
