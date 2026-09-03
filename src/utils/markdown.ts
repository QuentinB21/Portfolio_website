function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export function resolveMarkdownSourceUrl(url: string) {
  try {
    const parsed = new URL(url)

    if (parsed.hostname === 'github.com') {
      const segments = parsed.pathname.split('/').filter(Boolean)

      if (segments.length >= 5 && segments[2] === 'blob') {
        const [owner, repo, , ref, ...pathSegments] = segments
        return `https://raw.githubusercontent.com/${owner}/${repo}/${ref}/${pathSegments.join('/')}`
      }
    }

    return url
  } catch {
    return url
  }
}

export function resolveMarkdownLinkUrl(url: string | undefined, sourceUrl?: string) {
  if (!url || !sourceUrl || url.startsWith('#') || /^[a-z][a-z\d+.-]*:/i.test(url) || url.startsWith('//')) {
    return url
  }

  try {
    const source = new URL(sourceUrl)

    if (source.hostname === 'github.com' && source.pathname.includes('/blob/')) {
      const sourceDirectory = source.pathname.slice(0, source.pathname.lastIndexOf('/') + 1)
      return new URL(url, `${source.origin}${sourceDirectory}`).toString()
    }

    return new URL(url, sourceUrl).toString()
  } catch {
    return url
  }
}

export async function fetchMarkdownText(url: string) {
  const sourceUrl = resolveMarkdownSourceUrl(url)
  const response = await fetch(sourceUrl, { cache: 'no-store' })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} sur ${sourceUrl}`)
  }

  return response.text()
}

function stripMarkdownSyntax(value: string) {
  return value
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^>\s?/gm, '')
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    .replace(/\r/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function removeDuplicatedTitlePrefix(value: string, title?: string) {
  if (!title) {
    return value
  }

  const escapedTitle = escapeRegExp(title.trim())
  const duplicatedTitlePattern = new RegExp(`^(${escapedTitle})\\s+(${escapedTitle})\\b\\s*`, 'i')
  return value.replace(duplicatedTitlePattern, '$2 ')
}

export function normalizeProjectMarkdown(markdown: string, title?: string) {
  if (!title) {
    return markdown.trim()
  }

  const escapedTitle = escapeRegExp(title.trim())

  return markdown
    .replace(new RegExp(`^#\\s+${escapedTitle}\\s*\\n+`, 'i'), '')
    .replace(new RegExp(`^${escapedTitle}\\s+${escapedTitle}\\s*`, 'i'), `${title} `)
    .trim()
}

export function extractPreviewText(markdown: string, title?: string) {
  const normalizedMarkdown = normalizeProjectMarkdown(markdown, title)

  const paragraphs = normalizedMarkdown
    .split(/\n\s*\n/)
    .map((paragraph) => removeDuplicatedTitlePrefix(stripMarkdownSyntax(paragraph), title))
    .filter((paragraph) => paragraph.length > 0)

  const preview = paragraphs.find((paragraph) => paragraph.length >= 80) ?? paragraphs[0] ?? ''
  const collapsedPreviewLength = 360

  if (preview.length <= collapsedPreviewLength) {
    return preview
  }

  const truncated = preview.slice(0, collapsedPreviewLength)
  const lastSpaceIndex = truncated.lastIndexOf(' ')
  return `${truncated.slice(0, lastSpaceIndex > 0 ? lastSpaceIndex : collapsedPreviewLength).trimEnd()}…`
}
