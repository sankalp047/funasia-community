import { ArrowDown } from 'lucide-react'

/** Rotating circular-text badge that doubles as a scroll cue. */
export function CircleBadge({ href = '#mission', text = 'FUNASIA OUTREACH • CONNECTING COMMUNITIES • ' }) {
  return (
    <a
      href={href}
      aria-label="Scroll to next section"
      className="group relative block h-28 w-28 text-cream-50/80 transition-colors hover:text-marigold-300"
    >
      <svg viewBox="0 0 100 100" className="h-full w-full animate-spin-slow">
        <defs>
          <path id="badge-circle" d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" />
        </defs>
        <text className="fill-current text-[10.5px] font-semibold tracking-[0.24em]">
          <textPath href="#badge-circle">{text}</textPath>
        </text>
      </svg>
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-11 w-11 items-center justify-center rounded-full border border-cream-50/25 bg-cream-50/10 backdrop-blur-sm transition-transform duration-500 group-hover:translate-y-1 group-hover:border-marigold-300/50">
          <ArrowDown className="h-4 w-4" />
        </span>
      </span>
    </a>
  )
}
