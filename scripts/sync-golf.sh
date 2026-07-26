#!/usr/bin/env bash
# Sync the golf page from the vault (skinned by sync-golf.mjs), commit, push.
# Railway auto-deploys main, so push == deploy.
set -euo pipefail

REPO="$(cd "$(dirname "$0")/.." && pwd)"
node "$REPO/scripts/sync-golf.mjs"

cd "$REPO"
if git diff --quiet -- public/golf.html; then
  echo "golf.html unchanged, nothing to deploy"
  exit 0
fi
git add public/golf.html
git commit -m "chore: sync golf record from vault"
git push
echo "pushed - Railway will deploy to https://cosmicfarmland.wtf/golf"
