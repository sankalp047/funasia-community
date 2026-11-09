import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, Clock, Loader2, MapPin, Phone, Send } from 'lucide-react'
import { contact, site } from '../data/content'
import { Reveal } from './ui/Reveal'
import { Magnetic } from './ui/Magnetic'
import { submitInquiry } from '../lib/inquiries'

// text-base on phones: iOS Safari zooms into any field under 16px
const fieldClass =
  'w-full rounded-2xl border border-ever-900/12 bg-cream-100/60 px-5 py-4 text-base text-ink-900 placeholder:text-ink-400 outline-none transition focus:border-brand-600 focus:bg-cream-50 focus:ring-4 focus:ring-brand-600/12 sm:text-sm'

export function Contact() {
  const [status, setStatus] = useState('idle') // idle | sending | sent | error

  async function handleSubmit(e) {
    e.preventDefault()
    const form = Object.fromEntries(new FormData(e.currentTarget))
    // Honeypot: real visitors never see or fill this field
    if (form.website) {
      setStatus('sent')
      return
    }
    setStatus('sending')
    try {
      await submitInquiry(form)
      setStatus('sent')
    } catch (err) {
      console.error('Inquiry failed', err)
      setStatus('error')
    }
  }
  const sent = status === 'sent'

  return (
    <section id="contact" className="px-2 py-6 pb-14 sm:px-4">
      <div className="relative mx-auto max-w-[1600px] overflow-hidden rounded-[2.5rem] bg-ever-950 py-20 sm:rounded-[3rem] sm:py-28">
      {/* Ambient glows */}
      <div aria-hidden="true" className="absolute -left-24 top-0 h-96 w-96 rounded-full bg-brand-600/14 blur-3xl" />
      <div aria-hidden="true" className="absolute -bottom-24 right-0 h-96 w-96 rounded-full bg-marigold-500/10 blur-3xl" />
      {/* Arch hairline echo */}
      <div
        aria-hidden="true"
        className="absolute -top-24 left-1/2 hidden h-96 w-[540px] -translate-x-1/2 rounded-b-[999px] border border-cream-50/8 lg:block"
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-2 lg:gap-20">
        {/* Copy + contact details */}
        <div>
          <Reveal y={16}>
            <span className="inline-flex items-center gap-2 rounded-full border border-cream-50/20 bg-cream-50/8 px-4 py-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-marigold-300">
              <span className="h-1.5 w-1.5 rounded-full bg-marigold-400" />
              Get in Touch
            </span>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-5 font-display text-display-lg font-semibold text-cream-50">{contact.heading}</h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-cream-200/80">{contact.copy}</p>
          </Reveal>

          <div className="mt-10 space-y-4">
            {[
              {
                icon: MapPin,
                label: 'Visit us',
                value: site.address,
                href: site.addressUrl,
              },
              { icon: Phone, label: 'Call us', value: site.phone, href: site.phoneHref },
              { icon: Clock, label: 'Availability', value: 'Our managers work around the clock' },
            ].map(({ icon: Icon, label, value, href }, i) => {
              const Tag = href ? 'a' : 'div'
              const linkProps = href
                ? { href, ...(href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {}) }
                : {}
              return (
                <Reveal key={label} delay={0.2 + i * 0.08}>
                  <Tag
                    {...linkProps}
                    className={`group flex items-center gap-4 rounded-2xl border border-cream-50/10 bg-cream-50/5 p-5 backdrop-blur-sm transition ${
                      href ? 'hover:border-marigold-400/40 hover:bg-cream-50/10' : ''
                    }`}
                  >
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-brand-700 text-cream-50 shadow-glow transition-transform group-hover:scale-108">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span>
                      <span className="block text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-cream-200/60">{label}</span>
                      <span className="mt-0.5 block font-medium text-cream-50">{value}</span>
                    </span>
                  </Tag>
                </Reveal>
              )
            })}
          </div>
        </div>

        {/* Form card */}
        <Reveal delay={0.15}>
          <div className="relative rounded-[32px] bg-cream-50 p-8 shadow-soft sm:p-10">
            <span aria-hidden="true" className="absolute -top-3 left-10 h-6 w-24 rounded-full bg-marigold-400" />
            {sent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="flex min-h-[420px] flex-col items-center justify-center text-center"
              >
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.15, type: 'spring', bounce: 0.5 }}
                >
                  <CheckCircle2 className="h-16 w-16 text-ever-600" />
                </motion.span>
                <h3 className="mt-6 font-display text-2xl font-semibold text-ever-900">Thank you!</h3>
                <p className="mt-3 max-w-sm text-ink-600">
                  Your message has been received. Our team will call you back during the day.
                </p>
                <button
                  type="button"
                  onClick={() => setStatus('idle')}
                  className="mt-8 rounded-full border border-ever-900/15 px-6 py-3 text-sm font-semibold text-ever-900 transition hover:bg-ever-900/5"
                >
                  Send another message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4" aria-labelledby="contact-form-title">
                <h3 id="contact-form-title" className="font-display text-2xl font-semibold text-ever-900">
                  Send us a message
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="cf-name" className="sr-only">Your name</label>
                    <input id="cf-name" required maxLength={120} name="name" placeholder="Your name" autoComplete="name" className={fieldClass} />
                  </div>
                  <div>
                    <label htmlFor="cf-phone" className="sr-only">Phone number</label>
                    <input
                      id="cf-phone"
                      required
                      minLength={7}
                      maxLength={40}
                      name="phone"
                      type="tel"
                      inputMode="tel"
                      placeholder="Phone number"
                      autoComplete="tel"
                      className={fieldClass}
                    />
                  </div>
                </div>
                <label htmlFor="cf-email" className="sr-only">Email (optional)</label>
                <input id="cf-email" name="email" type="email" maxLength={200} placeholder="Email (optional)" autoComplete="email" className={fieldClass} />
                <label htmlFor="cf-topic" className="sr-only">What is this about?</label>
                <select id="cf-topic" name="topic" defaultValue="" className={fieldClass}>
                  <option value="" disabled>
                    What is this about?
                  </option>
                  {contact.services.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                  <option>Something else</option>
                </select>
                <label htmlFor="cf-message" className="sr-only">Your message</label>
                <textarea id="cf-message" name="message" rows={4} maxLength={4000} placeholder="Tell us a little about your request…" className={fieldClass} />
                {/* Honeypot — hidden from people, tempting to bots */}
                <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
                  <label htmlFor="cf-website">Website</label>
                  <input id="cf-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
                </div>
                {status === 'error' && (
                  <p role="alert" className="rounded-xl border border-brand-600/25 bg-brand-50 px-4 py-3 text-sm text-brand-700">
                    Sorry — your message couldn't be sent. Please try again, or call us at{' '}
                    <a href={site.phoneHref} className="font-semibold underline">{site.phone}</a>.
                  </p>
                )}
                <Magnetic strength={0.15} className="block">
                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="group flex w-full items-center justify-center gap-2.5 rounded-2xl bg-brand-600 py-4 text-sm font-semibold text-cream-50 shadow-glow transition hover:bg-brand-700 disabled:opacity-70"
                  >
                    {status === 'sending' ? 'Sending…' : 'Send'}
                    {status === 'sending' ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-0.5" />
                    )}
                  </button>
                </Magnetic>
                <p className="text-center text-xs text-ink-400">
                  We usually respond the same day.
                </p>
              </form>
            )}
          </div>
        </Reveal>
      </div>
      </div>
    </section>
  )
}
