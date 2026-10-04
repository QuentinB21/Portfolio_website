import { marked } from 'marked'
import DOMPurify from 'dompurify'

marked.setOptions({
  gfm: true,
})

export async function fetchAndRenderMarkdown(url: string): Promise<{ html: string }> {
  const resp = await fetch(url, { cache: 'no-store' })
  if (!resp.ok) {
    throw new Error(`HTTP ${resp.status} sur ${url}`)
  }
  const text = await resp.text()
  const parsed = await marked.parse(text)
  const html = typeof parsed === 'string' ? parsed : ''
  const clean = DOMPurify.sanitize(html, { USE_PROFILES: { html: true } })
  return { html: clean }
}
