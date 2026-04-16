import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { buildAnalyticsContext, sendAnalyticsEvent } from '../utils/analytics'
import { readStoredMessages, storeMessages } from '../utils/chatStorage'
import { cannedAnswers } from '../data/content'
import { fetchChatResponse } from '../services/chatApi'
import type { AnalyticsPayload } from '../utils/analytics'
import type { ChatCitation, ChatMessage, ChatSuggestedPath, Theme } from '../types'

type UseChatbotParams = {
  path: string
  theme: Theme
}

export function useChatbot({ path, theme }: UseChatbotParams) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => readStoredMessages())
  const [input, setInput] = useState('')
  const [typingText, setTypingText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const typingRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (typingRef.current) {
        window.clearInterval(typingRef.current)
      }
    }
  }, [])

  useEffect(() => {
    storeMessages(messages)
  }, [messages])

  const pickAnswer = (question: string) => {
    const normalized = question.toLowerCase()
    const found = cannedAnswers.find((entry) => entry.keywords.some((keyword) => normalized.includes(keyword)))
    if (found) return found.answer
    return "Je note ta question. L'API distante n'est pas branchee ici, mais je peux te parler du parcours, des competences et des experiences de Quentin."
  }

  const streamAnswer = (
    answer: string,
    analyticsContext: AnalyticsPayload,
    metadata?: { citations?: ChatCitation[]; suggestedPaths?: ChatSuggestedPath[] },
  ) => {
    if (typingRef.current) {
      window.clearInterval(typingRef.current)
    }

    setIsTyping(true)
    setTypingText('')

    let index = 0
    typingRef.current = window.setInterval(() => {
      index += 1
      setTypingText(answer.slice(0, index))
      if (index >= answer.length) {
        if (typingRef.current) {
          window.clearInterval(typingRef.current)
        }
        setIsTyping(false)
        setTypingText('')
        sendAnalyticsEvent('chat_assistant_rendered', {
          ...analyticsContext,
          answerLength: answer.length,
        })
        setMessages((prev) => [
          ...prev,
          {
            from: 'assistant',
            text: answer,
            citations: metadata?.citations,
            suggestedPaths: metadata?.suggestedPaths,
          },
        ])
      }
    }, 12)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const value = input.trim()
    if (!value) return

    const analyticsContext = buildAnalyticsContext(path, theme)

    setMessages((prev) => [...prev, { from: 'user', text: value }])
    setInput('')
    setIsTyping(true)
    setTypingText('')
    sendAnalyticsEvent('chat_user_message', {
      ...analyticsContext,
      messageLength: value.length,
    })

    void fetchChatResponse(value, analyticsContext).then((response) => {
      const finalAnswer = response.answer || pickAnswer(value)
      streamAnswer(finalAnswer, analyticsContext, {
        citations: response.citations,
        suggestedPaths: response.suggestedPaths,
      })
    })
  }

  const toggleChat = () => {
    setChatOpen((current) => {
      const next = !current
      sendAnalyticsEvent(next ? 'chat_opened' : 'chat_closed', buildAnalyticsContext(path, theme))
      return next
    })
  }

  return {
    messages,
    input,
    setInput,
    typingText,
    isTyping,
    chatOpen,
    setChatOpen,
    handleSubmit,
    toggleChat,
  }
}
