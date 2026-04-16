import { useEffect, useState } from 'react'
import { fetchAndRenderMarkdown } from '../utils/printCv'

type UseCvContentParams = {
  cvMarkdownUrl: string
}

export function useCvContent({ cvMarkdownUrl }: UseCvContentParams) {
  const [cvLoading, setCvLoading] = useState(true)
  const [cvError, setCvError] = useState<string | null>(null)
  const [cvHtml, setCvHtml] = useState('')

  useEffect(() => {
    let cancelled = false

    const fetchCv = async () => {
      try {
        const { html } = await fetchAndRenderMarkdown(cvMarkdownUrl)
        if (!cancelled) {
          setCvHtml(html)
        }
      } catch {
        if (!cancelled) {
          setCvError("Le CV n'a pas pu etre charge depuis GitHub.")
        }
      } finally {
        if (!cancelled) {
          setCvLoading(false)
        }
      }
    }

    void fetchCv()

    return () => {
      cancelled = true
    }
  }, [cvMarkdownUrl])

  return { cvLoading, cvError, cvHtml }
}
