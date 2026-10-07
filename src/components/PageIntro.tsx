import type { ReactNode } from 'react'

type PageIntroProps = {
  kicker: string
  title: string
  children: ReactNode
  aside?: ReactNode
}

export function PageIntro({ kicker, title, children, aside }: PageIntroProps) {
  return (
    <section className="page-intro editorial-hero">
      <div className="intro-copy">
        <span className="section-kicker">{kicker}</span>
        <h1>{title}</h1>
        <p className="hero-copy">{children}</p>
      </div>
      {aside}
    </section>
  )
}
