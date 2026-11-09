import { Plus } from 'lucide-react'
import { faqs } from '../data/content'
import { SectionHeading } from './ui/SectionHeading'
import { Reveal } from './ui/Reveal'

/**
 * Frequently asked questions. Native <details> so answers are in the HTML
 * (readable by search engines and AI crawlers) and work without JavaScript.
 * The same Q&A is published as FAQPage structured data at build time.
 */
export function Faq() {
  return (
    <section id="faq" className="relative py-24 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <SectionHeading eyebrow="FAQ" title="Questions, answered">
          The essentials about who we are, what we do, and how to work with us.
        </SectionHeading>

        <Reveal className="mt-12" y={20}>
          <div className="divide-y divide-ever-900/10 overflow-hidden rounded-3xl border border-ever-900/8 bg-cream-50 shadow-card">
            {faqs.map((f, i) => (
              <details key={f.q} className="group" open={i === 0}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 px-5 py-5 text-left transition hover:bg-cream-100/70 sm:px-7 [&::-webkit-details-marker]:hidden">
                  <h3 className="font-display text-lg font-semibold leading-snug text-ever-900 sm:text-xl">{f.q}</h3>
                  <span
                    aria-hidden="true"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-ever-900/12 text-ever-900 transition duration-300 group-open:rotate-45 group-open:border-brand-600 group-open:bg-brand-600 group-open:text-cream-50"
                  >
                    <Plus className="h-4 w-4" />
                  </span>
                </summary>
                <p className="px-5 pb-6 leading-relaxed text-ink-600 sm:px-7">{f.a}</p>
              </details>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
