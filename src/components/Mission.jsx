import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { ArrowRight, HeartHandshake, Sparkles, Users } from 'lucide-react'
import { mission, pillars } from '../data/content'
import { Reveal, Stagger, Item, ClipReveal } from './ui/Reveal'
import { Underline } from './ui/SectionHeading'
import { GhostLabel } from './ui/GhostLabel'
import { TiltCard } from './ui/TiltCard'
import { Magnetic } from './ui/Magnetic'
import { img } from '../lib/img'

const icons = { HeartHandshake, Sparkles, Users }
const ARCH = '190px 190px 28px 28px'

export function Mission() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const imgY = useTransform(scrollYProgress, [0, 1], ['-6%', '6%'])
  const badgeY = useTransform(scrollYProgress, [0, 1], ['16%', '-16%'])

  return (
    <section id="mission" ref={ref} className="relative overflow-hidden py-24 sm:py-32">
      {/* Soft background bloom */}
      <div aria-hidden="true" className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-brand-100/60 blur-3xl" />
      <div aria-hidden="true" className="absolute -right-32 bottom-10 h-80 w-80 rounded-full bg-marigold-100/70 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          {/* Image collage — arch-framed, echoing the site motif */}
          <div className="relative order-2 lg:order-1">
            <ClipReveal round={ARCH} className="relative z-10 overflow-hidden shadow-soft">
              <motion.img
                style={{ y: imgY }}
                {...img(mission.image, '(min-width: 1024px) 45vw, 100vw')}
                loading="lazy"
                decoding="async"
                alt="FunAsia volunteers at a community festival"
                className="h-[420px] w-full scale-110 object-cover sm:h-[520px]"
              />
            </ClipReveal>
            {/* Offset marigold frame */}
            <div
              aria-hidden="true"
              className="absolute -bottom-5 -left-5 -z-0 hidden h-full w-full rounded-t-[190px] rounded-b-[28px] border-2 border-marigold-400/50 sm:block"
            />
            {/* Floating years badge */}
            <motion.div
              style={{ y: badgeY }}
              className="absolute -right-3 top-14 z-20 rounded-3xl bg-ever-900 px-6 py-5 text-cream-50 shadow-soft sm:-right-8"
            >
              <p className="font-display text-4xl font-bold text-marigold-400">10</p>
              <p className="mt-0.5 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-cream-200/80">
                Years of<br />Community Service
              </p>
            </motion.div>
          </div>

          {/* Copy */}
          <div className="order-1 lg:order-2">
            <Reveal y={16}>
              <span className="inline-flex items-center gap-2 rounded-full border border-brand-600/20 bg-brand-50 px-4 py-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-brand-700">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-600" />
                {mission.eyebrow}
              </span>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="mt-6 font-display text-display-lg font-semibold text-ever-900">
                Uplifting communities, celebrating <Underline><em className="text-brand-600">culture</em></Underline>, empowering <em className="text-brand-600">women</em>.
              </h2>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-6 text-lg leading-relaxed text-ink-600">{mission.text}</p>
            </Reveal>
            <Reveal delay={0.24}>
              <Magnetic className="mt-9 inline-block">
                <a
                  href="#contact"
                  className="group inline-flex items-center gap-2.5 rounded-full bg-ever-900 px-8 py-4 text-sm font-semibold text-cream-50 shadow-soft transition hover:bg-ever-800"
                >
                  Be a Partner
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </Magnetic>
            </Reveal>
          </div>
        </div>

        {/* Core pillars */}
        <div className="relative mt-24 sm:mt-28">
          <GhostLabel text="Pillars" className="-top-10 sm:-top-16" />
          <Reveal className="relative text-center">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-ink-400">Core Pillars</p>
          </Reveal>
          <Stagger className="relative mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" gap={0.14}>
            {pillars.map((p, i) => {
              const Icon = icons[p.icon]
              return (
                <Item key={p.title} className="h-full">
                  <TiltCard maxTilt={5} className="h-full">
                    <div className="group relative h-full overflow-hidden rounded-3xl border border-ever-900/8 bg-cream-50 p-8 shadow-card transition-shadow duration-500 hover:shadow-soft">
                      <span
                        aria-hidden="true"
                        className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-brand-600 to-marigold-500 transition-transform duration-500 group-hover:scale-x-100"
                      />
                      <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-50 to-marigold-100 text-brand-600 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                        <Icon className="h-6 w-6" />
                      </span>
                      <h3 className="mt-6 font-display text-xl font-semibold text-ever-900">{p.title}</h3>
                      <p className="mt-3 leading-relaxed text-ink-600">{p.blurb}</p>
                      <span className="mt-6 block font-display text-5xl font-bold text-ever-900/6 transition-colors duration-500 group-hover:text-brand-600/10">
                        0{i + 1}
                      </span>
                    </div>
                  </TiltCard>
                </Item>
              )
            })}
          </Stagger>
        </div>
      </div>
    </section>
  )
}
