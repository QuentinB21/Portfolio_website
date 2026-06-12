# Portfolio Quentin Bouchot

Site personnel/portfolio en React + TypeScript + Vite, servi par un backend Node/Express.

## Stack
- React 19, TypeScript, Vite
- Styles custom, `react-icons`
- Backend Node/Express pour servir le build et protéger les variables sensibles
- Umami pour l'analytics web
- Caddy pour le reverse proxy et le HTTPS en production

## Démarrer en local
```bash
npm install
npm run dev
```

Ouvrir `http://localhost:5173`.

## Docker
```bash
docker compose up --build
```

Services exposés :
- portfolio : `http://localhost:8088`
- Umami : `http://127.0.0.1:3001`

## Production
Les fichiers de prod sont prévus pour un déploiement simple sur un VPS :
- `docker-compose.prod.yml`
- `deploy/Caddyfile`
- `.env.prod.example`
- `.github/workflows/deploy-production.yml`
- `docs/production.md`

Domaines attendus :
- `quentin-bouchot.fr`
- `www.quentin-bouchot.fr`
- `analytics.quentin-bouchot.fr`

## Structure
- `src/App.tsx` : shell principal du front
- `src/data/content.tsx` : contenu éditorial du portfolio
- `src/utils/analytics.ts` : intégration Umami côté front
- `server/index.js` : backend Express, âge calculé et endpoint chatbot
- `shared/siteData.js` : source de vérité partagée pour le contenu structuré

## CV synchronisé
Le CV est chargé depuis `https://raw.githubusercontent.com/QuentinB21/QuentinB21/main/README.md` et rendu en markdown.

Pour le bouton de téléchargement PDF sur la page CV :
- place un fichier `public/cv.pdf`
- ou définis `VITE_CV_PDF_URL` dans ton `.env`

## Ce que suit Umami
Umami couvre les usages produit :
- pages visitées
- durée de visite / session
- pays / région / navigateur / appareil
- referrer
- événements custom comme :
  - ouverture / fermeture du chat
  - message envoyé au chat
  - réponse rendue
  - changement de thème
  - clic sur téléchargement CV

## Variables sensibles
Les données sensibles doivent rester côté serveur dans `.env` :
- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- `OPENAI_BASE_URL`
- `PROFILE_BIRTHDATE`
- `CHATBOT_SYSTEM_PROMPT`
- `UMAMI_DB_PASSWORD`
- `UMAMI_APP_SECRET`

## Configuration
1. Crée un fichier `.env` ou `.env.local` à partir de `.env.example`
2. Renseigne les variables serveur et Umami
3. Lance `docker compose up --build`
4. Crée ton website dans Umami, puis copie son `website id` dans `VITE_UMAMI_WEBSITE_ID`

## Scripts utiles
- `npm run dev` : serveur de dev
- `npm run build` : build production
- `npm run preview` : prévisualisation du build
- `npm run lint` : ESLint
