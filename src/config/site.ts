import type { ChatMessage, NavItem, ProofItem } from '../types'

export const navItems: NavItem[] = [
  { label: 'Présentation', path: '/' },
  { label: 'Carrière', path: '/work' },
  { label: 'CV', path: '/cv' },
]

export const overviewProofs: ProofItem[] = [
  {
    title: 'Qualité logiciel',
    body: 'Tests, maintenance et réduction des régressions structurent ma manière de faire évoluer des applications réelles.',
  },
  {
    title: 'Vision produit',
    body: "Je conçois des applications utiles, lisibles et robustes, avec une vraie attention portée à l'expérience utilisateur.",
  },
  {
    title: 'Industrialisation progressive',
    body: 'CI/CD, qualité logiciel et testabilité ne sont pas accessoires : ils servent à faire grandir un produit proprement.',
  },
]

export const CHAT_STORAGE_KEY = 'quentinbot:messages'
export const THEME_STORAGE_KEY = 'portfolio:theme'

export const defaultMessages: ChatMessage[] = [
  {
    from: 'assistant',
    text: "Salut, je suis QuentinBot. Je peux t'aider a comprendre le parcours de Quentin, ses compétences, les pages du site et te rediriger vers les sections utiles.",
    suggestedPaths: [
      { label: 'Voir la page Carrière', path: '/work', reason: 'pour consulter la chronologie, les experiences et les compétences' },
      { label: 'Voir la page CV', path: '/cv', reason: 'pour lire et télécharger le CV' },
    ],
  },
]

export const MONTH_LABELS = ['Janv.', 'Fevr.', 'Mars', 'Avr.', 'Mai', 'Juin', 'Juil.', 'Aout', 'Sept.', 'Oct.', 'Nov.', 'Dec.']
