import { useEffect, useId, type RefObject } from 'react'
import { createGlassDisplacement } from '../utils/glassRefraction'

const SVG_NS = 'http://www.w3.org/2000/svg'

export function useGlassRefraction(ref: RefObject<HTMLDivElement | null>, path: string) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  useEffect(() => {
    const root = ref.current
    // Parsing url() is insufficient feature detection: limit this experiment to Chromium.
    const chromium = /Chrome\/|Chromium\/|Edg\//.test(navigator.userAgent) && !/Firefox|OPiOS|CriOS|EdgiOS/.test(navigator.userAgent)
    if (!root || !chromium || !CSS.supports('backdrop-filter', 'url("#glass")')) return
    const svg = document.createElementNS(SVG_NS, 'svg')
    svg.setAttribute('width', '0')
    svg.setAttribute('height', '0')
    svg.setAttribute('aria-hidden', 'true')
    svg.setAttribute('focusable', 'false')
    svg.style.position = 'absolute'
    svg.style.pointerEvents = 'none'
    document.body.append(svg)
    const surfaces = [...root.querySelectorAll<HTMLElement>('[data-liquid-glass]')]
    const cleanups = surfaces.map((surface, index) => {
      const filter = document.createElementNS(SVG_NS, 'filter')
      const filterId = `glass-${id}-${index}`
      filter.setAttribute('id', filterId)
      filter.setAttribute('filterUnits', 'userSpaceOnUse')
      filter.setAttribute('primitiveUnits', 'userSpaceOnUse')
      filter.setAttribute('color-interpolation-filters', 'sRGB')
      filter.setAttribute('x', '0')
      filter.setAttribute('y', '0')
      const blur = document.createElementNS(SVG_NS, 'feGaussianBlur')
      blur.setAttribute('in', 'SourceGraphic')
      blur.setAttribute('stdDeviation', '1.2')
      blur.setAttribute('result', 'softened')
      const image = document.createElementNS(SVG_NS, 'feImage')
      image.setAttribute('result', 'displacement')
      image.setAttribute('preserveAspectRatio', 'none')
      const displacement = document.createElementNS(SVG_NS, 'feDisplacementMap')
      displacement.setAttribute('in', 'softened')
      displacement.setAttribute('in2', 'displacement')
      displacement.setAttribute('xChannelSelector', 'R')
      displacement.setAttribute('yChannelSelector', 'G')
      filter.append(blur, image, displacement)
      svg.append(filter)
      let previous = ''
      let frame = 0
      const update = () => {
        frame = 0
        const rect = surface.getBoundingClientRect()
        const extra = surface.classList.contains('site-navigation') ? 2 : 0
        const width = Math.ceil(rect.width + extra)
        const height = Math.ceil(rect.height + extra)
        const radius = Math.min(parseFloat(getComputedStyle(surface).borderTopLeftRadius) || height / 2, width / 2, height / 2)
        const size = `${width}:${height}:${radius}`
        if (!width || !height || previous === size) return
        const map = createGlassDisplacement(width, height, radius)
        if (!map) return
        previous = size
        filter.setAttribute('width', String(width))
        filter.setAttribute('height', String(height))
        image.setAttribute('width', String(width))
        image.setAttribute('height', String(height))
        image.setAttribute('href', map.image)
        displacement.setAttribute('scale', String(map.scale))
        surface.style.setProperty('--glass-svg-filter', `url("#${filterId}")`)
        surface.dataset.glassRefraction = 'svg'
      }
      const schedule = () => {
        if (!frame) frame = requestAnimationFrame(update)
      }
      update()
      const observer = new ResizeObserver(schedule)
      observer.observe(surface)
      return () => {
        observer.disconnect()
        cancelAnimationFrame(frame)
        surface.style.removeProperty('--glass-svg-filter')
        delete surface.dataset.glassRefraction
      }
    })
    return () => {
      cleanups.forEach(cleanup => cleanup())
      svg.remove()
    }
  }, [ref, path, id])
}
