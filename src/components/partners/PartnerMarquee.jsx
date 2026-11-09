import { allPartners } from '../../data/partners'
import { Reveal } from '../ui/Reveal'

const half = Math.ceil(allPartners.length / 2)
const ROWS = [
  { logos: allPartners.slice(0, half), anim: 'animate-marquee', seconds: 150 },
  { logos: allPartners.slice(half), anim: 'animate-marquee-reverse', seconds: 170 },
]

function Tile({ p, onSelect, hidden }) {
  // Tile width follows the logo's proportions (clamped), height is fixed
  const a = p.aspect.toFixed(3)
  return (
    <button
      type="button"
      onClick={() => onSelect(allPartners, allPartners.indexOf(p))}
      tabIndex={hidden ? -1 : 0}
      aria-hidden={hidden || undefined}
      aria-label={hidden ? undefined : `${p.name} — view details`}
      title={p.name}
      style={{
        width: `calc(clamp(6.5rem, var(--mh) * ${a}, 15rem) + 2.5rem)`,
        height: 'calc(var(--mh) + 2rem)',
      }}
      className="group flex shrink-0 items-center justify-center rounded-2xl bg-white px-5 py-4 shadow-[0_10px_30px_-12px_rgb(0_0_0/0.45)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-14px_rgb(0_0_0/0.6)]"
    >
      <img
        src={p.logo}
        alt={hidden ? '' : `${p.name} logo`}
        loading="lazy"
        decoding="async"
        className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
      />
    </button>
  )
}

/** Two counter-drifting rows of every partner logo, full colour, on a dark band. */
export function PartnerMarquee({ onSelect }) {
  return (
    <div className="relative mt-24 overflow-hidden bg-ever-950 py-14 sm:py-16">
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            'radial-gradient(circle at 10% 0%, rgb(224 45 82 / 0.22) 0%, transparent 40%), radial-gradient(circle at 90% 100%, rgb(240 163 43 / 0.18) 0%, transparent 40%)',
        }}
      />
      <Reveal className="relative px-4 text-center" y={16}>
        <p className="text-[0.72rem] font-semibold uppercase tracking-[0.3em] text-marigold-300">
          Trusted by organizations across DFW &amp; Texas
        </p>
        <p className="mt-3 font-display text-2xl font-semibold text-cream-50 sm:text-3xl">
          {allPartners.length} partners and counting
        </p>
      </Reveal>

      <div className="relative mt-10 space-y-5 [--mh:3.25rem] [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)] sm:[--mh:4.25rem]">
        {ROWS.map((row, ri) => (
          <div key={ri} className="overflow-hidden py-2">
            <div
              className={`flex w-max gap-4 pr-4 sm:gap-5 sm:pr-5 ${row.anim} hover:[animation-play-state:paused]`}
              style={{ animationDuration: `${row.seconds}s` }}
            >
              {row.logos.map((p) => (
                <Tile key={p.slug} p={p} onSelect={onSelect} />
              ))}
              {/* Duplicate set for a seamless loop */}
              {row.logos.map((p) => (
                <Tile key={`${p.slug}-dup`} p={p} onSelect={onSelect} hidden />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
