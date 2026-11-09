import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useScroll, useMotionValueEvent } from 'framer-motion'
import { MapPin, Phone, Menu, X } from 'lucide-react'
import { SocialLinks } from './ui/SocialIcons'
import { Magnetic } from './ui/Magnetic'
import { lenisRef } from '../lib/lenis'
import { activeSocials, site } from '../data/content'
import { img } from '../lib/img'

const links = [
  { label: 'Mission', href: '#mission' },
  { label: 'CEO', href: '#ceo' },
  { label: 'Our Partners', href: '#partners' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Contact', href: '#contact' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 32))

  // Lock scrolling while the mobile menu is open (Lenis bypasses CSS overflow)
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    if (open) lenisRef.current?.stop()
    else lenisRef.current?.start()
    return () => { document.body.style.overflow = '' }
  }, [open])

  // Scrollspy: highlight the section currently crossing mid-viewport
  useEffect(() => {
    const sections = links
      .map((l) => document.querySelector(l.href))
      .filter(Boolean)
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(`#${e.target.id}`)
      },
      { rootMargin: '-42% 0px -52% 0px' },
    )
    sections.forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [])

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Top info bar — collapses away once the page is scrolled */}
      <div
        className={`overflow-hidden bg-ever-950 text-cream-100 transition-all duration-500 ${
          scrolled ? 'max-h-0 opacity-0' : 'max-h-12 opacity-100'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2 text-xs sm:px-6">
          <a
            href={site.addressUrl}
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-1.5 transition hover:text-marigold-300 sm:flex"
          >
            <MapPin className="h-3.5 w-3.5 text-marigold-400" />
            {site.address}
          </a>
          <a href={site.phoneHref} className="flex items-center gap-1.5 transition hover:text-marigold-300">
            <Phone className="h-3.5 w-3.5 text-marigold-400" />
            {site.phone}
          </a>
          <SocialLinks
            items={activeSocials}
            className="flex items-center gap-3"
            linkClassName="transition hover:text-marigold-300"
            iconClassName="h-3.5 w-3.5"
          />
        </div>
      </div>

      {/* Main nav */}
      <nav
        className={`transition-all duration-500 ${
          scrolled
            ? 'border-b border-ever-900/8 bg-cream-50/85 py-2 shadow-[0_10px_40px_-18px_rgb(10_51_43/0.25)] backdrop-blur-xl'
            : 'bg-transparent py-3.5'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6">
          <a href="#top" className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cream-50 p-1.5 shadow-card ring-1 ring-ever-900/10">
              <img {...img('/images/fanicon2.png', '48px')} alt="FunAsia Outreach logo" className="h-full w-full object-contain" />
            </span>
            <span className="leading-tight">
              <span className={`block font-display text-lg font-bold tracking-tight ${scrolled ? 'text-ever-900' : 'text-cream-50'}`}>
                FunAsia
              </span>
              <span className={`block text-[0.6rem] font-semibold uppercase tracking-[0.32em] ${scrolled ? 'text-brand-600' : 'text-marigold-300'}`}>
                Outreach
              </span>
            </span>
          </a>

          <ul className="hidden items-center gap-1 lg:flex">
            {links.map((l) => {
              const isActive = active === l.href
              return (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                      scrolled
                        ? isActive
                          ? 'bg-brand-50 text-brand-700'
                          : 'text-ink-900 hover:bg-brand-50 hover:text-brand-700'
                        : isActive
                          ? 'bg-cream-50/12 text-marigold-300'
                          : 'text-cream-100 hover:bg-cream-50/10 hover:text-marigold-300'
                    }`}
                  >
                    {l.label}
                  </a>
                </li>
              )
            })}
          </ul>

          <div className="hidden items-center gap-2.5 lg:flex">
            {/*
              Sign-in / Community button — hidden until login launches.
              To restore: re-add the Link, MessagesSquare, Avatar and useAuth imports,
              `const { user, profile } = useAuth()`, and this block:

              {user ? (
                <Link to="/community" className="…"><MessagesSquare /> Community <Avatar … /></Link>
              ) : (
                <Link to="/auth" className="…">Sign In</Link>
              )}
            */}
            <Magnetic strength={0.3}>
              <a
                href="#contact"
                className="block rounded-full bg-brand-600 px-6 py-2.5 text-sm font-semibold text-cream-50 shadow-glow transition hover:bg-brand-700"
              >
                Contact Us
              </a>
            </Magnetic>
          </div>

          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className={`rounded-xl p-2.5 transition lg:hidden ${
              scrolled ? 'bg-ever-900/5 text-ever-900' : 'bg-cream-50/10 text-cream-50'
            }`}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </nav>

      {/* Mobile full-screen menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] flex h-dvh flex-col bg-ever-950/97 backdrop-blur-md lg:hidden"
          >
            <div className="flex items-center justify-between px-5 py-5">
              <span className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cream-50 p-1.5">
                  <img {...img('/images/fanicon2.png', '48px')} alt="" className="h-full w-full object-contain" />
                </span>
                <span className="font-display text-lg font-bold text-cream-50">FunAsia Outreach</span>
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="rounded-xl bg-cream-50/10 p-2.5 text-cream-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex flex-1 flex-col justify-center gap-1 px-8">
              {links.map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 + i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="border-b border-cream-50/10 py-4 font-display text-3xl font-semibold text-cream-100 transition hover:text-marigold-300"
                >
                  {l.label}
                </motion.a>
              ))}
            </nav>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="flex gap-3 px-8 pb-[max(2.5rem,env(safe-area-inset-bottom))]"
            >
              {/* Sign-in button hidden until login launches (see desktop note above) */}
              <a
                href={site.phoneHref}
                className="flex flex-1 items-center justify-center gap-2 rounded-full border border-cream-50/25 py-3.5 font-semibold text-cream-50"
              >
                <Phone className="h-4 w-4" /> Call us
              </a>
              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className="flex-1 rounded-full bg-brand-600 py-3.5 text-center font-semibold text-cream-50 shadow-glow"
              >
                Contact Us
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
