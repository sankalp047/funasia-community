// Deterministic avatar colors drawn from the brand palette.
const PALETTE = [
  '#e02d52', // brand crimson
  '#c11f42',
  '#f0a32b', // marigold
  '#d98a15',
  '#145446', // evergreen
  '#1c6b58',
  '#0e4237',
  '#9c1a36',
]

export function userColor(seed = '') {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0
  return PALETTE[h % PALETTE.length]
}

export function initials(name = '?') {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('') || '?'
}
