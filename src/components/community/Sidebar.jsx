import { NavLink } from 'react-router-dom'
import { Compass, PenSquare, Plus, UsersRound } from 'lucide-react'
import { useCommunity } from '../../pages/Community'
import { Avatar } from './Avatar'
import { compactTime } from '../../lib/time'
import { initials, userColor } from '../../lib/colors'

function GroupAvatar({ name, size = 'h-11 w-11 text-xs' }) {
  return (
    <span
      aria-hidden="true"
      style={{ backgroundColor: userColor(name) }}
      className={`flex ${size} shrink-0 select-none items-center justify-center rounded-2xl font-display font-bold text-cream-50`}
    >
      {initials(name)}
    </span>
  )
}

function Row({ to, avatar, title, subtitle, stamp, badge }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-2xl px-3 py-2.5 transition ${
          isActive ? 'bg-brand-50 ring-1 ring-brand-600/15' : 'hover:bg-ever-900/4'
        }`
      }
    >
      {avatar}
      <span className="min-w-0 flex-1">
        <span className="flex items-baseline justify-between gap-2">
          <span className="truncate font-semibold text-ever-900">{title}</span>
          {stamp && <span className="shrink-0 text-[0.68rem] text-ink-400">{stamp}</span>}
        </span>
        <span className="mt-0.5 flex items-center justify-between gap-2">
          <span className="truncate text-[0.8rem] text-ink-600">{subtitle}</span>
          {badge}
        </span>
      </span>
    </NavLink>
  )
}

export function Sidebar({ className = '' }) {
  const { me, myGroups, myDms, openCreate, openNewDm } = useCommunity()

  return (
    <aside className={`min-h-0 flex-col border-r border-ever-900/8 bg-cream-50/60 ${className}`}>
      {/* Actions */}
      <div className="flex gap-2 px-4 pb-2 pt-4">
        <NavLink
          to="/community/discover"
          className={({ isActive }) =>
            `flex flex-1 items-center justify-center gap-2 rounded-2xl border py-2.5 text-sm font-semibold transition ${
              isActive
                ? 'border-brand-600/25 bg-brand-50 text-brand-700'
                : 'border-ever-900/10 bg-cream-50 text-ink-900 hover:border-ever-900/25'
            }`
          }
        >
          <Compass className="h-4 w-4" /> Discover
        </NavLink>
        <button
          type="button"
          onClick={openCreate}
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-ever-900 py-2.5 text-sm font-semibold text-cream-50 transition hover:bg-ever-800"
        >
          <Plus className="h-4 w-4" /> New group
        </button>
      </div>

      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-3 pb-6" data-lenis-prevent>
        {/* Groups */}
        <p className="px-3 pb-1 pt-4 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-ink-400">
          My groups
        </p>
        {myGroups.length === 0 && (
          <p className="rounded-2xl border border-dashed border-ever-900/15 px-4 py-5 text-center text-sm text-ink-400">
            You haven't joined any groups yet.
            <br />
            <button type="button" onClick={openCreate} className="mt-1 font-semibold text-brand-600 hover:text-brand-700">
              Create one
            </button>{' '}
            or explore Discover.
          </p>
        )}
        {myGroups.map((g) => (
          <Row
            key={g.id}
            to={`/community/g/${g.id}`}
            avatar={<GroupAvatar name={g.name} />}
            title={g.name}
            stamp={compactTime(g.lastMessage?.at)}
            subtitle={
              g.lastMessage
                ? `${g.lastMessage.senderName?.split(' ')[0]}: ${g.lastMessage.text}`
                : 'No messages yet — say hello!'
            }
            badge={
              (g.pendingIds?.length ?? 0) > 0 && g.admins?.includes(me.id) ? (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-600 px-1.5 text-[0.65rem] font-bold text-cream-50">
                  {g.pendingIds.length}
                </span>
              ) : null
            }
          />
        ))}

        {/* DMs */}
        <div className="flex items-center justify-between px-3 pb-1 pt-6">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-ink-400">Direct messages</p>
          <button
            type="button"
            onClick={openNewDm}
            aria-label="New direct message"
            className="rounded-lg p-1.5 text-ink-400 transition hover:bg-ever-900/5 hover:text-brand-600"
          >
            <PenSquare className="h-4 w-4" />
          </button>
        </div>
        {myDms.length === 0 && (
          <p className="rounded-2xl border border-dashed border-ever-900/15 px-4 py-5 text-center text-sm text-ink-400">
            No conversations yet.
            <br />
            <button type="button" onClick={openNewDm} className="mt-1 font-semibold text-brand-600 hover:text-brand-700">
              Start a message
            </button>
          </p>
        )}
        {myDms.map((dm) => {
          const otherId = dm.participants.find((p) => p !== me.id) ?? me.id
          const other = dm.profiles?.[otherId] ?? { displayName: 'Member' }
          return (
            <Row
              key={dm.id}
              to={`/community/dm/${dm.id}`}
              avatar={<Avatar name={other.displayName} uid={otherId} color={other.color} size="lg" />}
              title={other.displayName}
              stamp={compactTime(dm.updatedAt)}
              subtitle={
                dm.lastMessage
                  ? `${dm.lastMessage.senderName === me.displayName ? 'You' : dm.lastMessage.senderName?.split(' ')[0]}: ${dm.lastMessage.text}`
                  : 'Say hello 👋'
              }
            />
          )
        })}

        {/* Hint */}
        <div className="mt-8 rounded-2xl bg-ever-900 p-4 text-cream-200/85">
          <UsersRound className="h-5 w-5 text-marigold-400" />
          <p className="mt-2 text-[0.8rem] leading-relaxed">
            Groups are home bases for nonprofits — create a page for your organization, welcome
            members, and keep the conversation going.
          </p>
        </div>
      </div>
    </aside>
  )
}
