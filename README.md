# Portfolio Quentin Bouchot

Portfolio personnel en React et TypeScript, construit avec Vite et servi par Express. Caddy assure le HTTPS et l’accès aux applications de projets en production. Umami mesure l’audience uniquement après consentement.

## Démarrer en local

Utiliser Node.js 24 LTS.

```bash
npm install
npm run dev
```

Ouvrir `http://localhost:5173`. Vite permet de travailler sur l’interface ; l’âge reste facultatif lorsqu’aucun backend ne sert `/api/profile`.

Pour tester le site complet avec l’API et le build, dans PowerShell :

```powershell
npm run build
$env:PORT = '8088'
# Facultatif : renseigner PROFILE_BIRTHDATE dans .env.local.
node --env-file-if-exists=.env.local server/index.js
```

Ouvrir `http://localhost:8088`. Les variables `VITE_*` sont intégrées pendant le build ; les variables serveur sont lues au démarrage.

## Vérifications

```bash
npm run lint
npm test
```

`npm test` construit le site puis vérifie les routes de production, les ressources, le PDF, l’API de profil et l’absence de l’ancienne API de chat. Les tests lancent un serveur local temporaire avec des données fictives.

## Structure

- `src/App.tsx` : routes et raccordement des services communs.
- `src/components/SiteLayout.tsx` : structure du site, identité et actions rapides.
- `src/components/SiteNavigation.tsx` : navigation responsive et indicateur animé.
- `src/components/SiteFooter.tsx` : liens légaux et préférences de confidentialité.
- `src/pages/` : accueil, carrière, projets, CV, mentions légales et confidentialité.
- `src/components/` : introductions, cartes, compétences, chronologie, contacts et présentation Markdown des projets.
- `src/data/content.tsx` : contenu éditorial, projets professionnels et personnels, compétences, parcours et contacts.
- `src/config/` : onglets, préférence de thème et informations légales.
- `src/hooks/` : chargement du CV, âge, thème et cache des présentations de projets.
- `src/styles/` : styles répartis par responsabilité ; `index.css` fixe l’ordre de la cascade et charge les adaptations responsive en dernier.
- `src/index.css` : thèmes, variables et règles globales ; `src/fonts.css` et `public/fonts/` : polices locales et licences.
- `src/utils/` : analytics, consentement, Markdown, dates et impression du CV.
- `server/index.js` : fichiers statiques, routes du frontend et calcul de l’âge via `/api/profile`.
- `tests/server.test.js` : contrôles du serveur de production.

Le bilan du ménage et les fonctionnalités conservées sont détaillés dans [docs/code-cleanup.md](docs/code-cleanup.md).

## CV et présentations de projets

Le CV est récupéré depuis le README public du profil GitHub, ou depuis `VITE_CV_MARKDOWN_URL`. Son HTML est nettoyé avec DOMPurify avant affichage et impression. Le bouton PDF utilise ce contenu ; si celui-ci est indisponible, il ouvre le fichier `public/cv.pdf` ou `VITE_CV_PDF_URL`.

Les présentations des projets utilisent un cache en mémoire partagé et dédupliquent les requêtes simultanées. Changer d’onglet conserve les contenus pendant la visite ; recharger ou rouvrir le site démarre un nouveau cache. Les erreurs peuvent être retentées au prochain passage sur Projets.

## Configuration et Docker

Créer `.env` à partir de `.env.example`, puis renseigner les variables nécessaires :

- `PROFILE_BIRTHDATE` : date de naissance calculée côté serveur, jamais injectée dans le frontend.
- `VITE_CV_MARKDOWN_URL` et `VITE_CV_PDF_URL` : sources du CV.
- `VITE_UMAMI_SCRIPT_URL` et `VITE_UMAMI_WEBSITE_ID` : mesure d’audience facultative.
- `UMAMI_DB_NAME`, `UMAMI_DB_USER`, `UMAMI_DB_PASSWORD`, `UMAMI_APP_SECRET` : installation Umami.

```bash
docker compose up --build
```

Le portfolio est accessible sur `http://localhost:8088` et Umami sur `http://127.0.0.1:3001`. Créer le site dans Umami, recopier son identifiant dans `VITE_UMAMI_WEBSITE_ID`, puis reconstruire le frontend.

Umami suit les pages et les événements de changement de thème et de téléchargement du CV. Le consentement et son retrait sont gérés depuis le pied de page.

## Production

La configuration comprend `docker-compose.prod.yml`, `deploy/Caddyfile`, `.env.prod.example` et `.github/workflows/deploy-production.yml`. Voir [docs/production.md](docs/production.md) pour le déploiement et les applications indépendantes TradeCopilot et Mail Manager, et [docs/legal-and-privacy.md](docs/legal-and-privacy.md) pour la confidentialité.

Le chatbot a été supprimé. Les anciennes variables `OPENAI_*` et `CHATBOT_SYSTEM_PROMPT` peuvent être retirées des fichiers d’environnement locaux et du VPS ; elles ne sont plus lues ni transmises au conteneur du portfolio.
