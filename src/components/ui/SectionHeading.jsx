import { Reveal, WordReveal } from './Reveal'

/** Small crimson eyebrow + big serif title, used to open every section. */
export function SectionHeading({ eyebrow, title, align = 'center', tone = 'light', children }) {
  const dark = tone === 'dark'
  return (
    <div className={align === 'center' ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}>
      {eyebrow && (
        <Reveal y={16}>
          <span
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.22em] ${
              dark
                ? 'border-cream-50/25 bg-cream-50/10 text-marigold-300'
                : 'border-brand-600/20 bg-brand-50 text-brand-700'
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${dark ? 'bg-marigold-400' : 'bg-brand-600'}`} />
            {eyebrow}
          </span>
        </Reveal>
      )}
      {typeof title === 'string' ? (
        <WordReveal
          as="h2"
          text={title}
          delay={0.1}
          className={`mt-5 block font-display text-display-lg font-semibold ${
            dark ? 'text-cream-50' : 'text-ever-900'
          }`}
        />
      ) : (
        <Reveal delay={0.08}>
          <h2
            className={`mt-5 font-display text-display-lg font-semibold ${
              dark ? 'text-cream-50' : 'text-ever-900'
            }`}
          >
            {title}
          </h2>
        </Reveal>
      )}
      {children && (
        <Reveal delay={0.16}>
          <p className={`mt-5 text-base leading-relaxed sm:text-lg ${dark ? 'text-cream-200/80' : 'text-ink-600'}`}>
            {children}
          </p>
        </Reveal>
      )}
    </div>
  )
}

/** Hand-drawn marigold underline for a highlighted word. */
export function Underline({ children, color = 'var(--color-marigold-500)' }) {
  return (
    <span className="stroke-highlight">
      {children}
      <svg viewBox="0 0 120 12" preserveAspectRatio="none" aria-hidden="true">
        <path
          d="M3 9 Q 30 3 60 6 T 117 4"
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
    </span>
  )
}
