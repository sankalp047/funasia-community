import manifest from '../data/image-manifest.json'

/**
 * Responsive image props for a /images/... source:
 *   <img {...img('/images/x.jpg', '(min-width: 1024px) 50vw, 100vw')} alt="…" />
 * Returns WebP src/srcSet plus intrinsic width/height (prevents layout shift).
 * Falls back to the original file if it hasn't been through
 * scripts/optimize-images.mjs yet.
 */
export function img(src, sizes = '100vw') {
  const entry = manifest[src]
  if (!entry) return { src }
  const { variants, w, h } = entry
  return {
    src: variants[variants.length - 1][1],
    srcSet: variants.map(([width, url]) => `${url} ${width}w`).join(', '),
    sizes,
    width: w,
    height: h,
  }
}
