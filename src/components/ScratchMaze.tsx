import { useEffect, useId, useRef, useState } from 'react'

// The route follows open passages through this six-by-six maze.
const walls = 'M24 24H312V264 M312 312H24V72 M72 24v48 M216 24v48 M168 72h48 M72 72v48 M120 72v48 M120 120h48 M168 120h48 M264 72v48 M216 120h48 M72 120v48 M120 120v48 M72 168h48 M168 168h48 M216 168h48 M24 216h48 M72 216h48 M168 168v48 M120 216h48 M168 216h48 M264 168v48 M72 216v48 M168 264h48 M264 216v48 M216 264h48 M120 264v48'
const route = 'M24 48 L48 48 L48 96 L48 144 L48 192 L96 192 L144 192 L144 144 L192 144 L240 144 L288 144 L288 192 L288 240 L288 288 L312 288'

export function ScratchMaze() {
  const ref = useRef<HTMLElement>(null)
  const routeRef = useRef<SVGPathElement>(null)
  const travellerRef = useRef<SVGCircleElement>(null)
  const completedRef = useRef(false)
  const gradient = `maze-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [visible, setVisible] = useState(() => !('IntersectionObserver' in window))

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const change = () => setReduced(motion.matches)
    motion.addEventListener('change', change)
    const observer = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return
      setVisible(true)
      observer?.disconnect()
    }, { threshold: .35 }) : undefined
    if (ref.current) observer?.observe(ref.current)
    return () => {
      motion.removeEventListener('change', change)
      observer?.disconnect()
    }
  }, [])

  useEffect(() => {
    const path = routeRef.current
    const traveller = travellerRef.current
    if (!path || !traveller) return
    const length = path.getTotalLength()
    const paint = (progress: number) => {
      // Both visuals use the same progress, updated together in one frame.
      path.style.strokeDashoffset = String(1 - progress)
      const point = path.getPointAtLength(length * progress)
      traveller.setAttribute('cx', String(point.x))
      traveller.setAttribute('cy', String(point.y))
    }
    if (reduced || completedRef.current) {
      paint(1)
      completedRef.current = true
      return
    }
    paint(0)
    if (!visible) return
    let frame = 0
    let start: number | undefined
    const tick = (time: number) => {
      start ??= time
      const progress = Math.min(1, (time - start) / 5000)
      paint(progress)
      if (progress < 1) frame = requestAnimationFrame(tick)
      else completedRef.current = true
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [visible, reduced])

  return (
    <figure ref={ref} className={`scratch-maze${visible ? ' is-visible' : ''}${reduced ? ' is-still' : ''}`}>
      <svg viewBox="0 0 336 336" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id={gradient} x1="24" y1="48" x2="312" y2="288" gradientUnits="userSpaceOnUse">
            <stop stopColor="var(--accent-blue)" />
            <stop offset="1" stopColor="var(--maze-mint)" />
          </linearGradient>
        </defs>
        <path className="maze-walls" d={walls} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path ref={routeRef} className="maze-route" d={route} pathLength="1" stroke={`url(#${gradient})`} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="24" cy="48" r="5" fill="var(--accent-blue)" />
        <circle cx="312" cy="288" r="9" stroke="var(--maze-mint)" strokeWidth="2" />
        <circle ref={travellerRef} cx="24" cy="48" r="6" fill="var(--text-strong)" className="maze-traveller" visibility={visible || reduced ? 'visible' : 'hidden'} />
      </svg>
      {/* <figcaption>Un exercice sur Scratch, au collège.</figcaption> */}
    </figure>
  )
}
