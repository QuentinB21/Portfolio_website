export type ChatMessage = {
  from: 'user' | 'assistant'
  text: string
  citations?: ChatCitation[]
  suggestedPaths?: ChatSuggestedPath[]
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
import type { ReactNode } from 'react'
