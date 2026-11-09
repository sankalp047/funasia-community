import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { featuredStory } from '../data/content'
import { Reveal, Stagger, Item } from './ui/Reveal'
import { img } from '../lib/img'

export function FeaturedStory() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const photoY = useTransform(scrollYProgress, [0, 1], ['6%', '-6%'])
  const photoY2 = useTransform(scrollYProgress, [0, 1], ['12%', '-12%'])

  return (
    <section ref={ref} className="px-2 py-6 sm:px-4">
      {/* Saffron color-block sheet */}
      <div className="relative mx-auto max-w-[1600px] overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-marigold-400 to-marigold-500 py-20 sm:rounded-[3rem] sm:py-28">
        {/* Subtle dot lattice */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.14]"
          style={{
            backgroundImage: 'radial-gradient(rgb(6 35 29) 1.2px, transparent 1.2px)',
            backgroundSize: '26px 26px',
          }}
        />
        {/* Soft glow */}
        <div aria-hidden="true" className="absolute -left-24 top-0 h-96 w-96 rounded-full bg-cream-50/25 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-5 sm:px-8 lg:grid-cols-[minmax(0,6fr)_minmax(0,6fr)] lg:gap-20">
          <div>
            <Reveal y={16}>
              <span className="inline-flex items-center gap-2 rounded-full border border-ever-950/25 bg-cream-50/40 px-4 py-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-ever-950 backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-ever-950" />
                {featuredStory.eyebrow}
              </span>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="mt-5 font-display text-display-lg font-semibold text-ever-950">
                {featuredStory.title}
              </h2>
            </Reveal>
            {featuredStory.paragraphs.map((p, i) => (
              <Reveal key={i} delay={0.14 + i * 0.06}>
                <p
                  className={`mt-4 leading-relaxed ${
                    i === 0 ? 'text-lg font-semibold text-ever-950' : 'text-ever-950/80'
                  }`}
                >
                  {p}
                </p>
              </Reveal>
            ))}
            <Stagger className="mt-9 grid grid-cols-3 gap-4" gap={0.1} delay={0.2}>
              {featuredStory.highlights.map((h) => (
                <Item key={h.label}>
                  <div className="rounded-2xl bg-cream-50/85 px-4 py-5 text-center shadow-card backdrop-blur-sm">
                    <p className="font-display text-xl font-bold text-brand-600 sm:text-2xl">{h.value}</p>
                    <p className="mt-1 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-ink-600">
                      {h.label}
                    </p>
                  </div>
                </Item>
              ))}
            </Stagger>
          </div>

          {/* Stacked polaroids */}
          <div className="relative mx-auto w-full max-w-xl pb-10 lg:pb-0">
            <motion.div style={{ y: photoY }} className="relative z-10">
              <motion.div
                initial={{ opacity: 0, rotate: 6, y: 40 }}
                whileInView={{ opacity: 1, rotate: 2.5, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-[18px] bg-cream-50 p-3 pb-5 shadow-soft"
              >
                <img
                  {...img(featuredStory.image, '(min-width: 1024px) 560px, 100vw')}
                  loading="lazy"
                  decoding="async"
                  alt="Medal winners at the Sewa International DFW Chapter 5K run"
                  className="h-[300px] w-full rounded-xl object-cover sm:h-[380px]"
                />
                <p className="px-1.5 pt-3 font-display text-sm italic text-ink-600">
                  Medal winners — George Webb Park, McKinney
                </p>
              </motion.div>
            </motion.div>
            <motion.div style={{ y: photoY2 }} className="absolute -bottom-4 -left-4 z-20 w-56 sm:-left-10 sm:w-72">
              <motion.div
                initial={{ opacity: 0, rotate: -10, y: 40 }}
                whileInView={{ opacity: 1, rotate: -5, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-[14px] bg-cream-50 p-2 pb-3 shadow-soft"
              >
                <img
                  {...img('/images/sewa_runninig.jpeg', '18rem')}
                  loading="lazy"
                  decoding="async"
                  alt="Runners at the 5K"
                  className="h-32 w-full rounded-lg object-cover sm:h-40"
                />
                <p className="px-1 pt-2 font-display text-xs italic text-ink-600">6:30 a.m. start ✦ 200+ runners</p>
              </motion.div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.7, rotate: -10 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 8 }}
              viewport={{ once: true }}
              transition={{ delay: 0.45, duration: 0.7, type: 'spring', bounce: 0.45 }}
              className="absolute -right-2 -top-6 z-20 rounded-2xl bg-brand-600 px-5 py-3 text-cream-50 shadow-glow sm:-right-6"
            >
              <p className="font-display text-lg font-bold">Wellness + Sewa 🏅</p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
