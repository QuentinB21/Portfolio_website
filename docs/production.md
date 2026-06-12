# Production Setup

## Target architecture
- `quentin-bouchot.fr` : portfolio public
- `www.quentin-bouchot.fr` : redirection vers le domaine principal
- `analytics.quentin-bouchot.fr` : interface Umami

## DNS
Créer les enregistrements `A` suivants dans OVH DNS :
- `@` -> IP publique du VPS
- `www` -> IP publique du VPS
- `analytics` -> IP publique du VPS

## Server bootstrap
Base recommandée :
- Ubuntu 24.04 LTS
- accès SSH par clé uniquement
- `ufw allow OpenSSH`
- `ufw allow 80/tcp`
- `ufw allow 443/tcp`
- `ufw enable`

Installer Docker :
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

Reconnecte-toi après l'ajout au groupe `docker`.

## Repo layout on server
Exemple :
```bash
sudo mkdir -p /opt/portfolio_website
sudo chown -R $USER:$USER /opt/portfolio_website
cd /opt/portfolio_website
git clone <your-repo-url> .
cp .env.prod.example .env.prod
```

## Production environment
Édite `.env.prod` sur le serveur.

Valeurs importantes :
- `PRIMARY_DOMAIN=quentin-bouchot.fr`
- `WWW_DOMAIN=www.quentin-bouchot.fr`
- `UMAMI_DOMAIN=analytics.quentin-bouchot.fr`
- `ACME_EMAIL=<your-email>`
- `VITE_UMAMI_SCRIPT_URL=https://quentin-bouchot.fr/stats.js`
- `OPENAI_API_KEY=...`
- `OPENAI_MODEL=...`
- `OPENAI_BASE_URL=...`
- `PROFILE_BIRTHDATE=...`
- `CHATBOT_SYSTEM_PROMPT=...`

## First deployment
```bash
docker compose --env-file .env.prod -f docker-compose.prod.yml up -d --build
```

## Umami
1. Ouvre `https://analytics.quentin-bouchot.fr`
2. Connecte-toi avec les identifiants par défaut sur une instance fraîche :
   - username: `admin`
   - password: `umami`
3. Crée le website `quentin-bouchot.fr`
4. Copie le website id dans `.env.prod` comme `VITE_UMAMI_WEBSITE_ID`
5. Rebuild :
```bash
docker compose --env-file .env.prod -f docker-compose.prod.yml up -d --build
```

## GitHub Actions secrets
Créer ces secrets de repository ou d'environment :
- `SSH_HOST`
- `SSH_PORT`
- `SSH_USER`
- `SSH_PRIVATE_KEY`
- `DEPLOY_PATH`
- `VITE_CV_PDF_URL`
- `VITE_CV_MARKDOWN_URL`
- `VITE_UMAMI_SCRIPT_URL`
- `VITE_UMAMI_WEBSITE_ID`

Exemple attendu pour `DEPLOY_PATH` :
```text
/opt/portfolio_website
```

## Deploy flow
Sur push vers `main`, GitHub Actions :
1. installe les dépendances
2. build l'application
3. se connecte au VPS via SSH
4. exécute :
```bash
docker compose --env-file .env.prod -f docker-compose.prod.yml up -d --build
```

## Operations
Commandes utiles sur le VPS :
```bash
docker compose --env-file .env.prod -f docker-compose.prod.yml ps
docker compose --env-file .env.prod -f docker-compose.prod.yml logs -f portfolio
docker compose --env-file .env.prod -f docker-compose.prod.yml logs -f caddy
docker compose --env-file .env.prod -f docker-compose.prod.yml logs -f umami
```
