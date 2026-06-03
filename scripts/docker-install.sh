#!/usr/bin/env bash
# DeployManager — Docker installer
# Usage: curl -fsSL https://raw.githubusercontent.com/parthrb/DeployManager/main/scripts/docker-install.sh | sudo bash

set -euo pipefail

# Allow read prompts to work even when script is piped via curl | bash
exec </dev/tty

exec </dev/tty

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
CYAN='\033[0;36m'; BOLD='\033[1m'; RESET='\033[0m'

info()    { echo -e "${CYAN}[INFO]${RESET}  $*"; }
success() { echo -e "${GREEN}[OK]${RESET}    $*"; }
error()   { echo -e "${RED}[ERROR]${RESET} $*"; exit 1; }
step()    { echo -e "\n${BOLD}━━━  $*${RESET}"; }

[[ $EUID -ne 0 ]] && error "Run with sudo: curl ... | sudo bash"

echo -e "${BOLD}${CYAN}
  DeployManager — Docker Installer
${RESET}"

# ─── inputs ──────────────────────────────────────────────────────────────────
read -rp "$(echo -e "${BOLD}Domain or server IP${RESET} (e.g. deploy.example.com): ")" DOMAIN
[[ -z "$DOMAIN" ]] && error "Domain is required."

read -rp "$(echo -e "${BOLD}Install path${RESET} [/opt/deploymanager]: ")" INSTALL_DIR
INSTALL_DIR="${INSTALL_DIR:-/opt/deploymanager}"

read -rp "$(echo -e "${BOLD}Admin email${RESET}: ")" ADMIN_EMAIL
[[ -z "$ADMIN_EMAIL" ]] && error "Email is required."

read -rsp "$(echo -e "${BOLD}Admin password${RESET} (min 8 chars): ")" ADMIN_PASS
echo ""
[[ ${#ADMIN_PASS} -lt 8 ]] && error "Password must be at least 8 characters."

read -rp "$(echo -e "${BOLD}Enable HTTPS?${RESET} (y/N, skip if using IP): ")" ENABLE_SSL
ENABLE_SSL="${ENABLE_SSL:-n}"

PROTOCOL="http"
[[ "${ENABLE_SSL,,}" == "y" ]] && PROTOCOL="https"

DB_PASS=$(openssl rand -hex 16)
JWT_SECRET=$(openssl rand -hex 64)
JWT_REFRESH_SECRET=$(openssl rand -hex 64)

echo ""
read -rp "$(echo -e "${BOLD}Continue? (y/N):${RESET} ")" CONFIRM
[[ "${CONFIRM,,}" != "y" ]] && exit 0

# ─── install Docker ──────────────────────────────────────────────────────────
step "Installing Docker"

if ! command -v docker &>/dev/null; then
  info "Installing Docker..."
  curl -fsSL https://get.docker.com | sh
  systemctl enable docker --quiet
  systemctl start docker
  success "Docker installed"
else
  success "Docker $(docker -v | awk '{print $3}' | tr -d ',')"
fi

if ! docker compose version &>/dev/null 2>&1; then
  error "Docker Compose not found. Install Docker Desktop or the compose plugin."
fi
success "Docker Compose ready"

# ─── download compose file + scripts ─────────────────────────────────────────
step "Setting up DeployManager"

BASE_URL="https://20parth.github.io/deploymanager-releases"
mkdir -p "$INSTALL_DIR/docker" "$INSTALL_DIR/backend" "$INSTALL_DIR/scripts"

curl -fsSL "$BASE_URL/docker-compose.yml" -o "$INSTALL_DIR/docker/docker-compose.yml"
curl -fsSL "$BASE_URL/docker-update.sh"   -o "$INSTALL_DIR/scripts/docker-update.sh"
chmod +x "$INSTALL_DIR/scripts/docker-update.sh"

cd "$INSTALL_DIR"

# ─── write backend .env ──────────────────────────────────────────────────────
step "Writing configuration"

cat > backend/.env <<EOF
DATABASE_URL="postgresql://deploymanager:${DB_PASS}@postgres:5432/deploymanager"
JWT_SECRET="${JWT_SECRET}"
JWT_REFRESH_SECRET="${JWT_REFRESH_SECRET}"
PORT=5000
NODE_ENV=production
CORS_ORIGIN="${PROTOCOL}://${DOMAIN}"
WEBHOOK_BASE_URL="${PROTOCOL}://${DOMAIN}"
ALLOW_REGISTRATION=false
EOF

# docker/.env is read by compose for variable substitution (POSTGRES_PASSWORD)
cat > docker/.env <<EOF
POSTGRES_PASSWORD=${DB_PASS}
EOF

success "Configuration written"

# ─── build & start ───────────────────────────────────────────────────────────
step "Building and starting containers"

cd docker
docker compose pull --quiet 2>/dev/null || true
docker compose up -d --build

success "Containers running"
cd ..

# ─── wait for backend ────────────────────────────────────────────────────────
info "Waiting for backend to be ready..."
for i in $(seq 1 30); do
  curl -sf http://localhost:5000/health &>/dev/null && break
  sleep 2
done
curl -sf http://localhost:5000/health &>/dev/null || error "Backend did not start in time. Check: docker compose logs backend"

# ─── seed admin user ─────────────────────────────────────────────────────────
step "Creating admin user"

docker compose exec -T backend node -e "
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
(async () => {
  const db = new PrismaClient();
  const hash = await bcrypt.hash('${ADMIN_PASS}', 12);
  await db.user.upsert({
    where: { email: '${ADMIN_EMAIL}' },
    update: { passwordHash: hash },
    create: { email: '${ADMIN_EMAIL}', passwordHash: hash, name: 'Admin', role: 'ADMIN' }
  });
  await db.\$disconnect();
})();
" && success "Admin user created"

# ─── install & configure Nginx on host ───────────────────────────────────────
step "Configuring Nginx reverse proxy"

if ! command -v nginx &>/dev/null; then
  apt-get update -qq && apt-get install -y -qq nginx
fi

cat > /etc/nginx/sites-available/deploymanager <<NGINX
server {
    listen 80;
    server_name ${DOMAIN};

    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_read_timeout 120s;
    }

    location /socket.io/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }

    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
    }
}
NGINX

