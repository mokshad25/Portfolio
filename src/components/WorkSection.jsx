import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useTheme } from '../context/ThemeContext'
import SectionHeader from './SectionHeader'
import ProjectCard from './ProjectCard'
import Ticker from './Ticker'

/* ─────────────────────────────────────────────────────────────────────────────
   PROJECT DATA  ←  EDIT HERE

   HOW TO ADD A PROJECT:
     1. Copy one of the objects below.
     2. Paste it at the end of the array (before the closing ] ).
     3. Fill in your values — every field is a plain string.

   FIELDS:
     title       — Project name displayed large on the card.
     description — 1–2 sentences; keep it punchy.
     tech        — Comma-separated stack, e.g. "Python, React, Docker"
     link        — Primary CTA URL (opened when card or button is clicked).
     github      — GitHub repo URL. Set to null if not applicable.
     figma       — Figma share URL. Set to null if not applicable.

   LINK PRIORITY: link → github → figma (first non-null wins).

   HOW TO REMOVE A PROJECT: delete the entire { … } block for that project.
   ─────────────────────────────────────────────────────────────────────────── */
const PROJECTS = [
  {
    title: 'AI Detector',
    description:
      'Developed a production-ready AI-generated text detection platform using a hybrid approach combining TF-IDF/statistical features and transformer models (BERT). Implemented stylometric analysis (burstiness, sentence variation) and probabilistic scoring instead of binary classification, with a FastAPI backend and deployed frontend for real-time inference.',
    tech: 'Python, Transformers (BERT / DistilBERT), NumPy / Pandas,FastAPI / Flask, React, ',
    link: null,
    github: 'https://ai-idetector.vercel.app/',
    figma: null,
  },
  {
    title: 'Driver mirror AI',
    description:
      'Built a real-time driver monitoring system using Python, OpenCV and MediaPipe that detects drowsiness, yawning and distraction at 30fps through Eye Aspect Ratio, Mouth Aspect Ratio and head pose estimation via solvePnP, processes video at 30fps with <33ms latency.',
    tech: 'Python, OpenCV, MediaPipe, Flask, SQLite, Matplotlib',
    link: null,
    github: 'https://github.com/mokshad25/DriverMonitorAI',
    figma: null,
  },
  {
    title: 'LinkedIn-Style Professional Job Platform',
    description:
      'Built a full-stack LinkedIn-style platform with authentication, role-based access (student, recruiter, admin), and scalable architecture using Supabase',
    tech: 'Next.js, TypeScript, Tailwind CSS, Supabase',
    link: null,
    github: 'https://linkedin-clone-coral-alpha.vercel.app/',
    figma: null,
  },
  {
    title: 'AI study planner',
    description:
      'A full-stack AI-powered study planning application built using FastAPI (Python). The system generates personalized study schedules based on user inputs such as goals, subjects, and deadlines. The backend follows a modular architecture with RESTful APIs, schema validation, and database integration.',
    tech: 'FastAPI, Python, Uvicorn, React (Vite), Tailwind CSS',
    link: null,
    github: 'https://github.com/mokshad25/AIstudyplanner',
    figma: null,
  },
  {
    title: 'Securecorp Dashboard',
    description:
      'Developed a full-stack secure document management system using MySQL, Node.js/Express, and a responsive frontend UI. The system implements role-based access control (RBAC) with document classification levels (Public, Internal, Confidential, Top Secret). Key features include password hashing, login tracking, access logs, and security alerts.',
    tech: 'React, Node.js, Express, MySQL',
    link: null,
    github: 'https://github.com/mokshad25/Securecorp-dashboard',
    figma: null,
  },
  {
    title: 'Club Blog App',
    description:
      'A full-stack blog application for a college club, featuring role-based access (admin/member), post management, and a modern, responsive interface.',
    tech: 'Next.js, CSS Modules, MongoDB',
    link: null,
    github: 'https://club-blog-app.vercel.app/',
    figma: null,
  }
]

// ─────────────────────────────────────────────────────────────────────────────
//  GSAP SCROLL CONFIGURATION  ←  TWEAK HERE
// ─────────────────────────────────────────────────────────────────────────────
//
//  SCRUB_DURATION
//    Controls the "lag" between the user's scroll and the card movement.
//    Think of it as inertia for the animation.
//      0     = instant / mechanical (ScrollTrigger.scrub: true)
//      0.5   = slightly smoothed
//      1     = natural, recommended sweet spot
//      2     = silky/cinematic, slower response
//    HOW TO CHANGE SCROLL FEEL: this is the main knob.
//
//  MOBILE_BREAKPOINT
//    Below this width (px) GSAP is skipped entirely.
//    Mobile uses native touch/trackpad horizontal scroll instead.
//    HOW TO CHANGE: set to 0 to force GSAP on all screen sizes.
//
// ─────────────────────────────────────────────────────────────────────────────
const SCRUB_DURATION    = 1      // seconds of animation lag (feel: smooth/natural)
const MOBILE_BREAKPOINT = 768    // px — GSAP disabled below this width

