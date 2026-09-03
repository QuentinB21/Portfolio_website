# Production Setup

## Target architecture
- `quentin-bouchot.fr` : portfolio public
- `www.quentin-bouchot.fr` : redirection vers le domaine principal
- `analytics.quentin-bouchot.fr` : interface Umami
- `quentin-bouchot.fr/projets/TradeCopilot/*` : application TradeCopilot exposée via le Caddy du portfolio
- `quentin-bouchot.fr/projets/MailManager/*` : future application Mail Manager Workflow

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

## Shared reverse-proxy network
Le portfolio et TradeCopilot doivent partager un réseau Docker externe, sans partager leurs bases de données.

Création initiale :
```bash
docker network create public-proxy
```

Vérification :
```bash
docker network inspect public-proxy
```

## Repo layout on server
Exemple :
```bash
sudo mkdir -p /opt/portfolio_website
sudo chown -R $USER:$USER /opt/portfolio_website
cd /opt/portfolio_website
git clone <portfolio-repo-url> .
cp .env.prod.example .env.prod
```

TradeCopilot reste dans un autre dossier, par exemple :
```bash
sudo mkdir -p /opt/tradecopilot
sudo chown -R $USER:$USER /opt/tradecopilot
cd /opt/tradecopilot
git clone <tradecopilot-repo-url> .
```

Mail Manager Workflow reste également dans son propre dossier :
```bash
sudo mkdir -p /opt/mail-manager-workflow
sudo chown -R $USER:$USER /opt/mail-manager-workflow
cd /opt/mail-manager-workflow
git clone https://github.com/QuentinB21/MailManagerWorkflow.git .
```

## Portfolio environment
Édite `.env.prod` sur le serveur.

Valeurs importantes :
- `PRIMARY_DOMAIN=quentin-bouchot.fr`
- `WWW_DOMAIN=www.quentin-bouchot.fr`
- `UMAMI_DOMAIN=analytics.quentin-bouchot.fr`
- `ACME_EMAIL=<your-email>`
- `VITE_UMAMI_SCRIPT_URL=https://quentin-bouchot.fr/stats.js`
- `TRADECOPILOT_FRONTEND_UPSTREAM=tradecopilot-client:80`
- `TRADECOPILOT_API_UPSTREAM=tradecopilot-api:8080`
- `TRADECOPILOT_AUTH_UPSTREAM=tradecopilot-keycloak:8080`
- `MAILMANAGER_FRONTEND_UPSTREAM=mail-manager-web:80`
- `MAILMANAGER_API_UPSTREAM=mail-manager-api:8080`
- `MAILMANAGER_AUTH_UPSTREAM=mail-manager-keycloak:8080`
- `MAILMANAGER_WORKFLOW_UPSTREAM=mail-manager-n8n:5678`
- `OPENAI_API_KEY=...`
- `OPENAI_MODEL=...`
- `OPENAI_BASE_URL=...`
- `PROFILE_BIRTHDATE=...`
- `CHATBOT_SYSTEM_PROMPT=...`

Les trois variables `TRADECOPILOT_*_UPSTREAM` doivent correspondre à des aliases DNS réellement exposés par le compose TradeCopilot sur le réseau `public-proxy`.

## First portfolio deployment
```bash
cd /opt/portfolio_website
docker compose --env-file .env.prod -f docker-compose.prod.yml up -d --build
```

## TradeCopilot requirements
Le repo TradeCopilot doit respecter ces règles avant d'être branché derrière le Caddy du portfolio :

1. Le frontend doit fonctionner publiquement sous `/projets/TradeCopilot/`.
2. L'API doit être exposée publiquement sous `/projets/TradeCopilot/api/*`.
3. Keycloak doit être exposé publiquement sous `/projets/TradeCopilot/auth/*`.
4. Le callback OIDC `/projets/TradeCopilot/auth/callback` doit être servi par le frontend TradeCopilot, pas par Keycloak.
5. Le frontend doit connaître son base path :
   - Vite : `base: '/projets/TradeCopilot/'`
   - React Router : `basename="/projets/TradeCopilot"`
6. Les appels frontend vers l'API ne doivent pas viser `/api` à la racine du domaine.
   Ils doivent viser `/projets/TradeCopilot/api/...` ou une variable dédiée.
