import { useEffect, type RefObject } from 'react'

/** Animate only the rim; the backdrop and the content stay on their own layers. */
export function useGlassLighting(ref: RefObject<HTMLDivElement | null>, path: string) {
  useEffect(() => {
    const root = ref.current
    if (!root) return
    const pointer = window.matchMedia('(hover: hover) and (pointer: fine)')
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    // Keep navigation lighting steady: the capsule normal flips across its centre line.
    const surfaces = [...root.querySelectorAll<HTMLElement>('[data-liquid-glass]:not(.site-navigation)')]
    let detach = () => {}

    const setup = () => {
      detach()
      if (!pointer.matches || motion.matches) return
      const cleanups = surfaces.map(surface => {
        let frame = 0
        let x = 0
        let y = 0
        const paint = () => {
          frame = 0
          const rect = surface.getBoundingClientRect()
          const radius = Math.min(rect.width, rect.height) / 2
          if (!radius) return
          const px = Math.min(rect.width, Math.max(0, x - rect.left))
          const py = Math.min(rect.height, Math.max(0, y - rect.top))
          // Surface normal of a capsule: straight middle, curved ends.
          const nx = px - Math.min(rect.width - radius, Math.max(radius, px))
          const ny = py - rect.height / 2
          const distance = Math.min(1, Math.hypot(nx, ny) / radius)
          const incidence = Math.sqrt(1 - distance * distance)
          // Schlick's approximation with n=1.5: reflectance rises at grazing angles.
          const reflectance = 0.04 + 0.96 * (1 - incidence) ** 5
          const angle = Math.atan2(ny, nx) * 180 / Math.PI + 90
          surface.style.setProperty('--glass-light-angle', `${angle.toFixed(1)}deg`)
          surface.style.setProperty('--glass-reflectance', reflectance.toFixed(3))
        }
        const move = (event: PointerEvent) => {
          if (event.pointerType !== 'mouse') return
          x = event.clientX
          y = event.clientY
          if (!frame) frame = window.requestAnimationFrame(paint)
        }
        const reset = () => {
          window.cancelAnimationFrame(frame)
          frame = 0
          surface.style.removeProperty('--glass-light-angle')
          surface.style.removeProperty('--glass-reflectance')
        }
        surface.addEventListener('pointermove', move, { passive: true })
        surface.addEventListener('pointerleave', reset)
        return () => {
          reset()
          surface.removeEventListener('pointermove', move)
          surface.removeEventListener('pointerleave', reset)
        }
      })
      detach = () => cleanups.forEach(cleanup => cleanup())
    }
    setup()
    pointer.addEventListener('change', setup)
    motion.addEventListener('change', setup)
    return () => {
      detach()
      pointer.removeEventListener('change', setup)
      motion.removeEventListener('change', setup)
    }
  }, [ref, path])
}
