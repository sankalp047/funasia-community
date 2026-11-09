import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, ChevronLeft, ChevronRight, ExternalLink, MapPin, Tag, X } from 'lucide-react'
import { partnerLink } from '../../data/partners'
import { useScrollLock } from '../../lib/scrollLock'

const EASE = [0.22, 1, 0.36, 1]

/**
 * Detail card for one partner. `list` + `index` enable prev/next browsing
 * (buttons and ← → keys) through whatever list the user opened it from.
 */
export function PartnerDetail({ list, index, onNavigate, onClose, onContact }) {
  const p = list[index]
  useScrollLock(true)

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onNavigate((index + 1) % list.length)
      if (e.key === 'ArrowLeft') onNavigate((index - 1 + list.length) % list.length)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [index, list.length, onClose, onNavigate])

  if (!p) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[85] flex items-end justify-center bg-ever-950/60 backdrop-blur-sm sm:items-center sm:p-6"
      onPointerDown={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label={p.name}
    >
      <motion.div
        initial={{ opacity: 0, y: 48, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 48, scale: 0.97 }}
        transition={{ duration: 0.4, ease: EASE }}
        data-lenis-prevent
        className="relative max-h-[92dvh] w-full overflow-y-auto rounded-t-[2rem] bg-cream-50 shadow-soft sm:max-w-xl sm:rounded-[2rem]"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-cream-50/90 text-ink-600 shadow-sm ring-1 ring-ever-900/10 transition hover:text-ink-900"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Logo stage */}
        <div className="relative h-56 overflow-hidden rounded-t-[2rem] border-b border-ever-900/8 bg-white px-10 py-9 sm:h-64">
          <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-600 via-brand-500 to-marigold-400" />
          <motion.img
            key={p.slug}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, ease: EASE }}
            src={p.logo}
            alt={`${p.name} logo`}
            className="h-full w-full object-contain"
          />
        </div>

        <div className="px-6 pb-7 pt-6 sm:px-8">
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-wide text-brand-700">
              <Tag className="h-3 w-3" /> {p.category}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-ever-100 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-wide text-ever-700">
              <MapPin className="h-3 w-3" /> {p.city ?? p.region}
            </span>
          </div>

          <motion.div key={`t-${p.slug}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: EASE }}>
            <h3 className="mt-4 font-display text-2xl font-semibold leading-snug text-ever-900 sm:text-3xl">{p.name}</h3>
            <p className="mt-3 leading-relaxed text-ink-600">{p.description}</p>
            {p.address && (
              <p className="mt-4 flex items-start gap-2 text-sm text-ink-600">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                {p.address}
              </p>
            )}
          </motion.div>

          <div className="mt-7 flex flex-col gap-2.5 sm:flex-row">
            <a
              href={partnerLink(p)}
              target="_blank"
              rel="noreferrer"
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-ever-900 py-3.5 text-sm font-semibold text-cream-50 transition hover:bg-ever-800"
            >
              {p.website ? 'Visit website' : 'Find on the web'}
              <ExternalLink className="h-4 w-4" />
            </a>
            <button
              type="button"
              onClick={onContact}
              className="group flex flex-1 items-center justify-center gap-2 rounded-2xl bg-brand-600 py-3.5 text-sm font-semibold text-cream-50 shadow-glow transition hover:bg-brand-700"
            >
              Partner with FunAsia
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          {list.length > 1 && (
            <div className="mt-6 flex items-center justify-between border-t border-ever-900/8 pt-5">
              <button
                type="button"
                onClick={() => onNavigate((index - 1 + list.length) % list.length)}
                className="flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-ink-600 transition hover:bg-ever-900/5 hover:text-ever-900"
              >
                <ChevronLeft className="h-4 w-4" /> Previous
              </button>
              <span className="text-xs tabular-nums text-ink-400">
                {index + 1} / {list.length}
              </span>
              <button
                type="button"
                onClick={() => onNavigate((index + 1) % list.length)}
                className="flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-ink-600 transition hover:bg-ever-900/5 hover:text-ever-900"
              >
                Next <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
