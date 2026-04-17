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
- `CHAT_CONVERSATION_IDLE_MS=90000` to consolidate chatbot activity into one conversation event after 90 seconds of inactivity

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

## Chatbot monitoring
The backend emits these structured chatbot events to Loki:
- `chat_user_message`
- `chat_completion`
- `chat_completion_error`
- `chat_conversation_closed`

`chat_completion` includes `payload_isRefusal=true` when the assistant answers with `Je ne peux pas fournir cette information.`.

`chat_conversation_closed` is emitted only after a period of inactivity. It is the best signal to drive mobile alerts, because it consolidates a conversation instead of notifying once per message.

Recommended alerting setup in Grafana:
- use a Telegram or Discord contact point for mobile notifications
- create the alert from `chat_conversation_closed`, not from `chat_user_message`
- set a notification policy with grouping enabled so one conversation stays one alert

## Discord conversation relay
This repository includes an internal `notifications` service so the flow becomes:

`Grafana -> internal webhook -> Discord bot`

### Discord target model
When a chatbot conversation ends, the relay creates a **new text channel** inside your Discord category `Conversations`.

Then it republishes the transcript turn by turn:
- one user message in the chatbot = one Discord message
- one assistant reply in the chatbot = one Discord message

Conversation metadata is stored in the Discord channel topic.

### Discord IDs to provide
Store these values in `.env.prod`:

```env
DISCORD_GUILD_ID=123456789012345678
DISCORD_CATEGORY_ID=123456789012345678
DISCORD_CHANNEL_NAME_PREFIX=chatbot
```

To copy IDs, enable **Developer Mode** in Discord, then right-click:
- the server -> **Copy Server ID**
- the category `Conversations` -> **Copy Channel ID**

### Discord bot setup
1. Open the Discord Developer Portal
2. Create an application and a bot
3. Copy the bot token into:

```env
DISCORD_BOT_TOKEN=...
```

4. Invite the bot to your server with these permissions on the parent text channel:
   - View Channel
   - Send Messages
   - Manage Channels
   - Read Message History

The relay queries Loki for the corresponding `chat_conversation_closed` event, creates one dedicated Discord text channel per conversation, and posts the full transcript into it.

### Grafana contact point
The contact point `chatbot-discord-relay` is provisioned automatically and points to the internal webhook:

```text
http://notifications:8081/webhooks/grafana/discord
```

### Grafana alert rule
Create a Grafana-managed alert rule with:

- datasource: `Loki`
- query:

```logql
sum by (payload_sessionId, payload_visitorId) (
  count_over_time(
    {stack="portfolio",compose_service="portfolio"}
    | json
    | type="chat_conversation_closed"
    | payload_sessionId!=""
    [2m]
  )
)
```

- condition: alert when the reduced value is `> 0`
- contact point: `chatbot-discord-relay`
- send firing notifications only

This keeps one notification per closed conversation instead of one notification per chatbot turn.
