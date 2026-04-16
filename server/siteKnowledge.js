export const siteKnowledge = [
  {
    id: 'overview-profile',
    path: '/',
    pageLabel: 'Overview',
    section: 'Profil',
    title: 'Profil de Quentin Bouchot',
    content:
      "Quentin Bouchot est élève ingénieur en informatique et réseaux à CPE Lyon, spécialisé en développement logiciel, data et intelligence artificielle. Il se positionne comme un ingénieur logiciel orienté produit, qualité logicielle, robustesse et expérience utilisateur.",
    keywords: ['profil', 'quentin', 'cpe', 'ingenieur', 'data', 'ia', 'positionnement'],
  },
  {
    id: 'overview-focus',
    path: '/',
    pageLabel: 'Overview',
    section: 'Axes',
    title: 'Axes de travail',
    content:
      "Les trois axes mis en avant sur la page d'accueil sont la qualité logicielle, la vision produit et l'industrialisation progressive. Le site insiste sur la maintenabilité, la fiabilité, l'expérience utilisateur, les tests et le CI/CD.",
    keywords: ['qualité', 'produit', 'industrialisation', 'tests', 'cicd', 'vision'],
  },
  {
    id: 'work-renault',
    path: '/work',
    pageLabel: 'Carriere',
    section: 'Experience',
    title: 'Software Engineer Apprentice chez Renault Trucks',
    content:
      "Depuis septembre 2024, Quentin travaille chez Renault Trucks comme Software Engineer Apprentice. Il developpe et maintient des outils de diagnostic pour vehicules utilitaires dans un environnement .NET, avec un travail sur les correctifs, les evolutions, la qualite logicielle, les tests et les pipelines CI/CD.",
    keywords: ['renault', 'trucks', 'volvo', 'diagnostic', '.net', 'c#', 'wpf', 'blazor', 'azure devops'],
  },
  {
    id: 'work-biosystemes',
    path: '/work',
    pageLabel: 'Carriere',
    section: 'Experience',
    title: 'Developer Apprentice chez Biosystemes',
    content:
      "De septembre 2023 à aout 2024, Quentin à été Developer Apprentice chez Biosystemes. Il y a conçu le frontend d'une application web en Vue.js from scratch pour générer des questionnaires sensoriels a partir de templates éditables, avec un travail sur l'ergonomie et le Green IT.",
    keywords: ['biosystemes', 'vue', 'questionnaires', 'frontend', 'green it', 'ergonomie'],
  },
  {
    id: 'work-education-cpe',
    path: '/work',
    pageLabel: 'Carriere',
    section: 'Formation',
    title: 'CPE Lyon',
    content:
      "Quentin suit le cycle ingenieur Informatique & Reseaux de Communication a CPE Lyon de 2024 a 2027, avec une specialisation en developpement logiciel, data et intelligence artificielle.",
    keywords: ['cpe', 'lyon', 'formation', 'ingenieur', '2024', '2027'],
  },
  {
    id: 'work-education-iut',
    path: '/work',
    pageLabel: 'Carriere',
    section: 'Formation',
    title: 'IUT Dijon-Auxerre',
    content:
      "Avant CPE Lyon, Quentin a suivi un BUT Informatique a l'IUT Dijon-Auxerre de 2021 a 2024. La formation couvrait l'algorithmique, les bases de donnees et le developpement logiciel.",
    keywords: ['iut', 'dijon', 'auxerre', 'but', 'informatique', 'algorithmique', 'bases de donnees'],
  },
  {
    id: 'work-skills',
    path: '/work',
    pageLabel: 'Carriere',
    section: 'Competences',
    title: 'Competences techniques',
    content:
      "Les competences techniques mises en avant sont C#, .NET, ASP.NET, API REST, architecture logicielle, Blazor, Vue.js, TypeScript, JavaScript, Azure DevOps, CI/CD, Docker, Git, ainsi que les tests unitaires, les tests fonctionnels, la testabilite et la reduction des regressions.",
    keywords: ['competences', 'stack', 'backend', 'frontend', 'devops', 'tests', 'docker', 'git'],
  },
  {
    id: 'cv-page',
    path: '/cv',
    pageLabel: 'CV',
    section: 'CV',
    title: 'Page CV',
    content:
      "La page CV presente une version lisible du CV de Quentin. Son contenu est synchronise avec son profil GitHub, et l'utilisateur peut aussi telecharger le CV directement depuis cette page.",
    keywords: ['cv', 'github', 'telecharger', 'document', 'resume'],
  },
  {
    id: 'site-navigation',
    path: '/',
    pageLabel: 'Navigation',
    section: 'Navigation',
    title: 'Navigation du site',
    content:
      "Le site comporte trois pages principales : Overview pour la presentation generale, Carriere pour les experiences, la chronologie et les competences, et CV pour la version document et le telechargement du CV.",
    keywords: ['navigation', 'overview', 'carriere', 'cv', 'pages', 'rediriger'],
  },
  {
    id: 'site-contact',
    path: '/',
    pageLabel: 'Contact',
    section: 'Contact',
    title: 'Moyens de contact',
    content:
      "Les moyens de contact presents sur le site sont l'email bouchotquentin0603@gmail.com, le profil LinkedIn de Quentin Bouchot et son GitHub QuentinB21.",
    keywords: ['contact', 'email', 'linkedin', 'github', 'mail'],
  },
  {
    id: 'site-chatbot',
    path: '/',
    pageLabel: 'Assistant',
    section: 'Chatbot',
    title: 'Capacites du chatbot',
    content:
      "Le chatbot du site peut aider a comprendre le profil de Quentin, son parcours, ses competences et la structure du site. Il peut aussi suggerer des pages pertinentes comme Carriere ou CV selon la question de l'utilisateur.",
    keywords: ['chatbot', 'assistant', 'site', 'aide', 'pages'],
  },
]

function normalize(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

function tokenize(value) {
  return normalize(value)
    .split(/[^a-z0-9.+#/-]+/)
    .filter(Boolean)
}

export function retrieveKnowledge(question, limit = 6) {
  const tokens = tokenize(question)
  if (tokens.length === 0) {
    return siteKnowledge.slice(0, limit)
  }

  const scored = siteKnowledge
    .map((entry) => {
      const haystack = `${entry.title} ${entry.section} ${entry.content} ${entry.keywords.join(' ')}`
      const normalizedHaystack = normalize(haystack)

      let score = 0
      for (const token of tokens) {
        if (entry.keywords.some((keyword) => normalize(keyword).includes(token))) {
          score += 5
        }

        if (normalizedHaystack.includes(token)) {
          score += 2
        }
      }

      return { entry, score }
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)

  if (scored.length === 0) {
    return siteKnowledge.slice(0, limit)
  }

  return scored.slice(0, limit).map((item) => item.entry)
}

export function buildKnowledgeContext(entries) {
  return entries
    .map(
      (entry) =>
        `- [${entry.pageLabel}] ${entry.title}\n  path: ${entry.path}\n  section: ${entry.section}\n  content: ${entry.content}`,
    )
    .join('\n')
}
