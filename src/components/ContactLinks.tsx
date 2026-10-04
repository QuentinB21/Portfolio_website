import { contact } from '../data/content'

export function ContactLinks() {
  return (
    <div className="contact-strip">
      {contact.map((item) => (
        <a
          className={`glass-panel contact-pill ${getContactToneClass(item.href)}`}
          href={item.href}
          key={item.label}
          rel="noreferrer"
          target="_blank"
        >
          <span className="contact-icon">{item.icon}</span>
          <span>{item.label}</span>
        </a>
      ))}
    </div>
  )
}

function getContactToneClass(href: string) {
  if (href.startsWith('mailto:')) {
    return 'contact-pill-mail'
  }

  if (href.includes('linkedin.com')) {
    return 'contact-pill-linkedin'
  }

  if (href.includes('github.com')) {
    return 'contact-pill-github'
  }

  return ''
}
