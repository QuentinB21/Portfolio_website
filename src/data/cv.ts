import { contact, skills, timelineItems } from './content'
import { getTimelineStartValue } from '../utils/timeline'

const experienceHighlights: Record<string, string[]> = {
  'Renault Trucks (Volvo Group)': [
    'Développement et maintenance des outils de diagnostic des véhicules utilitaires de la marque.',
    'Évolutions des applications WPF et du portail web Blazor, dans un environnement C# et .NET.',
    'Correctifs, tests et amélioration de la qualité logicielle ; conception de pipelines CI/CD avec Azure DevOps.',
  ],
  'Innoova · Montréal, Québec, Canada': [
    'Conception d’agents IA pour accélérer les processus internes d’une entreprise d’intégration Workday.',
    'Analyse des besoins de l’équipe et exploration des usages de l’IA pour faciliter le travail des intégrateurs.',
  ],
  'Biosystèmes': [
    'Conception et développement d’une application web en Vue.js pour générer des questionnaires sensoriels.',
    'Création de questionnaires à partir de modèles modifiables ; travail sur l’ergonomie et la sobriété numérique.',
  ],
}

// Screen and PDF share these data; dates and qualifications follow the career page.
export const cv = {
  name: 'Quentin Bouchot',
  title: 'Développement logiciel',
  subtitle: 'Élève ingénieur · Alternant chez Renault Trucks',
  location: 'Lyon, France',
  graduation: 'Diplôme prévu en 2027',
  summary: 'En troisième année du cycle ingénieur en informatique et réseaux de communication à CPE Lyon. Je développe et maintiens les outils de diagnostic des véhicules utilitaires chez Renault Trucks. J’aime comprendre un problème et concevoir une solution utile.',
  email: contact[0].label,
  links: [
    { label: 'quentin-bouchot.fr', href: 'https://quentin-bouchot.fr' },
    { label: 'LinkedIn', href: contact[1].href },
    { label: 'GitHub', href: contact[2].href },
  ],
  experiences: timelineItems.filter(item => item.kind === 'experience')
    .sort((a, b) => Number(!b.periodEnd) - Number(!a.periodEnd) || getTimelineStartValue(b) - getTimelineStartValue(a))
    .map(item => ({ ...item, highlights: experienceHighlights[item.place] ?? [item.detail] })),
  education: timelineItems.filter(item => item.kind === 'education')
    .sort((a, b) => getTimelineStartValue(b) - getTimelineStartValue(a)),
  skills: [...skills, { title: 'Autres langages', items: ['Java', 'SQL', 'Python'] }],
  languages: [
    { name: 'Français', level: 'Langue maternelle' },
    { name: 'Anglais', level: 'Usage technique' },
  ],
  projects: [
    { name: 'RefScope', stack: 'C# · .NET · Visual Studio', description: 'Extension Visual Studio qui distingue les références applicatives des références de tests, directement au-dessus des méthodes C#.' },
    { name: 'TradeCopilot', stack: 'React · ASP.NET Core · PostgreSQL', description: 'Application de suivi patrimonial et d’aide à la décision pour les investisseurs particuliers.' },
    { name: 'Mail Manager Workflow', stack: 'React · ASP.NET Core · n8n', description: 'Application de classement automatisé d’e-mails.' },
  ],
  interests: 'Jeux vidéo, films et séries, notamment les thrillers psychologiques.',
} as const
