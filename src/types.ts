import type { ReactNode } from 'react'

export type Theme = 'dark' | 'light'

export type NavItem = {
  label: string
  path: string
}

export type ProofItem = {
  title: string
  body: string
}

export type Skill = {
  title: string
  items: string[]
}

export type ProfessionalProject = {
  title: string
  description: string
  stack: string[]
  link: string
  status: string
}

export type PersonalProject = {
  title: string
  description: string
  stack: string[]
  href: string
  repoUrl?: string
  presentationUrl?: string
  available?: boolean
  status: string
  ctaLabel: string
  note?: string
}

export type TimelineItem = {
  kind: 'experience' | 'education'
  title: string
  place: string
  periodStart: string
  periodEnd: string | null
  detail: string
}

export type ContactItem = {
  label: string
  icon: ReactNode
  href: string
}
