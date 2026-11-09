import { useEffect } from 'react'
import Lenis from 'lenis'
import { lenisRef } from '../../lib/lenis'

/**
 * Inertia smooth-scrolling via Lenis. Touch devices keep native scrolling;
 * users with reduced-motion get the browser default untouched.
 * Anchor clicks are intercepted so they glide with the same easing.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const lenis = new Lenis({ lerp: 0.095, wheelMultiplier: 0.95 })
    lenisRef.current = lenis

    let raf = requestAnimationFrame(function loop(time) {
      lenis.raf(time)
      raf = requestAnimationFrame(loop)
    })

    const onClick = (e) => {
      const a = e.target.closest('a[href^="#"]')
      if (!a) return
      const href = a.getAttribute('href')
      if (!href || href.length < 2) return
      const el = document.querySelector(href)
      if (!el) return
      e.preventDefault()
      lenis.scrollTo(el, { offset: -72, duration: 1.5, force: true })
    }
    document.addEventListener('click', onClick)

    return () => {
      document.removeEventListener('click', onClick)
      cancelAnimationFrame(raf)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  return null
}
