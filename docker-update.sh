#!/usr/bin/env bash
# DeployManager — Docker update script
set -euo pipefail

INSTALL_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$INSTALL_DIR"

echo "▶ Pulling latest code..."
git pull

echo "▶ Rebuilding containers..."
cd docker
docker compose build --no-cache
docker compose up -d

echo "▶ Running migrations..."
sleep 5
docker compose exec -T backend npx prisma migrate deploy

echo "✓ Update complete"
docker compose ps
