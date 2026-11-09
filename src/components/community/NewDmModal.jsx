import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2, Search } from 'lucide-react'
import { openDm, searchUsers } from '../../lib/db'
import { Modal, useCommunity } from '../../pages/Community'
import { Avatar } from './Avatar'

export function NewDmModal({ onClose }) {
  const { me } = useCommunity()
  const [term, setTerm] = useState('')
  const [results, setResults] = useState(null)
  const [busyId, setBusyId] = useState(null)
  const navigate = useNavigate()

  // Debounced people search
  useEffect(() => {
    let cancelled = false
    const t = setTimeout(async () => {
      const users = await searchUsers(term, me.id)
      if (!cancelled) setResults(users)
    }, 250)
    return () => {
      cancelled = true
      clearTimeout(t)
    }
  }, [term, me.id])

  async function start(user) {
    setBusyId(user.id)
    try {
      const dmId = await openDm(me, user)
      onClose()
      navigate(`/community/dm/${dmId}`)
    } finally {
      setBusyId(null)
    }
  }

  return (
    <Modal title="New message" onClose={onClose}>
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
        <input
          autoFocus
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Search people by name…"
          className="w-full rounded-2xl border border-ever-900/12 bg-cream-100/60 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-brand-600 focus:bg-cream-50 focus:ring-4 focus:ring-brand-600/12"
        />
      </div>

      <div className="mt-4 min-h-[200px]">
        {results === null ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-6 w-6 animate-spin text-brand-600" />
          </div>
        ) : results.length === 0 ? (
          <p className="py-10 text-center text-sm text-ink-400">
            {term ? 'No one found by that name.' : 'No other members yet — invite your community!'}
          </p>
        ) : (
          <ul className="space-y-1">
            {results.map((u) => (
              <li key={u.id}>
                <button
                  type="button"
                  onClick={() => start(u)}
                  disabled={busyId !== null}
                  className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition hover:bg-ever-900/4 disabled:opacity-60"
                >
                  <Avatar name={u.displayName} uid={u.id} color={u.color} size="md" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-ever-900">{u.displayName}</span>
                    <span className="block truncate text-xs text-ink-400">{u.email}</span>
                  </span>
                  {busyId === u.id && <Loader2 className="h-4 w-4 animate-spin text-brand-600" />}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Modal>
  )
}
