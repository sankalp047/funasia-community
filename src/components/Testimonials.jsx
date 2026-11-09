import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import { testimonials } from '../data/content'
import { SectionHeading } from './ui/SectionHeading'
import { Reveal } from './ui/Reveal'
import { GhostLabel } from './ui/GhostLabel'
import { Magnetic } from './ui/Magnetic'
import { img } from '../lib/img'

export function Testimonials() {
  const [[index, direction], setIndex] = useState([0, 1])
  const [paused, setPaused] = useState(false)
  const t = testimonials[index]

  const go = (dir) =>
    setIndex(([i]) => [(i + dir + testimonials.length) % testimonials.length, dir])

  useEffect(() => {
    if (paused) return
    const id = setInterval(() => go(1), 9000)
    return () => clearInterval(id)
  }, [paused, index])

  return (
    <section
      id="testimonials"
      className="relative overflow-hidden py-24 sm:py-32"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div aria-hidden="true" className="absolute right-0 top-16 h-80 w-80 rounded-full bg-brand-100/50 blur-3xl" />
      <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
        <GhostLabel text="Voices" className="-top-4" />
        <SectionHeading eyebrow="Testimonials" title="Voices from our community">
          What partner organizations say about working with FunAsia.
        </SectionHeading>

        <Reveal className="relative mt-14" y={24}>
          <Quote
            aria-hidden="true"
            className="absolute -top-7 left-4 h-16 w-16 text-brand-600/12 sm:-left-4 sm:h-24 sm:w-24"
          />
          <div className="relative min-h-[380px] sm:min-h-[330px]">
            {/* Deck: the next cards peeking out behind the active one */}
            <div
              aria-hidden="true"
              className="absolute inset-x-5 -bottom-3.5 top-6 -z-10 rotate-[1.4deg] rounded-[32px] border border-ever-900/8 bg-cream-50/80 shadow-sm"
            />
            <div
              aria-hidden="true"
              className="absolute inset-x-10 -bottom-7 top-12 -z-20 rotate-[-1.2deg] rounded-[32px] border border-ever-900/6 bg-cream-50/50"
            />
            <AnimatePresence mode="wait" custom={direction}>
              <motion.figure
                key={index}
                custom={direction}
                initial={{ opacity: 0, x: direction * 80, rotate: direction * 2.5 }}
                animate={{ opacity: 1, x: 0, rotate: 0 }}
                exit={{ opacity: 0, x: direction * -80, rotate: direction * -2.5 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-[32px] border border-ever-900/8 bg-cream-50 p-8 shadow-card sm:p-12"
              >
                <blockquote className="text-[0.95rem] leading-relaxed text-ink-600 sm:text-base">
                  {t.text}
                </blockquote>
                <figcaption className="mt-8 flex items-center gap-4 border-t border-ever-900/8 pt-6">
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-cream-100 ring-2 ring-marigold-400/40 ring-offset-2 ring-offset-cream-50">
                    <img {...img(t.logo, '56px')} loading="lazy" alt={`${t.org} logo`} className="h-full w-full object-contain p-1" />
                  </span>
                  <span>
                    <p className="font-display text-lg font-semibold text-ever-900">{t.name}</p>
                    <p className="text-sm text-brand-600">{t.org}</p>
                  </span>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="mt-8 flex items-center justify-between">
            <div className="-ml-1 flex">
              {testimonials.map((item, i) => (
                <button
                  key={item.name}
                  type="button"
                  aria-label={`Show testimonial from ${item.name}`}
                  aria-current={i === index ? 'true' : undefined}
                  onClick={() => setIndex(([cur]) => [i, i > cur ? 1 : -1])}
                  className="group flex h-8 min-w-6 items-center justify-center px-1"
                >
                  <span
                    className={`block h-1.5 rounded-full transition-all duration-500 ${
                      i === index ? 'w-8 bg-brand-600' : 'w-2.5 bg-ever-900/15 group-hover:bg-ever-900/30'
                    }`}
                  />
                </button>
              ))}
            </div>
            <div className="flex gap-2.5">
              <Magnetic strength={0.3}>
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label="Previous testimonial"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-ever-900/12 text-ever-900 transition hover:border-brand-600 hover:bg-brand-600 hover:text-cream-50"
                >
                  <ChevronLeft className="h-4.5 w-4.5" />
                </button>
              </Magnetic>
              <Magnetic strength={0.3}>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label="Next testimonial"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-ever-900/12 text-ever-900 transition hover:border-brand-600 hover:bg-brand-600 hover:text-cream-50"
                >
                  <ChevronRight className="h-4.5 w-4.5" />
                </button>
              </Magnetic>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
