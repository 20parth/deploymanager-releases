#!/usr/bin/env bash
# DeployManager — Docker update script
set -euo pipefail

INSTALL_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$INSTALL_DIR/docker"

echo "▶ Pulling latest images..."
docker compose pull

echo "▶ Restarting containers..."
docker compose up -d

echo "▶ Running migrations..."
sleep 5
docker compose exec -T backend npx prisma migrate deploy

echo "✓ Update complete"
docker compose ps
