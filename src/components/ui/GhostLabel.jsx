import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

/**
 * Huge outlined word floating behind a section heading,
 * drifting sideways slightly as the section scrolls.
 */
export function GhostLabel({ text, light = false, drift = 60, className = '' }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const x = useTransform(scrollYProgress, [0, 1], [drift, -drift])

  return (
    <div ref={ref} aria-hidden="true" className={`pointer-events-none absolute inset-x-0 flex justify-center overflow-hidden ${className}`}>
      <motion.span
        style={{ x, fontSize: 'clamp(5rem, 16vw, 15rem)' }}
        className={`ghost-text ${light ? 'ghost-text-light' : ''}`}
      >
        {text}
      </motion.span>
    </div>
  )
}
