import { FiGithub, FiLinkedin, FiMail } from 'react-icons/fi'
import type { ContactItem, ProfessionalProject, PersonalProject, Skill, TimelineItem } from '../types'

export const skills: Skill[] = [
  { title: 'Backend', items: ['C#', '.NET', 'ASP.NET', 'API REST', 'Architecture logicielle'] },
  { title: 'Frontend', items: ['Blazor', 'Vue.js', 'TypeScript', 'JavaScript'] },
  { title: 'DevOps & outils', items: ['Azure DevOps', 'CI/CD', 'Docker', 'Git'] },
  {
    title: 'Qualité logicielle',
    items: ['Tests unitaires', 'Tests fonctionnels', 'Testabilité', 'Réduction des régressions'],
  },
]

export const professionalProjects: ProfessionalProject[] = [
  {
    title: 'Outils de diagnostic véhicules',
    description:
      "Développement et amélioration d'outils de diagnostic pour véhicules utilitaires Renault Trucks, dans un environnement .NET avec des enjeux de maintenabilité et de qualité logicielle.",
    stack: ['C#', '.NET', 'WPF', 'Blazor', 'Azure DevOps'],
    link: 'https://www.volvogroup.com',
    status: 'En poste',
  },
  {
    title: 'Générateur de questionnaires sensoriels',
    description:
      "Conception frontend d'une application web en Vue.js pour générer des questionnaires sensoriels à partir de templates éditables, avec un travail sur l'ergonomie et le Green IT.",
    stack: ['Vue.js', 'TypeScript', 'JavaScript', 'Bootstrap'],
    link: 'https://www.biosystemes.com/',
    status: 'Livré',
  },
]

export const refScopeRelease = {
  version: '1.0.3.1993412',
  href: '/downloads/RefScope-1.0.3.1993412.vsix',
} as const

export const personalProjects: PersonalProject[] = [
  {
    title: 'RefScope',
    description: 'Extension Visual Studio développée pour distinguer les références applicatives des références de tests au-dessus des méthodes C#. Elle répond à une difficulté rencontrée dans mon équipe après la mise en place d’une nouvelle stratégie de tests.',
    stack: ['C#', '.NET'],
    href: refScopeRelease.href,
    download: true,
    status: `Version ${refScopeRelease.version}`,
    ctaLabel: 'Télécharger RefScope (.vsix)',
    note: 'Installation : fermer Visual Studio, ouvrir le fichier VSIX puis suivre l’assistant. Compatibilité déclarée : Visual Studio 17.x et 18.x, Windows x64. Dans cette version, une référence est classée comme test si le chemin de son fichier se termine par Tests.cs. Distribution directe, sans publication sur le Marketplace.',
  },
  {
    title: 'TradeCopilot',
    description:
      "Application dédiée au suivi patrimonial et à l'aide à la décision pour les investisseurs particuliers. Le portfolio l'expose simplement depuis le même domaine, sans fusionner son dépôt ni sa stack technique.",
    stack: ['React', 'ASP.NET Core', 'PostgreSQL', 'Keycloak', 'Docker Compose'],
    href: '/projets/TradeCopilot/',
    repoUrl: 'https://github.com/QuentinB21/TradeCopilot',
    presentationUrl: 'https://github.com/QuentinB21/TradeCopilot/blob/master/docs/presentation.md',
    status: 'MVP en évolution',
    ctaLabel: 'Ouvrir TradeCopilot',
    note: "Le portfolio agit ici comme point d'entrée et reverse proxy. Le déploiement de TradeCopilot reste autonome.",
  },
  {
    title: 'Mail Manager Workflow',
    description:
      "Application de classement automatisé d'e-mails combinant une interface React, une API ASP.NET Core et des workflows n8n.",
    stack: ['React', 'ASP.NET Core', 'PostgreSQL', 'Keycloak', 'n8n'],
    href: '/projets/MailManager/',
    repoUrl: 'https://github.com/QuentinB21/MailManagerWorkflow',
    presentationUrl: 'https://github.com/QuentinB21/MailManagerWorkflow/blob/master/README.md',
    available: true,
    status: 'MVP en évolution',
    ctaLabel: 'Ouvrir Mail Manager',
    note: "Le portfolio fournit uniquement le point d'entrée HTTPS et le reverse proxy. Le dépôt et le déploiement de l'application restent autonomes.",
  },
]

export const timelineItems: TimelineItem[] = [
  {
    kind: "experience",
    title: "Stage · Agents IA & automatisation",
    place: "Innoova · Montréal, Québec, Canada",
    periodStart: "2026-06-29",
    periodEnd: "2026-08-28",
    detail:
      "Conception d'agents IA pour accélérer les processus internes d'Innoova dans son activité d'intégration Workday. Analyse des besoins avec l'équipe et exploration des usages de l'intelligence artificielle pour faciliter le travail des intégrateurs. Une expérience internationale mêlant autonomie, compréhension des enjeux métiers et collaboration au sein d'une équipe de conseil en transformation numérique.",
  },
  {
    kind: 'experience',
    title: 'Software Engineer Apprentice',
    place: 'Renault Trucks (Volvo Group)',
    stack: professionalProjects[0].stack,
    periodStart: '2024-09',
    periodEnd: null,
    detail:
      "Développement et maintenance d'outils de diagnostic pour véhicules utilitaires. Travail sur les correctifs, les évolutions, la qualité logicielle, les tests et les pipelines CI/CD.",
  },
  {
    kind: 'education',
    title: 'CPE Lyon',
    place: 'Cycle ingénieur - Informatique & Réseaux de Communication',
    periodStart: '2024-09',
    periodEnd: '2027-06',
    detail: 'Spécialisation en développement logiciel, data et intelligence artificielle.',
  },
  {
    kind: 'experience',
    title: 'Developer Apprentice',
    place: 'Biosystèmes',
    stack: professionalProjects[1].stack,
    periodStart: '2023-09',
    periodEnd: '2024-08',
    detail:
      "Développement frontend d'une application web from scratch en Vue.js pour générer des questionnaires sensoriels depuis des templates éditables.",
  },
  {
    kind: 'education',
    title: 'IUT Dijon-Auxerre',
    place: 'BUT Informatique',
    periodStart: '2021-09',
    periodEnd: '2024-06',
    detail: 'Formation en algorithmique, bases de données et développement logiciel.',
  },
]

export const contact: ContactItem[] = [
  { label: 'bouchotquentin0603@gmail.com', icon: <FiMail />, href: 'mailto:bouchotquentin0603@gmail.com' },
  { label: 'LinkedIn', icon: <FiLinkedin />, href: 'https://www.linkedin.com/in/quentin-bouchot-1b55321a7/' },
  { label: 'GitHub', icon: <FiGithub />, href: 'https://github.com/QuentinB21' },
]