export default function WorkSection() {
  const { bg, mutedText } = useTheme()

  // sectionRef  — ScrollTrigger pins this element when it reaches the viewport top
  // trackRef    — GSAP translates this element's X position as the user scrolls
  // progressRef — DOM ref for the progress fill; updated directly (no React state)
  const sectionRef  = useRef(null)
  const trackRef    = useRef(null)
  const progressRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    const track   = trackRef.current
    if (!section || !track) return

    // ── gsap.matchMedia() ────────────────────────────────────────────────────
    // This is the correct GSAP pattern for responsive animations.
    // Unlike a one-shot window.innerWidth check, matchMedia:
    //   • runs the callback immediately at the correct viewport size
    //   • re-evaluates automatically when the window is resized
    //   • calls the returned cleanup function when the breakpoint is no longer met
    //
    // HOW TO CHANGE THE BREAKPOINT: edit MOBILE_BREAKPOINT at the top of this file.
    //   Setting it to 0 forces desktop behaviour on all screen sizes.
    //
    const mm = gsap.matchMedia()

    mm.add(`(min-width: ${MOBILE_BREAKPOINT}px)`, () => {

      // ── Calculate scroll distance ───────────────────────────────────────────
      //
      // HOW TO CHANGE ANIMATION DISTANCE:
      //   By default the track scrolls until the last card aligns with the
      //   viewport's right edge. The formula is:
      //
      //     distance = (total card row width) − (visible viewport width)
      //
      //   To add extra breathing room after the last card, multiply:
      //     e.g. `(track.scrollWidth - window.innerWidth) * 1.2`  (+20%)
      //
      //   To hard-code a fixed distance (e.g. always 3000px):
      //     replace the body with: `return 3000`
      //
      const getDistance = () => track.scrollWidth - window.innerWidth

      // ── Main tween: translate the card track horizontally ──────────────────
      gsap.to(track, {
        // Translate from x:0 (natural) → x:−distance (last card in view)
        x: () => -getDistance(),

        // ease:'none' = linear motion relative to scroll progress.
        // The smooth feel comes entirely from `scrub`, not the easing curve.
        ease: 'none',

        scrollTrigger: {
          trigger: section,

          // "top top" → pin activates when the section's top hits the viewport top
          start: 'top top',

          // HOW TO CONTROL TOTAL SCROLL TRAVEL:
          //   "+=" + getDistance() = "scroll this many more px before unpinning."
          //   Increase by multiplying getDistance() (see comment above).
          end: () => '+=' + getDistance(),

          // scrub: SCRUB_DURATION → animation lags behind scroll by this many
          // seconds. Change SCRUB_DURATION at the top of this file.
          //   0 = instant / mechanical
          //   1 = natural (recommended)
          //   2 = silky / cinematic
          scrub: SCRUB_DURATION,

          // Fixes the section in viewport while the horizontal animation plays
          pin: true,

          // Reduces the brief "jump" when the browser commits to pinning
          anticipatePin: 1,

          // Recalculates getDistance() on every window resize
          invalidateOnRefresh: true,

          // ── Progress bar ──────────────────────────────────────────────────
          // Direct DOM write — zero React re-renders per scroll tick.
          onUpdate: (self) => {
            if (progressRef.current) {
              progressRef.current.style.width = `${self.progress * 100}%`
            }
          },
        },
      })

      // Return value from matchMedia callback = cleanup for this breakpoint.
      // gsap.matchMedia calls it automatically when the breakpoint stops matching.
      // (gsap.context handles the tween/trigger cleanup; nothing extra needed here)
    })

    // Revert all matchMedia contexts on component unmount
    return () => mm.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="work"
      className={`${bg} pt-24`}
    >

      {/* ── Header row ──────────────────────────────────────────────────── */}
      {/*
        Stays visible at the top of the viewport while the section is pinned.
        The cards scroll horizontally below this header.
      */}
      <div className="px-6 md:px-14 lg:px-20">
        <SectionHeader index="03" title="WORK" />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="flex items-center justify-between mb-8"
        >
          <p className={`font-body text-[10px] tracking-[0.35em] uppercase ${mutedText}`}>
            {String(PROJECTS.length).padStart(2, '0')} Projects
          </p>

          {/* Scroll hint — hidden on mobile */}
          <p className={`hidden sm:flex items-center gap-2 font-body text-[10px] tracking-[0.35em] uppercase ${mutedText}`}>
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              aria-hidden="true"
            >
              →
            </motion.span>
            Scroll to explore
          </p>
        </motion.div>
      </div>

      {/* ── Cards track ──────────────────────────────────────────────────── */}
      {/*
        Structure (desktop):
          outer div  — overflow:hidden clips cards that are off-screen to the right
          trackRef   — GSAP translates this div's X position as the user scrolls

        Structure (mobile):
          outer div  — overflow visible (no clip needed)
          trackRef   — overflow-x:auto enables native touch/trackpad scroll

        HOW TO ADD/REMOVE PROJECTS: edit the PROJECTS array at the top of this file.
      */}
      <div className="md:overflow-hidden">
        <div
          ref={trackRef}
          className="
            flex gap-4
            px-6 md:px-14 lg:px-20
            pb-10
            overflow-x-auto md:overflow-visible
            [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
          "
        >
          {PROJECTS.map((project, i) => (
            <ProjectCard key={i} project={project} index={i} />
          ))}

          {/* Right-edge spacer: prevents the last card from sitting flush against the wall */}
          <div className="flex-shrink-0 w-6 md:w-14 lg:w-20" aria-hidden="true" />
        </div>
      </div>

      {/* ── Scroll progress bar ──────────────────────────────────────────── */}
      {/*
        progressRef is written to directly in ScrollTrigger's onUpdate callback —
        zero React state, zero re-renders per scroll tick.
        On mobile, the bar is not driven (stays at 0%) — acceptable since
        mobile uses native scroll with no progress concept.

        ANIMATION TUNING:
          The bar fills in sync with the horizontal animation because both
          read the same ScrollTrigger.progress value.
          Smoothness is controlled by SCRUB_DURATION above.
      */}
      <div className="px-6 md:px-14 lg:px-20 mb-16">
        <div className="relative w-full h-px bg-black/15 overflow-hidden">
          <div
            ref={progressRef}
            className="absolute inset-y-0 left-0 bg-black"
            style={{ width: '0%' }}
          />
        </div>
      </div>

      <Ticker />
    </section>
  )
}
