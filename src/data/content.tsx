import { FiGithub, FiLinkedin, FiMail } from 'react-icons/fi'
import type { CannedAnswer, ContactItem, Project, Skill, TimelineItem } from '../types'

export const skills: Skill[] = [
  { title: 'Backend', items: ['C#', '.NET', 'ASP.NET', 'API REST', 'Architecture logicielle'] },
  { title: 'Frontend', items: ['Blazor', 'Vue.js', 'TypeScript', 'JavaScript'] },
  { title: 'DevOps & outils', items: ['Azure DevOps', 'CI/CD', 'Docker', 'Git'] },
  { title: 'Qualité logicielle', items: ['Tests unitaires', 'Tests fonctionnels', 'Testabilité', 'Réduction des régressions'] },
]

export const projects: Project[] = [
  {
    title: 'Outils de diagnostic véhicules',
    description:
      'Développement et amélioration d’outils de diagnostic pour véhicules utilitaires Renault Trucks, dans un environnement .NET avec enjeux de maintenabilité et de qualité logicielle.',
    stack: ['C#', '.NET', 'WPF', 'Blazor', 'Azure DevOps'],
    link: 'https://www.volvogroup.com',
    status: 'En poste',
  },
  {
    title: 'Générateur de questionnaires sensoriels',
    description:
      'Conception frontend d’une application web en Vue.js pour générer des questionnaires sensoriels à partir de templates éditables, avec un travail sur l’ergonomie et le Green IT.',
    stack: ['Vue.js', 'TypeScript', 'JavaScript', 'Bootstrap'],
    link: 'https://www.biosystemes.com/',
    status: 'Livré',
  },
]

export const timelineItems: TimelineItem[] = [
  {
    kind: 'experience',
    title: 'Software Engineer Apprentice',
    place: 'Renault Trucks (Volvo Group)',
    periodStart: '2024-09',
    periodEnd: null,
    detail:
      'Développement et maintenance d’outils de diagnostic pour véhicules utilitaires. Travail sur les correctifs, les évolutions, la qualité logicielle, les tests et les pipelines CI/CD.',
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
    periodStart: '2023-09',
    periodEnd: '2024-08',
    detail:
      'Développement frontend d’une application web from scratch en Vue.js pour générer des questionnaires sensoriels depuis des templates éditables.',
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

export const cannedAnswers: CannedAnswer[] = [
  {
    keywords: ['stack', 'tech', 'techno', 'compétence', 'competence'],
    answer:
      'Je travaille surtout avec C# et .NET côté applicatif, Blazor et Vue.js côté interface, et Azure DevOps / CI-CD / Docker pour l’industrialisation et la qualité logicielle.',
  },
  {
    keywords: ['exp', 'expérience', 'experience', 'parcours', 'cv'],
    answer:
      'Je suis actuellement Software Engineer Apprentice chez Renault Trucks après une alternance chez Biosystèmes. Je suis également élève ingénieur à CPE Lyon, spécialisé en développement logiciel, data et IA.',
  },
  {
    keywords: ['qualité', 'qualite', 'tests', 'industrialisation', 'ci', 'cd'],
    answer:
      'Je m’intéresse particulièrement à la qualité logicielle, à la testabilité, à la réduction des régressions et à l’industrialisation via les tests et les pipelines CI/CD.',
  },
  {
    keywords: ['projet', 'projets', 'travaux'],
    answer:
      'Les deux expériences que je mets le plus en avant sont le développement d’outils de diagnostic chez Renault Trucks et la conception d’un générateur de questionnaires sensoriels chez Biosystèmes.',
  },
]
