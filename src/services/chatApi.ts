import type { ChatCitation, ChatSuggestedPath } from '../types'
import type { AnalyticsPayload } from '../utils/analytics'

export type ChatResponse = {
  answer: string
  citations?: ChatCitation[]
  suggestedPaths?: ChatSuggestedPath[]
  usage: {
    promptTokens: number | null
    completionTokens: number | null
    totalTokens: number | null
  } | null
}

export async function fetchChatResponse(
  question: string,
  analyticsContext: AnalyticsPayload,
): Promise<ChatResponse> {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: question, analytics: analyticsContext }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Chat API error', errorText)
      return {
        answer: 'Le service IA ne repond pas. Reessaie plus tard.',
        citations: [],
        suggestedPaths: [],
        usage: null,
      }
    }

    const data = await response.json()
    const content = data?.answer
    if (!content) {
      return {
        answer: 'Pas de reponse recue. Reessaie plus tard.',
        citations: [],
        suggestedPaths: [],
        usage: null,
      }
    }

    return {
      answer: content.trim(),
      citations: Array.isArray(data?.citations) ? data.citations : [],
      suggestedPaths: Array.isArray(data?.suggestedPaths) ? data.suggestedPaths : [],
      usage: data?.usage || null,
    }
  } catch (error) {
    console.error('Chat API request failed', error)
    return {
      answer: "Une erreur est survenue avec l'IA. Reessaie plus tard.",
      citations: [],
      suggestedPaths: [],
      usage: null,
    }
  }
}
