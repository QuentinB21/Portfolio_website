const REFUSAL_MESSAGE = 'Je ne peux pas fournir cette information.'

const PROFILE = {
  fullName: 'Quentin Bouchot',
  currentRole: 'Software Engineer Apprentice',
  currentCompany: 'Renault Trucks (Volvo Group)',
  location: 'Lyon, France',
  email: 'bouchotquentin0603@gmail.com',
  linkedin: 'https://www.linkedin.com/in/quentin-bouchot-1b55321a7/',
  github: 'https://github.com/QuentinB21',
}

const EXPERIENCES = [
  {
    title: 'Software Engineer Apprentice',
    company: 'Renault Trucks (Volvo Group)',
    periodStart: '2024-09',
    periodEnd: null,
    summary:
      "Développement et maintenance d'outils de diagnostic pour véhicules utilitaires dans un environnement .NET.",
  },
  {
    title: 'Developer Apprentice',
    company: 'Biosystèmes',
    periodStart: '2023-09',
    periodEnd: '2024-08',
    summary:
      "Développement frontend d'une application web en Vue.js pour générer des questionnaires sensoriels à partir de templates éditables.",
  },
]

const EDUCATION = [
  {
    title: 'CPE Lyon',
    degree: 'Cycle ingénieur - Informatique & Réseaux de Communication',
    summary: 'Spécialisation en développement logiciel, data et intelligence artificielle.',
  },
  {
    title: 'IUT Dijon-Auxerre',
    degree: 'BUT Informatique',
    summary: 'Formation en algorithmique, bases de données et développement logiciel.',
  },
]

const SKILLS = {
  backend: ['C#', '.NET', 'ASP.NET', 'API REST', 'Architecture logicielle'],
  frontend: ['Blazor', 'Vue.js', 'TypeScript', 'JavaScript'],
  devops: ['Azure DevOps', 'CI/CD', 'Docker', 'Git'],
  quality: ['Tests unitaires', 'Tests fonctionnels', 'Testabilité', 'Réduction des régressions'],
}

const NAVIGATION = [
  { label: 'Accueil', path: '/' },
  { label: 'Carrière', path: '/work' },
  { label: 'Projets', path: '/projets' },
  { label: 'CV', path: '/cv' },
]

