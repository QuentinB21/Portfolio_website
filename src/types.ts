import type { ReactNode } from 'react'

export type ChatMessage = {
  from: 'user' | 'assistant'
  text: string
  citations?: ChatCitation[]
  suggestedPaths?: ChatSuggestedPath[]
}

export type Theme = 'dark' | 'light'

export type NavItem = {
  label: string
  path: string
}

export type ProofItem = {
  title: string
  body: string
}

export type ChatCitation = {
  title: string
  path: string
  section: string
  excerpt: string
}

export type ChatSuggestedPath = {
  label: string
  path: string
  reason: string
}

export type Skill = {
  title: string
  items: string[]
}

export type Project = {
  title: string
  description: string
  stack: string[]
  link: string
  status: string
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

export type CannedAnswer = {
  keywords: string[]
  answer: string
}
