// Google Analytics 4, loaded only after the page has finished loading and the
// browser is idle — so it never competes with images or scripts on phones.
// Uses the measurement ID of the Firebase web app (VITE_FIREBASE_MEASUREMENT_ID).

export function loadAnalytics() {
  const id = import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
  if (!id || !import.meta.env.PROD || typeof window === 'undefined') return

  const start = () => {
    window.dataLayer = window.dataLayer || []
    window.gtag = function gtag() {
      window.dataLayer.push(arguments) // eslint-disable-line prefer-rest-params
    }
    window.gtag('js', new Date())
    window.gtag('config', id)
    const s = document.createElement('script')
    s.async = true
    s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`
    document.head.appendChild(s)
  }

  const whenIdle = () =>
    'requestIdleCallback' in window ? window.requestIdleCallback(start, { timeout: 4000 }) : setTimeout(start, 2500)

  if (document.readyState === 'complete') whenIdle()
  else window.addEventListener('load', whenIdle, { once: true })
}
