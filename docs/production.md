# Production Setup

## Target architecture
- `quentin-bouchot.fr`: public portfolio
- `www.quentin-bouchot.fr`: redirect to apex domain
- `analytics.quentin-bouchot.fr`: Umami admin UI
- `grafana.quentin-bouchot.fr`: Grafana behind Caddy basic auth
- Loki is internal only

## DNS
Create `A` records in OVH DNS:
- `@` -> VPS public IP
- `www` -> VPS public IP
- `analytics` -> VPS public IP
- `grafana` -> VPS public IP

## Server bootstrap
Recommended base:
- Ubuntu 24.04 LTS
- SSH keys only
- `ufw allow OpenSSH`
- `ufw allow 80/tcp`
- `ufw allow 443/tcp`
- `ufw enable`

Install Docker:
```bash
sudo apt update
sudo apt install -y ca-certificates curl gnupg git
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker.gpg
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo usermod -aG docker $USER
```

Reconnect after adding your user to the `docker` group.

## Repo layout on server
Example:
```bash
sudo mkdir -p /opt/portfolio_website
sudo chown -R $USER:$USER /opt/portfolio_website
cd /opt/portfolio_website
git clone <your-repo-url> .
cp .env.prod.example .env.prod
```

## Production environment
Edit `.env.prod` on the server.

Generate the Caddy bcrypt hash for Grafana basic auth:
```bash
docker run --rm caddy:2-alpine caddy hash-password --plaintext 'CHANGE_ME'
```

Important values:
- `PRIMARY_DOMAIN=quentin-bouchot.fr`
- `WWW_DOMAIN=www.quentin-bouchot.fr`
- `UMAMI_DOMAIN=analytics.quentin-bouchot.fr`
- `GRAFANA_DOMAIN=grafana.quentin-bouchot.fr`
- `ACME_EMAIL=<your-email>`
- `GRAFANA_BASIC_AUTH_HASH=<bcrypt hash generated above>`
- `VITE_UMAMI_SCRIPT_URL=https://quentin-bouchot.fr/stats.js`

## First deployment
```bash
docker compose --env-file .env.prod -f docker-compose.prod.yml up -d --build
```

## Umami
1. Open `https://analytics.quentin-bouchot.fr`
2. Login with Umami default credentials on a fresh instance:
   - username: `admin`
   - password: `umami`
3. Create the website `quentin-bouchot.fr`
4. Copy the website id into `.env.prod` as `VITE_UMAMI_WEBSITE_ID`
5. Rebuild:
```bash
docker compose --env-file .env.prod -f docker-compose.prod.yml up -d --build
```

## GitHub Actions secrets
Create these repository or environment secrets:
- `SSH_HOST`
- `SSH_PORT`
- `SSH_USER`
- `SSH_PRIVATE_KEY`
- `DEPLOY_PATH`
- `VITE_CV_PDF_URL`
- `VITE_CV_MARKDOWN_URL`
- `VITE_UMAMI_SCRIPT_URL`
- `VITE_UMAMI_WEBSITE_ID`

Expected `DEPLOY_PATH` example:
```text
/opt/portfolio_website
```

## Deploy flow
On push to `main`, GitHub Actions:
1. installs dependencies
2. builds the app
3. connects to the VPS through SSH
4. runs:
```bash
docker compose --env-file .env.prod -f docker-compose.prod.yml up -d --build
```

## Operations
Useful commands on the VPS:
```bash
docker compose --env-file .env.prod -f docker-compose.prod.yml ps
docker compose --env-file .env.prod -f docker-compose.prod.yml logs -f portfolio
docker compose --env-file .env.prod -f docker-compose.prod.yml logs -f caddy
docker compose --env-file .env.prod -f docker-compose.prod.yml logs -f grafana
docker compose --env-file .env.prod -f docker-compose.prod.yml logs -f umami
```

Loki production retention is set to 14 days in `observability/loki-config.prod.yml`.
