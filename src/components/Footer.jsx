import { ArrowUp, MapPin, Phone } from "lucide-react"
import { SocialLinks } from "./ui/SocialIcons"
import { Magnetic } from './ui/Magnetic'
import { activeSocials, contact, site } from '../data/content'
import { img } from '../lib/img'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative overflow-hidden border-t border-cream-50/8 bg-ever-950 pb-44 pt-16 text-cream-200/80 sm:pb-52">
      {/* Giant watermark wordmark bleeding off the bottom */}
      {/* Drawn via ::before so it stays purely decorative (not read as text) */}
      <div
        aria-hidden="true"
        data-text="FunAsia Outreach"
        className="pointer-events-none absolute inset-x-0 -bottom-4 select-none whitespace-nowrap text-center font-display font-bold leading-none text-cream-50/[0.045] before:content-[attr(data-text)]"
        style={{ fontSize: 'clamp(4.5rem, 12.5vw, 12rem)' }}
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[minmax(0,5fr)_minmax(0,3fr)_minmax(0,2fr)_minmax(0,4fr)]">
          {/* Brand */}
          <div>
            <a href="#top" className="inline-flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cream-50 p-2">
                <img {...img('/images/fanicon2.png', '48px')} loading="lazy" alt="FunAsia Outreach logo" className="h-full w-full object-contain" />
              </span>
              <span className="leading-tight">
                <span className="block font-display text-xl font-bold text-cream-50">FunAsia</span>
                <span className="block text-[0.62rem] font-semibold uppercase tracking-[0.32em] text-marigold-300">
                  Community Outreach
                </span>
              </span>
            </a>
            <p className="mt-5 max-w-sm text-sm leading-relaxed">
              FunAsia Community Outreach is dedicated to uplifting communities through nonprofit
              partnerships, women's empowerment, and culturally vibrant events.
            </p>
            <SocialLinks
              items={activeSocials}
              className="mt-6 flex gap-3"
              linkClassName="flex h-11 w-11 items-center justify-center rounded-full border border-cream-50/15 transition hover:border-marigold-400 hover:text-marigold-300"
            />
          </div>

          {/* Services */}
          <div>
            <h3 className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-cream-50">Our Services</h3>
            <ul className="mt-5 space-y-3 text-sm">
              {contact.services.map((s) => (
                <li key={s}>
                  <a href="#mission" className="transition hover:text-marigold-300">
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Schedule */}
          <div>
            <h3 className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-cream-50">Schedule</h3>
            <p className="mt-5 inline-flex rounded-full border border-marigold-400/30 bg-marigold-400/10 px-4 py-1.5 text-sm font-medium text-marigold-300">
              Coming Soon!
            </p>
          </div>

          {/* Contacts */}
          <div>
            <h3 className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-cream-50">Contacts</h3>
            <ul className="mt-5 space-y-4 text-sm">
              <li>
                <a href={site.addressUrl} target="_blank" rel="noreferrer" className="flex items-start gap-3 transition hover:text-marigold-300">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-marigold-400" />
                  {site.address}
                </a>
              </li>
              <li>
                <a href={site.phoneHref} className="flex items-center gap-3 transition hover:text-marigold-300">
                  <Phone className="h-4 w-4 shrink-0 text-marigold-400" />
                  {site.phone}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-cream-50/8 pt-7 sm:flex-row">
          <p className="text-xs text-cream-200/60">
            Copyright © {year} FunAsia Community Outreach. All rights reserved.
          </p>
          <Magnetic strength={0.4}>
            <a
              href="#top"
              aria-label="Back to top"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-600 text-cream-50 shadow-glow transition hover:bg-brand-700"
            >
              <ArrowUp className="h-4.5 w-4.5" />
            </a>
          </Magnetic>
        </div>
      </div>
    </footer>
  )
}
