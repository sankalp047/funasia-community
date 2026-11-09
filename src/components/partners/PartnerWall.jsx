import { ArrowRight, LayoutGrid } from 'lucide-react'
import { allPartners } from '../../data/partners'
import { Reveal } from '../ui/Reveal'
import { Magnetic } from '../ui/Magnetic'

const PREVIEW_DESKTOP = 28
const PREVIEW_MOBILE = 14

/** Layout width weight: keeps very square or very wide logos from dominating. */
const weight = (aspect) => Math.min(Math.max(aspect, 1.05), 3.8)

/**
 * Justified logo wall — logos keep their natural proportions and rows fill the
 * width, like the presentation slides. Every logo opens its partner details.
 */
export function PartnerWall({ onSelect, onViewAll }) {
  const preview = allPartners.slice(0, PREVIEW_DESKTOP)
  const remaining = allPartners.length - PREVIEW_DESKTOP

  return (
    <div className="mt-20">
      <Reveal className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-brand-600">
            Our partner family
          </p>
          <h3 className="mt-2 font-display text-display-md font-semibold text-ever-900">
            {allPartners.length} organizations we’re proud to support
          </h3>
          <p className="mt-2 max-w-xl text-ink-600">
            Tap any logo to learn about the organization and the work they do.
          </p>
        </div>
        <Magnetic strength={0.2} className="hidden shrink-0 sm:block">
          <button
            type="button"
            onClick={onViewAll}
            className="group flex items-center gap-2.5 rounded-full bg-ever-900 px-6 py-3.5 text-sm font-semibold text-cream-50 shadow-soft transition hover:bg-ever-800"
          >
            <LayoutGrid className="h-4 w-4" />
            View all {allPartners.length} partners
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </Magnetic>
      </Reveal>

      <Reveal y={24} delay={0.1}>
        <div className="mt-8 flex flex-wrap gap-2.5 [--tile-h:4.25rem] sm:gap-3 sm:[--tile-h:5.75rem]">
          {preview.map((p, i) => {
            const w = weight(p.aspect)
            return (
              <button
                key={p.slug}
                type="button"
                onClick={() => onSelect(allPartners, i)}
                title={p.name}
                aria-label={`${p.name} — view details`}
                style={{
                  flex: `${w} 1 calc(var(--tile-h) * ${w})`,
                  maxWidth: `calc(var(--tile-h) * ${w * 1.7})`,
                }}
                className={`group relative h-[var(--tile-h)] items-center justify-center rounded-2xl bg-white p-2.5 shadow-sm ring-1 ring-ever-900/8 transition duration-300 hover:-translate-y-1 hover:shadow-card hover:ring-brand-600/30 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-600/30 sm:p-3 ${
                  i >= PREVIEW_MOBILE ? 'hidden sm:flex' : 'flex'
                }`}
              >
                <img
                  src={p.logo}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  width={p.width}
                  height={p.height}
                  className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-[1.06]"
                />
              </button>
            )
          })}
          {/* absorbs leftover space so the last row isn't over-stretched */}
          <span aria-hidden="true" className="h-0 grow-[12]" />
        </div>
      </Reveal>

      {/* "View all" bar */}
      <Reveal delay={0.15}>
        <button
          type="button"
          onClick={onViewAll}
          className="group mt-6 flex w-full items-center justify-between gap-4 rounded-3xl border border-ever-900/10 bg-cream-50 p-3 pl-4 text-left shadow-sm transition hover:border-brand-600/30 hover:shadow-card sm:pl-5"
        >
          <span className="flex items-center gap-4">
            <span className="hidden -space-x-3 sm:flex">
              {allPartners.slice(PREVIEW_DESKTOP, PREVIEW_DESKTOP + 5).map((p) => (
                <span
                  key={p.slug}
                  className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-white p-1.5 ring-2 ring-cream-50 shadow-sm"
                >
                  <img src={p.logo} alt="" loading="lazy" className="max-h-full max-w-full object-contain" />
                </span>
              ))}
            </span>
            <span>
              <span className="block font-semibold text-ever-900">
                <span className="sm:hidden">+{allPartners.length - PREVIEW_MOBILE}</span>
                <span className="hidden sm:inline">+{remaining}</span> more partners across Texas & beyond
              </span>
              <span className="block text-sm text-ink-400">Search by name, region or cause</span>
            </span>
          </span>
          <span className="flex shrink-0 items-center gap-2 rounded-full bg-brand-600 px-5 py-3 text-sm font-semibold text-cream-50 shadow-glow transition group-hover:bg-brand-700">
            View all
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </button>
      </Reveal>
    </div>
  )
}
