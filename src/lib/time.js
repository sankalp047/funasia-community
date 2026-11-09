const DAY = 86400000

const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()

export function toDate(ts) {
  if (!ts) return null
  return typeof ts.toDate === 'function' ? ts.toDate() : new Date(ts)
}

/** "2:34 PM" */
export function clockTime(ts) {
  const d = toDate(ts)
  if (!d) return '…'
  return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}

/** "Today" / "Yesterday" / "Aug 30, 2026" — for message day dividers. */
export function dayLabel(ts) {
  const d = toDate(ts)
  if (!d) return ''
  const diff = startOfDay(new Date()) - startOfDay(d)
  if (diff === 0) return 'Today'
  if (diff === DAY) return 'Yesterday'
  return d.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })
}

export const dayKey = (ts) => {
  const d = toDate(ts)
  return d ? startOfDay(d) : 'pending'
}

/** Compact sidebar stamp: "now", "12m", "3h", "Tue", "8/12/26". */
export function compactTime(ts) {
  const d = toDate(ts)
  if (!d) return ''
  const diff = Date.now() - d.getTime()
  if (diff < 60000) return 'now'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m`
  if (diff < DAY && startOfDay(new Date()) === startOfDay(d)) return clockTime(d)
  if (diff < 7 * DAY) return d.toLocaleDateString([], { weekday: 'short' })
  return d.toLocaleDateString([], { month: 'numeric', day: 'numeric', year: '2-digit' })
}
