import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useScrollLock } from '../../lib/scrollLock'
import { img } from '../../lib/img'

const EASE = [0.22, 1, 0.36, 1]

/**
 * Full-screen "all photos" view: masonry grid with a close button. Clicking a
 * photo enlarges it (← → keys / swipe to browse, Esc steps back out).
 */
export function GalleryViewer({ photos, initialIndex = null, onClose }) {
  const [active, setActive] = useState(initialIndex)
  useScrollLock(true)

  const step = (dir) => setActive((i) => (i + dir + photos.length) % photos.length)

  useEffect(() => {
    const onKey = (e) => {
      if (active !== null) {
        if (e.key === 'Escape') setActive(null)
        if (e.key === 'ArrowRight') step(1)
        if (e.key === 'ArrowLeft') step(-1)
      } else if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: '5%' }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: '5%' }}
      transition={{ duration: 0.45, ease: EASE }}
      role="dialog"
      aria-modal="true"
      aria-label="All photos"
      data-lenis-prevent
      className="fixed inset-0 z-[80] overflow-y-auto bg-cream-100"
    >
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-ever-900/8 bg-cream-100/92 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 sm:py-5">
          <div>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-brand-600">Photo Gallery</p>
            <h2 className="mt-1 font-display text-2xl font-semibold text-ever-900 sm:text-3xl">
              All moments <span className="text-ink-400">· {photos.length} photos</span>
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex shrink-0 items-center gap-2 rounded-full bg-ever-900 py-3 pl-4 pr-5 text-sm font-semibold text-cream-50 transition hover:bg-ever-800"
          >
            <X className="h-4.5 w-4.5" />
            Close
          </button>
        </div>
      </div>

      {/* Masonry grid */}
      <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-10">
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
          {photos.map((p, i) => (
            <motion.button
              key={p.src}
              type="button"
              onClick={() => setActive(i)}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 + i * 0.04, ease: EASE }}
              className="group relative block w-full break-inside-avoid overflow-hidden rounded-2xl bg-ever-900 text-left shadow-card focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-600/30"
            >
              <img
                {...img(p.src, '(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw')}
                alt={p.alt}
                loading="lazy"
                decoding="async"
                className="h-auto w-full transition-transform duration-700 group-hover:scale-105"
              />
              <span className="absolute inset-x-0 bottom-0 flex items-baseline gap-2 bg-gradient-to-t from-ever-950/75 to-transparent px-4 pb-3.5 pt-10 text-sm text-cream-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                <span className="font-display font-bold text-marigold-300">{String(i + 1).padStart(2, '0')}</span>
                <span className="font-display italic">{p.alt}</span>
              </span>
            </motion.button>
          ))}
        </div>
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-2 rounded-full border border-ever-900/15 bg-cream-50 px-6 py-3 text-sm font-semibold text-ever-900 transition hover:border-ever-900/30"
          >
            <X className="h-4 w-4" /> Close gallery
          </button>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {active !== null && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-20 flex flex-col bg-ever-950/95 backdrop-blur-sm"
            onPointerDown={(e) => e.target === e.currentTarget && setActive(null)}
          >
            <div className="flex items-center justify-between px-4 py-4 text-cream-50 sm:px-6">
              <span className="font-display text-sm italic text-cream-200/80">
                <span className="font-bold not-italic text-marigold-300">{String(active + 1).padStart(2, '0')}</span>
                {' '}/ {String(photos.length).padStart(2, '0')}
              </span>
              <button
                type="button"
                onClick={() => setActive(null)}
                aria-label="Close photo"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-cream-50/10 transition hover:bg-cream-50/20"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div
              className="relative flex min-h-0 flex-1 items-center justify-center px-4 sm:px-20"
              onPointerDown={(e) => e.target === e.currentTarget && setActive(null)}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={photos[active].src}
                  {...img(photos[active].src, '100vw')}
                  alt={photos[active].alt}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.6}
                  onDragEnd={(_, info) => {
                    if (info.offset.x < -70) step(1)
                    else if (info.offset.x > 70) step(-1)
                  }}
                  className="max-h-full max-w-full cursor-grab rounded-xl object-contain shadow-2xl active:cursor-grabbing"
                  draggable={false}
                />
              </AnimatePresence>
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="Previous photo"
                className="absolute left-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-cream-50/10 text-cream-50 transition hover:bg-cream-50/25 sm:flex"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label="Next photo"
                className="absolute right-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-cream-50/10 text-cream-50 transition hover:bg-cream-50/25 sm:flex"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>

            <div className="flex items-center justify-between gap-4 px-4 py-5 sm:justify-center sm:px-6">
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="Previous photo"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-cream-50/10 text-cream-50 sm:hidden"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <p className="text-center font-display text-base italic text-cream-100">{photos[active].alt}</p>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label="Next photo"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-cream-50/10 text-cream-50 sm:hidden"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
