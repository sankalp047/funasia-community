import { useCallback, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { partners } from '../data/content'
import { allPartners } from '../data/partners'
import { SectionHeading } from './ui/SectionHeading'
import { Stagger, Item } from './ui/Reveal'
import { GhostLabel } from './ui/GhostLabel'
import { TiltCard } from './ui/TiltCard'
import { PartnerWall } from './partners/PartnerWall'
// "Trusted by" logo band — hidden for now; re-enable by restoring this import
// and the <PartnerMarquee /> line below.
// import { PartnerMarquee } from './partners/PartnerMarquee'
import { PartnerDirectory } from './partners/PartnerDirectory'
import { PartnerDetail } from './partners/PartnerDetail'
import { scrollToTarget } from '../lib/lenis'
import { whenUnlocked } from '../lib/scrollLock'
import { img } from '../lib/img'

// The six featured cards open the same detail popup as the logo wall.
// Featured partners missing from the directory get a card built from their blurb.
const featuredDetails = partners.map(
  (p) =>
    allPartners.find((x) => x.slug === p.slug) ?? {
      slug: p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name: p.name,
      logo: img(p.image).src,
      category: 'Faith & Temples',
      region: 'Nationwide',
      description: p.blurb,
    },
)

export function Partners() {
  const [directoryOpen, setDirectoryOpen] = useState(false)
  const [detail, setDetail] = useState(null) // { list, index }

  const openDetail = useCallback((list, index) => setDetail({ list, index }), [])
  const closeDetail = useCallback(() => setDetail(null), [])
  const navigate = useCallback((index) => setDetail((d) => (d ? { ...d, index } : d)), [])

  const goToContact = useCallback(() => {
    setDetail(null)
    setDirectoryOpen(false)
    whenUnlocked(() => scrollToTarget(document.querySelector('#contact')))
  }, [])

  return (
    <section id="partners" className="relative overflow-hidden bg-cream-200/50 py-24 sm:py-32">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <GhostLabel text="Partners" className="-top-6" />
        <SectionHeading eyebrow="Our Community Partners" title="Stronger together, always">
          The nonprofits and cultural organizations we proudly stand beside.
        </SectionHeading>

        <Stagger className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" gap={0.1}>
          {partners.map((p, i) => (
            <Item key={p.name} className="h-full">
              <TiltCard maxTilt={4} className="h-full">
              <article className="group relative h-full overflow-hidden rounded-3xl border border-ever-900/8 bg-cream-50 shadow-card transition-shadow duration-500 hover:shadow-soft">
                {/* Whole card is the click target; the arrow is its visual cue */}
                <button
                  type="button"
                  onClick={() => openDetail(featuredDetails, i)}
                  aria-label={`Learn more about ${p.name}`}
                  className="absolute inset-0 z-10 rounded-3xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-brand-600/30"
                />
                {/* All partner artwork is 600×450, so a 4:3 box fits it edge-to-edge */}
                <div className="relative aspect-[4/3] overflow-hidden bg-cream-100">
                  <img
                    {...img(p.image, '(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw')}
                    loading="lazy"
                    decoding="async"
                    alt={`${p.name} logo`}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-brand-600 to-marigold-500 transition-transform duration-500 group-hover:scale-x-100"
                  />
                </div>
                <div className="flex items-start justify-between gap-4 p-6">
                  <div>
                    <h3 className="font-display text-xl font-semibold text-ever-900">{p.name}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-600">{p.blurb}</p>
                  </div>
                  <span
                    aria-hidden="true"
                    className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-ever-900/12 text-ever-900 transition group-hover:border-brand-600 group-hover:bg-brand-600 group-hover:text-cream-50"
                  >
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
              </article>
              </TiltCard>
            </Item>
          ))}
        </Stagger>

        <PartnerWall onSelect={openDetail} onViewAll={() => setDirectoryOpen(true)} />
      </div>

      {/* <PartnerMarquee onSelect={openDetail} /> */}

      {typeof document !== 'undefined' && createPortal(
        <>
      <AnimatePresence>
        {directoryOpen && (
          <PartnerDirectory
            key="directory"
            onClose={() => setDirectoryOpen(false)}
            onSelect={openDetail}
            detailOpen={Boolean(detail)}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {detail && (
          <PartnerDetail
            key="detail"
            list={detail.list}
            index={detail.index}
            onNavigate={navigate}
            onClose={closeDetail}
            onContact={goToContact}
          />
        )}
      </AnimatePresence>
        </>,
        document.body,
      )}
    </section>
  )
}
