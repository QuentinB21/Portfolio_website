export type ChatMessage = {
  from: 'user' | 'assistant'
  text: string
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
  title: string
  place: string
  period: string
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
