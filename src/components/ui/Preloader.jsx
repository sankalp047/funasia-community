import { AnimatePresence, motion } from 'framer-motion'
import { img } from '../../lib/img'

const EASE = [0.76, 0, 0.24, 1]

/**
 * One-time entrance curtain: evergreen sheet with the logo and tagline,
 * lifts away with a curved bottom edge. Shown once per browser session.
 */
export function Preloader({ show, onDone }) {
  return (
    <AnimatePresence onExitComplete={onDone}>
      {show && (
        <motion.div
          key="curtain"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ever-950"
          exit={{ y: '-100%', borderBottomLeftRadius: '50% 12%', borderBottomRightRadius: '50% 12%' }}
          transition={{ duration: 0.95, ease: EASE }}
          aria-hidden="true"
        >
          <div className="flex flex-col items-center">
            <motion.span
              initial={{ opacity: 0, scale: 0.7, rotate: -8 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="flex h-20 w-20 items-center justify-center rounded-[1.6rem] bg-cream-50 p-3 shadow-glow"
            >
              <img {...img('/images/fanicon2.png', '80px')} alt="" className="h-full w-full object-contain" />
            </motion.span>
            <span className="mt-6 block overflow-hidden">
              <motion.span
                initial={{ y: '110%' }}
                animate={{ y: 0 }}
                transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="block font-display text-2xl font-semibold text-cream-50"
              >
                FunAsia <span className="italic text-marigold-300">Outreach</span>
              </motion.span>
            </span>
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.9, delay: 0.4, ease: EASE }}
              className="mt-5 h-px w-40 origin-left bg-gradient-to-r from-brand-500 to-marigold-400"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
