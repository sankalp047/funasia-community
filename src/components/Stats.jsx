import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { stats } from '../data/content'
import { CountUp } from './ui/CountUp'
import { Stagger, Item } from './ui/Reveal'
import { img } from '../lib/img'

export function Stats() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const bgY = useTransform(scrollYProgress, [0, 1], ['-12%', '12%'])

  return (
    <section ref={ref} className="px-2 py-6 sm:px-4">
      {/* Floating evergreen sheet */}
      <div className="relative mx-auto max-w-[1600px] overflow-hidden rounded-[2.5rem] bg-ever-950 py-20 sm:rounded-[3rem] sm:py-24">
        {/* Tinted parallax photo layer */}
        <motion.div style={{ y: bgY }} aria-hidden="true" className="absolute -inset-y-16 inset-x-0">
          <img
            {...img('/images/banner_main1.jpg', '60vw')}
            loading="lazy"
            decoding="async"
            alt=""
            className="h-full w-full object-cover opacity-15 saturate-50"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ever-950 via-ever-950/60 to-ever-950" />
        </motion.div>
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              'radial-gradient(circle at 15% 20%, rgb(224 45 82 / 0.16) 0%, transparent 45%), radial-gradient(circle at 85% 80%, rgb(240 163 43 / 0.14) 0%, transparent 45%)',
          }}
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <Stagger className="grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4" gap={0.12}>
            {stats.map((s) => (
              <Item key={s.label} className="text-center">
                <p className="font-display text-6xl font-bold text-cream-50 sm:text-7xl">
                  <CountUp to={s.value} suffix={s.suffix} />
                </p>
                <div aria-hidden="true" className="mx-auto mt-4 h-px w-10 bg-gradient-to-r from-brand-500 to-marigold-400" />
                <p className="mt-4 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-cream-200/70">
                  {s.label}
                </p>
              </Item>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  )
}
