import type { NavItem, ProofItem } from '../types'

export const navItems: NavItem[] = [
  { label: 'Accueil', path: '/' },
  { label: 'Carrière', path: '/work' },
  { label: 'Projets', path: '/projets' },
  { label: 'CV', path: '/cv' },
]

export const overviewProofs: ProofItem[] = [
  {
    title: 'Qualité logicielle',
    body: 'Tests, maintenance et réduction des régressions structurent ma manière de faire évoluer des applications réelles.',
  },
  {
    title: 'Vision produit',
    body: "Je conçois des applications utiles, lisibles et robustes, avec une vraie attention portée à l'expérience utilisateur.",
  },
  {
    title: 'Industrialisation progressive',
    body: 'CI/CD, qualité logicielle et testabilité ne sont pas accessoires : ils servent à faire grandir un produit proprement.',
  },
]

export const THEME_STORAGE_KEY = 'portfolio:theme'
