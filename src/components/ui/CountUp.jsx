import { useEffect, useRef, useState } from 'react'
import { animate, useInView } from 'framer-motion'

/** Number that counts up from 0 the first time it scrolls into view. */
export function CountUp({ to, suffix = '', duration = 2.2, className }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  // Pre-rendered HTML (no window) shows the real number for crawlers;
  // in the browser it starts at 0 and counts up when scrolled into view.
  const [value, setValue] = useState(() => (typeof window === 'undefined' ? to : 0))

  useEffect(() => {
    if (!inView) return
    const controls = animate(0, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setValue(Math.round(v)),
    })
    return () => controls.stop()
  }, [inView, to, duration])

  return (
    <span ref={ref} className={className}>
      {value}
      {suffix && <span className="text-marigold-400">{suffix}</span>}
    </span>
  )
}
