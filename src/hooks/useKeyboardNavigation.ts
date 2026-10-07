import { useEffect } from 'react'
import { navItems } from '../config/site'

export function useKeyboardNavigation(currentPath: string, onNavigate: (path: string) => void) {
  useEffect(() => {
    const index = navItems.findIndex(item => item.path === currentPath)
    if (index < 0) return
    const desktop = window.matchMedia('(min-width: 721px)')

    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        !desktop.matches || event.defaultPrevented || event.repeat || event.isComposing ||
        event.altKey || event.ctrlKey || event.metaKey || event.shiftKey ||
        (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') ||
        window.getSelection()?.toString() || document.querySelector('dialog[open], [aria-modal="true"]')
      ) return

      const target = event.target
      const navigationButton = target instanceof Element && target.closest('.navigation-tabs .nav-tab')
      if (target instanceof Element && !navigationButton) {
        if (target.closest('a, button, input, textarea, select, [contenteditable], [role="tablist"], [role="slider"], [role="spinbutton"], [role="listbox"], [role="menu"], [role="tree"], [role="grid"], [role="toolbar"], [data-no-page-keyboard]')) return
        for (let element: Element | null = target; element && element !== document.body; element = element.parentElement) {
          if (element.scrollWidth > element.clientWidth + 1 && /auto|scroll/.test(getComputedStyle(element).overflowX)) return
        }
      }

      const nextIndex = index + (event.key === 'ArrowRight' ? 1 : -1)
      const next = navItems[nextIndex]
      if (!next) return
      event.preventDefault()
      if (navigationButton) {
        document.querySelectorAll<HTMLButtonElement>('.navigation-tabs .nav-tab')[nextIndex]?.focus({ preventScroll: true })
      }
      onNavigate(next.path)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentPath, onNavigate])
}
