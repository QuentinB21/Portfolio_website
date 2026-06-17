import { useEffect, useMemo, useState } from 'react'
import { extractPreviewText, fetchMarkdownText, normalizeProjectMarkdown } from '../utils/markdown'

type UseProjectPresentationParams = {
  projectTitle: string
  fallbackDescription: string
  presentationUrl?: string
}

export function useProjectPresentation({ projectTitle, fallbackDescription, presentationUrl }: UseProjectPresentationParams) {
  const [markdown, setMarkdown] = useState('')
  const [loading, setLoading] = useState(Boolean(presentationUrl))
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!presentationUrl) {
      setMarkdown('')
      setLoading(false)
      setError(null)
      return
    }

    let cancelled = false

    const loadPresentation = async () => {
      setLoading(true)
      setError(null)

      try {
        const text = await fetchMarkdownText(presentationUrl)

        if (!cancelled) {
          setMarkdown(text)
        }
      } catch {
        if (!cancelled) {
          setError("La présentation du projet n'a pas pu être chargée.")
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void loadPresentation()

    return () => {
      cancelled = true
    }
  }, [presentationUrl])

  const normalizedMarkdown = useMemo(() => normalizeProjectMarkdown(markdown, projectTitle), [markdown, projectTitle])
  const previewText = useMemo(() => extractPreviewText(normalizedMarkdown, projectTitle), [normalizedMarkdown, projectTitle])
  const summaryText = previewText || fallbackDescription
  const hasFullContent = normalizedMarkdown.trim().length > previewText.trim().length + 40

  return { markdown: normalizedMarkdown, summaryText, hasFullContent, loading, error }
}
