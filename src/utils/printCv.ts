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

export function printHtmlContent(html: string, title = 'Document') {
  const iframe = document.createElement('iframe')
  iframe.style.position = 'fixed'
  iframe.style.right = '0'
  iframe.style.bottom = '0'
  iframe.style.width = '0'
  iframe.style.height = '0'
  iframe.style.border = '0'
  iframe.setAttribute('aria-hidden', 'true')
  document.body.appendChild(iframe)

  const doc = iframe.contentWindow?.document
  if (!doc) return

  const parentFont = getComputedStyle(document.body).fontFamily
  doc.open()
  doc.write(`<!doctype html><html><head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
    <style>
      @page { margin: 14mm; }
      body { margin: 0; font-family: ${parentFont}; color: #0f172a; }
      .markdown-body { padding: 0; line-height: 1.6; }
      .markdown-body h1, .markdown-body h2, .markdown-body h3 { margin: 10px 0 8px; }
      .markdown-body ul { padding-left: 18px; }
    </style>
  </head><body>
    <div class="markdown-body">${html}</div>
  </body></html>`)
  doc.close()

  const doPrint = () => {
    try {
      iframe.contentWindow?.focus()
      iframe.contentWindow?.print()
    } finally {
      setTimeout(() => document.body.removeChild(iframe), 300)
    }
  }

  setTimeout(doPrint, 350)
}
