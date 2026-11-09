// Shared handle to the active Lenis instance so other components
// (e.g. the mobile menu) can pause/resume or drive smooth scrolls.
export const lenisRef = { current: null }

export function scrollToTarget(target, opts = {}) {
  if (lenisRef.current) {
    lenisRef.current.scrollTo(target, { offset: -72, duration: 1.5, force: true, ...opts })
  } else if (typeof target !== 'string') {
    target?.scrollIntoView({ behavior: 'smooth' })
  }
}
