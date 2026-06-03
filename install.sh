#!/usr/bin/env bash
# DeployManager — unified installer
# Usage:
#   curl -fsSL https://20parth.github.io/deploymanager-releases/install.sh | sudo bash

set -euo pipefail

BASE_URL="https://20parth.github.io/deploymanager-releases"
BOLD='\033[1m'; CYAN='\033[0;36m'; GREEN='\033[0;32m'; RESET='\033[0m'

echo -e "${BOLD}${CYAN}
  ██████╗ ███████╗██████╗ ██╗      ██████╗ ██╗   ██╗
  ██╔══██╗██╔════╝██╔══██╗██║     ██╔═══██╗╚██╗ ██╔╝
  ██║  ██║█████╗  ██████╔╝██║     ██║   ██║ ╚████╔╝
  ██║  ██║██╔══╝  ██╔═══╝ ██║     ██║   ██║  ╚██╔╝
  ██████╔╝███████╗██║     ███████╗╚██████╔╝   ██║
  ╚═════╝ ╚══════╝╚═╝     ╚══════╝ ╚═════╝    ╚═╝
  MANAGER — Installer
${RESET}"

echo -e "${BOLD}Choose installation method:${RESET}
"
echo "  1) Bare metal  — Node + PM2 on your server (works with any hosting panel)"
echo "  2) Docker      — containers only (not recommended if DeployManager will deploy host apps)"
echo ""
read -rp "Enter 1 or 2 [1]: " METHOD
METHOD="${METHOD:-1}"

TMPSCRIPTS=$(mktemp -d)
trap 'rm -rf "$TMPSCRIPTS"' EXIT

case "$METHOD" in
  1)
    echo -e "\n${GREEN}▶ Downloading bare-metal installer...${RESET}\n"
    curl -fsSL "$BASE_URL/scripts/bare-metal-install.sh" -o "$TMPSCRIPTS/bare-metal-install.sh"
    bash "$TMPSCRIPTS/bare-metal-install.sh"
    ;;
  2)
    echo -e "\n${GREEN}▶ Downloading Docker installer...${RESET}\n"
    curl -fsSL "$BASE_URL/scripts/docker-install.sh" -o "$TMPSCRIPTS/docker-install.sh"
    bash "$TMPSCRIPTS/docker-install.sh"
    ;;
  *)
    echo "Invalid choice. Run again and enter 1 or 2."
    exit 1
    ;;
esac
