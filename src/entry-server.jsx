// Build-time renderer: turns the landing page into plain HTML (see
// scripts/prerender.mjs) so search engines and AI crawlers — most of which
// don't run JavaScript — can read every word, and phones paint instantly.
import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import Landing from './pages/Landing'

export function render() {
  return renderToString(
    <StrictMode>
      <Landing />
    </StrictMode>,
  )
}

// Content for structured data, llms.txt and the sitemap — one source of truth.
export {
  site,
  activeSocials,
  mission,
  pillars,
  stats,
  ceo,
  outreachLead,
  featuredStory,
  testimonials,
  gallery,
  heroSlides,
  faqs,
} from './data/content'
export { allPartners } from './data/partners'
