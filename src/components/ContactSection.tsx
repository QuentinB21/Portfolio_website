import type { ContactItem } from '../types'

type ContactSectionProps = {
  contact: ContactItem[]
}

export function ContactSection({ contact }: ContactSectionProps) {
  return (
    <section className="section" id="contact">
      <div className="section-header">
        <h3 className="section-title">Contact</h3>
        <span className="section-subtitle">Parlons de votre projet</span>
      </div>
      <div className="contact-grid">
        {contact.map((item) => (
          <a className="contact-card" href={item.href} key={item.label} target="_blank" rel="noreferrer">
            <span className="icon-circle">{item.icon}</span>
            <strong>{item.label}</strong>
          </a>
        ))}
      </div>
    </section>
  )
}
