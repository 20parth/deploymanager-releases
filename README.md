<div align="center">

<img src="assets/screenshots/logo.png" alt="DeployManager Logo" width="120" />

# ⚡ DeployManager

**Self-hosted CI/CD deployment management — deploy any app on your VPS with a single Git push.**

No third-party CI servers. No per-seat pricing. Your server, your code, your rules.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-2.0.1-brightgreen.svg)](https://github.com/20parth/deploymanager-releases/releases)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)](https://nodejs.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue.svg)](https://postgresql.org)
[![Docker](https://img.shields.io/badge/Docker-ready-2496ED.svg)](https://hub.docker.com/u/parthrb)

🌐 **Website:** [deploymanager.parthrb.dev](https://deploymanager.parthrb.dev)

</div>

---

## Demo

<!-- Replace with actual GIF after recording -->
<div align="center">
  <img src="assets/screenshots/demo.gif" alt="DeployManager Demo" width="800" />
</div>

---

## Screenshots

<div align="center">

| Dashboard | Deployments | Webhooks |
|-----------|-------------|----------|
| <img src="assets/screenshots/dashboard.png" width="250" /> | <img src="assets/screenshots/deployments.png" width="250" /> | <img src="assets/screenshots/webhooks.png" width="250" /> |

| Live Logs | Webhook Wizard | Dark Mode |
|-----------|----------------|-----------|
| <img src="assets/screenshots/logs.png" width="250" /> | <img src="assets/screenshots/wizard.png" width="250" /> | <img src="assets/screenshots/dark.png" width="250" /> |

</div>

---

## What is DeployManager?

DeployManager runs on your own VPS and deploys your web apps automatically when you push to Git. Think GitHub Actions — but running on your own server with no per-minute billing.

```
git push origin main
        │
        ▼
GitHub / GitLab sends webhook
        │
        ▼
DeployManager verifies HMAC-SHA256 signature
        │
        ▼
Runs your deploy script (git pull → build → copy files)
        │
        ▼
Streams logs live in the browser  ✓ Done
```

---

## Features

| Feature | Description |
|---------|-------------|
| 🔄 **Git-triggered deploys** | Push to a branch → deploy runs automatically |
| 📊 **Real-time log streaming** | Watch every output line live via Socket.io |
| 🏗️ **7 framework templates** | React/Vite, Vue/Vite, Node.js, PHP, Python, Static, Custom |
| 🔐 **Secure webhooks** | HMAC-SHA256 verified, GitHub + GitLab supported |
| 👥 **Role-based access** | ADMIN, DEVELOPER, VIEWER roles |
| 🌿 **Multi-environment** | Unlimited projects, staging/production/preview |
| 🐳 **Docker ready** | Pull from Docker Hub, no build needed |
| 📝 **Script editor** | CodeMirror bash editor with autocomplete |
| 🌙 **Dark mode** | Full dark/light theme toggle |

---

## Install

### Requirements

| | Minimum |
|-|---------|
| OS | Ubuntu 22.04 or Debian 12 |
| RAM | 1 GB |
| CPU | 1 vCPU |
| Disk | 10 GB |
| Network | Public IP or domain |

### One-command installer

```bash
curl -fsSL https://deploymanager.parthrb.dev/install.sh -o install.sh
echo "b4fd20fe738b0200956bf0710606affd7f1d56514b55c203056f2e5fb6353791  install.sh" | sha256sum -c
sudo bash install.sh
```

The installer will ask:
- Domain or server IP
- Admin email + password
- Docker or bare metal
- HTTPS with Let's Encrypt (y/n)

Then it automatically sets up PostgreSQL, Nginx, SSL, and firewall.

### Installation methods

<details>
<summary><b>🐳 Docker (recommended)</b></summary>

```bash
curl -fsSL https://deploymanager.parthrb.dev/install.sh -o install.sh
sudo bash install.sh
# → choose option 1 (Docker)
```

Uses pre-built images from Docker Hub — no build required.

</details>

<details>
<summary><b>🖥️ Bare metal (Node + PM2 + Nginx)</b></summary>

```bash
curl -fsSL https://deploymanager.parthrb.dev/install.sh -o install.sh
sudo bash install.sh
# → choose option 2 (Bare metal)
```

Best when DeployManager needs to deploy apps directly on the host filesystem.

</details>

<details>
<summary><b>🛠️ Manual / Docker Compose</b></summary>

```bash
# Download compose file
curl -fsSL https://deploymanager.parthrb.dev/docker-compose.yml -o docker-compose.yml

# Create backend config
mkdir backend
cat > backend/.env <<EOF
DATABASE_URL="postgresql://deploymanager:yourpassword@postgres:5432/deploymanager"
JWT_SECRET="$(openssl rand -hex 64)"
JWT_REFRESH_SECRET="$(openssl rand -hex 64)"
PORT=5000
NODE_ENV=production
CORS_ORIGIN="https://your-domain.com"
WEBHOOK_BASE_URL="https://your-domain.com"
EOF

docker compose up -d
```

</details>

---

## Updating

```bash
# Bare metal
bash scripts/update.sh

# Docker
bash scripts/docker-update.sh
```

---

## How webhooks work

1. Go to **Webhooks → New webhook** in DeployManager
2. Fill in: project, framework, git repo path, branch, deploy path
3. Copy the **webhook URL** and **secret** shown at the end
4. Add them to your GitHub repo → **Settings → Webhooks**
5. Push to your branch — deployment starts automatically

---

## Tech stack

| Layer | Technology |
|-------|------------|
| Backend API | Express.js + TypeScript, Prisma ORM |
| Database | PostgreSQL 16 |
| Frontend | React 18 + Vite, TanStack Query, Zustand |
| Real-time | Socket.io |
| Auth | JWT (24h access + 7d refresh), bcrypt |
| Styling | Tailwind CSS v4 |
| Containers | Docker + Docker Compose |

---

## Releases

| Version | Date | Notes |
|---------|------|-------|
| [v2.0.1](https://github.com/20parth/deploymanager-releases/releases/tag/v2.0.1) | 2026-05-29 | Initial public release |

---

## Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

**Ways to contribute:**
- 🐛 Report bugs via [Issues](https://github.com/20parth/deploymanager-releases/issues)
- 💡 Request features
- 📸 Share screenshots / demo GIFs
- 📖 Improve documentation
- ⭐ Star the repo to show support

---

## Author

**Parth Bhawar**

- GitHub: [@20parth](https://github.com/20parth)
- Website: [deploymanager.parthrb.dev](https://deploymanager.parthrb.dev)

---

## License

MIT License © 2026 [Parth Bhawar](https://github.com/20parth)

See [LICENSE](LICENSE) for full details. You are free to use, modify, and distribute this software with attribution.

---

<div align="center">

If DeployManager saves you time, consider giving it a ⭐

</div>
