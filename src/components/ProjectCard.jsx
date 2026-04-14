import { useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'

/**
 * ProjectCard
 * ─────────────────────────────────────────────────────────────────────────────
 * A single horizontally-scrolled project slide.
 *
 * Props:
 *   project  — object from the PROJECTS array in WorkSection.jsx
 *   index    — card position (0-based), used for the display number
 *
 * TO EDIT CARD CONTENT → go to WorkSection.jsx and edit the PROJECTS array.
 * DO NOT hard-code text here — all data flows from the parent.
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ── Tilt configuration ────────────────────────────────────────────────────────
// TILT_MAX   → max rotation in degrees (raise for a more dramatic tilt)
// HOVER_SCALE → card scale on hover (keep close to 1 for subtlety)
// PERSPECTIVE → lower = more dramatic 3D depth, higher = flatter
// To DISABLE the effect entirely: set TILT_MAX to 0
const TILT_MAX    = 8      // degrees  (recommended range: 5–12)
const HOVER_SCALE = 1.03   // unitless (recommended range: 1.01–1.05)
const PERSPECTIVE = 800    // px       (recommended range: 600–1200)

// ── Spring feel ───────────────────────────────────────────────────────────────
// stiffness ↑ = snappier response    damping ↑ = less oscillation on release
// mass      ↑ = heavier/slower feel
const SPRING = { stiffness: 200, damping: 22, mass: 0.6 }

// ── Entrance stagger ──────────────────────────────────────────────────────────
// With GSAP horizontal scroll, cards are translated into view via CSS transform.
// IntersectionObserver (used by Framer Motion's whileInView) does NOT update on
// CSS transforms, so off-screen cards would stay invisible forever.
// Fix: use animate instead of whileInView, staggering by index so each card
// slides in slightly after the previous. Visually identical on both desktop
// and mobile; just triggers on mount rather than on intersection.
//
// HOW TO ADJUST STAGGER: change STAGGER_DELAY_PER_CARD (seconds per card)
// HOW TO DISABLE: set STAGGER_DELAY_PER_CARD to 0
const STAGGER_DELAY_PER_CARD = 0.08   // seconds  (recommended: 0.05–0.12)

export default function ProjectCard({ project, index }) {
  const { border } = useTheme()
  const { title, description, tech, link, github, figma } = project

  // ── Primary CTA resolves the best available link ──────────────────────────
  const primaryLink = link || github || figma || null

  const openLink = (e, url) => {
    e?.stopPropagation()
    if (url) window.open(url, '_blank', 'noopener,noreferrer')
  }

  // Parse comma-separated tech string into individual chips
  const techChips = tech
    ? tech.split(',').map(t => t.trim()).filter(Boolean)
    : []

  // ── 3D tilt state (MotionValues → no React re-renders on mouse move) ──────
  const cardRef   = useRef(null)

  const rawRotateX = useMotionValue(0)   // raw target values
  const rawRotateY = useMotionValue(0)
  const rawScale   = useMotionValue(1)

  // Springs interpolate from current → target for smooth motion
  const rotateX = useSpring(rawRotateX, SPRING)
  const rotateY = useSpring(rawRotateY, SPRING)
  const scale   = useSpring(rawScale,   SPRING)

  // ── Mouse move: map cursor position → rotation ────────────────────────────
  const onMouseMove = (e) => {
    const card = cardRef.current
    if (!card) return

    const rect = card.getBoundingClientRect()

    // Normalize cursor to [-1, +1] within the card bounds
    const normX = ((e.clientX - rect.left)  / rect.width  - 0.5) * 2
    const normY = ((e.clientY - rect.top)   / rect.height - 0.5) * 2

    // rotateY: cursor right  → positive (right side lifts toward viewer)
    // rotateX: cursor bottom → positive (bottom lifts toward viewer)
    rawRotateY.set( normX * TILT_MAX)
    rawRotateX.set( normY * TILT_MAX)
    rawScale.set(HOVER_SCALE)
  }

  // ── Mouse leave: spring back to resting state ─────────────────────────────
  const onMouseLeave = () => {
    rawRotateX.set(0)
    rawRotateY.set(0)
    rawScale.set(1)
  }

  return (
    <motion.article
      ref={cardRef}

      // ── 3D transform (driven by springs above) ────────────────────────────
      style={{
        rotateX,
        rotateY,
        scale,
        transformPerspective: PERSPECTIVE,  // depth of the 3D space
        willChange: 'transform',            // hint browser to composite this layer
      }}

      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}

      // ── Entrance: slides up + fades in on mount (staggered by card index) ──
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.55,
        ease: [0.16, 1, 0.3, 1],
        delay: index * STAGGER_DELAY_PER_CARD,
      }}

      onClick={(e) => openLink(e, primaryLink)}
      aria-label={`Open ${title}`}
      className={`
        relative flex-shrink-0
        w-[310px] sm:w-[360px] md:w-[410px]
        h-[500px] md:h-[540px]
        border ${border}
        p-7 md:p-8
        flex flex-col
        cursor-pointer group
        hover:bg-black hover:text-white
        transition-colors duration-300
        select-none
        snap-start
      `}
    >
      {/* ── Card number ──────────────────────────────────────────────────── */}
      <span className="font-body text-[10px] tracking-[0.45em] uppercase opacity-35 group-hover:opacity-25 mb-auto">
        {String(index + 1).padStart(2, '0')}
      </span>

      {/* ── Project title (Bebas Neue, dominant element) ─────────────────── */}
      {/* FONT SIZE: change text-5xl / text-6xl to resize the title */}
      <h3 className="font-heading text-[3.2rem] md:text-[3.8rem] leading-[0.92] tracking-wide mt-5 mb-5">
        {title}
      </h3>

      {/* ── Horizontal rule ──────────────────────────────────────────────── */}
      <div className="w-full h-px bg-black/25 group-hover:bg-white/20 transition-colors mb-5" />

      {/* ── Description ──────────────────────────────────────────────────── */}
      <p className="font-body text-sm leading-relaxed opacity-65 group-hover:opacity-50 flex-1 mb-5">
        {description}
      </p>

      {/* ── Tech stack chips ─────────────────────────────────────────────── */}
      {techChips.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-7">
          {techChips.map(chip => (
            <span
              key={chip}
              className={`
                font-body text-[9px] tracking-[0.25em] uppercase
                border ${border} group-hover:border-white/25
                px-2 py-[3px]
                transition-colors duration-300
              `}
            >
              {chip}
            </span>
          ))}
        </div>
      )}

      {/* ── CTA button ───────────────────────────────────────────────────── */}
      <button
        onClick={(e) => openLink(e, primaryLink)}
        disabled={!primaryLink}
        className={`
          font-body text-[10px] tracking-[0.38em] uppercase
          border ${border} group-hover:border-white
          px-4 py-2.5 w-fit
          hover:bg-white hover:text-black
          disabled:opacity-30 disabled:cursor-default
          transition-colors duration-200
        `}
      >
        VIEW PROJECT →
      </button>

      {/* ── Corner notch accent (purely decorative) ───────────────────────── */}
      <span
        aria-hidden="true"
        className="absolute bottom-0 right-0 w-6 h-6 border-l border-t border-black/20 group-hover:border-white/20 transition-colors"
      />
    </motion.article>
  )
}
