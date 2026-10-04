import { useEffect, type RefObject } from 'react'

/** Only off-screen sections animate; content remains visible without this enhancement. */
export function useScrollReveal(
  ref: RefObject<HTMLElement | null>,
  path: string,
) {
  useEffect(() => {
    const root = ref.current
    if (!root || !('IntersectionObserver' in window)) return
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (motion.matches) return

    const sections = [...root.querySelectorAll<HTMLElement>(':scope > section')]
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(({ target, isIntersecting }) => {
          if (!isIntersecting) return
          target.classList.remove('reveal-pending')
          observer.unobserve(target)
        })
      },
      { rootMargin: '0px 0px 40px 0px' },
    )

    sections.forEach((section) => {
      if (section.getBoundingClientRect().top < window.innerHeight) return
      section.classList.add('reveal-section', 'reveal-pending')
      observer.observe(section)
    })

    const showAll = () => {
      if (!motion.matches) return
      sections.forEach((section) => section.classList.remove('reveal-pending'))
      observer.disconnect()
    }
    motion.addEventListener('change', showAll)
    return () => {
      observer.disconnect()
      motion.removeEventListener('change', showAll)
      sections.forEach((section) =>
        section.classList.remove('reveal-section', 'reveal-pending'),
      )
    }
  }, [ref, path])
}
