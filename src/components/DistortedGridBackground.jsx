import { useEffect, useRef } from 'react'

// ─────────────────────────────────────────────────────────────────────────────
//  VISUAL DESIGN
//  The effect is VERTICAL LINES ONLY with sinusoidal X-axis displacement.
//  Dense lines + large-ish wave amplitude = natural convergence / divergence
//  zones that look like flowing fabric or a magnetic field.
//
//  This intentionally matches the reference image aesthetic:
//  many close vertical lines that wave left/right as they travel downward.
// ─────────────────────────────────────────────────────────────────────────────

// ── GRID DENSITY ─────────────────────────────────────────────────────────────
// Pixels between vertical lines.
// HOW TO ADJUST DENSITY: change GRID_SIZE.
//   Lower  = more lines, denser look  (try 8 for ultra-dense)
//   Higher = fewer lines, airier look (try 18 for lighter)
const GRID_SIZE = 11

// Pixels between sample points along each vertical line.
// Lower = smoother curves but more work per frame.  3–5 is optimal.
// HOW TO IMPROVE CURVE SMOOTHNESS: lower this value.
const SAMPLE_STEP = 3

// ── WAVE SHAPE ───────────────────────────────────────────────────────────────
// Primary wave — creates the large, dramatic bends
// HOW TO CONTROL DISTORTION INTENSITY: change WAVE_AMP_1 (main knob)
//   Raise  → more dramatic convergence zones (try 45 for strong effect)
//   Lower  → gentler waves (try 18 for subtle)
const WAVE_AMP_1   = 32     // px  (recommended: 20–45)
const WAVE_FREQ_1  = 0.0088 // rad/px (lower = longer waves, higher = tighter)

// Secondary wave — adds organic variation on top of the primary wave
// Set WAVE_AMP_2 to 0 for a perfectly uniform sine pattern.
const WAVE_AMP_2   = 13     // px
const WAVE_FREQ_2  = 0.0048 // should be notably different from FREQ_1

// Phase difference between adjacent lines — controls convergence zone spacing.
// Larger value → convergence zones are closer together.
// HOW TO CHANGE CONVERGENCE SPACING: tweak PHASE_OFFSET.
const PHASE_OFFSET = 0.21   // radians per line index

// ── ANIMATION SPEED ──────────────────────────────────────────────────────────
// HOW TO CONTROL ANIMATION SPEED: change TIME_STEP (main speed knob).
//   0.004 = very slow, meditative drift
//   0.012 = noticeably moving
// WAVE_SPEED_* = independent time multipliers for each wave layer
const TIME_STEP    = 0.005
const WAVE_SPEED_1 = 1.0    // time multiplier for primary wave
const WAVE_SPEED_2 = 0.65   // secondary wave moves slightly slower

// ── MOUSE INTERACTION ─────────────────────────────────────────────────────────
// Cursor creates a localised radial distortion (Gaussian falloff).
// HOW TO DISABLE: set MOUSE_STRENGTH to 0.
// HOW TO WIDEN INFLUENCE: increase MOUSE_RADIUS.
const MOUSE_STRENGTH  = 38   // px max displacement at cursor centre
const MOUSE_RADIUS    = 230  // px influence radius (1-sigma Gaussian)
// Cursor tracking speed (0.01 = sluggish/dreamy, 0.15 = nearly instant)
const MOUSE_LERP      = 0.06

// ── APPEARANCE ────────────────────────────────────────────────────────────────
// Opacity of lines on the canvas (0 = invisible, 1 = full black).
// Keep this low — the red background carries the visual weight.
const LINE_OPACITY = 0.52
const LINE_WIDTH   = 0.6    // px — keep ≤ 1 for the premium fine-line look

// ── MOBILE ────────────────────────────────────────────────────────────────────
// On small screens (no mouse, less GPU): reduce amplitude for cleaner look.
// HOW TO ADJUST MOBILE SCALE: change the scale factors (0–1).
const MOBILE_BREAKPOINT = 768
const MOBILE_AMP_SCALE  = 0.55  // amplitude multiplier on mobile