rm -f /etc/nginx/sites-enabled/default
ln -sf /etc/nginx/sites-available/deploymanager /etc/nginx/sites-enabled/deploymanager
nginx -t &>/dev/null && systemctl reload nginx
success "Nginx configured"

# ─── SSL ─────────────────────────────────────────────────────────────────────
if [[ "${ENABLE_SSL,,}" == "y" ]]; then
  step "Setting up HTTPS"
  apt-get install -y -qq certbot python3-certbot-nginx
  certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos -m "$ADMIN_EMAIL" --redirect
  success "SSL certificate installed"
fi

# ─── firewall ────────────────────────────────────────────────────────────────
if command -v ufw &>/dev/null; then
  ufw allow OpenSSH --quiet
  ufw allow 'Nginx Full' --quiet
  ufw --force enable &>/dev/null
fi

# ─── save credentials ────────────────────────────────────────────────────────
cat > "$INSTALL_DIR/.install-info" <<EOF
Installed:    $(date)
Domain:       ${PROTOCOL}://${DOMAIN}
Install dir:  ${INSTALL_DIR}
Admin email:  ${ADMIN_EMAIL}
DB password:  ${DB_PASS}
EOF
chmod 600 "$INSTALL_DIR/.install-info"

# ─── done ────────────────────────────────────────────────────────────────────
echo -e "
${BOLD}${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ✓  DeployManager is live! (Docker)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}

  ${BOLD}URL:${RESET}       ${PROTOCOL}://${DOMAIN}
  ${BOLD}Login:${RESET}     ${ADMIN_EMAIL}

  ${BOLD}Useful commands:${RESET}
    cd ${INSTALL_DIR}/docker
    docker compose ps               — container status
    docker compose logs -f backend  — live API logs
    docker compose restart backend  — restart backend
    docker compose down             — stop all
    docker compose up -d            — start all

  ${BOLD}To update:${RESET}
    cd ${INSTALL_DIR} && bash scripts/docker-update.sh

  Credentials saved to: ${INSTALL_DIR}/.install-info
${RESET}"
