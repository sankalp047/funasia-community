import { initials, userColor } from '../../lib/colors'

/** Initials avatar with a deterministic brand color. */
export function Avatar({ name, uid, color, size = 'md', className = '' }) {
  const sizes = {
    xs: 'h-6 w-6 text-[0.55rem]',
    sm: 'h-8 w-8 text-[0.65rem]',
    md: 'h-10 w-10 text-xs',
    lg: 'h-12 w-12 text-sm',
    xl: 'h-16 w-16 text-lg',
  }
  return (
    <span
      aria-hidden="true"
      style={{ backgroundColor: color ?? userColor(uid ?? name ?? '') }}
      className={`flex shrink-0 select-none items-center justify-center rounded-full font-display font-bold tracking-wide text-cream-50 ${sizes[size]} ${className}`}
    >
      {initials(name)}
    </span>
  )
}
