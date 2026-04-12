# Portfolio Quentin Bouchot

Site personnel/portfolio en React + TypeScript + Vite. Il met en avant le profil de Quentin Bouchot, ses experiences, sa timeline, une page CV synchronisee depuis GitHub et un chatbot branche sur un backend Node.

## Stack
- React 19, TypeScript, Vite
- Styles custom, `react-icons`, `react-markdown`
- Backend Node/Express pour servir le build et proteger les variables sensibles

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
Le service est expose sur `http://localhost:8088`.

## Structure
- `src/App.tsx` : pages principales et logique front
- `src/data/content.tsx` : contenu editorial du portfolio
- `src/App.css` / `src/index.css` : styles globaux
- `server/index.js` : serveur Express et endpoints backend

## CV synchronise
Le CV est charge depuis `https://raw.githubusercontent.com/QuentinB21/QuentinB21/main/README.md` et rendu en markdown.

Pour le bouton de telechargement PDF sur la page CV :
- place un fichier `public/cv.pdf`
- ou definis `VITE_CV_PDF_URL` dans ton `.env`

## Variables sensibles
Les donnees sensibles ou semi-sensibles doivent rester cote serveur dans `.env` :
- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- `OPENAI_BASE_URL`
- `PROFILE_BIRTHDATE`
- `CHATBOT_SYSTEM_PROMPT`

Le front ne contient plus ces donnees :
- la date de naissance n'est pas exposee au client, seul l'age calcule est renvoye par `/api/profile`
- le prompt systeme du chatbot est lu depuis le serveur

## Configuration
1. Cree un fichier `.env` ou `.env.local` a partir de `.env.example`
2. Renseigne les variables serveur comme `OPENAI_API_KEY`, `PROFILE_BIRTHDATE` et `CHATBOT_SYSTEM_PROMPT`
3. Le front dialogue uniquement avec `/api/chat` et `/api/profile`

## Scripts utiles
- `npm run dev` : serveur de dev
- `npm run build` : build production
- `npm run preview` : previsualisation du build
- `npm run lint` : ESLint
