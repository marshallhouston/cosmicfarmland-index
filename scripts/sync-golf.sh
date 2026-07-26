#!/usr/bin/env bash
# Pull the golf record page from the Obsidian vault, commit, push.
# Railway auto-deploys main, so push == deploy.
set -euo pipefail

REPO="$(cd "$(dirname "$0")/.." && pwd)"
SRC="${VAULT:-$HOME/marshall.notes}/golf-rounds-deep-dive-ghin.html"

cp "$SRC" "$REPO/public/golf.html"
cd "$REPO"
if git diff --quiet -- public/golf.html; then
  echo "golf.html unchanged, nothing to deploy"
  exit 0
fi
git add public/golf.html
git commit -m "chore: sync golf record from vault"
git push
echo "pushed - Railway will deploy to https://cosmicfarmland.wtf/golf.html"
