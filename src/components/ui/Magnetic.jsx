import { useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

const finePointer = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(pointer: fine)').matches &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Wrapper that makes its child gently follow the cursor while hovered. */
export function Magnetic({ children, strength = 0.35, className }) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 240, damping: 18, mass: 0.6 })
  const sy = useSpring(y, { stiffness: 240, damping: 18, mass: 0.6 })

  const onMove = (e) => {
    if (!finePointer() || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * strength)
    y.set((e.clientY - (r.top + r.height / 2)) * strength)
  }
  const reset = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      style={{ x: sx, y: sy }}
      onPointerMove={onMove}
      onPointerLeave={reset}
      className={className ?? 'inline-block'}
    >
      {children}
    </motion.div>
  )
}
