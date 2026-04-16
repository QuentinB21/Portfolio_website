import { CHAT_STORAGE_KEY, defaultMessages } from '../config/site'
import type { ChatMessage } from '../types'

export function readStoredMessages(): ChatMessage[] {
  if (typeof window === 'undefined') {
    return defaultMessages
  }

  try {
    const raw = window.localStorage.getItem(CHAT_STORAGE_KEY)
    if (!raw) {
      return defaultMessages
    }

    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return defaultMessages

    const sanitized = parsed.filter(
      (message): message is ChatMessage =>
        typeof message === 'object' &&
        message !== null &&
        (message.from === 'user' || message.from === 'assistant') &&
        typeof message.text === 'string',
    )

    return sanitized.length > 0 ? sanitized : defaultMessages
  } catch {
    return defaultMessages
  }
}

export function storeMessages(messages: ChatMessage[]) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages))
}
