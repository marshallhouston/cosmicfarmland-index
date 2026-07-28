#!/usr/bin/env bash
# Sync the vault-sourced pages (skinned by sync-vault.mjs), commit, push.
# Railway auto-deploys main, so push == deploy.
set -euo pipefail

REPO="$(cd "$(dirname "$0")/.." && pwd)"
node "$REPO/scripts/sync-vault.mjs" "$@"

cd "$REPO"
if git diff --quiet -- public/; then
  echo "pages unchanged, nothing to deploy"
  exit 0
fi
git add public/
git commit -m "chore: sync vault pages"
git push
echo "pushed - Railway will deploy to https://cosmicfarmland.wtf/golf"