7. Keycloak doit être configuré avec le bon chemin externe :
   - hostname public : `quentin-bouchot.fr`
   - chemin relatif : `/projets/TradeCopilot/auth`
   - redirect URIs et web origins alignées sur ce sous-chemin
8. Les services `client`, `api` et `keycloak` doivent rejoindre le réseau Docker externe `public-proxy`.
9. Les bases Postgres de TradeCopilot et du portfolio doivent rester uniquement sur leurs réseaux internes respectifs.

## TradeCopilot compose expectations
Le compose TradeCopilot doit exposer des aliases explicites sur `public-proxy`, par exemple :

```yaml
networks:
  default:
  public-proxy:
    external: true

services:
  client:
    networks:
      default:
      public-proxy:
        aliases:
          - tradecopilot-client

  api:
    networks:
      default:
      public-proxy:
        aliases:
          - tradecopilot-api

  keycloak:
    networks:
      default:
      public-proxy:
        aliases:
          - tradecopilot-keycloak
```

Les services Postgres ne doivent pas être connectés à `public-proxy`.

## Mail Manager Workflow requirements

Le portfolio prépare les routes suivantes :

- `/projets/MailManager/` vers le frontend React ;
- `/projets/MailManager/api/*` et `/projets/MailManager/health` vers l'API ASP.NET Core ;
- `/projets/MailManager/auth/*` vers Keycloak ;
- `/projets/MailManager/webhook/*` vers les webhooks n8n, sans exposer l'interface d'administration n8n.

Avant d'activer la carte dans le portfolio, le repo MailManagerWorkflow devra fournir une configuration de production qui respecte les points suivants :

1. Le build Vite utilise `base: '/projets/MailManager/'`.
2. Le frontend utilise les URL publiques `/projets/MailManager/api`, `/projets/MailManager/auth` et `/projets/MailManager/webhook/mail-manager/email`.
3. Les redirections Keycloak reviennent vers `https://quentin-bouchot.fr/projets/MailManager/`, et non vers la racine du domaine.
4. Keycloak est démarré en mode production derrière un reverse proxy et sert son chemin relatif `/auth`.
5. `WebOrigin`, les émetteurs JWT et les callbacks OAuth Gmail et Outlook utilisent les URL HTTPS publiques.
6. Les services `web`, `api`, `keycloak` et `n8n` rejoignent `public-proxy` avec les aliases définis ci-dessous.
7. PostgreSQL et les services d'initialisation restent uniquement sur le réseau privé du projet.
8. Les ports des conteneurs ne sont pas publiés sur l'hôte en production ; seuls Caddy et le réseau partagé y accèdent.

Exemple de raccordement du compose MailManagerWorkflow :

```yaml
networks:
  default:
  public-proxy:
    external: true

services:
  web:
    networks:
      default:
      public-proxy:
        aliases:
          - mail-manager-web

  api:
    networks:
      default:
      public-proxy:
        aliases:
          - mail-manager-api

  keycloak:
    networks:
      default:
      public-proxy:
        aliases:
          - mail-manager-keycloak

  n8n:
    networks:
      default:
      public-proxy:
        aliases:
          - mail-manager-n8n
```

La carte reste volontairement marquée `Bientôt disponible` tant que ces adaptations ne sont pas déployées. Il faudra ensuite passer son champ `available` à `true` dans `src/data/content.tsx`. La présentation affichée sur la carte est récupérée depuis le `README.md` public du dépôt MailManagerWorkflow.

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

## Operations
Commandes utiles sur le VPS :
```bash
cd /opt/portfolio_website
docker compose --env-file .env.prod -f docker-compose.prod.yml ps
docker compose --env-file .env.prod -f docker-compose.prod.yml logs -f caddy
docker compose --env-file .env.prod -f docker-compose.prod.yml logs -f portfolio
docker compose --env-file .env.prod -f docker-compose.prod.yml logs -f umami
```

Pour TradeCopilot :
```bash
cd /opt/tradecopilot
docker compose -f docker-compose.prod.yml ps
docker compose -f docker-compose.prod.yml logs -f frontend
docker compose -f docker-compose.prod.yml logs -f api
docker compose -f docker-compose.prod.yml logs -f keycloak
```
