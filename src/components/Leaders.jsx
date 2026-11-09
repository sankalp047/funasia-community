import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { Quote, Radio } from 'lucide-react'
import { FacebookIcon, InstagramIcon } from './ui/SocialIcons'
import { GhostLabel } from './ui/GhostLabel'
import { ceo, outreachLead } from '../data/content'
import { Reveal, ClipReveal } from './ui/Reveal'
import { SectionHeading } from './ui/SectionHeading'
import { img } from '../lib/img'

export function Leaders() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const floatY = useTransform(scrollYProgress, [0, 1], ['10%', '-10%'])

  return (
    <section id="ceo" ref={ref} className="relative overflow-hidden py-24 sm:py-32">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <GhostLabel text="Leaders" className="-top-8" />
        <SectionHeading eyebrow="Leadership" title="The women behind the mission">
          Guided by a belief that true leadership uplifts others.
        </SectionHeading>

        {/* ——— CEO ——— */}
        <div className="mt-16 grid items-center gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
          <div className="relative mx-auto w-full max-w-md">
            {/* Arch-framed portrait */}
            <ClipReveal>
              <div className="relative overflow-hidden rounded-t-[999px] rounded-b-[36px] bg-cream-200">
                <img
                  {...img(ceo.photo, '(min-width: 1024px) 28rem, 90vw')}
                  loading="lazy"
                  decoding="async"
                  alt={`Portrait of ${ceo.name}`}
                  className="h-[460px] w-full object-cover object-top transition-transform duration-[1.8s] ease-out hover:scale-105 sm:h-[520px]"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ever-950/70 to-transparent px-7 pb-6 pt-16 text-cream-50">
                  <p className="font-display text-2xl font-semibold">{ceo.name}</p>
                  <p className="text-sm text-marigold-300">{ceo.role}</p>
                </div>
              </div>
            </ClipReveal>
            <div aria-hidden="true" className="absolute -right-4 -top-4 -z-10 h-full w-full rounded-t-[999px] rounded-b-[36px] border-2 border-brand-600/30" />
            {/* Floating quote chip — tucked at the bottom edge, clear of the face */}
            <motion.div
              style={{ y: floatY }}
              className="absolute -bottom-9 -right-2 z-10 max-w-[240px] rounded-2xl border border-ever-900/8 bg-cream-50/95 p-4 shadow-soft backdrop-blur-sm sm:-right-8"
            >
              <Quote className="h-4 w-4 text-brand-600" />
              <p className="mt-2 font-display text-sm italic leading-snug text-ever-900">
                “True leadership uplifts others.”
              </p>
            </motion.div>
          </div>

          <div>
            <Reveal>
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-brand-600">About the CEO</p>
              <h3 className="mt-3 font-display text-display-md font-semibold text-ever-900">{ceo.headline}</h3>
            </Reveal>
            {ceo.bio.map((para, i) => (
              <Reveal key={i} delay={0.1 + i * 0.08}>
                <p className="mt-5 leading-relaxed text-ink-600">{para}</p>
              </Reveal>
            ))}
            <Reveal delay={0.3}>
              <blockquote className="relative mt-8 rounded-2xl border-l-4 border-brand-600 bg-brand-50/70 py-5 pl-6 pr-5">
                <p className="font-display text-lg italic leading-relaxed text-ever-900 sm:text-xl">
                  “{ceo.quote}”
                </p>
              </blockquote>
            </Reveal>
            <Reveal delay={0.38}>
              <div className="mt-7 flex items-center gap-3">
                <span className="text-sm font-medium text-ink-400">Follow Vaishali</span>
                <a
                  href={ceo.socials.facebook}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Vaishali Thakkar on Facebook"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-ever-900 text-cream-50 transition hover:-translate-y-0.5 hover:bg-brand-600"
                >
                  <FacebookIcon className="h-4 w-4" />
                </a>
                <a
                  href={ceo.socials.instagram}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Vaishali Thakkar on Instagram"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-ever-900 text-cream-50 transition hover:-translate-y-0.5 hover:bg-brand-600"
                >
                  <InstagramIcon className="h-4 w-4" />
                </a>
              </div>
            </Reveal>
          </div>
        </div>

        {/* ——— Outreach Lead ——— */}
        <div className="mt-24 overflow-hidden rounded-[36px] bg-ever-900 sm:mt-28">
          <div className="grid items-center gap-10 p-8 sm:p-12 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-14 lg:p-16">
            <Reveal className="mx-auto">
              <div className="relative">
                <div className="overflow-hidden rounded-full ring-4 ring-marigold-400/40 ring-offset-8 ring-offset-ever-900">
                  <img
                    {...img(outreachLead.photo, '16rem')}
                    loading="lazy"
                    decoding="async"
                    alt={`Portrait of ${outreachLead.name}`}
                    className="h-56 w-56 object-cover transition-transform duration-[1.8s] hover:scale-108 sm:h-64 sm:w-64"
                  />
                </div>
                <motion.span
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -bottom-1 -right-1 flex h-14 w-14 items-center justify-center rounded-full bg-brand-600 text-cream-50 shadow-glow"
                >
                  <Radio className="h-6 w-6" />
                </motion.span>
              </div>
            </Reveal>
            <div>
              <Reveal>
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-marigold-300">
                  Community Outreach Lead
                </p>
                <h3 className="mt-3 font-display text-display-md font-semibold text-cream-50">{outreachLead.name}</h3>
              </Reveal>
              {outreachLead.bio.map((para, i) => (
                <Reveal key={i} delay={0.1 + i * 0.08}>
                  <p className="mt-4 leading-relaxed text-cream-200/85">{para}</p>
                </Reveal>
              ))}
              <Reveal delay={0.3}>
                <div className="mt-7 inline-flex flex-wrap items-center gap-x-4 gap-y-2 rounded-2xl border border-cream-50/15 bg-cream-50/5 px-5 py-4 backdrop-blur-sm">
                  <span className="flex items-center gap-2.5">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-500 opacity-75" />
                      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-brand-500" />
                    </span>
                    <span className="font-semibold text-cream-50">{outreachLead.show.name}</span>
                  </span>
                  <span className="text-sm text-marigold-300">{outreachLead.show.schedule}</span>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
