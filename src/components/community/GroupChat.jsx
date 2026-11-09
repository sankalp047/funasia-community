import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft,
  Check,
  Globe2,
  Info,
  Loader2,
  Lock,
  MessageCircle,
  Pencil,
  Shield,
  Trash2,
  Users,
  X,
} from 'lucide-react'
import {
  approveRequest,
  cancelRequest,
  deleteGroup,
  denyRequest,
  joinGroup,
  leaveGroup,
  openDm,
  requestToJoin,
  sendGroupMessage,
  subscribeGroup,
  subscribeGroupMessages,
  subscribeMembers,
  subscribeRequests,
  updateGroup,
} from '../../lib/db'
import { useCommunity } from '../../pages/Community'
import { Avatar } from './Avatar'
import { MessageList } from './MessageList'
import { Composer } from './Composer'
import { initials, userColor } from '../../lib/colors'

// ---------------------------------------------------------------------------

function GroupBadge({ group, size = 'h-10 w-10 text-xs' }) {
  return (
    <span
      style={{ backgroundColor: userColor(group.name) }}
      className={`flex ${size} shrink-0 items-center justify-center rounded-2xl font-display font-bold text-cream-50`}
    >
      {initials(group.name)}
    </span>
  )
}

/** Full-page preview shown to visitors who aren't members yet. */
function GroupPreview({ group, me, navigate }) {
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

  return (
    <div className="flex min-h-0 flex-1 items-center justify-center overflow-y-auto p-6" data-lenis-prevent>
      <div className="w-full max-w-lg rounded-[2rem] border border-ever-900/8 bg-cream-50 p-8 text-center shadow-card">
        <GroupBadge group={group} size="mx-auto h-20 w-20 text-2xl" />
        <h1 className="mt-5 font-display text-3xl font-semibold text-ever-900">{group.name}</h1>
        <p className="mt-2 flex items-center justify-center gap-2 text-sm text-ink-400">
          {group.privacy === 'private' ? <Lock className="h-3.5 w-3.5" /> : <Globe2 className="h-3.5 w-3.5" />}
          {group.privacy === 'private' ? 'Private group' : 'Public group'}
          <span>·</span>
          <Users className="h-3.5 w-3.5" />
          {group.memberCount ?? group.memberIds?.length} members
          <span>·</span>
          {group.category}
        </p>
        <p className="mt-5 leading-relaxed text-ink-600">{group.description}</p>

        <div className="mt-8">
          {isPending ? (
            <div className="space-y-3">
              <p className="rounded-2xl border border-marigold-500/30 bg-marigold-100 px-4 py-3 text-sm text-marigold-600">
                Your request is pending — an admin will review it.
              </p>
              <button
                type="button"
                disabled={busy}
                onClick={() => act(() => cancelRequest(group, me.id))}
                className="text-sm font-semibold text-ink-400 transition hover:text-brand-600"
              >
                Cancel request
              </button>
            </div>
          ) : group.privacy === 'private' ? (
            <button
              type="button"
              disabled={busy}
              onClick={() => act(() => requestToJoin(group, me))}
              className="w-full rounded-2xl bg-brand-600 py-3.5 text-sm font-semibold text-cream-50 shadow-glow transition hover:bg-brand-700 disabled:opacity-50"
            >
              {busy ? 'Sending…' : 'Request to join'}
            </button>
          ) : (
            <button
              type="button"
              disabled={busy}
              onClick={() => act(() => joinGroup(group, me))}
              className="w-full rounded-2xl bg-brand-600 py-3.5 text-sm font-semibold text-cream-50 shadow-glow transition hover:bg-brand-700 disabled:opacity-50"
            >
              {busy ? 'Joining…' : 'Join this group'}
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={() => navigate('/community/discover')}
          className="mt-4 text-sm text-ink-400 transition hover:text-ever-900"
        >
          ← Back to Discover
        </button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------

function InfoPanel({ group, me, onClose }) {
  const [members, setMembers] = useState([])
  const [requests, setRequests] = useState([])
  const [editing, setEditing] = useState(false)
  const [desc, setDesc] = useState(group.description)
  const [confirming, setConfirming] = useState(null) // 'leave' | 'delete'
  const navigate = useNavigate()

  const isAdmin = group.admins?.includes(me.id)
  const isOwner = group.ownerId === me.id

  useEffect(() => subscribeMembers(group.id, setMembers), [group.id])
  useEffect(() => (isAdmin ? subscribeRequests(group.id, setRequests) : undefined), [group.id, isAdmin])

  async function messageMember(member) {
    const dmId = await openDm(me, { id: member.id, displayName: member.displayName, color: member.color })
    navigate(`/community/dm/${dmId}`)
  }

  return (
    <motion.aside
      initial={{ x: 60, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 60, opacity: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      data-lenis-prevent
      className="absolute inset-y-0 right-0 z-30 w-full overflow-y-auto border-l border-ever-900/8 bg-cream-50 sm:w-96 lg:static lg:shrink-0"
    >
      <div className="flex items-center justify-between border-b border-ever-900/8 px-5 py-4">
        <h2 className="font-display text-lg font-semibold text-ever-900">Group info</h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close info"
          className="rounded-xl p-2 text-ink-400 transition hover:bg-ever-900/5 hover:text-ink-900"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-6 px-5 py-5">
        {/* About */}
        <section>
          <div className="flex items-center justify-between">
            <h3 className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-ink-400">About</h3>
            {isAdmin && !editing && (
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700"
              >
                <Pencil className="h-3 w-3" /> Edit
              </button>
            )}
          </div>
          {editing ? (
            <div className="mt-2 space-y-2">
              <textarea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                rows={4}
                maxLength={400}
                className="w-full rounded-2xl border border-ever-900/12 bg-cream-100/60 px-3.5 py-2.5 text-sm outline-none transition focus:border-brand-600 focus:ring-4 focus:ring-brand-600/12"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={async () => {
                    await updateGroup(group.id, { description: desc.trim() })
                    setEditing(false)
                  }}
                  className="rounded-full bg-ever-900 px-4 py-1.5 text-xs font-semibold text-cream-50"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDesc(group.description)
                    setEditing(false)
                  }}
                  className="rounded-full border border-ever-900/15 px-4 py-1.5 text-xs font-semibold text-ink-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="mt-2 text-sm leading-relaxed text-ink-600">{group.description}</p>
          )}
          <div className="mt-3 flex flex-wrap gap-2 text-[0.68rem] font-semibold uppercase tracking-wide">
            <span className="rounded-full bg-ever-100 px-2.5 py-1 text-ever-700">{group.category}</span>
            <span
              className={`flex items-center gap-1 rounded-full px-2.5 py-1 ${
                group.privacy === 'private' ? 'bg-marigold-100 text-marigold-600' : 'bg-ever-100 text-ever-700'
              }`}
            >
              {group.privacy === 'private' ? <Lock className="h-3 w-3" /> : <Globe2 className="h-3 w-3" />}
              {group.privacy}
            </span>
          </div>
          {isAdmin && (
            <button
              type="button"
              onClick={() => updateGroup(group.id, { privacy: group.privacy === 'private' ? 'public' : 'private' })}
              className="mt-3 text-xs font-semibold text-brand-600 hover:text-brand-700"
            >
              Switch to {group.privacy === 'private' ? 'public' : 'private'}
            </button>
          )}
        </section>

        {/* Join requests (admins) */}
        {isAdmin && requests.length > 0 && (
          <section>
            <h3 className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-ink-400">
              Join requests · {requests.length}
            </h3>
            <ul className="mt-2 space-y-2">
              {requests.map((r) => (
                <li key={r.id} className="flex items-center gap-3 rounded-2xl border border-marigold-500/25 bg-marigold-100/50 p-3">
                  <Avatar name={r.displayName} uid={r.id} color={r.color} size="md" />
                  <span className="min-w-0 flex-1 truncate text-sm font-semibold text-ever-900">{r.displayName}</span>
                  <button
                    type="button"
                    onClick={() => approveRequest(group, r)}
                    aria-label={`Approve ${r.displayName}`}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-ever-700 text-cream-50 transition hover:bg-ever-600"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => denyRequest(group, r.id)}
                    aria-label={`Deny ${r.displayName}`}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-ever-900/15 text-ink-400 transition hover:border-brand-600 hover:text-brand-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Members */}
        <section>
          <h3 className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-ink-400">
            Members · {members.length}
          </h3>
          <ul className="mt-2 space-y-1">
            {members.map((m) => (
              <li key={m.id} className="group flex items-center gap-3 rounded-2xl px-2 py-2 transition hover:bg-ever-900/4">
                <Avatar name={m.displayName} uid={m.id} color={m.color} size="md" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-ever-900">
                    {m.displayName}
                    {m.id === me.id && <span className="text-ink-400"> (you)</span>}
                  </span>
                  {m.role === 'admin' && (
                    <span className="flex items-center gap-1 text-[0.65rem] font-semibold uppercase tracking-wide text-marigold-600">
                      <Shield className="h-3 w-3" /> Admin
                    </span>
                  )}
                </span>
                {m.id !== me.id && (
                  <button
                    type="button"
                    onClick={() => messageMember(m)}
                    aria-label={`Message ${m.displayName}`}
                    title="Send a direct message"
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-ever-900/12 text-ink-400 opacity-0 transition group-hover:opacity-100 hover:border-brand-600 hover:text-brand-600"
                  >
                    <MessageCircle className="h-4 w-4" />
                  </button>
                )}
              </li>
            ))}
          </ul>
        </section>

        {/* Danger zone */}
        <section className="border-t border-ever-900/8 pt-4">
          {confirming ? (
            <div className="rounded-2xl border border-brand-600/25 bg-brand-50 p-4">
              <p className="text-sm font-semibold text-ever-900">
                {confirming === 'delete'
                  ? `Delete “${group.name}” for everyone?`
                  : `Leave “${group.name}”?`}
              </p>
              <p className="mt-1 text-xs text-ink-600">This can't be undone.</p>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={async () => {
                    if (confirming === 'delete') await deleteGroup(group.id)
                    else await leaveGroup(group, me.id)
                    navigate('/community')
                  }}
                  className="rounded-full bg-brand-600 px-4 py-2 text-xs font-semibold text-cream-50"
                >
                  Yes, {confirming}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirming(null)}
                  className="rounded-full border border-ever-900/15 px-4 py-2 text-xs font-semibold text-ink-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : isOwner ? (
            <button
              type="button"
              onClick={() => setConfirming('delete')}
              className="flex items-center gap-2 text-sm font-semibold text-brand-600 transition hover:text-brand-700"
            >
              <Trash2 className="h-4 w-4" /> Delete group
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setConfirming('leave')}
              className="flex items-center gap-2 text-sm font-semibold text-brand-600 transition hover:text-brand-700"
            >
              <ArrowLeft className="h-4 w-4" /> Leave group
            </button>
          )}
        </section>
      </div>
    </motion.aside>
  )
}

// ---------------------------------------------------------------------------

export function GroupChat() {
  const { groupId } = useParams()
  const { me } = useCommunity()
  const [group, setGroup] = useState(undefined) // undefined = loading, null = missing
  const [messages, setMessages] = useState([])
  const [showInfo, setShowInfo] = useState(false)
  const navigate = useNavigate()

  useEffect(() => subscribeGroup(groupId, setGroup), [groupId])

  const isMember = group?.memberIds?.includes(me.id)

  useEffect(() => {
    if (!isMember) return
    return subscribeGroupMessages(groupId, setMessages)
  }, [groupId, isMember])

  if (group === undefined) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-brand-600" />
      </div>
    )
  }

  if (group === null) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
        <p className="font-display text-xl font-semibold text-ever-900">This group no longer exists.</p>
        <button
          type="button"
          onClick={() => navigate('/community/discover')}
          className="rounded-full bg-ever-900 px-5 py-2.5 text-sm font-semibold text-cream-50"
        >
          Back to Discover
        </button>
      </div>
    )
  }

  if (!isMember) return <GroupPreview group={group} me={me} navigate={navigate} />

  return (
    <div className="relative flex min-h-0 flex-1">
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Header */}
        <header className="flex shrink-0 items-center gap-3 border-b border-ever-900/8 bg-cream-50/70 px-4 py-3 backdrop-blur">
          <button
            type="button"
            onClick={() => navigate('/community')}
            aria-label="Back"
            className="rounded-xl p-2 text-ink-400 transition hover:bg-ever-900/5 hover:text-ink-900 md:hidden"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <GroupBadge group={group} />
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-display text-lg font-semibold leading-tight text-ever-900">{group.name}</h1>
            <p className="flex items-center gap-1.5 text-xs text-ink-400">
              {group.privacy === 'private' ? <Lock className="h-3 w-3" /> : <Globe2 className="h-3 w-3" />}
              {group.memberCount ?? group.memberIds.length} members
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowInfo((s) => !s)}
            aria-label="Group info"
            className={`rounded-xl p-2 transition ${
              showInfo ? 'bg-brand-50 text-brand-600' : 'text-ink-400 hover:bg-ever-900/5 hover:text-ink-900'
            }`}
          >
            <Info className="h-5 w-5" />
          </button>
        </header>

        <MessageList
          messages={messages}
          meId={me.id}
          emptyHint={`Welcome to ${group.name} — start the conversation!`}
        />
        <Composer onSend={(text) => sendGroupMessage(group, me, text)} placeholder={`Message ${group.name}…`} />
      </div>

      <AnimatePresence>
        {showInfo && <InfoPanel key={group.id} group={group} me={me} onClose={() => setShowInfo(false)} />}
      </AnimatePresence>
    </div>
  )
}
