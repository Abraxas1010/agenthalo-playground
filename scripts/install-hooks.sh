#!/usr/bin/env bash
set -euo pipefail

# Install git hooks for the agenthalo-playground repo.
# Run once after cloning.

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
HOOKS_DIR="$REPO_ROOT/.git/hooks"

mkdir -p "$HOOKS_DIR"

# Pre-push hook: validate dashboard before pushing
cat > "$HOOKS_DIR/pre-push" << 'HOOKEOF'
#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel)"

if [ -f "$REPO_ROOT/dashboard/index.html" ]; then
  echo "[pre-push] Running playground validation..."
  if ! bash "$REPO_ROOT/scripts/validate_playground.sh" "$REPO_ROOT/dashboard"; then
    echo "[pre-push] BLOCKED: validation failed. Fix the issues above before pushing."
    exit 1
  fi
  echo "[pre-push] Validation passed."
fi
HOOKEOF

chmod +x "$HOOKS_DIR/pre-push"
echo "Installed pre-push hook at $HOOKS_DIR/pre-push"
