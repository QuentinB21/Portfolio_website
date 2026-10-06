# Bilan du ménage du code — 4 octobre 2026

Ce changement prépare la refonte graphique en clarifiant la structure, sans changer les routes publiques ni le contenu éditorial conservé. Le chatbot est retiré définitivement de cette version. Aucun déploiement ni changement de configuration sur le VPS n’a été effectué pendant ce ménage.

## Inventaire et suppressions

L’inventaire suit les imports depuis `src/main.tsx`, les références HTML/CSS aux ressources, les classes dynamiques et les points d’entrée du serveur et de Docker. Les polices, licences, PDF, favicon et logo sont conservés parce qu’ils sont utilisés, même lorsqu’ils ne sont pas importés directement par un composant.

| Élément | Constat | Action |
| --- | --- | --- |
| `ChatWidget`, `useChatbot`, `chatApi`, `chatStorage` | Interface désactivée, code encore présent | Suppression des quatre modules, des types, constantes, réponses prédéfinies et branchements dans `App` |
| `server/chatDomain.js`, `server/siteKnowledge.js`, `/api/chat` | Backend de l’assistant encore accessible | Suppression des modules, de la route, des appels OpenAI et du parseur de corps JSON devenu inutile |
| Variables `OPENAI_*`, `CHATBOT_SYSTEM_PROMPT` | Exclusivement utilisées par l’assistant | Retrait des exemples d’environnement, des deux configurations Compose et de la documentation d’exploitation |
| `NavBar`, `Hero`, `Stats`, `CvSection`, `ContactSection`, `ProjectsSection`, `SkillsSection`, `TimelineSection` | Huit anciens composants sans import depuis les pages actives | Suppression ; les fonctionnalités présentes dans les pages actuelles sont conservées |
| Réponses et types du chatbot | Exclusivement liés aux modules supprimés | Suppression de `ChatMessage`, `ChatCitation`, `ChatSuggestedPath`, `CannedAnswer` et `cannedAnswers` |
| Styles du chatbot | Aucun élément correspondant après suppression | Retrait du bloc complet, des surcharges mobile et des variables associées |
| Autres styles inutilisés | `theme-switch-glyph`, `accent-pill-wide`, `principle-list`, `quote-block`, ancienne règle mobile `timeline-period`, variable `text-subtle` | Suppression ; règles répétées du bouton de présentation fusionnées |
| `src/assets/1.png`, `react.svg`, `public/vite.svg` | Aucune référence active | Suppression |
| `1_glass.png`, `2_glass.png` | Ancien logo et favicon | Remplacés par `src/assets/logo.svg` et `public/favicon.svg`, source des icônes PNG/ICO pour les navigateurs et l’installation |
| README et informations sur l’assistant | Documentation en décalage avec le code, référence à un fichier partagé inexistant | Mise à jour du README, de la documentation de production et retrait des passages sur l’assistant dans la confidentialité |

Au total, 17 fichiers obsolètes sont supprimés, hors fichiers remplacés ou renommés. Les sources `src/` et `server/` passent de **5 009 à 3 423 lignes**, soit **1 586 lignes en moins**, malgré l’extraction de composants et la mise en forme. Ce comptage exclut documentation, images et nouveaux tests.

## Structure après factorisation

| Ancienne responsabilité | Nouvelle structure |
| --- | --- |
| `SiteChrome` : identité, actions, navigation, animation et footer | `SiteLayout`, `SiteNavigation`, `SiteFooter` ; classes CSS `site-brand`, `site-utilities`, `site-navigation`, `navigation-tabs` |
| `WorkPage` | `CareerPage`, toujours accessible sur `/work` |
| `StoryItem` | `ProfileFact`, pour les informations de profil et les statistiques éditoriales |
| `projects` / `showcaseProjects`, types `Project` / `ShowcaseProject` | `professionalProjects` / `personalProjects`, types `ProfessionalProject` / `PersonalProject` |
| Introductions répétées des pages carrière, projets et CV | `PageIntro`, avec contenu complémentaire et variante CV |
| Structure répétée des cartes professionnelles et personnelles | `ProjectCard`, avec action et contenu propres à chaque page |
| Listes de technologies répétées | `TechnologyTags`, utilisé dans les projets, compétences et l’accueil |
| Chronologie et compétences intégrées dans une longue page | `CareerTimeline` et `SkillsList` |
| Contacts et leur style selon le service | `ContactLinks` |
| Impression/téléchargement dans le composant racine | `CvDownloadButton` |
| Chargement/sanitation du Markdown mélangés à l’impression | `renderMarkdown.ts` et `printCv.ts` |
| `App.css` monolithique | `src/styles/` : layout, navigation, contrôles, sections, projets, chronologie, documents, footer/confidentialité et responsive |

