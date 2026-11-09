import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, ChevronDown, HeartHandshake } from 'lucide-react'
import { heroSlides, site } from '../data/content'
import { Petals } from './ui/Petals'
import { CircleBadge } from './ui/CircleBadge'
import { Magnetic } from './ui/Magnetic'
import { img } from '../lib/img'

const EASE = [0.22, 1, 0.36, 1]

export function Hero({ introDelay = 0 }) {
  const ref = useRef(null)
  const [slide, setSlide] = useState(0)

  // Parallax: background sinks slower than the page, content drifts up and fades
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '22%'])
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '-30%'])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0])

  useEffect(() => {
    const id = setInterval(() => setSlide((s) => (s + 1) % heroSlides.length), 6500)
    return () => clearInterval(id)
  }, [])

  const d = (t) => introDelay + t
  // Entrance animations play only alongside the desktop intro curtain. Phones and
  // return visits get the hero fully visible from the very first paint — the
  // pre-rendered HTML shows it before any JavaScript runs (fast LCP).
  const animateIn = introDelay > 0
  const enter = (from) => (animateIn ? from : false)

  return (
    <section ref={ref} id="top" className="relative h-[100svh] min-h-[640px] overflow-hidden bg-ever-950">
      {/* Crossfading Ken Burns slideshow */}
      <motion.div style={{ y: bgY }} className="absolute inset-0">
        {/* initial={false}: the first photo is visible immediately (fast LCP), later ones crossfade */}
        <AnimatePresence initial={false}>
          <motion.div
            key={slide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.6, ease: 'easeInOut' }}
            className="absolute inset-0"
          >
            <motion.img
              {...img(heroSlides[slide].src, '100vw')}
              alt={heroSlides[slide].alt}
              fetchPriority={slide === 0 ? 'high' : 'auto'}
              decoding={slide === 0 ? 'sync' : 'async'}
              initial={{ scale: 1 }}
              animate={{ scale: 1.12 }}
              transition={{ duration: 8.5, ease: 'linear' }}
              className="h-full w-full object-cover"
            />
          </motion.div>
        </AnimatePresence>
        {/* Evergreen wash + vignette for legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-ever-950/80 via-ever-950/55 to-ever-950/90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgb(6_35_29/0.55)_100%)]" />
      </motion.div>

      {/* Marigold petals drifting down */}
      <Petals />

      {/* Decorative arch hairlines, echoing the site's arch motif */}
      <motion.div
        aria-hidden="true"
        initial={enter({ opacity: 0 })}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.6, delay: d(0.9) }}
        className="pointer-events-none absolute inset-x-0 bottom-0 top-24 hidden justify-center lg:flex"
      >
        <div className="h-full w-[62vw] max-w-4xl rounded-t-[999px] border border-cream-50/12" />
        <div className="absolute top-10 h-full w-[70vw] max-w-5xl rounded-t-[999px] border border-marigold-400/15" />
      </motion.div>

      {/* Content */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 mx-auto flex h-full max-w-7xl flex-col items-center justify-center px-4 pb-14 pt-24 text-center sm:px-6 sm:pb-0"
      >
        <motion.span
          initial={enter({ opacity: 0, y: 24 })}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: d(0.15), ease: EASE }}
          className="inline-flex items-center gap-2 rounded-full border border-cream-50/20 bg-cream-50/10 whitespace-nowrap px-4 py-2 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-marigold-300 backdrop-blur-sm sm:px-5 sm:text-[0.7rem] sm:tracking-[0.28em]"
        >
          <HeartHandshake className="h-3.5 w-3.5" />
          FunAsia Community Outreach
        </motion.span>

        <h1 className="mt-7 font-display text-display-xl font-semibold text-cream-50">
          <span className="sr-only">FunAsia Community Outreach — </span>
          {site.tagline.map((line, li) => (
            <span key={line} className="block overflow-hidden pb-1">
              <motion.span
                className="block"
                initial={enter({ y: '110%' })}
                animate={{ y: 0 }}
                transition={{ duration: 1.05, delay: d(0.35 + li * 0.16), ease: EASE }}
              >
                {li === 1 ? (
                  <span className="bg-gradient-to-r from-marigold-300 via-brand-400 to-brand-500 bg-clip-text italic text-transparent">
                    {line}
                  </span>
                ) : (
                  line
                )}
              </motion.span>
              {li < site.tagline.length - 1 && ' '}
            </span>
          ))}
        </h1>

        <motion.p
          initial={enter({ opacity: 0, y: 24 })}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: d(0.8), ease: EASE }}
          className="mt-6 max-w-2xl text-base leading-relaxed text-cream-100/85 sm:text-lg"
        >
          {site.heroIntro}
        </motion.p>

        <motion.div
          initial={enter({ opacity: 0, y: 24 })}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: d(0.95), ease: EASE }}
          className="mt-9 flex flex-col items-center gap-3.5 sm:flex-row"
        >
          <Magnetic>
            <a
              href="#contact"
              className="group inline-flex items-center gap-2.5 rounded-full bg-brand-600 px-8 py-4 text-sm font-semibold text-cream-50 shadow-glow transition hover:bg-brand-700"
            >
              Contact Us
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </Magnetic>
          <Magnetic strength={0.25}>
            <a
              href="#partners"
              className="inline-flex items-center gap-2.5 rounded-full border border-cream-50/30 bg-cream-50/5 px-8 py-4 text-sm font-semibold text-cream-50 backdrop-blur-sm transition hover:border-marigold-300/60 hover:text-marigold-300"
            >
              Be a Partner
            </a>
          </Magnetic>
        </motion.div>

        {/* Slide dots + counter */}
        <motion.div
          initial={enter({ opacity: 0 })}
          animate={{ opacity: 1 }}
          transition={{ delay: d(1.4) }}
          className="mt-12 flex items-center gap-4"
        >
          <span className="font-display text-sm italic text-cream-50/70">
            0{slide + 1} <span className="text-cream-50/35">/ 0{heroSlides.length}</span>
          </span>
          <div className="flex items-center">
            {heroSlides.map((s, i) => (
              <button
                key={s.src}
                type="button"
                aria-label={`Show slide ${i + 1}`}
                aria-current={i === slide ? 'true' : undefined}
                onClick={() => setSlide(i)}
                className="group flex h-8 min-w-6 items-center justify-center px-1.5"
              >
                <span
                  className={`block h-1.5 rounded-full transition-all duration-500 ${
                    i === slide ? 'w-8 bg-marigold-400' : 'w-2.5 bg-cream-50/35 group-hover:bg-cream-50/60'
                  }`}
                />
              </button>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Rotating badge (desktop) + simple chevron cue (mobile) */}
      <motion.div
        initial={enter({ opacity: 0, scale: 0.6 })}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: d(1.55), duration: 0.8, ease: EASE }}
        className="absolute bottom-10 right-10 z-10 hidden lg:block"
      >
        <CircleBadge />
      </motion.div>
      <motion.a
        href="#mission"
        aria-label="Scroll to mission"
        initial={enter({ opacity: 0 })}
        animate={{ opacity: 1 }}
        transition={{ delay: d(1.7) }}
        className="absolute bottom-[max(1.25rem,env(safe-area-inset-bottom))] left-1/2 z-10 -translate-x-1/2 text-cream-50/70 transition hover:text-marigold-300 lg:hidden"
      >
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="block"
        >
          <ChevronDown className="h-6 w-6" />
        </motion.span>
      </motion.a>
    </section>
  )
}
