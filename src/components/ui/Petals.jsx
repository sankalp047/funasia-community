import { useState } from 'react'
import { motion } from 'framer-motion'

// Deterministic per-petal variation (no Math.random — keeps renders stable)
const PETALS = [
  { left: '6%', size: 22, dur: 19, delay: 0, sway: 26, spin: 200 },
  { left: '18%', size: 14, dur: 24, delay: 6, sway: -20, spin: -160 },
  { left: '32%', size: 18, dur: 21, delay: 12, sway: 32, spin: 240 },
  { left: '52%', size: 12, dur: 26, delay: 3, sway: -26, spin: 180 },
  { left: '66%', size: 20, dur: 18, delay: 9, sway: 22, spin: -220 },
  { left: '82%', size: 15, dur: 23, delay: 15, sway: -30, spin: 200 },
  { left: '92%', size: 24, dur: 20, delay: 5, sway: 24, spin: 160 },
]

function Petal({ size }) {
  return (
    <svg width={size} height={size * 1.25} viewBox="0 0 20 25" fill="none" aria-hidden="true">
      <path
        d="M10 0.8C14.6 5 19.2 10.4 19.2 15.6c0 5-4.1 8.6-9.2 8.6S0.8 20.6 0.8 15.6C0.8 10.4 5.4 5 10 0.8Z"
        fill="url(#pg)"
      />
      <defs>
        <linearGradient id="pg" x1="10" y1="0" x2="10" y2="25" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f8cd7f" />
          <stop offset="1" stopColor="#f0a32b" />
        </linearGradient>
      </defs>
    </svg>
  )
}

/** Marigold petals drifting slowly down the hero. Desktop + motion-ok only. */
export function Petals() {
  const [on] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(min-width: 1024px)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  if (!on) return null

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[5] overflow-hidden">
      {PETALS.map((p, i) => (
        <motion.span
          key={i}
          className="absolute -top-10 opacity-60"
          style={{ left: p.left }}
          animate={{
            y: ['-6vh', '108vh'],
            x: [0, p.sway, -p.sway * 0.6, 0],
            rotate: [0, p.spin],
          }}
          transition={{
            duration: p.dur,
            delay: -p.delay,
            repeat: Infinity,
            ease: 'linear',
            x: { duration: p.dur / 2.6, repeat: Infinity, ease: 'easeInOut' },
          }}
        >
          <Petal size={p.size} />
        </motion.span>
      ))}
    </div>
  )
}
