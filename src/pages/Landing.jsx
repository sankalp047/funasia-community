import { useEffect, useLayoutEffect, useState } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { Navbar } from '../components/Navbar'
import { Hero } from '../components/Hero'
import { Mission } from '../components/Mission'
import { Stats } from '../components/Stats'
import { Leaders } from '../components/Leaders'
import { Partners } from '../components/Partners'
import { Gallery } from '../components/Gallery'
import { FeaturedStory } from '../components/FeaturedStory'
import { Testimonials } from '../components/Testimonials'
import { Faq } from '../components/Faq'
import { Contact } from '../components/Contact'
import { Footer } from '../components/Footer'
import { Preloader } from '../components/ui/Preloader'
import { SmoothScroll } from '../components/ui/SmoothScroll'
import { Ribbon } from '../components/ui/Ribbon'

const INTRO_KEY = 'fa-intro-seen'

/** The intro curtain plays once per session, desktop only — phones get content immediately. */
function introAlreadySeen() {
  try {
    if (typeof window === 'undefined') return true
    if (window.matchMedia('(max-width: 1023px), (prefers-reduced-motion: reduce)').matches) return true
    return sessionStorage.getItem(INTRO_KEY) === '1'
  } catch {
    return true
  }
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 })
  return (
    <motion.div
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[90] h-[3px] origin-left bg-gradient-to-r from-brand-600 via-brand-500 to-marigold-400"
    />
  )
}

export default function Landing() {
  const [showIntro, setShowIntro] = useState(() => !introAlreadySeen())
  // Frozen at first mount so the hero's entrance timing never shifts mid-flight
  const [introDelay] = useState(() => (introAlreadySeen() ? 0 : 1.15))

  // index.html hides the pre-rendered page while a first-visit intro is due
  // (so it doesn't flash before the curtain); React's curtain takes over here.
  useLayoutEffect(() => {
    document.documentElement.classList.remove('intro-pending')
  }, [])

  // Curtain holds ~1.5s, then lifts
  useEffect(() => {
    if (!showIntro) return
    const t = setTimeout(() => {
      setShowIntro(false)
      try {
        sessionStorage.setItem(INTRO_KEY, '1')
      } catch {
        /* private browsing — fine */
      }
    }, 1500)
    return () => clearTimeout(t)
  }, [showIntro])

  return (
    <>
      <SmoothScroll />
      <Preloader show={showIntro} />
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero introDelay={introDelay} />
        <Ribbon
          items={[
            'Philanthropy',
            'Women Empowerment',
            'Community Engagement',
            'Culture & Celebration',
            'Sewa · Selfless Service',
          ]}
        />
        <Mission />
        <Stats />
        <Leaders />
        <Partners />
        <Gallery />
        <FeaturedStory />
        <Testimonials />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
