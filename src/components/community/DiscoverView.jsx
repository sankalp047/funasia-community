import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Globe2, Lock, Plus, Search, Users } from 'lucide-react'
import { GROUP_CATEGORIES, cancelRequest, joinGroup, requestToJoin, subscribeAllGroups } from '../../lib/db'
import { useCommunity } from '../../pages/Community'
import { initials, userColor } from '../../lib/colors'

function JoinButton({ group, me, navigate }) {
  const isMember = group.memberIds?.includes(me.id)
  const isPending = group.pendingIds?.includes(me.id)
  const [busy, setBusy] = useState(false)

  const act = async (fn) => {
    setBusy(true)
    try {
      await fn()
    } finally {
      setBusy(false)
    }
  }

  if (isMember) {
    return (
      <button
        type="button"
        onClick={() => navigate(`/community/g/${group.id}`)}
        className="rounded-full bg-ever-900 px-4 py-2 text-xs font-semibold text-cream-50 transition hover:bg-ever-800"
      >
        Open
      </button>
    )
  }
  if (isPending) {
    return (
      <button
        type="button"
        disabled={busy}
        onClick={() => act(() => cancelRequest(group, me.id))}
        className="rounded-full border border-marigold-500/40 bg-marigold-100 px-4 py-2 text-xs font-semibold text-marigold-600 transition hover:border-marigold-500 disabled:opacity-50"
        title="Cancel request"
      >
        Requested ·&nbsp;Cancel
      </button>
    )
  }
  if (group.privacy === 'private') {
    return (
      <button
        type="button"
        disabled={busy}
        onClick={() => act(() => requestToJoin(group, me))}
        className="rounded-full border border-ever-900/15 bg-cream-50 px-4 py-2 text-xs font-semibold text-ever-900 transition hover:border-brand-600 hover:text-brand-600 disabled:opacity-50"
      >
        Request to join
      </button>
    )
  }
  return (
    <button
      type="button"
      disabled={busy}
      onClick={() =>
        act(async () => {
          await joinGroup(group, me)
          navigate(`/community/g/${group.id}`)
        })
      }
      className="rounded-full bg-brand-600 px-4 py-2 text-xs font-semibold text-cream-50 shadow-glow transition hover:bg-brand-700 disabled:opacity-50"
    >
      Join group
    </button>
  )
}

export function DiscoverView() {
  const { me, openCreate } = useCommunity()
  const [groups, setGroups] = useState(null)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const navigate = useNavigate()

  useEffect(() => subscribeAllGroups(setGroups), [])

  const filtered = useMemo(() => {
    if (!groups) return []
    const q = search.trim().toLowerCase()
    return groups.filter(
      (g) =>
        (category === 'All' || g.category === category) &&
        (!q || g.nameLower?.includes(q) || g.description?.toLowerCase().includes(q)),
    )
  }, [groups, search, category])

  return (
    <div className="min-h-0 flex-1 overflow-y-auto" data-lenis-prevent>
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-brand-600">Discover</p>
            <h1 className="mt-1.5 font-display text-3xl font-semibold text-ever-900">
              Find your community
            </h1>
            <p className="mt-1.5 text-ink-600">
              Join nonprofit groups across DFW — or create a page for your own organization.
            </p>
          </div>
          <button
            type="button"
            onClick={openCreate}
            className="flex items-center gap-2 rounded-full bg-ever-900 px-5 py-2.5 text-sm font-semibold text-cream-50 transition hover:bg-ever-800"
          >
            <Plus className="h-4 w-4" /> Create a group
          </button>
        </div>

        {/* Search + filters */}
        <div className="mt-6 flex flex-col gap-3">
          <div className="relative max-w-md">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search groups…"
              className="w-full rounded-2xl border border-ever-900/12 bg-cream-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-brand-600 focus:ring-4 focus:ring-brand-600/12"
            />
          </div>
          <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
            {['All', ...GROUP_CATEGORIES].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                  category === c
                    ? 'bg-brand-600 text-cream-50 shadow-glow'
                    : 'border border-ever-900/12 bg-cream-50 text-ink-600 hover:border-brand-600/40 hover:text-brand-600'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {groups === null ? (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 animate-pulse rounded-3xl bg-ever-900/6" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-dashed border-ever-900/15 px-6 py-14 text-center">
            <p className="font-display text-xl font-semibold text-ever-900">
              {groups.length === 0 ? 'No groups yet — be the first!' : 'Nothing matches that search.'}
            </p>
            <p className="mx-auto mt-2 max-w-sm text-sm text-ink-600">
              {groups.length === 0
                ? 'Create the first group and give your nonprofit a home here.'
                : 'Try a different name or category.'}
            </p>
            {groups.length === 0 && (
              <button
                type="button"
                onClick={openCreate}
                className="mt-5 rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-cream-50 shadow-glow transition hover:bg-brand-700"
              >
                Create the first group
              </button>
            )}
          </div>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((g) => (
              <article
                key={g.id}
                className="flex flex-col rounded-3xl border border-ever-900/8 bg-cream-50 p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-soft"
              >
                <div className="flex items-start justify-between gap-3">
                  <span
                    style={{ backgroundColor: userColor(g.name) }}
                    className="flex h-12 w-12 items-center justify-center rounded-2xl font-display text-sm font-bold text-cream-50"
                  >
                    {initials(g.name)}
                  </span>
                  <span
                    className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wide ${
                      g.privacy === 'private'
                        ? 'bg-marigold-100 text-marigold-600'
                        : 'bg-ever-100 text-ever-700'
                    }`}
                  >
                    {g.privacy === 'private' ? <Lock className="h-3 w-3" /> : <Globe2 className="h-3 w-3" />}
                    {g.privacy}
                  </span>
                </div>
                <h3 className="mt-3 font-display text-lg font-semibold leading-snug text-ever-900">{g.name}</h3>
                <p className="mt-1 line-clamp-2 flex-1 text-sm leading-relaxed text-ink-600">{g.description}</p>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <span className="flex items-center gap-1.5 text-xs text-ink-400">
                    <Users className="h-3.5 w-3.5" />
                    {g.memberCount ?? g.memberIds?.length ?? 0}
                    <span className="text-ink-400/60">·</span>
                    {g.category}
                  </span>
                  <JoinButton group={g} me={me} navigate={navigate} />
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
