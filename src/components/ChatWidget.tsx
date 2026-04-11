import type { FormEvent } from 'react'
import type { ChatMessage } from '../types'
import { FiSend } from 'react-icons/fi'
import { FaRobot } from 'react-icons/fa'

type ChatWidgetProps = {
  open: boolean
  messages: ChatMessage[]
  isTyping: boolean
  typingText: string
  input: string
  onInputChange: (value: string) => void
  onSubmit: (evt: FormEvent<HTMLFormElement>) => void
  onToggle: () => void
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
}: ChatWidgetProps) {
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
              ×
            </button>
          </div>

            <div className="chat-window">
              <div className="chat-messages">
                {messages.map((message, index) => (
                  <div className={`bubble-row ${message.from}`} key={`${message.from}-${index}`}>
                    <div className="bubble-meta">
                      <span className="bubble-avatar">{message.from === 'assistant' ? <FaRobot /> : '👤'}</span>
                      <span className="bubble-name">{message.from === 'assistant' ? 'QuentinBot' : 'Visiteur'}</span>
                    </div>
                    <div className={`bubble ${message.from}`}>
                      <div className="bubble-text">{message.text}</div>
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
              <div style={{ backgroundColor: 'transparent'}}>
                <form className="chat-input" onSubmit={onSubmit}>
                  <input
                    aria-label="Votre question"
                    placeholder="Posez une question sur le parcours de Quentin..."
                    value={input}
                    onChange={(evt) => onInputChange(evt.target.value)}
                  />
                  <button className="chat-send-btn" type="submit">
                    <FiSend size={18} />
                  </button>
                </form>
              </div>
            </div>
          </div>
      )}
      <button className="chat-toggle" type="button" onClick={onToggle} aria-label="Ouvrir le chat IA">
        <FaRobot size={22} />
      </button>
    </div>
  )
}
