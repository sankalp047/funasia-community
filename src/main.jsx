import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { loadAnalytics } from './lib/analytics'

// The landing page is pre-rendered into index.html at build time (for search
// engines, AI crawlers and a fast first paint). We render fresh on top of it
// rather than hydrating, because the live page adapts to the visitor's screen
// and session in ways a static snapshot can't.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

loadAnalytics()
