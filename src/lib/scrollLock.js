import { useEffect } from 'react'
import { lenisRef } from './lenis'

// Reference-counted page scroll lock, so stacked overlays (e.g. a partner
// detail opened on top of the directory) don't unlock each other on close.
let locks = 0
let pending = []

export function useScrollLock(active) {
  useEffect(() => {
    if (!active) return
    locks += 1
    if (locks === 1) {
      document.body.style.overflow = 'hidden'
      lenisRef.current?.stop()
    }
    return () => {
      locks -= 1
      if (locks === 0) {
        document.body.style.overflow = ''
        lenisRef.current?.start()
        const queued = pending
        pending = []
        // Lenis.start() resets any in-flight scroll, so queued scrolls run after it
        requestAnimationFrame(() => queued.forEach((fn) => fn()))
      }
    }
  }, [active])
}

/** Run `fn` once every overlay has closed and the page can scroll again. */
export function whenUnlocked(fn) {
  if (locks === 0) fn()
  else pending.push(fn)
}
