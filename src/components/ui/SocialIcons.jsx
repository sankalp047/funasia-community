// Brand icons (removed from lucide-react v1) drawn as minimal inline SVGs.
const base = {
  viewBox: '0 0 24 24',
  fill: 'currentColor',
  'aria-hidden': true,
}

export function FacebookIcon({ className }) {
  return (
    <svg {...base} className={className}>
      <path d="M13.4 21.5v-7.6h2.55l.38-2.96h-2.93V9.05c0-.86.24-1.44 1.47-1.44h1.57V4.96c-.27-.04-1.2-.12-2.29-.12-2.27 0-3.82 1.39-3.82 3.93v2.19H7.77v2.96h2.56v7.58h3.07z" />
    </svg>
  )
}

export function InstagramIcon({ className }) {
  return (
    <svg {...base} fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5" />
      <circle cx="12" cy="12" r="4.1" />
      <circle cx="17.2" cy="6.8" r="1.15" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function YouTubeIcon({ className }) {
  return (
    <svg {...base} className={className}>
      <path d="M21.6 7.2a2.7 2.7 0 0 0-1.9-1.9C18 4.8 12 4.8 12 4.8s-6 0-7.7.5a2.7 2.7 0 0 0-1.9 1.9C1.9 8.9 1.9 12 1.9 12s0 3.1.5 4.8a2.7 2.7 0 0 0 1.9 1.9c1.7.5 7.7.5 7.7.5s6 0 7.7-.5a2.7 2.7 0 0 0 1.9-1.9c.5-1.7.5-4.8.5-4.8s0-3.1-.5-4.8zM10 15.1V8.9l5.2 3.1L10 15.1z" />
    </svg>
  )
}

const NETWORK_ICONS = { facebook: FacebookIcon, instagram: InstagramIcon, youtube: YouTubeIcon }
const NETWORK_LABELS = { facebook: 'Facebook', instagram: 'Instagram', youtube: 'YouTube' }

/** Renders one link per configured social profile; renders nothing when none are set. */
export function SocialLinks({ items, className = '', linkClassName = '', iconClassName = 'h-4 w-4' }) {
  if (!items.length) return null
  return (
    <div className={className}>
      {items.map(({ network, url }) => {
        const Icon = NETWORK_ICONS[network]
        if (!Icon) return null
        return (
          <a
            key={network}
            href={url}
            target="_blank"
            rel="noreferrer"
            aria-label={`FunAsia Community Outreach on ${NETWORK_LABELS[network]}`}
            className={linkClassName}
          >
            <Icon className={iconClassName} />
          </a>
        )
      })}
    </div>
  )
}

export function XIcon({ className }) {
  return (
    <svg {...base} className={className}>
      <path d="M17.75 3h3.07l-6.7 7.66L22 21h-6.18l-4.84-6.33L5.44 21H2.37l7.17-8.19L2 3h6.34l4.37 5.78L17.75 3zm-1.08 16.16h1.7L7.4 4.74H5.57l11.1 14.42z" />
    </svg>
  )
}
