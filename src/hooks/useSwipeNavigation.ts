import { useEffect, type RefObject } from 'react'
import { navItems } from '../config/site'

// Keep page gestures separate from controls, text selection and horizontal scrollers.
function canStartSwipe(target: EventTarget | null, root: HTMLElement) {
  if (!(target instanceof Element)) return false
  if (target.closest('a, button, input, textarea, select, [contenteditable], [role="slider"], [data-no-page-swipe]')) return false
  for (let element: Element | null = target; element && element !== root; element = element.parentElement) {
    if (element.scrollWidth > element.clientWidth + 1 && /auto|scroll/.test(getComputedStyle(element).overflowX)) return false
  }
  return !window.getSelection()?.toString()
}

export function useSwipeNavigation(
  contentRef: RefObject<HTMLElement | null>,
  currentPath: string,
  onNavigate: (path: string) => void,
) {
  useEffect(() => {
    const root = contentRef.current
    const index = navItems.findIndex(item => item.path === currentPath)
    if (!root || index < 0) return
    const mobile = window.matchMedia('(max-width: 720px)')
    let gesture: { id: number; x: number; y: number; time: number } | null = null
    const cancel = () => { gesture = null }
    const start = (event: TouchEvent) => {
      cancel()
      if (!mobile.matches || event.touches.length !== 1 || !canStartSwipe(event.target, root)) return
      const touch = event.touches[0]
      // Leave screen-edge gestures to the browser/OS (back, forward, etc.).
      if (touch.clientX < 24 || touch.clientX > window.innerWidth - 24) return
      gesture = { id: touch.identifier, x: touch.clientX, y: touch.clientY, time: performance.now() }
    }
    const move = (event: TouchEvent) => {
      if (!gesture) return
      if (event.touches.length !== 1) return cancel()
      const touch = event.touches[0]
      const dx = Math.abs(touch.clientX - gesture.x)
      const dy = Math.abs(touch.clientY - gesture.y)
      if (dy > 12 && dy >= dx) cancel()
    }
    const end = (event: TouchEvent) => {
      const active = gesture
      cancel()
      if (!active || !mobile.matches || event.touches.length || window.getSelection()?.toString()) return
      const touch = Array.from(event.changedTouches).find(item => item.identifier === active.id)
      if (!touch) return
      const dx = touch.clientX - active.x
      const dy = Math.abs(touch.clientY - active.y)
      if (Math.abs(dx) < 64 || Math.abs(dx) < dy * 2 || performance.now() - active.time > 900) return
      const next = navItems[index + (dx < 0 ? 1 : -1)]
      if (next) onNavigate(next.path)
    }
    root.addEventListener('touchstart', start, { passive: true })
    root.addEventListener('touchmove', move, { passive: true })
    root.addEventListener('touchend', end, { passive: true })
    root.addEventListener('touchcancel', cancel, { passive: true })
    return () => {
      root.removeEventListener('touchstart', start)
      root.removeEventListener('touchmove', move)
      root.removeEventListener('touchend', end)
      root.removeEventListener('touchcancel', cancel)
    }
  }, [contentRef, currentPath, onNavigate])
}
