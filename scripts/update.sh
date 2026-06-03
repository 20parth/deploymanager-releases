#!/usr/bin/env bash
# DeployManager — bare-metal update script
# Always downloads the latest release from GitHub.
set -euo pipefail

GITHUB_REPO="20parth/deploymanager-releases"
INSTALL_DIR="$(cd "$(dirname "$0")/.." && pwd)"

echo "▶ Fetching latest version..."
RELEASE_VERSION=$(curl -fsSL "https://api.github.com/repos/${GITHUB_REPO}/releases/latest" \
  | grep -o '"tag_name": *"v[^"]*"' | grep -o '[0-9][^"]*')
[[ -z "$RELEASE_VERSION" ]] && { echo "Could not fetch latest version from GitHub."; exit 1; }
RELEASE_BASE="https://github.com/${GITHUB_REPO}/releases/download/v${RELEASE_VERSION}"
RELEASE_URL="${RELEASE_BASE}/deploymanager-v${RELEASE_VERSION}.tar.gz"
RELEASE_SHA256_URL="${RELEASE_BASE}/deploymanager-v${RELEASE_VERSION}.tar.gz.sha256"

CURRENT_VERSION=$(grep '^# version:' "$INSTALL_DIR/.install-info" 2>/dev/null | awk '{print $3}' || echo "unknown")
echo "  Current: ${CURRENT_VERSION}  →  Latest: ${RELEASE_VERSION}"

cd "$INSTALL_DIR"

echo "▶ Backing up .env..."
cp backend/.env backend/.env.bak

echo "▶ Downloading v${RELEASE_VERSION}..."
TMPFILE=$(mktemp /tmp/deploymanager-XXXXXX.tar.gz)
curl -fsSL "$RELEASE_URL" -o "$TMPFILE"
EXPECTED_SHA=$(curl -fsSL "$RELEASE_SHA256_URL" | awk '{print $1}')
if [[ -n "$EXPECTED_SHA" ]]; then
  echo "${EXPECTED_SHA}  ${TMPFILE}" | sha256sum -c &>/dev/null \
    || { echo "Checksum mismatch — aborting."; rm -f "$TMPFILE"; exit 1; }
fi
tar -xzf "$TMPFILE" -C "$INSTALL_DIR"
rm -f "$TMPFILE"

echo "▶ Restoring .env..."
cp backend/.env.bak backend/.env

echo "▶ Running migrations..."
cd backend && npx prisma migrate deploy && cd ..

echo "▶ Restarting backend..."
pm2 restart deploymanager

echo "✓ Updated to v${RELEASE_VERSION}"
