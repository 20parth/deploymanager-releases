# Changelog

All notable releases of DeployManager are documented here.

---

## [v3.0.0] — 2026-06-02

### Installer improvements

- **Hosting panel support** — installer now asks "Using a hosting panel?" (cPanel, CloudPanel, Plesk, HestiaCP, etc.). If yes, Nginx is not installed; the installer prints the exact proxy config snippet to paste into your panel instead.
- **Safe re-install / update** — re-running the installer on an existing deployment no longer regenerates DB credentials or JWT secrets. Existing `.env` values are preserved and only the domain-specific vars are updated.
- **`install.sh` can now be piped** — sub-scripts are fetched from the website at runtime; no longer requires the script to be on disk before execution.
- Bare-metal install now sets `ALLOW_REGISTRATION=false` by default (admin creates accounts manually).

### Bug fixes

- **Docker compose hardcoded password** — `POSTGRES_PASSWORD` was hardcoded as `secret` in `docker-compose.yml`, silently overriding the randomly generated password from the installer. Now reads from `docker/.env`.
- **Docker `DATABASE_URL` override** — the `environment:` block in the backend service was overriding `env_file`, so the generated credentials were never used. Removed the override; `env_file` is the sole source.
- **`update.sh` used `git pull`** — end users have no git repo (pre-built tarball). Both `update.sh` (bare metal) and `docker-update.sh` now download/pull the latest release correctly.
- **`build-release.sh` non-TTY failure** — `pnpm install --prod` aborted in non-interactive environments. Fixed with `CI=true`.

---

## [v2.0.1] — 2026-05-29

### Initial public release

- One-command installer (Docker + bare metal)
- Git-triggered deployments via GitHub / GitLab webhooks
- Real-time log streaming via Socket.io
- 7 framework deploy templates (React/Vite, Vue/Vite, Node.js, PHP, Python, Static, Custom)
- HMAC-SHA256 webhook signature verification
- Role-based access (ADMIN, DEVELOPER, VIEWER)
- Multi-project, multi-environment support
- CodeMirror bash script editor
- Dark / light mode
- JWT authentication (access 24h + refresh 7d)
- Docker Hub image distribution
- SHA256 checksum verified install script
