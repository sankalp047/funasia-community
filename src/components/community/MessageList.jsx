import { useEffect, useRef } from 'react'
import { Avatar } from './Avatar'
import { clockTime, dayKey, dayLabel } from '../../lib/time'

/** Group consecutive messages by the same sender into visual clusters. */
function clusterMessages(messages) {
  const days = []
  for (const msg of messages) {
    const key = dayKey(msg.createdAt)
    let day = days[days.length - 1]
    if (!day || day.key !== key) {
      day = { key, label: dayLabel(msg.createdAt), clusters: [] }
      days.push(day)
    }
    let cluster = day.clusters[day.clusters.length - 1]
    if (!cluster || cluster.senderId !== msg.senderId) {
      cluster = { senderId: msg.senderId, senderName: msg.senderName, senderColor: msg.senderColor, items: [] }
      day.clusters.push(cluster)
    }
    cluster.items.push(msg)
  }
  return days
}

export function MessageList({ messages, meId, emptyHint }) {
  const bottomRef = useRef(null)
  const containerRef = useRef(null)
  const firstRender = useRef(true)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 220
    if (firstRender.current || nearBottom) {
      bottomRef.current?.scrollIntoView({ behavior: firstRender.current ? 'instant' : 'smooth' })
    }
    if (messages.length) firstRender.current = false
  }, [messages])

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="max-w-xs text-center">
          <p className="font-display text-4xl">👋</p>
          <p className="mt-3 font-display text-lg font-semibold text-ever-900">No messages yet</p>
          <p className="mt-1 text-sm text-ink-600">{emptyHint ?? 'Be the first to say hello!'}</p>
        </div>
      </div>
    )
  }

  return (
    <div ref={containerRef} data-lenis-prevent className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6">
      {clusterMessages(messages).map((day) => (
        <div key={day.key}>
          <div className="my-5 flex items-center gap-4">
            <span className="h-px flex-1 bg-ever-900/8" />
            <span className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-ink-400">
              {day.label}
            </span>
            <span className="h-px flex-1 bg-ever-900/8" />
          </div>
          {day.clusters.map((cluster, ci) => {
            const mine = cluster.senderId === meId
            return (
              <div key={ci} className={`mb-4 flex gap-2.5 ${mine ? 'flex-row-reverse' : ''}`}>
                {!mine && (
                  <Avatar name={cluster.senderName} uid={cluster.senderId} color={cluster.senderColor} size="sm" className="mt-auto" />
                )}
                <div className={`flex max-w-[78%] flex-col gap-1 sm:max-w-[65%] ${mine ? 'items-end' : 'items-start'}`}>
                  {!mine && (
                    <p className="px-1 text-[0.7rem] font-semibold" style={{ color: cluster.senderColor }}>
                      {cluster.senderName}
                    </p>
                  )}
                  {cluster.items.map((msg, mi) => {
                    const first = mi === 0
                    const last = mi === cluster.items.length - 1
                    const corners = mine
                      ? `${first ? 'rounded-tr-3xl' : 'rounded-tr-lg'} ${last ? 'rounded-br-md' : 'rounded-br-lg'} rounded-l-3xl`
                      : `${first ? 'rounded-tl-3xl' : 'rounded-tl-lg'} ${last ? 'rounded-bl-md' : 'rounded-bl-lg'} rounded-r-3xl`
                    return (
                      <div
                        key={msg.id}
                        title={clockTime(msg.createdAt)}
                        className={`group relative px-4 py-2.5 text-[0.92rem] leading-relaxed whitespace-pre-wrap break-words ${corners} ${
                          mine
                            ? 'bg-brand-600 text-cream-50 shadow-[0_8px_24px_-12px_rgb(224_45_82/0.5)]'
                            : 'border border-ever-900/8 bg-cream-50 text-ink-900 shadow-sm'
                        }`}
                      >
                        {msg.text}
                        {last && (
                          <span
                            className={`mt-1 block text-right text-[0.62rem] ${
                              mine ? 'text-cream-50/70' : 'text-ink-400'
                            }`}
                          >
                            {clockTime(msg.createdAt)}
                          </span>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  )
}
