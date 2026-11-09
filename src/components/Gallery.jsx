import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from 'framer-motion'
import { ArrowRight, ArrowDown, Images } from 'lucide-react'
import { gallery } from '../data/content'
import { SectionHeading } from './ui/SectionHeading'
import { Reveal } from './ui/Reveal'
import { GhostLabel } from './ui/GhostLabel'
import { GalleryViewer } from './gallery/GalleryViewer'
import { img as imgProps } from '../lib/img'

/** Vertical scroll spent per pixel of horizontal travel. */
const SPEED = 0.85
/** Extra pinned scroll at the end (× viewport height) — the "pause" before moving on. */
const HOLD = 1

function useDesktop() {
  const [desktop, setDesktop] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches,
  )
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const onChange = (e) => setDesktop(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return desktop
}

// Alternating hand-placed rotations for the polaroid look
const TILTS = [-2.2, 1.6, -1.2, 2.4, -1.8, 1.2, -2.6, 1.8, -1.4, 2]
const pad2 = (n) => String(n).padStart(2, '0')

function Frame({ img, i, onOpen }) {
  return (
    <motion.button
      type="button"
      onClick={() => onOpen(i)}
      aria-label={`View photo ${i + 1}: ${img.alt}`}
      initial={{ rotate: TILTS[i % TILTS.length] }}
      whileHover={{ rotate: 0, scale: 1.02 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative block shrink-0 snap-center rounded-[18px] bg-cream-50 p-3 pb-4 text-left shadow-card ring-1 ring-ever-900/8 hover:shadow-soft focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-600/30 ${
        img.wide ? 'w-[80vw] sm:w-[480px] lg:w-[540px]' : 'w-[66vw] sm:w-[330px] lg:w-[370px]'
      }`}
    >
      <span className="relative block h-[44vh] max-h-[360px] min-h-[240px] overflow-hidden rounded-xl bg-ever-900 lg:h-[40vh]">
        <img
          {...imgProps(img.src, '(min-width: 1024px) 560px, 80vw')}
          alt={img.alt}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-107"
        />
        <span className="absolute inset-0 bg-gradient-to-t from-ever-950/35 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </span>
      <span className="flex items-baseline gap-2.5 px-1.5 pt-3">
        <span className="font-display text-sm font-bold text-brand-600">{pad2(i + 1)}</span>
        <span className="truncate font-display text-sm italic text-ink-600">{img.alt}</span>
      </span>
    </motion.button>
  )
}

/** Closing card at the end of the strip — the hand-off to "View all". */
function EndCard({ onOpen, highlight }) {
  const fan = gallery.slice(0, 3)
  return (
    <motion.button
      type="button"
      onClick={onOpen}
      animate={highlight ? { scale: 1.03 } : { scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative flex shrink-0 snap-center flex-col items-center justify-center overflow-hidden rounded-[18px] bg-ever-900 p-8 text-center shadow-soft transition-shadow duration-500 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-600/40 w-[72vw] sm:w-[340px] lg:w-[360px] h-[calc(44vh+3.5rem)] max-h-[calc(360px+3.5rem)] min-h-[calc(240px+3.5rem)] lg:h-[calc(40vh+3.5rem)] ${
        highlight ? 'ring-4 ring-marigold-400/60' : 'ring-1 ring-ever-900/8'
      }`}
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            'radial-gradient(circle at 15% 10%, rgb(224 45 82 / 0.25) 0%, transparent 45%), radial-gradient(circle at 85% 95%, rgb(240 163 43 / 0.22) 0%, transparent 45%)',
        }}
      />
      {/* Fanned thumbnails */}
      <span className="relative mb-7 flex h-24 w-40 items-center justify-center">
        {fan.map((p, k) => (
          <span
            key={p.src}
            className="absolute h-20 w-28 overflow-hidden rounded-lg border-[3px] border-cream-50 shadow-card transition-transform duration-500"
            style={{ transform: `rotate(${(k - 1) * 9}deg) translateX(${(k - 1) * 26}px)`, zIndex: k === 1 ? 2 : 1 }}
          >
            <img {...imgProps(p.src, '112px')} alt="" loading="lazy" className="h-full w-full object-cover" />
          </span>
        ))}
      </span>
      <span className="relative text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-marigold-300">
        That's the highlights
      </span>
      <span className="relative mt-2 font-display text-2xl font-semibold leading-snug text-cream-50">
        See every moment
      </span>
      <span className="relative mt-6 inline-flex items-center gap-2 rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-cream-50 shadow-glow transition group-hover:bg-brand-700">
        <Images className="h-4 w-4" />
        View all {gallery.length} photos
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </span>
    </motion.button>
  )
}