Le fichier `src/styles/index.css` conserve l’ordre de la cascade. Les règles responsive restent chargées en dernier. Les utilitaires uniquement internes aux modules ne sont plus exportés inutilement. Le chargement de l’âge est raccordé à la page d’accueil ; le CV reste chargé au niveau de l’application pour garder son contenu entre les onglets.

## Dépendances et services conservés

Toutes les dépendances directes de production restent utilisées :

- React / React DOM et React Router : rendu et navigation.
- `react-icons` : icônes de l’interface.
- `react-markdown` : présentation des projets, avec résolution des liens relatifs.
- `marked` et DOMPurify : conversion du CV en HTML nettoyé, réutilisé pour l’impression. Ces bibliothèques ne sont pas des reliquats du chatbot.
- Express : fichiers du build et API `/api/profile`, qui conserve la date de naissance côté serveur.

Aucune nouvelle dépendance n’est ajoutée. Le verrouillage npm est conservé. TypeScript, Vite et les outils ESLint restent nécessaires à la compilation et à la vérification. Les tests serveur utilisent uniquement les modules intégrés à Node.js.

Les intégrations actives restent en place : GitHub pour le CV et les présentations, Umami après consentement, Caddy pour le reverse proxy, le service de purge des statistiques et les routes des applications autonomes TradeCopilot et Mail Manager.

## Vérifications

- `npm test` : compilation TypeScript/Vite puis deux tests d’intégration du vrai serveur, sur des ports temporaires. Ils vérifient les six routes, les ressources du build, le PDF, l’âge configuré et la réponse 404 de l’ancien endpoint de chat.
- `npm run lint`, `npm audit` et `git diff --check` : validés ; audit sans vulnérabilité.
- Configurations Compose locale et production : validation avec les fichiers d’environnement d’exemple, sans lancement ni modification de services.
- Graphe des imports : aucun module TS/TSX/CSS restant hors des points d’entrée ; toutes les dépendances directes de production sont référencées.
- Comparaison navigateur avant/après des six pages, en clair et sombre, à 390 et 1 440 px : dimensions des pages inchangées, sauf confidentialité après le retrait du paragraphe sur l’assistant. Les ressources GitHub sont remplacées par des contenus fictifs déterministes pour cette comparaison.
- Parcours sur le build de production : thèmes et persistance, chronologie et compétences, présentations complètes et liens relatifs, cache des README entre onglets et rechargement à l’ouverture d’un nouveau document, erreurs et nouvelle tentative, nettoyage du CV et impression, téléchargement du PDF de secours, footer accessible, liens légaux, dialogue de confidentialité, retour/avance du navigateur.
- Navigation : bulle alignée à 320, 390, 720, 721 et 1 440 px et après modification d’un libellé long ; animation de page et préférence de réduction des animations conservées.
- Consentement avec un script Umami fictif : aucun chargement avant accord ou après refus, chargement unique après accord, événement de thème, retrait avec rechargement et suppression des identifiants.

Le workflow GitHub exécute désormais le lint puis `npm test` avant le déploiement, en conservant les variables de build existantes. Les tests navigateur ont été faits sous Chromium, avec des sources externes simulées ; ils ne constituent pas un test de disponibilité de GitHub ou des applications du VPS.

## Pour la suite

Le logo et le favicon restent volumineux (environ 2,6 et 1,9 Mo). Ils sont utilisés et ont donc été conservés ; leur optimisation pourra accompagner la refonte. Le contenu du portfolio reste centralisé dans `src/data/content.tsx` et les thèmes dans `src/index.css`, ce qui donne des points d’entrée clairs pour le futur travail graphique.

Lors du prochain déploiement, le conteneur du portfolio n’exposera plus `/api/chat`. Les anciennes variables OpenAI peuvent être effacées des fichiers d’environnement réels ; elles sont déjà ignorées par le code et ne sont plus transmises par Compose. Les historiques précédemment stockés dans le navigateur ne sont plus lus ni écrits par le site.
