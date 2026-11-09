import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, Search, X } from 'lucide-react'
import { PARTNER_CATEGORIES, PARTNER_REGIONS, allPartners } from '../../data/partners'
import { useScrollLock } from '../../lib/scrollLock'

const EASE = [0.22, 1, 0.36, 1]

function Chip({ active, onClick, children, count }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
        active
          ? 'bg-ever-900 text-cream-50'
          : 'border border-ever-900/12 bg-cream-50 text-ink-600 hover:border-ever-900/30 hover:text-ever-900'
      }`}
    >
      {children}
      {count !== undefined && (
        <span className={`tabular-nums ${active ? 'text-marigold-300' : 'text-ink-400'}`}>{count}</span>
      )}
    </button>
  )
}

/** Full-screen directory of every partner, with search and filters. */
export function PartnerDirectory({ onClose, onSelect, detailOpen }) {
  const [query, setQuery] = useState('')
  const [region, setRegion] = useState('All')
  const [category, setCategory] = useState('All')
  const searchRef = useRef(null)
  useScrollLock(true)

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && !detailOpen) onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, detailOpen])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return allPartners.filter(
      (p) =>
        (region === 'All' || p.region === region) &&
        (category === 'All' || p.category === category) &&
        (!q ||
          p.name.toLowerCase().includes(q) ||
          p.shortName?.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)),
    )
  }, [query, region, category])

  const regionCounts = useMemo(() => {
    const c = {}
    for (const p of allPartners) c[p.region] = (c[p.region] ?? 0) + 1
    return c
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: '6%' }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: '6%' }}
      transition={{ duration: 0.45, ease: EASE }}
      role="dialog"
      aria-modal="true"
      aria-label="All community partners"
      data-lenis-prevent
      className="fixed inset-0 z-[75] overflow-y-auto bg-cream-100"
    >
      {/* Sticky header with search + filters */}
      <div className="sticky top-0 z-10 border-b border-ever-900/8 bg-cream-100/92 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 pb-4 pt-5 sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-brand-600">
                Our Community Partners
              </p>
              <h2 className="mt-1 font-display text-2xl font-semibold text-ever-900 sm:text-3xl">
                {allPartners.length} organizations, one community
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close partner directory"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ever-900 text-cream-50 transition hover:bg-ever-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative lg:w-80">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
              <input
                ref={searchRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search partners…"
                className="w-full rounded-2xl border border-ever-900/12 bg-cream-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-brand-600 focus:ring-4 focus:ring-brand-600/12"
              />
            </div>
            <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:px-0">
              <Chip active={region === 'All'} onClick={() => setRegion('All')} count={allPartners.length}>
                All regions
              </Chip>
              {PARTNER_REGIONS.filter((r) => regionCounts[r]).map((r) => (
                <Chip key={r} active={region === r} onClick={() => setRegion(r)} count={regionCounts[r]}>
                  {r}
                </Chip>
              ))}
            </div>
          </div>
          <div className="no-scrollbar -mx-4 mt-2.5 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
            {['All', ...PARTNER_CATEGORIES].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={`shrink-0 rounded-full px-3 py-1 text-[0.72rem] font-medium transition ${
                  category === c ? 'bg-brand-600 text-cream-50' : 'text-ink-600 hover:bg-ever-900/5 hover:text-ever-900'
                }`}
              >
                {c === 'All' ? 'All causes' : c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-9">
        <p className="mb-5 text-sm text-ink-400">
          Showing <strong className="text-ever-900">{filtered.length}</strong> of {allPartners.length} partners
        </p>
        {filtered.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-ever-900/15 py-16 text-center">
            <p className="font-display text-xl font-semibold text-ever-900">No partners match that search.</p>
            <button
              type="button"
              onClick={() => {
                setQuery('')
                setRegion('All')
                setCategory('All')
                searchRef.current?.focus()
              }}
              className="mt-3 text-sm font-semibold text-brand-600 hover:text-brand-700"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filtered.map((p, i) => (
              <motion.button
                key={p.slug}
                type="button"
                onClick={() => onSelect(filtered, i)}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: Math.min(i, 20) * 0.02, ease: EASE }}
                className="group flex flex-col overflow-hidden rounded-3xl border border-ever-900/8 bg-cream-50 text-left shadow-sm transition hover:-translate-y-1 hover:border-brand-600/25 hover:shadow-card focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-600/25"
              >
                <span className="block aspect-[16/10] min-h-0 shrink-0 overflow-hidden bg-white p-4 sm:p-5">
                  <img
                    src={p.logo}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                </span>
                <span className="flex flex-1 items-start justify-between gap-2 border-t border-ever-900/6 px-4 py-3">
                  <span className="min-w-0">
                    <span className="line-clamp-2 text-sm font-semibold leading-snug text-ever-900">
                      {p.shortName ?? p.name}
                    </span>
                    <span className="mt-0.5 block truncate text-[0.7rem] text-ink-400">{p.region}</span>
                  </span>
                  <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-ink-400 transition group-hover:text-brand-600" />
                </span>
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}
