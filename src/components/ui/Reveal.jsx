import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const EASE = [0.22, 1, 0.36, 1]

/** Fade-and-rise reveal triggered when the element scrolls into view. */
export function Reveal({ children, delay = 0, y = 30, className, ...rest }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-70px' }}
      transition={{ duration: 0.85, delay, ease: EASE }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

/** Parent container that staggers its <Item> children as they enter view. */
export function Stagger({ children, className, delay = 0, gap = 0.12 }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-70px' }}
      transition={{ staggerChildren: gap, delayChildren: delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function Item({ children, className, y = 30 }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.85, ease: EASE },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/** Image that un-masks with a sliding clip-path as it enters view.
 *  `round` accepts any corner spec — e.g. '220px 220px 28px 28px' for an arch. */
export function ClipReveal({ children, className, delay = 0, round = '28px' }) {
  return (
    <motion.div
      initial={{ clipPath: `inset(12% 12% 12% 12% round ${round})`, opacity: 0, scale: 1.06 }}
      whileInView={{ clipPath: `inset(0% 0% 0% 0% round ${round})`, opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-90px' }}
      transition={{ duration: 1.1, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/** Splits a string into words, each rising out of its own mask.
 *  In-view detection happens on the container — a fully-masked word never
 *  intersects the viewport, so observing the words themselves would deadlock. */
export function WordReveal({ text, className, delay = 0, stagger = 0.05, as: Tag = 'span' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const words = String(text).split(' ')
  return (
    <Tag ref={ref} className={className}>
      {words.map((word, i) => (
        <span key={i}>
          <span className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom">
            <motion.span
              className="inline-block"
              initial={{ y: '112%' }}
              animate={inView ? { y: 0 } : { y: '112%' }}
              transition={{ duration: 0.85, delay: delay + i * stagger, ease: EASE }}
            >
              {word}
            </motion.span>
          </span>
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </Tag>
  )
}
