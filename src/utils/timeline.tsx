import { LuBriefcaseBusiness, LuGraduationCap } from 'react-icons/lu'
import type { TimelineItem } from '../types'
import { MONTH_LABELS } from '../config/site'

export function parseTimelineDate(value: string | null) {
  if (!value) return null

  const [yearPart, monthPart] = value.split('-')
  const year = Number(yearPart)
  const month = monthPart ? Number(monthPart) : 1

  if (!Number.isFinite(year) || !Number.isFinite(month)) {
    return null
  }

  return { year, month }
}

export function getTimelineStartValue(item: TimelineItem) {
  const parsed = parseTimelineDate(item.periodStart)
  if (!parsed) return Number.NEGATIVE_INFINITY
  return parsed.year * 100 + parsed.month
}

export function formatTimelineDate(value: string | null) {
  if (!value) return 'Present'

  const parsed = parseTimelineDate(value)
  if (!parsed) return value

  return `${MONTH_LABELS[parsed.month - 1]} ${parsed.year}`
}

export function formatTimelinePeriod(item: TimelineItem) {
  return `${formatTimelineDate(item.periodStart)} - ${formatTimelineDate(item.periodEnd)}`
}

export function getTimelineVariant(item: TimelineItem) {
  if (item.kind === 'education') {
    return {
      kind: 'education' as const,
      label: 'Formation',
      icon: <LuGraduationCap size={14} />,
    }
  }

  return {
    kind: 'experience' as const,
    label: 'Experience',
    icon: <LuBriefcaseBusiness size={14} />,
  }
}
