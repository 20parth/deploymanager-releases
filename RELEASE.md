# DeployManager v3.0.0 — Release Notes

**Release date:** 2026-06-02
**Tarball:** `deploymanager-v3.0.0.tar.gz`
**SHA256:** `a998168b938502661209dbe485fafcbdf4786b106e027d7b9e5af61aeeea8693`

---

## What's new

### Hosting panel support

The bare-metal installer now asks one question instead of presenting a panel menu:

```
Using a hosting panel? cPanel/CloudPanel/Plesk/HestiaCP/etc. (y/N):
```

- **No (plain VPS):** Nginx is installed and fully configured automatically.
- **Yes (panel):** Nginx installation is skipped. At the end of the install the script prints the exact proxy snippet to paste into your panel's custom Nginx/vhost config, and tells you where the frontend static files are.

No panel type is asked. No web root path is asked. The proxy config is identical for every panel — the user just pastes it.

### Safe re-installs and updates

Re-running `bare-metal-install.sh` on an existing server no longer wipes DB credentials or JWT secrets. On detection of an existing `.env`, only the domain-specific vars (`CORS_ORIGIN`, `WEBHOOK_BASE_URL`, `DATABASE_URL` password sync) are updated. All secrets are preserved.

### `install.sh` works piped

```bash
curl -fsSL https://deploymanager.parthrb.dev/install.sh | sudo bash
```

Sub-scripts are now fetched from the website at runtime rather than read from disk, so piping works correctly.

### Default: registration closed

Fresh installs now set `ALLOW_REGISTRATION=false`. The admin user is created during install. New accounts must be created by the admin in the UI.

---

## Bug fixes

| Area | Bug | Fix |
|------|-----|-----|
| Docker | `POSTGRES_PASSWORD: secret` hardcoded in `docker-compose.yml` — randomly generated password from installer was ignored | Reads `${POSTGRES_PASSWORD}` from `docker/.env` written by installer |
| Docker | `DATABASE_URL` in backend `environment:` block silently overrode `env_file` | Removed override; `env_file` is sole source |
| Bare metal | `update.sh` ran `git pull` — fails for end users with no source repo | Downloads latest tarball, verifies SHA256, extracts, restores `.env` |
| Docker | `docker-update.sh` ran `git pull` then rebuilt images from source | Uses `docker compose pull` to pull latest images from Docker Hub |
| Build | `build-release.sh` failed in non-TTY environments at `pnpm install --prod` step | Added `CI=true` |

---

## Upgrade from v2.x

```bash
cd /var/www/deploymanager
bash scripts/update.sh
```

The update script downloads the v3.0.0 tarball, backs up your `.env`, extracts, restores `.env`, runs migrations, and restarts PM2. Your data and credentials are untouched.

**Docker users:**
```bash
cd /opt/deploymanager/docker
docker compose pull
docker compose up -d
```

---

## Distribution checksums

```
a998168b938502661209dbe485fafcbdf4786b106e027d7b9e5af61aeeea8693  deploymanager-v3.0.0.tar.gz
```
