import { FiGithub, FiLinkedin, FiMail } from 'react-icons/fi'
import type { CannedAnswer, ContactItem, Project, Skill, TimelineItem } from '../types'

export const skills: Skill[] = [
  { title: 'Backend', items: ['C# / ASP.NET', 'Node.js', 'PostgreSQL', 'REST'] },
  { title: 'Frontend', items: ['React', 'TypeScript', 'Blazor', 'Vue.js'] },
  { title: 'DevOps & Cloud', items: ['Docker', 'CI/CD (GitHub Actions)', 'Nginx', 'Azure DevOps', 'Linux'] },
  { title: 'Data & IA', items: ['Python', 'FastAPI', 'LLM integration', 'LangChain', 'ETL'] },
  { title: 'Soft skills', items: ['Pédagogie', 'Autonomie', 'Leadership technique', 'Gestion produit', 'Mentorat'] },
]

export const projects: Project[] = [
  {
    title: 'Diagnostic véhicules (Renault Trucks)',
    description: 'Outils de diagnostic (WPF) et portail web (Blazor) pour véhicules utilitaires.',
    stack: ['.NET 5/8', 'Blazor', 'WPF', 'Azure DevOps', 'App Insights'],
    link: 'https://www.volvogroup.com',
    status: 'En poste',
  },
  {
    title: 'Générateur de questionnaires',
    description: 'Applications web pour créer des questionnaires sensoriels à partir de templates.',
    stack: ['Vue.js', 'TypeScript', 'CI/CD', 'Docker'],
    link: 'https://www.biosystemes.com/',
    status: 'Livré',
  },
  {
    title: 'Assistant IA Portfolio',
    description: 'Chat temps réel qui répond aux recruteurs sur mon profil et mes projets.',
    stack: ['React', 'FastAPI', 'LangChain', 'OpenAI', 'Vector DB'],
    link: 'https://github.com/quentin/ai-portfolio',
    status: 'R&D',
  },
]

export const experiences: TimelineItem[] = [
  {
    title: 'Software Engineer Apprentice',
    place: 'Renault Trucks (Volvo Group)',
    period: 'Sept. 2024 – Présent',
    detail:
      'Développement d’outils de diagnostic pour véhicules utilitaires, desktop (WPF) et portail web (Blazor). Maintenance et CI/CD.',
  },
  {
    title: 'Developer Apprentice',
    place: 'Biosystèmes',
    period: 'Sept. 2023 – Août 2024',
    detail: 'Développement d’applications web (Vue.js) de génération de questionnaires sensoriels depuis des templates.',
  },
]

export const educations: TimelineItem[] = [
  {
    title: 'CPE Lyon',
    place: 'Diplôme ingénieur Informatique & Réseaux',
    period: '2024 – 2027',
    detail: 'Spécialisation logiciel, data & IA.',
  },
  {
    title: 'IUT Dijon-Auxerre',
    place: 'BUT Informatique',
    period: '2021 – 2024',
    detail: 'Algorithmique, bases de données, développement web.',
  },
]

export const contact: ContactItem[] = [
  { label: 'bouchotquentin0603@gmail.com', icon: <FiMail />, href: 'mailto:bouchotquentin0603@gmail.com' },
  { label: 'LinkedIn', icon: <FiLinkedin />, href: 'https://www.linkedin.com/in/quentin-bouchot-1b55321a7/' },
  { label: 'GitHub', icon: <FiGithub />, href: 'https://github.com/QuentinB21' },
]

export const cannedAnswers: CannedAnswer[] = [
  {
    keywords: ['stack', 'tech', 'techno'],
    answer:
      'Je travaille surtout avec React + TypeScript côté front, .NET/Blazor ou Node côté backend, Docker/Nginx pour le déploiement, et CI/CD via GitHub Actions ou Azure DevOps.',
  },
  {
    keywords: ['exp', 'expérience', 'parcours', 'cv'],
    answer:
      'Apprenti ingénieur software chez Renault Trucks (Volvo Group) depuis 2024, ex-Biosystèmes (2023-2024), actuellement en école CPE Lyon. Projets : outils de diagnostic, apps web et intégration CI/CD.',
  },
  {
    keywords: ['ia', 'assistant', 'chat'],
    answer:
      "L'assistant IA est prévu pour être relié à mon CV et mes projets. Il peut expliquer mes choix techniques ou détailler un livrable.",
  },
  {
    keywords: ['mission', 'freelance', 'dispo'],
    answer: 'Je suis ouvert à des missions ponctuelles (soir/week-end) en web, data ou intégrations IA.',
  },
]
