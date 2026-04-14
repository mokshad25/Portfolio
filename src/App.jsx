import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useTheme } from './context/ThemeContext'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Work from './components/WorkSection'
import Certifications from './components/Certifications'
import Connect from './components/Connect'

// Register ScrollTrigger once at module level — safe to call multiple times.
// Must happen before any component uses ScrollTrigger.
gsap.registerPlugin(ScrollTrigger)

// ─────────────────────────────────────────────────────────────────────────────
//  LENIS SMOOTH SCROLL CONFIGURATION
// ─────────────────────────────────────────────────────────────────────────────
//
//  lerp            → interpolation strength (0.01 = buttery slow, 0.15 = snappy)
//                    Recommended sweet spot: 0.07–0.10
//                    HOW TO ADJUST SMOOTHNESS: change this single value.
//
//  wheelMultiplier → how far one wheel tick scrolls (1.0 = native feel)
//
//  touchMultiplier → how far one touch-swipe scrolls on mobile
//
//  TO DISABLE LENIS ENTIRELY: delete the useEffect block below and
//  remove the Lenis import — the page reverts to native browser scroll.
// ─────────────────────────────────────────────────────────────────────────────
const LENIS_CONFIG = {
  lerp:             0.08,   // smoothness ← main knob to tweak
  wheelMultiplier:  1.0,
  touchMultiplier:  1.0,    // keep native-speed touch on mobile
  smoothWheel:      true,
}

export default function App() {
  const { bg, text } = useTheme()

  // ── Lenis + GSAP ticker initialisation ───────────────────────────────────
  //
  // WHY GSAP TICKER INSTEAD OF requestAnimationFrame?
  //   GSAP ScrollTrigger reads scroll position on every tick of gsap.ticker.
  //   If Lenis runs on a separate RAF loop, scroll updates can land a frame
  //   late relative to ScrollTrigger, causing stuttering in the pinned Work
  //   section. Running both through the same ticker eliminates that race.
  //
  // HOW IT WORKS:
  //   1. gsap.ticker calls lenis.raf() — Lenis updates window.scrollY
  //   2. lenis emits 'scroll' → ScrollTrigger.update reads the new position
  //   3. All animations fire in the same frame, perfectly in sync
  //
  useEffect(() => {
    const lenis = new Lenis(LENIS_CONFIG)

    // Step 1: Lenis scroll events tell ScrollTrigger to re-evaluate positions
    lenis.on('scroll', ScrollTrigger.update)

    // Step 2: GSAP ticker drives Lenis (replaces manual requestAnimationFrame)
    //   time is in seconds; lenis.raf() expects milliseconds
    const lenisRaf = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(lenisRaf)

    // Step 3: Disable GSAP's built-in lag compensation — Lenis handles smoothing
    gsap.ticker.lagSmoothing(0)

    // Cleanup on unmount / hot-reload
    return () => {
      lenis.destroy()
      gsap.ticker.remove(lenisRaf)
    }
  }, [])

  return (
    <div className={`${bg} ${text} min-h-screen font-body transition-colors duration-500`}>
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <Work />
      <Certifications />
      <Connect />
    </div>
  )
}