function normalize(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

function includesAny(haystack, needles) {
  return needles.some((needle) => haystack.includes(needle))
}

function parseYearMonth(value) {
  if (!value) return null

  const [yearPart, monthPart] = value.split('-')
  const year = Number(yearPart)
  const month = Number(monthPart)

  if (!Number.isFinite(year) || !Number.isFinite(month)) {
    return null
  }

  return { year, month }
}

function getCurrentPeriod() {
  const now = new Date()
  return { year: now.getFullYear(), month: now.getMonth() + 1 }
}

function diffMonthsInclusive(start, end) {
  return (end.year - start.year) * 12 + (end.month - start.month) + 1
}

function getTotalProfessionalExperienceMonths() {
  return EXPERIENCES.reduce((total, experience) => {
    const start = parseYearMonth(experience.periodStart)
    const end = parseYearMonth(experience.periodEnd) || getCurrentPeriod()

    if (!start || !end) return total
    return total + Math.max(diffMonthsInclusive(start, end), 0)
  }, 0)
}

function formatExperienceDuration(totalMonths) {
  const years = Math.floor(totalMonths / 12)
  const months = totalMonths % 12

  if (years <= 0) return `${months} mois`
  if (months === 0) return `${years} an${years > 1 ? 's' : ''}`
  return `${years} an${years > 1 ? 's' : ''} et ${months} mois`
}

function buildResponse(answer, citations = [], suggestedPaths = []) {
  return { answer, citations, suggestedPaths }
}

function buildCitation(title, path, section, excerpt) {
  return { title, path, section, excerpt }
}

function buildSuggestion(label, path, reason) {
  return { label, path, reason }
}

const deterministicHandlers = [
  {
    matches(question) {
      return (
        includesAny(question, ['combien', 'nombre']) &&
        includesAny(question, ['annee', 'ans', 'an', 'mois']) &&
        includesAny(question, ['experience', 'professionnel', 'pro'])
      )
    },
    build() {
      const totalMonths = getTotalProfessionalExperienceMonths()
      const duration = formatExperienceDuration(totalMonths)
      const roundedYears = Math.round((totalMonths / 12) * 10) / 10

      return buildResponse(
        `${PROFILE.fullName} cumule ${duration} d'expérience professionnelle, soit environ ${roundedYears} ans, répartis sur deux alternances : Biosystèmes de septembre 2023 à août 2024, puis Renault Trucks depuis septembre 2024.`,
        [buildCitation('Chronologie du parcours', '/work', 'Expérience', 'Deux alternances sont détaillées : Biosystèmes puis Renault Trucks.')],
        [buildSuggestion('Voir la page Carrière', '/work', 'pour consulter la chronologie complète des expériences')],
      )
    },
  },
  {
    matches(question) {
      return includesAny(question, ['poste actuel', 'role actuel', 'travaille actuellement', 'travaille ou', 'job actuel'])
    },
    build() {
      return buildResponse(
        `${PROFILE.fullName} est actuellement ${PROFILE.currentRole} chez ${PROFILE.currentCompany}, à ${PROFILE.location}.`,
        [buildCitation(`${PROFILE.currentRole} chez ${PROFILE.currentCompany}`, '/work', 'Expérience', 'Poste actuel chez Renault Trucks depuis septembre 2024.')],
        [buildSuggestion('Voir la page Carrière', '/work', "pour lire le détail de l'expérience actuelle")],
      )
    },
  },
  {
    matches(question) {
      return includesAny(question, ['parcours', 'resume', 'résume', 'quelques mots', 'qui est quentin'])
    },
    build() {
      return buildResponse(
        "Quentin Bouchot suit un cycle ingénieur à CPE Lyon et construit son expérience en logiciel au travers de deux alternances : d'abord chez Biosystèmes en frontend Vue.js, puis chez Renault Trucks sur des outils .NET orientés qualité, tests et maintenabilité.",
        [
          buildCitation('Profil de Quentin Bouchot', '/', 'Profil', 'Élève ingénieur à CPE Lyon, spécialisé en développement logiciel, data et intelligence artificielle.'),
          buildCitation('Parcours professionnel', '/work', 'Expérience', 'Biosystèmes puis Renault Trucks.'),
        ],
        [buildSuggestion('Voir la page Carrière', '/work', 'pour parcourir son parcours professionnel et sa formation')],
      )
    },
  },
  {
    matches(question) {
      return includesAny(question, ['formation', 'etudes', 'études', 'ecole', 'école', 'diplome', 'diplôme', 'cpe', 'iut'])
    },
    build() {
      return buildResponse(
        `${PROFILE.fullName} est actuellement en cycle ingénieur à ${EDUCATION[0].title}, en ${EDUCATION[0].degree.toLowerCase()}, avec une spécialisation en développement logiciel, data et intelligence artificielle. Avant cela, il a suivi un ${EDUCATION[1].degree} à ${EDUCATION[1].title}.`,
        [buildCitation('Formation', '/work', 'Formation', `${EDUCATION[0].title}, puis ${EDUCATION[1].title}.`)],
        [buildSuggestion('Voir la page Carrière', '/work', 'pour retrouver la formation et la timeline complète')],
      )
    },
  },
  {
    matches(question) {
      return includesAny(question, ['competence', 'compétence', 'stack', 'techno', 'technologie', 'outil', 'skills'])
    },
    build() {
      return buildResponse(
        `${PROFILE.fullName} travaille principalement avec ${SKILLS.backend.join(', ')} côté backend, ${SKILLS.frontend.join(', ')} côté frontend, et ${SKILLS.devops.join(', ')} pour la partie industrialisation. Son axe fort reste la qualité logicielle avec ${SKILLS.quality.join(', ')}.`,
        [buildCitation('Compétences techniques', '/work', 'Compétences', 'Backend, frontend, DevOps et qualité logicielle sont résumés sur la page Carrière.')],
        [buildSuggestion('Voir la page Carrière', '/work', 'pour consulter les compétences et leur contexte dans les expériences')],
      )
    },
  },
  {
    matches(question) {
      return includesAny(question, ['projet', 'tradecopilot', 'mailmanager', 'mail manager', 'workflow email'])
    },
    build(question) {
      const asksAboutMailManager = includesAny(question, ['mailmanager', 'mail manager', 'workflow email'])

      return buildResponse(
        asksAboutMailManager
          ? "Mail Manager Workflow est un projet de classement automatisé d'e-mails basé sur React, ASP.NET Core, PostgreSQL, Keycloak et n8n. L'application et son dépôt sont accessibles depuis la page Projets."
          : 'La page Projets présente notamment TradeCopilot et Mail Manager Workflow. Les deux applications et leurs dépôts sont accessibles depuis le portfolio.',
        [buildCitation('Projets personnels', '/projets', 'Projets', 'TradeCopilot et Mail Manager Workflow sont présentés sur cette page.')],
        [buildSuggestion('Voir la page Projets', '/projets', 'pour consulter les présentations et accéder aux dépôts')],
      )
    },
  },
  {
    matches(question) {
      return includesAny(question, ['contact', 'email', 'mail', 'linkedin', 'github'])
    },
    build() {
      return buildResponse(
        `Tu peux contacter ${PROFILE.fullName} par email à ${PROFILE.email}, ou passer par son LinkedIn et son GitHub depuis le site.`,
        [buildCitation('Moyens de contact', '/', 'Contact', `Email ${PROFILE.email}. LinkedIn et GitHub sont aussi disponibles.`)],
        [buildSuggestion('Revenir à la page Accueil', '/', 'pour retrouver les liens de contact visibles sur le site')],
      )
    },
  },
  {
    matches(question) {
      return includesAny(question, ['cv', 'curriculum', 'telecharger', 'télécharger'])
    },
    build() {
      return buildResponse(
        'La page CV présente la version document du profil de Quentin. Elle est alignée sur son GitHub et tu peux aussi télécharger le CV directement depuis cette page.',
        [buildCitation('Page CV', '/cv', 'CV', 'Le CV est lisible sur la page et téléchargeable.')],
        [buildSuggestion('Ouvrir la page CV', '/cv', 'pour lire ou télécharger le CV complet')],
      )
    },
  },
  {
    matches(question) {
      return includesAny(question, ['page', 'site', 'navigation', 'ou aller', 'où aller', 'ou trouver', 'où trouver'])
    },
    build() {
      return buildResponse(
        `Le site comporte quatre pages principales : ${NAVIGATION.map((item) => `${item.label} (${item.path})`).join(', ')}.`,
        [buildCitation('Navigation du site', '/', 'Navigation', 'Le site comporte Accueil, Carrière, Projets et CV.')],
        NAVIGATION.map((item) => buildSuggestion(`Aller vers ${item.label}`, item.path, `ouvrir la page ${item.label.toLowerCase()}`)),
      )
    },
  },
]

export { REFUSAL_MESSAGE }

export function buildDeterministicChatResponse(question) {
  const normalizedQuestion = normalize(question)
  const handler = deterministicHandlers.find((entry) => entry.matches(normalizedQuestion))
  return handler ? handler.build(normalizedQuestion) : null
}

export function buildRefusalResponse() {
  return buildResponse(REFUSAL_MESSAGE, [], [])
}
