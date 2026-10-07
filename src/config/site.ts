import type { NavItem } from '../types'

export const navItems: NavItem[] = [
  { label: 'Accueil', path: '/' },
  { label: 'Carrière', path: '/work' },
  { label: 'Projets', path: '/projets' },
  { label: 'CV', path: '/cv' },
]

export const THEME_STORAGE_KEY = 'portfolio:theme'
