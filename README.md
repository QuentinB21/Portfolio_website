# Portfolio Quentin Bouchot

Site personnel/portfolio en React + TypeScript + Vite avec backend Node/Express.

L'architecture de suivi est hybride :
- `Umami` pour l'analytics produit et les metriques d'usage du site
- `Grafana + Loki + Alloy` pour les logs applicatifs et le suivi detaille du chatbot

## Stack
- React 19, TypeScript, Vite
- Styles custom, `react-icons`, `react-markdown`
- Backend Node/Express pour servir le build et proteger les variables sensibles
- Umami pour les analytics web
- Grafana, Loki et Alloy pour l'observabilite

## Demarrer en local
```bash
npm install
npm run dev
```
Ouvrir `http://localhost:5173`.

## Docker
```bash
docker compose up --build
```

Services exposes :
- portfolio : `http://localhost:8088`
- Umami : `http://127.0.0.1:3001`
- Grafana : `http://127.0.0.1:3002`
- Loki : `http://127.0.0.1:3100`

## Production
Production files are prepared for a single VPS deployment with Caddy:
- `docker-compose.prod.yml`
- `deploy/Caddyfile`
- `.env.prod.example`
- `.github/workflows/deploy-production.yml`
- `docs/production.md`

Expected domains:
- `quentin-bouchot.fr`
- `www.quentin-bouchot.fr`
- `analytics.quentin-bouchot.fr`
- `grafana.quentin-bouchot.fr`

## Structure
- `src/App.tsx` : pages principales et logique front
- `src/data/content.tsx` : contenu editorial du portfolio
- `src/utils/analytics.ts` : integration Umami cote front
- `server/index.js` : backend Express, age calcule, chatbot et logs structures
- `observability/` : configuration Loki, Alloy et Grafana

## CV synchronise
Le CV est charge depuis `https://raw.githubusercontent.com/QuentinB21/QuentinB21/main/README.md` et rendu en markdown.

Pour le bouton de telechargement PDF sur la page CV :
- place un fichier `public/cv.pdf`
- ou definis `VITE_CV_PDF_URL` dans ton `.env`

## Ce que suit Umami
Umami couvre les usages produit :
- pages visitees
- duree de visite / session
- pays / region / navigateur / appareil
- referrer
- evenements custom comme :
  - ouverture / fermeture du chat
  - message envoye au chat
  - reponse rendue
  - changement de theme
  - clic sur telechargement CV

## Ce que suit Grafana + Loki
Loki collecte les logs structures du backend :
- message utilisateur envoye au chatbot
- reponse du modele
- consommation de tokens
- latence OpenAI
- erreurs du chatbot
- contexte pseudonymise (session, visiteur, pays/region si headers disponibles)

## Variables sensibles
Les donnees sensibles ou semi-sensibles doivent rester cote serveur dans `.env` :
- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- `OPENAI_BASE_URL`
- `PROFILE_BIRTHDATE`
- `CHATBOT_SYSTEM_PROMPT`
- `MONITORING_IP_HASH_SALT`
- `UMAMI_DB_PASSWORD`
- `UMAMI_APP_SECRET`
- `GRAFANA_ADMIN_PASSWORD`

## Configuration
1. Cree un fichier `.env` ou `.env.local` a partir de `.env.example`
2. Renseigne les variables serveur et observabilite
3. Lance `docker compose up --build`
4. Cree ton website dans Umami, puis copie son `website id` dans `VITE_UMAMI_WEBSITE_ID`

## Scripts utiles
- `npm run dev` : serveur de dev
- `npm run build` : build production
- `npm run preview` : previsualisation du build
- `npm run lint` : ESLint
