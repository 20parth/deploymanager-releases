#!/usr/bin/env bash
# DeployManager — unified installer
# Usage:
#   curl -fsSL https://deploymanager.parthrb.dev/install.sh -o install.sh
#   echo "b4fd20fe738b0200956bf0710606affd7f1d56514b55c203056f2e5fb6353791  install.sh" | sha256sum -c
#   sudo bash install.sh
#
# NOTE: Do NOT pipe directly with | bash — sub-scripts are loaded from disk.

set -euo pipefail

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
echo "  1) Docker         — recommended, easiest, one command"
echo "  2) Bare metal     — Node + PM2 + Nginx directly on the server"
echo ""
read -rp "Enter 1 or 2 [1]: " METHOD
METHOD="${METHOD:-1}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]:-$0}")" && pwd)"

case "$METHOD" in
  1)
    echo -e "\n${GREEN}▶ Running Docker installer...${RESET}\n"
    bash "$SCRIPT_DIR/scripts/docker-install.sh"
    ;;
  2)
    echo -e "\n${GREEN}▶ Running bare-metal installer...${RESET}\n"
    bash "$SCRIPT_DIR/scripts/bare-metal-install.sh"
    ;;
  *)
    echo "Invalid choice. Run again and enter 1 or 2."
    exit 1
    ;;
esac
