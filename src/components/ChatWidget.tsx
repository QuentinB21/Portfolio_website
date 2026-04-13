import { useEffect, useRef } from 'react'
import type { FormEvent } from 'react'
import { FiSend, FiX } from 'react-icons/fi'
import { FaRobot } from 'react-icons/fa'
import type { ChatMessage } from '../types'

type ChatWidgetProps = {
  open: boolean
  messages: ChatMessage[]
  isTyping: boolean
  typingText: string
  input: string
  onInputChange: (value: string) => void
  onSubmit: (evt: FormEvent<HTMLFormElement>) => void
  onToggle: () => void
  onNavigate: (path: string) => void
}

export function ChatWidget({
  open,
  messages,
  isTyping,
  typingText,
  input,
  onInputChange,
  onSubmit,
  onToggle,
  onNavigate,
}: ChatWidgetProps) {
  const messagesRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!open || !messagesRef.current) return
    messagesRef.current.scrollTop = messagesRef.current.scrollHeight
  }, [messages, isTyping, typingText, open])

  return (
    <div className="floating-chat">
      {open && <div className="chat-modal-backdrop" onClick={onToggle} />}

      {open && (
        <div className="chat-modal">
          <div className="chat-modal-header">
            <div>
              <p className="chat-modal-eyebrow">Assistant IA</p>
              <h4 className="chat-modal-title">QuentinBot</h4>
            </div>
            <button className="close-btn icon-only" type="button" onClick={onToggle} aria-label="Fermer le chat">
              <FiX size={16} />
            </button>
          </div>

          <div className="chat-window">
            <div className="chat-messages" ref={messagesRef}>
              {messages.map((message, index) => (
                <div className={`bubble-row ${message.from}`} key={`${message.from}-${index}`}>
                  <div className="bubble-meta">
                    <span className="bubble-avatar">{message.from === 'assistant' ? <FaRobot /> : '👤'}</span>
                    <span className="bubble-name">{message.from === 'assistant' ? 'QuentinBot' : 'Visiteur'}</span>
                  </div>
                  <div className={`bubble ${message.from}`}>
                    <div className="bubble-text">{message.text}</div>
                    {message.from === 'assistant' && message.citations && message.citations.length > 0 && (
                      <div className="bubble-support">
                        <p className="bubble-support-label">Sources</p>
                        <div className="bubble-citation-list">
                          {message.citations.map((citation, citationIndex) => (
                            <button
                              key={`${citation.path}-${citation.title}-${citationIndex}`}
                              className="bubble-citation"
                              type="button"
                              onClick={() => {
                                onNavigate(citation.path)
                                onToggle()
                              }}
                            >
                              <span className="bubble-citation-title">{citation.title}</span>
                              <span className="bubble-citation-meta">
                                {citation.section} · {citation.path}
                              </span>
                              {citation.excerpt ? <span className="bubble-citation-excerpt">{citation.excerpt}</span> : null}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    {message.from === 'assistant' && message.suggestedPaths && message.suggestedPaths.length > 0 && (
                      <div className="bubble-support">
                        <p className="bubble-support-label">Pages utiles</p>
                        <div className="bubble-suggestion-list">
                          {message.suggestedPaths.map((suggestion, suggestionIndex) => (
                            <button
                              key={`${suggestion.path}-${suggestion.label}-${suggestionIndex}`}
                              className="bubble-suggestion"
                              type="button"
                              onClick={() => {
                                onNavigate(suggestion.path)
                                onToggle()
                              }}
                            >
                              <span className="bubble-suggestion-label">{suggestion.label}</span>
                              {suggestion.reason ? <span className="bubble-suggestion-reason">{suggestion.reason}</span> : null}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="bubble-row assistant">
                  <div className="bubble-meta">
                    <span className="bubble-avatar">
                      <FaRobot />
                    </span>
                    <span className="bubble-name">QuentinBot</span>
                  </div>
                  <div className="bubble assistant">
                    <span className="typing">{typingText || '...'}</span>
                  </div>
                </div>
              )}
            </div>

            <form className="chat-input-bar" onSubmit={onSubmit}>
              <div className="chat-input-shell">
                <input
                  aria-label="Votre question"
                  placeholder="Posez une question..."
                  value={input}
                  onChange={(evt) => onInputChange(evt.target.value)}
                />
                <button className="chat-send-btn" type="submit">
                  <FiSend size={18} />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <button className="chat-toggle" type="button" onClick={onToggle} aria-label="Ouvrir le chat IA">
        <FaRobot size={22} />
      </button>
    </div>
  )
}
