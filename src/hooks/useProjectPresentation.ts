import { useEffect, useMemo, useState } from 'react'
import { extractPreviewText, fetchMarkdownText, normalizeProjectMarkdown, resolveMarkdownSourceUrl } from '../utils/markdown'

// Shared by every mount during this visit; a fresh document starts with empty caches.
const presentations = new Map<string, string>()
const pendingPresentations = new Map<string, Promise<string>>()

function loadPresentation(url: string) {
  const cached = presentations.get(url)
  if (cached !== undefined) return Promise.resolve(cached)

  const pending = pendingPresentations.get(url)
  if (pending) return pending

  const request = fetchMarkdownText(url).then(
    (markdown) => {
      presentations.set(url, markdown)
      pendingPresentations.delete(url)
      return markdown
    },
    (error: unknown) => {
      // Failed requests can be retried on the next visit to the Projects tab.
      pendingPresentations.delete(url)
      throw error
    },
  )
  pendingPresentations.set(url, request)
  return request
}

type UseProjectPresentationParams = {
  projectTitle: string
  fallbackDescription: string
  presentationUrl?: string
}

export function useProjectPresentation({ projectTitle, fallbackDescription, presentationUrl }: UseProjectPresentationParams) {
  const sourceUrl = presentationUrl ? resolveMarkdownSourceUrl(presentationUrl) : undefined
  const [result, setResult] = useState<{ url: string; error: string | null } | null>(null)
  const cachedMarkdown = sourceUrl ? presentations.get(sourceUrl) : undefined
  const markdown = cachedMarkdown ?? ''
  const error = cachedMarkdown === undefined && sourceUrl && result?.url === sourceUrl ? result.error : null
  const loading = Boolean(sourceUrl && cachedMarkdown === undefined && !error)

  useEffect(() => {
    if (!sourceUrl || presentations.has(sourceUrl)) return

    let cancelled = false

    void loadPresentation(sourceUrl).then(
      () => {
        if (!cancelled) setResult({ url: sourceUrl, error: null })
      },
      () => {
        if (!cancelled) {
          setResult({ url: sourceUrl, error: "La présentation du projet n'a pas pu être chargée." })
        }
      },
    )

    return () => {
      cancelled = true
    }
  }, [sourceUrl])

  const normalizedMarkdown = useMemo(() => normalizeProjectMarkdown(markdown, projectTitle), [markdown, projectTitle])
  const previewText = useMemo(() => extractPreviewText(normalizedMarkdown, projectTitle), [normalizedMarkdown, projectTitle])
  const summaryText = previewText || fallbackDescription
  const hasFullContent = normalizedMarkdown.trim().length > previewText.trim().length + 40

  return { markdown: normalizedMarkdown, summaryText, hasFullContent, loading, error }
}
