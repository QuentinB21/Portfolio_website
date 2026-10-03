export const CONSENT_KEY = 'portfolio:privacy-choice'
export const CONSENT_DURATION_MS = 180 * 24 * 60 * 60 * 1000
export const ANALYTICS_CONFIGURED = Boolean(import.meta.env.VITE_UMAMI_SCRIPT_URL && import.meta.env.VITE_UMAMI_WEBSITE_ID)
export type PrivacyChoice = 'accepted' | 'refused'

export function clearAnalyticsIdentifiers() {
  try {
    window.localStorage.removeItem('portfolio:visitor-id')
    window.sessionStorage.removeItem('portfolio:session-id')
  } catch { /* Storage may be unavailable. Tracking remains disabled without a saved choice. */ }
}

export function readPrivacyPreference(): { choice: PrivacyChoice; expiresAt: number } | null {
  try {
    const stored = JSON.parse(window.localStorage.getItem(CONSENT_KEY) || 'null')
    if (stored?.version === 1 && (stored.choice === 'accepted' || stored.choice === 'refused') &&
      typeof stored.expiresAt === 'number' && stored.expiresAt > Date.now() &&
      stored.expiresAt <= Date.now() + CONSENT_DURATION_MS) return { choice: stored.choice, expiresAt: stored.expiresAt }
  } catch { /* An absent or invalid choice never authorizes tracking. */ }
  return null
}

export function readPrivacyChoice(): PrivacyChoice | null {
  return readPrivacyPreference()?.choice ?? null
}

export function analyticsAllowed() {
  return ANALYTICS_CONFIGURED && readPrivacyChoice() === 'accepted'
}

export function savePrivacyChoice(choice: PrivacyChoice) {
  if (choice === 'refused') clearAnalyticsIdentifiers()
  try {
    window.localStorage.setItem(CONSENT_KEY, JSON.stringify({ version: 1, choice, expiresAt: Date.now() + CONSENT_DURATION_MS }))
  } catch { /* Tracking remains disabled if the choice cannot be saved. */ }
}
