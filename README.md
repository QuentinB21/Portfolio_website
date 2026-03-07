# Portfolio Quentin Bouchot

Site personnel/portfolio en React + TypeScript + Vite. Il met en avant le profil full‑stack (.NET/React/TypeScript), les projets phares, l’expérience/formation, une page CV synchronisée depuis GitHub et une section d’assistant IA (démo front avec effet de frappe).

## Stack
- React 19, TypeScript, Vite
- Styles custom (glassmorphism, grid overlay), `react-icons`, `react-markdown`
- Chat front (typing effect) prêt à être branché sur une API IA

## Démarrer en local
```bash
npm install
npm run dev
```
Ouvrir http://localhost:5173. Vite 7 recommande Node 20.19+ ou 22.12+ (Node 18 affiche juste un warning).

## Docker
```bash
docker build -t portfolio-quentin .
docker run -p 8080:80 portfolio-quentin
```
Avec `docker-compose` : `docker-compose up --build` (exposé sur le port 8080).

## Structure
- `src/App.tsx` : sections principales (hero, compétences, projets, parcours, CV, assistant IA, contact)
- `src/App.css` / `src/index.css` : thème sombre glassmorphism + overlay
- `Dockerfile` : build Vite (node:20-alpine) puis nginx statique

## CV synchronisé
Le CV est chargé depuis `https://raw.githubusercontent.com/QuentinB21/QuentinB21/main/README.md` et rendu en markdown. Il suffit de mettre à jour le README du repo `QuentinB21/QuentinB21` pour rafraîchir la page CV.
Pour le bouton de téléchargement PDF sur la page CV, place un fichier `public/cv.pdf` ou définis `VITE_CV_PDF_URL` dans `.env.local`.

## Brancher une vraie IA (sans exposer la clé)
1) Créer un fichier `.env.local` (non versionné) à partir de `.env.example` et y placer la clé OpenAI (`VITE_OPENAI_API_KEY`) et le modèle (`VITE_OPENAI_MODEL=gpt-4o-mini` par défaut).  
2) Par sécurité, il est conseillé de passer par un backend/edge (FastAPI/Node) qui consommera la clé côté serveur. Le front enverra la question à cet endpoint, pas directement à OpenAI.  
3) Ne jamais commit la clé (ni la mettre en clair dans le code ou le repo).

## Scripts utiles
- `npm run dev` : serveur de dev
- `npm run build` : build production
- `npm run preview` : prévisualisation du build
- `npm run lint` : ESLint
