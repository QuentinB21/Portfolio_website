export type AnalyticsPayload = Record<string, string | number | boolean | null>

declare global {
  interface Window {
    umami?: {
      track: (eventName: string, payload?: AnalyticsPayload) => void
    }
  }
}

const VISITOR_STORAGE_KEY = 'portfolio:visitor-id'
const SESSION_STORAGE_KEY = 'portfolio:session-id'
const UMAMI_SCRIPT_URL = import.meta.env.VITE_UMAMI_SCRIPT_URL
const UMAMI_WEBSITE_ID = import.meta.env.VITE_UMAMI_WEBSITE_ID

function createId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export function getVisitorId() {
  if (typeof window === 'undefined') return 'server'

  const existing = window.localStorage.getItem(VISITOR_STORAGE_KEY)
  if (existing) return existing

  const next = createId()
  window.localStorage.setItem(VISITOR_STORAGE_KEY, next)
  return next
}

export function getSessionId() {
  if (typeof window === 'undefined') return 'server'

  const existing = window.sessionStorage.getItem(SESSION_STORAGE_KEY)
  if (existing) return existing

  const next = createId()
  window.sessionStorage.setItem(SESSION_STORAGE_KEY, next)
  return next
}

export function buildAnalyticsContext(path: string, theme: 'dark' | 'light') {
  if (typeof window === 'undefined') {
    return {
      visitorId: 'server',
      sessionId: 'server',
      path,
      theme,
      language: null,
      timezone: null,
      viewportWidth: null,
      viewportHeight: null,
    }
  }

  return {
    visitorId: getVisitorId(),
    sessionId: getSessionId(),
    path,
    theme,
    language: navigator.language || null,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || null,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
  }
}

export function initializeAnalytics() {
  if (typeof document === 'undefined' || !UMAMI_SCRIPT_URL || !UMAMI_WEBSITE_ID) return
  if (document.querySelector('script[data-umami-script="true"]')) return

  const script = document.createElement('script')
  script.async = true
  script.defer = true
  script.src = UMAMI_SCRIPT_URL
  script.setAttribute('data-website-id', UMAMI_WEBSITE_ID)
  script.setAttribute('data-umami-script', 'true')
  document.head.appendChild(script)
}

export function sendAnalyticsEvent(type: string, payload: AnalyticsPayload) {
  if (typeof window === 'undefined') return
  if (!window.umami?.track) return

  window.umami.track(type, payload)
}
