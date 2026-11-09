import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Globe2, Loader2, Lock } from 'lucide-react'
import { GROUP_CATEGORIES, createGroup } from '../../lib/db'
import { Modal, useCommunity } from '../../pages/Community'

const fieldClass =
  'w-full rounded-2xl border border-ever-900/12 bg-cream-100/60 px-4 py-3 text-sm text-ink-900 placeholder:text-ink-400 outline-none transition focus:border-brand-600 focus:bg-cream-50 focus:ring-4 focus:ring-brand-600/12'

export function CreateGroupModal({ onClose }) {
  const { me } = useCommunity()
  const [privacy, setPrivacy] = useState('public')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    setBusy(true)
    setError('')
    try {
      const id = await createGroup(
        {
          name: form.get('name').trim(),
          description: form.get('description').trim(),
          category: form.get('category'),
          privacy,
        },
        me,
      )
      onClose()
      navigate(`/community/g/${id}`)
    } catch {
      setError('Could not create the group — please try again.')
      setBusy(false)
    }
  }

  return (
    <Modal title="Create a group" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink-400">
            Group name
          </label>
          <input required name="name" maxLength={60} placeholder="e.g. Sewa DFW Volunteers" className={fieldClass} />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink-400">
            Category
          </label>
          <select name="category" defaultValue={GROUP_CATEGORIES[0]} className={fieldClass}>
            {GROUP_CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink-400">
            About this group
          </label>
          <textarea
            required
            name="description"
            rows={3}
            maxLength={400}
            placeholder="What is this group about? Who should join?"
            className={fieldClass}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink-400">
            Privacy
          </label>
          <div className="grid gap-2.5 sm:grid-cols-2">
            {[
              {
                key: 'public',
                icon: Globe2,
                title: 'Public',
                desc: 'Anyone can find and join instantly.',
              },
              {
                key: 'private',
                icon: Lock,
                title: 'Private',
                desc: 'People must request — admins approve.',
              },
            ].map(({ key, icon: Icon, title, desc }) => (
              <button
                key={key}
                type="button"
                onClick={() => setPrivacy(key)}
                className={`rounded-2xl border p-4 text-left transition ${
                  privacy === key
                    ? 'border-brand-600 bg-brand-50 ring-4 ring-brand-600/10'
                    : 'border-ever-900/12 bg-cream-50 hover:border-ever-900/30'
                }`}
              >
                <Icon className={`h-4.5 w-4.5 ${privacy === key ? 'text-brand-600' : 'text-ink-400'}`} />
                <p className="mt-2 text-sm font-semibold text-ever-900">{title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-ink-600">{desc}</p>
              </button>
            ))}
          </div>
        </div>

        {error && (
          <p role="alert" className="rounded-xl border border-brand-600/25 bg-brand-50 px-4 py-2.5 text-sm text-brand-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-600 py-3.5 text-sm font-semibold text-cream-50 shadow-glow transition hover:bg-brand-700 disabled:opacity-60"
        >
          {busy && <Loader2 className="h-4 w-4 animate-spin" />}
          Create group
        </button>
      </form>
    </Modal>
  )
}
