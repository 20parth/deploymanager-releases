#!/usr/bin/env bash
# DeployManager — bare-metal installer (Node + PM2)
# Downloads pre-built release tarball — no source code access needed.
set -euo pipefail

GITHUB_REPO="20parth/deploymanager-releases"

RED='\033[0;31m'; GREEN='\033[0;32m'; CYAN='\033[0;36m'; YELLOW='\033[1;33m'; BOLD='\033[1m'; RESET='\033[0m'
info()    { echo -e "${CYAN}[INFO]${RESET}  $*"; }
success() { echo -e "${GREEN}[OK]${RESET}    $*"; }
warn()    { echo -e "${YELLOW}[WARN]${RESET}  $*"; }
error()   { echo -e "${RED}[ERROR]${RESET} $*"; exit 1; }
step()    { echo -e "\n${BOLD}━━━  $*${RESET}"; }

info "Fetching latest release..."
RELEASE_VERSION=$(curl -fsSL "https://api.github.com/repos/${GITHUB_REPO}/releases/latest" \
  | grep -o '"tag_name": *"v[^"]*"' | grep -o '[0-9][^"]*')
[[ -z "$RELEASE_VERSION" ]] && error "Could not fetch latest version from GitHub."
RELEASE_BASE="https://github.com/${GITHUB_REPO}/releases/download/v${RELEASE_VERSION}"
RELEASE_URL="${RELEASE_BASE}/deploymanager-v${RELEASE_VERSION}.tar.gz"
RELEASE_SHA256_URL="${RELEASE_BASE}/deploymanager-v${RELEASE_VERSION}.tar.gz.sha256"

[[ $EUID -ne 0 ]] && error "Run with sudo."

# ─── inputs ──────────────────────────────────────────────────────────────────
step "Configuration"

read -rp "$(echo -e "${BOLD}Domain${RESET} (e.g. deploy.example.com): ")" DOMAIN
[[ -z "$DOMAIN" ]] && error "Domain is required."

read -rp "$(echo -e "${BOLD}Install path${RESET} [/var/www/deploymanager]: ")" INSTALL_DIR
INSTALL_DIR="${INSTALL_DIR:-/var/www/deploymanager}"

IS_REINSTALL=false
if [[ -f "$INSTALL_DIR/backend/.env" ]]; then
  IS_REINSTALL=true
  warn "Existing installation found — DB credentials and JWT secrets will be preserved."
fi