// ─────────────────────────────────────────────────────────────────────────────
//  COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function DistortedGridBackground() {
  const canvasRef = useRef(null)
  const rafRef    = useRef(null)

  // All animation state in a single ref — zero React re-renders during playback
  const S = useRef({
    t:     0,
    mouse: { x: -9999, y: -9999 },   // real cursor (off-screen by default)
    sm:    { x: -9999, y: -9999 },   // lerped cursor
  })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    // ── Canvas sizing ─────────────────────────────────────────────────────────
    const resize = () => {
      // Use devicePixelRatio for sharp rendering on HiDPI screens
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width  = canvas.offsetWidth  * dpr
      canvas.height = canvas.offsetHeight * dpr
      ctx.scale(dpr, dpr)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    // ── Mouse tracking (on parent section — canvas is pointer-events:none) ────
    const section = canvas.parentElement
    const onMove  = (e) => {
      const r = section.getBoundingClientRect()
      S.current.mouse.x = e.clientX - r.left
      S.current.mouse.y = e.clientY - r.top
    }
    const onLeave = () => { S.current.mouse.x = -9999; S.current.mouse.y = -9999 }
    section.addEventListener('mousemove', onMove,  { passive: true })
    section.addEventListener('mouseleave', onLeave)

    // ── Draw loop ─────────────────────────────────────────────────────────────
    const draw = () => {
      // Read logical CSS size (not physical pixel size) for layout maths
      const W = canvas.offsetWidth
      const H = canvas.offsetHeight
      const s = S.current
      const isMob = W < MOBILE_BREAKPOINT
      const ampScale = isMob ? MOBILE_AMP_SCALE : 1

      // Smooth cursor lerp
      s.sm.x += (s.mouse.x - s.sm.x) * MOUSE_LERP
      s.sm.y += (s.mouse.y - s.sm.y) * MOUSE_LERP
      const smx = s.sm.x
      const smy = s.sm.y
      const t   = s.t

      // Pre-compute mouse radius squared once per frame (avoids repeat in inner loop)
      const MR2 = MOUSE_RADIUS * MOUSE_RADIUS

      // Clear — canvas bg is transparent, red section shows through
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // ── Single batched path — one stroke call for ALL lines ──────────────────
      // This is the key performance optimisation: no per-line stroke() flush.
      ctx.beginPath()
      ctx.strokeStyle = `rgba(0,0,0,${LINE_OPACITY})`
      ctx.lineWidth   = LINE_WIDTH

      // Number of lines needed to fill width + overscan 1 line on each side
      const numLines = Math.ceil(W / GRID_SIZE) + 3

      for (let i = -1; i < numLines; i++) {
        const xBase = i * GRID_SIZE
        // Each line gets a unique phase based on its column index.
        // This is what creates the convergence / divergence zones.
        const phase = i * PHASE_OFFSET

        // ── Sample along the full height of the line ─────────────────────────
        for (let y = 0; y <= H + SAMPLE_STEP; y += SAMPLE_STEP) {

          // ── 1. Ambient sine wave (X displacement only) ──────────────────────
          //    Primary wave:   longer, dominant bends
          //    Secondary wave: adds organic variation
          //    Together they produce the natural "flowing fabric" look.
          const xWave =
            Math.sin(y * WAVE_FREQ_1 + phase + t * WAVE_SPEED_1) * WAVE_AMP_1 * ampScale +
            Math.sin(y * WAVE_FREQ_2 + phase * 0.72 + t * WAVE_SPEED_2) * WAVE_AMP_2 * ampScale

          // ── 2. Mouse distortion (Gaussian radial push) ──────────────────────
          //    HOW TO CHANGE PUSH → PULL: negate xMouse below.
          //    On mobile this is skipped (no cursor).
          let xMouse = 0
          if (!isMob) {
            const dx2   = (xBase - smx) * (xBase - smx)
            const dy2   = (y     - smy) * (y     - smy)
            const distSq = dx2 + dy2
            if (distSq < MR2 * 9) {   // early-exit: skip maths beyond 3× radius
              const falloff  = Math.exp(-distSq / MR2)
              const angle    = Math.atan2(y - smy, xBase - smx)
              xMouse = Math.cos(angle) * falloff * MOUSE_STRENGTH
            }
          }

          const x = xBase + xWave + xMouse

          // moveTo starts a new sub-path for each line; lineTo extends it
          if (y === 0) ctx.moveTo(x, y)
          else         ctx.lineTo(x, y)
        }
      }

      ctx.stroke()   // ← single GPU draw call for all lines

      s.t        += TIME_STEP
      rafRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      ro.disconnect()
      cancelAnimationFrame(rafRef.current)
      section.removeEventListener('mousemove', onMove)
      section.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  )
}