export function Gallery() {
  const desktop = useDesktop()
  const [viewer, setViewer] = useState(null) // null | { index: number | null }
  const openViewer = useCallback((index = null) => setViewer({ index }), [])

  const heading = (
    <div className="relative">
      <GhostLabel text="Gallery" className="-top-8 sm:-top-14" />
      <SectionHeading eyebrow="Photo Gallery" title="Moments that move us">
        Scenes from festivals, fundraisers, and celebrations across the metroplex.
      </SectionHeading>
    </div>
  )

  return (
    <>
      {desktop ? (
        <PinnedStrip heading={heading} onOpen={openViewer} />
      ) : (
        <section id="gallery" className="overflow-hidden py-24">
          {heading}
          <Reveal className="mt-10" y={24}>
            <div className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-6 pt-2">
              {gallery.map((img, i) => (
                <Frame key={img.src} img={img} i={i} onOpen={openViewer} />
              ))}
              <EndCard onOpen={() => openViewer()} />
            </div>
            <div className="mt-4 flex flex-col items-center gap-3 px-5">
              <button
                type="button"
                onClick={() => openViewer()}
                className="flex items-center gap-2 rounded-full bg-ever-900 px-6 py-3.5 text-sm font-semibold text-cream-50 shadow-soft transition hover:bg-ever-800"
              >
                <Images className="h-4 w-4" />
                View all {gallery.length} photos
              </button>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-ink-400">or swipe to explore →</p>
            </div>
          </Reveal>
        </section>
      )}

      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {viewer && (
            <GalleryViewer
              key="gallery-viewer"
              photos={gallery}
              initialIndex={viewer.index}
              onClose={() => setViewer(null)}
            />
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  )
}

/**
 * Desktop: the section pins while vertical scroll drives the strip sideways.
 * Travel is measured from the real strip width, so every photo — and the
 * closing "View all" card — is reached, then the section holds before release.
 */
function PinnedStrip({ heading, onOpen }) {
  const sectionRef = useRef(null)
  const stripRef = useRef(null)
  const [dims, setDims] = useState({ travel: 0, hold: 0 })
  const [atEnd, setAtEnd] = useState(false)

  useLayoutEffect(() => {
    const measure = () => {
      const strip = stripRef.current
      if (!strip) return
      setDims({
        travel: Math.max(0, strip.offsetWidth - window.innerWidth),
        hold: window.innerHeight * HOLD,
      })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(stripRef.current)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  const moveDist = dims.travel * SPEED
  const total = moveDist + dims.hold
  const moveEnd = total > 0 ? moveDist / total : 1

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] })
  const x = useMotionValue(0)
  const moved = useMotionValue(0) // 0 → 1 across the photos
  const ended = useMotionValue(false)

  const apply = (v) => {
    const f = moveEnd > 0 ? Math.min(1, Math.max(0, v / moveEnd)) : 1
    x.set(-f * dims.travel)
    moved.set(f)
    ended.set(v >= moveEnd - 0.002 && v > 0)
  }
  useMotionValueEvent(scrollYProgress, 'change', apply)
  useMotionValueEvent(ended, 'change', setAtEnd)
  // Re-apply when the measured travel changes (resize, first layout)
  useEffect(() => apply(scrollYProgress.get()), [moveEnd, dims.travel]) // eslint-disable-line react-hooks/exhaustive-deps

  const counter = useTransform(moved, (f) => pad2(Math.min(gallery.length, Math.round(f * (gallery.length - 1)) + 1)))

  return (
    <section
      id="gallery"
      ref={sectionRef}
      className="relative"
      style={{ height: `calc(100vh + ${Math.round(total)}px)` }}
    >
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden py-8">
        {heading}

        <motion.div ref={stripRef} style={{ x }} className="mt-10 flex w-max items-center gap-8 px-[6vw]">
          {gallery.map((img, i) => (
            <Frame key={img.src} img={img} i={i} onOpen={onOpen} />
          ))}
          <EndCard onOpen={() => onOpen()} highlight={atEnd} />
        </motion.div>

        {/* Progress bar ⇄ "View all" call to action */}
        <div className="mt-9 flex h-14 items-center justify-center">
          <AnimatePresence mode="wait" initial={false}>
            {atEnd ? (
              <motion.div
                key="cta"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-center gap-5"
              >
                <button
                  type="button"
                  onClick={() => onOpen()}
                  className="group flex items-center gap-2.5 rounded-full bg-brand-600 px-7 py-3.5 text-sm font-semibold text-cream-50 shadow-glow transition hover:bg-brand-700"
                >
                  <Images className="h-4 w-4" />
                  View all {gallery.length} photos
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
                <span className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.18em] text-ink-400">
                  or keep scrolling <ArrowDown className="h-3.5 w-3.5 animate-bounce" />
                </span>
              </motion.div>
            ) : (
              <motion.div
                key="progress"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-5"
              >
                <span className="font-display text-sm italic text-ink-600">
                  <motion.span className="font-bold not-italic text-brand-600">{counter}</motion.span>
                  <span className="text-ink-400"> / {pad2(gallery.length)}</span>
                </span>
                <span className="h-1 w-48 overflow-hidden rounded-full bg-ever-900/10">
                  <motion.span
                    style={{ scaleX: moved }}
                    className="block h-full origin-left bg-gradient-to-r from-brand-600 to-marigold-500"
                  />
                </span>
                <button
                  type="button"
                  onClick={() => onOpen()}
                  className="text-sm font-semibold text-brand-600 underline-offset-4 transition hover:text-brand-700 hover:underline"
                >
                  View all
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