read -rp "$(echo -e "${BOLD}Admin email${RESET}: ")" ADMIN_EMAIL
[[ -z "$ADMIN_EMAIL" ]] && error "Email is required."
read -rsp "$(echo -e "${BOLD}Admin password${RESET} (min 8 chars): ")" ADMIN_PASS; echo ""
[[ ${#ADMIN_PASS} -lt 8 ]] && error "Password too short."

read -rp "$(echo -e "${BOLD}Enable HTTPS?${RESET} (y/N): ")" ENABLE_SSL
ENABLE_SSL="${ENABLE_SSL:-n}"
PROTOCOL="http"; [[ "${ENABLE_SSL,,}" == "y" ]] && PROTOCOL="https"

read -rp "$(echo -e "${BOLD}Using a hosting panel?${RESET} cPanel/CloudPanel/Plesk/HestiaCP/etc. (y/N): ")" HAS_PANEL
HAS_PANEL="${HAS_PANEL:-n}"

echo ""
read -rp "$(echo -e "${BOLD}Continue? (y/N):${RESET} ")" CONFIRM
[[ "${CONFIRM,,}" != "y" ]] && exit 0

# ─── system packages ─────────────────────────────────────────────────────────
step "Installing system packages"
export DEBIAN_FRONTEND=noninteractive
apt-get update -qq

if [[ "${HAS_PANEL,,}" != "y" ]]; then
  apt-get install -y -qq curl nginx postgresql postgresql-contrib openssl
else
  apt-get install -y -qq curl postgresql postgresql-contrib openssl
fi

if ! command -v node &>/dev/null || [[ "$(node -e 'process.stdout.write(process.version.slice(1).split(".")[0])')" -lt 20 ]]; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash - &>/dev/null
  apt-get install -y -qq nodejs
fi
command -v pm2 &>/dev/null || npm install -g pm2 --quiet
success "Node $(node -v) ready"

# ─── PostgreSQL ───────────────────────────────────────────────────────────────
step "PostgreSQL"
systemctl enable postgresql --quiet && systemctl start postgresql

if [[ "$IS_REINSTALL" == "true" ]]; then
  DB_PASS=$(grep '^DATABASE_URL' "$INSTALL_DIR/backend/.env" 2>/dev/null \
    | sed 's/.*:\/\/deploymanager:\([^@]*\)@.*/\1/' || openssl rand -hex 16)
  info "Preserving existing DB password"
else
  DB_PASS=$(openssl rand -hex 16)
fi

sudo -u postgres psql -tc "SELECT 1 FROM pg_roles WHERE rolname='deploymanager'" | grep -q 1 \
  || sudo -u postgres psql -c "CREATE USER deploymanager WITH PASSWORD '${DB_PASS}';" &>/dev/null
sudo -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname='deploymanager'" | grep -q 1 \
  || sudo -u postgres psql -c "CREATE DATABASE deploymanager OWNER deploymanager;" &>/dev/null
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE deploymanager TO deploymanager;" &>/dev/null
sudo -u postgres psql -c "ALTER USER deploymanager WITH PASSWORD '${DB_PASS}';" &>/dev/null
success "Database ready"

# ─── download + extract ───────────────────────────────────────────────────────
step "Downloading DeployManager v${RELEASE_VERSION}"
TMPFILE=$(mktemp /tmp/deploymanager-XXXXXX.tar.gz)
curl -fsSL "$RELEASE_URL" -o "$TMPFILE"
EXPECTED_SHA=$(curl -fsSL "$RELEASE_SHA256_URL" | awk '{print $1}')
if [[ -n "$EXPECTED_SHA" ]]; then
  echo "${EXPECTED_SHA}  ${TMPFILE}" | sha256sum -c &>/dev/null \
    || error "Checksum mismatch — download may be corrupted."
  success "Checksum verified"
fi

mkdir -p "$INSTALL_DIR"
tar -xzf "$TMPFILE" -C "$INSTALL_DIR"
rm -f "$TMPFILE"
success "Extracted to $INSTALL_DIR"

cd "$INSTALL_DIR"

# ─── backend .env ─────────────────────────────────────────────────────────────
step "Backend config"
if [[ "$IS_REINSTALL" == "true" ]]; then
  sed -i "s|^CORS_ORIGIN=.*|CORS_ORIGIN=\"${PROTOCOL}://${DOMAIN}\"|" backend/.env
  sed -i "s|^WEBHOOK_BASE_URL=.*|WEBHOOK_BASE_URL=\"${PROTOCOL}://${DOMAIN}\"|" backend/.env
  sed -i "s|^DATABASE_URL=.*|DATABASE_URL=\"postgresql://deploymanager:${DB_PASS}@127.0.0.1:5432/deploymanager\"|" backend/.env
  info "Updated .env (JWT secrets preserved)"
else
  JWT_SECRET=$(openssl rand -hex 64)
  JWT_REFRESH_SECRET=$(openssl rand -hex 64)
  cat > backend/.env <<EOF
DATABASE_URL="postgresql://deploymanager:${DB_PASS}@127.0.0.1:5432/deploymanager"
JWT_SECRET="${JWT_SECRET}"
JWT_REFRESH_SECRET="${JWT_REFRESH_SECRET}"
PORT=5000
NODE_ENV=production
CORS_ORIGIN="${PROTOCOL}://${DOMAIN}"
WEBHOOK_BASE_URL="${PROTOCOL}://${DOMAIN}"
ALLOW_REGISTRATION=false
DEPLOY_TIMEOUT_MINUTES=30
EOF
fi

# ─── migrations + admin user ──────────────────────────────────────────────────
step "Database migrations + admin user"
cd backend
npx prisma migrate deploy
node -e "
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
"
cd ..

# ─── PM2 ─────────────────────────────────────────────────────────────────────
step "PM2 (backend service)"
pm2 stop deploymanager 2>/dev/null || true
pm2 delete deploymanager 2>/dev/null || true
pm2 start backend/dist/index.js --name deploymanager --cwd "$INSTALL_DIR/backend" --update-env
pm2 save --force &>/dev/null
env PATH=$PATH:/usr/bin pm2 startup systemd -u root --hp /root 2>/dev/null | grep "^sudo" | bash || true

# ─── web server ───────────────────────────────────────────────────────────────
if [[ "${HAS_PANEL,,}" != "y" ]]; then

  step "Nginx"
  cat > /etc/nginx/sites-available/deploymanager <<NGINX
server {
    listen 80;
    server_name ${DOMAIN};
    root ${INSTALL_DIR}/frontend/dist;
    index index.html;

    location /api/ {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_read_timeout 120s;
    }
    location /socket.io/ {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
    location / { try_files \$uri \$uri/ /index.html; }
}
NGINX
  rm -f /etc/nginx/sites-enabled/default
  ln -sf /etc/nginx/sites-available/deploymanager /etc/nginx/sites-enabled/deploymanager
  nginx -t &>/dev/null && systemctl reload nginx
  success "Nginx configured"

  if [[ "${ENABLE_SSL,,}" == "y" ]]; then
    step "Let's Encrypt SSL"
    apt-get install -y -qq certbot python3-certbot-nginx
    certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos -m "$ADMIN_EMAIL" --redirect
    success "SSL certificate installed"
  fi

  command -v ufw &>/dev/null && {
    ufw allow OpenSSH --quiet
    ufw allow 'Nginx Full' --quiet
    ufw --force enable &>/dev/null
  }

else

  command -v ufw &>/dev/null && {
    ufw allow OpenSSH --quiet; ufw allow 80/tcp --quiet; ufw allow 443/tcp --quiet
    ufw --force enable &>/dev/null
  }

fi

# ─── save install info ────────────────────────────────────────────────────────
cat > "$INSTALL_DIR/.install-info" <<EOF
Installed:    $(date)
Version:      ${RELEASE_VERSION}
Domain:       ${PROTOCOL}://${DOMAIN}
Install dir:  ${INSTALL_DIR}
Admin email:  ${ADMIN_EMAIL}
DB password:  ${DB_PASS}
EOF
chmod 600 "$INSTALL_DIR/.install-info"

# ─── done ────────────────────────────────────────────────────────────────────
if [[ "${HAS_PANEL,,}" == "y" ]]; then
  echo -e "\n${BOLD}${GREEN}✓ DeployManager v${RELEASE_VERSION} backend is running!${RESET}

  ${BOLD}Backend:${RESET}  running on port 5000 (PM2)
  ${BOLD}Frontend:${RESET} ${INSTALL_DIR}/frontend/dist

  ${BOLD}In your panel, create a site for ${DOMAIN} and:${RESET}
    1. Set the web root to: ${INSTALL_DIR}/frontend/dist
    2. Add these proxy rules to the site's Nginx config:

$(cat <<PROXY
location /api/ {
    proxy_pass http://127.0.0.1:5000/api/;
    proxy_http_version 1.1;
    proxy_set_header Host \$host;
    proxy_set_header X-Real-IP \$remote_addr;
    proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto \$scheme;
    proxy_read_timeout 120s;
}
location /socket.io/ {
    proxy_pass http://127.0.0.1:5000/socket.io/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade \$http_upgrade;
    proxy_set_header Connection \"upgrade\";
    proxy_set_header Host \$host;
    proxy_cache_bypass \$http_upgrade;
}
PROXY
)
  ${BOLD}Login:${RESET}    ${ADMIN_EMAIL}  (after panel config is done)
  ${BOLD}Update:${RESET}   cd ${INSTALL_DIR} && bash scripts/update.sh"
else
  echo -e "\n${BOLD}${GREEN}✓ DeployManager v${RELEASE_VERSION} is live!${RESET}
  URL:     ${PROTOCOL}://${DOMAIN}
  Login:   ${ADMIN_EMAIL}
  Update:  cd ${INSTALL_DIR} && bash scripts/update.sh"
fi
