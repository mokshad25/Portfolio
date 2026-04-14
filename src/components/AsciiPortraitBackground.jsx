import { useEffect, useRef } from 'react'

// ─────────────────────────────────────────────────────────────────────────────
//  CONFIGURATION  ← every tuning knob is here
// ─────────────────────────────────────────────────────────────────────────────

// HOW TO REPLACE THE IMAGE:
//   Place your portrait photo at  /public/portrait.png
//   (the file at that path is loaded at runtime — no rebuild needed)
//   For best results use a high-contrast B&W image with a plain/white background.
const IMAGE_SRC = '/portrait.png'

// CHARACTER SET  (index 0 = darkest pixel, last index = lightest before skip)
// HOW TO CHANGE CHARACTER STYLE: swap this array.
//   Dense/blocky:  ['█','▓','▒','░',' ']
//   Code-style:    ['#','{','}','>','<','/','1','0','.']   ← current
//   Minimal dots:  ['●','•','.','·',' ']
const CHARS = ['█','▓','▒','░',' '] 

// HOW TO CONTROL OPACITY (how visible the ASCII is):
//   Raise → more visible.  Lower → more ghostly.
//   On a solid-color background like #c30101, go higher than you'd expect —
//   0.08 produces only a 16/255 delta in the red channel, which is imperceptible.
//   0.18–0.25 is the practical sweet spot on this red theme.
const OPACITY_DESKTOP = 0.42
const OPACITY_MOBILE  = 0.23   // slightly dimmer on mobile (less space)

// HOW TO ADJUST ASCII DENSITY (characters per inch):
//   Lower FONT_SIZE → more characters, denser texture.
//   Higher FONT_SIZE → fewer, coarser characters.
//   Recommended range: 7–14.  Current: 9px (dense and sharp).
const FONT_SIZE = 1             // px — monospace font size

// Monospace character aspect ratio: width / height ≈ 0.55 for most mono fonts.
// Raise slightly (0.60) if characters look squished, lower (0.50) if stretched.
const CHAR_ASPECT = 0.55

// HOW TO SCALE THE PORTRAIT SIZE:
//   Fraction of the section's height that the portrait fills.
//   0.85 = portrait is 85% as tall as the section.
const PORTRAIT_HEIGHT_RATIO = 0.95

// Horizontal position of the portrait's right edge (fraction of section width).
// 0.96 = portrait right edge sits at 96% of section width (near the right wall).
const PORTRAIT_RIGHT_EDGE = 0.94

// HOW TO DISABLE THE EFFECT ENTIRELY:
//   Comment out <AsciiPortraitBackground /> in About.jsx.
//   Or set OPACITY_DESKTOP to 0.

// Brightness threshold — pixels brighter than this are treated as "background"
// and rendered as blank space. Raise if the image background bleeds into the art.
const BG_THRESHOLD = 225

// HOW TO CONTROL SCROLL PARALLAX STRENGTH:
//   0 = completely static.  0.08 = subtle drift.  0.2 = strong parallax.
//   Set to 0 to disable parallax entirely.
const PARALLAX_STRENGTH = 0.06

// Mobile breakpoint (px)
const MOBILE_BP = 768

// ─────────────────────────────────────────────────────────────────────────────
//  COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function AsciiPortraitBackground() {
  const canvasRef  = useRef(null)
  const wrapperRef = useRef(null)
  const imgRef     = useRef(null)   // cached HTMLImageElement

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    // ── Render ASCII art onto the canvas ─────────────────────────────────────
    // Called once on image load, and again on every resize.
    // NOT called on scroll — parallax is pure CSS transform (zero canvas work).
    const render = () => {
      const img = imgRef.current
      if (!img) return

      // Match canvas pixel size to its CSS layout size
      const W = canvas.offsetWidth
      const H = canvas.offsetHeight
      if (!W || !H) return
      canvas.width  = W
      canvas.height = H

      const isMobile = W < MOBILE_BP
      const opacity  = isMobile ? OPACITY_MOBILE : OPACITY_DESKTOP

      // ── Work out portrait dimensions ────────────────────────────────────────
      const targetH  = H * PORTRAIT_HEIGHT_RATIO
      const aspect   = img.naturalWidth / img.naturalHeight
      const targetW  = targetH * aspect

      // Character cell dimensions
      const charW = FONT_SIZE * CHAR_ASPECT
      const charH = FONT_SIZE * 1.15

      // How many ASCII columns / rows fit inside the target portrait area
      const cols = Math.max(1, Math.floor(targetW / charW))
      const rows = Math.max(1, Math.floor(targetH / charH))

      // ── Sample image pixels at ASCII resolution ─────────────────────────────
      // Draw the image into a tiny off-screen canvas sized exactly cols × rows.
      // Each pixel in that tiny canvas = one ASCII character cell.
      const sample = document.createElement('canvas')
      sample.width  = cols
      sample.height = rows
      const sCtx = sample.getContext('2d')

      // Flip horizontally so portrait mirrors naturally as a background
      sCtx.save()
      sCtx.translate(cols, 0)
      sCtx.scale(-1, 1)
      sCtx.drawImage(img, 0, 0, cols, rows)
      sCtx.restore()

      const { data } = sCtx.getImageData(0, 0, cols, rows)

      // ── Clear and set up drawing context ─────────────────────────────────────
      ctx.clearRect(0, 0, W, H)
      // Slightly stronger opacity for dark characters, fades naturally with char density
      ctx.fillStyle   = `rgba(0,0,0,${opacity})`
      ctx.font        = `${FONT_SIZE}px "Courier New", Courier, monospace`
      ctx.textBaseline = 'top'

      // Portrait origin: right-aligned within the canvas
      const startX = W - targetW - (W * (1 - PORTRAIT_RIGHT_EDGE))
      const startY = (H - targetH) / 2   // vertically centred

      // ── Rasterise ASCII ───────────────────────────────────────────────────────
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const i          = (r * cols + c) * 4
          const R          = data[i]
          const G          = data[i + 1]
          const B          = data[i + 2]
          const A          = data[i + 3]
          const brightness = (R + G + B) / 3

          // Skip transparent or near-white (background) pixels
          if (A < 30 || brightness > BG_THRESHOLD) continue

          // Map brightness to a character:
          //   dark (brightness ≈ 0) → CHARS[0]  ('#')
          //   light (brightness ≈ BG_THRESHOLD) → CHARS[last]  ('.')
          const t       = brightness / BG_THRESHOLD                    // 0–1
          const charIdx = Math.min(
            Math.floor(t * CHARS.length),
            CHARS.length - 1
          )

          ctx.fillText(
            CHARS[charIdx],
            startX + c * charW,
            startY + r * charH,
          )
        }
      }
    }

    // ── Load portrait image ───────────────────────────────────────────────────
    const img     = new Image()
    img.src       = IMAGE_SRC
    // requestAnimationFrame ensures the browser has finished layout before we
    // read canvas.offsetWidth / canvas.offsetHeight — without it, a cached image
    // can fire onload before h-full resolves, returning 0 and silently aborting.
    img.onload    = () => { imgRef.current = img; requestAnimationFrame(render) }
    img.onerror   = () =>
      console.warn(
        `[AsciiPortrait] Could not load "${IMAGE_SRC}".\n` +
        `→ Copy your portrait photo to  /public/portrait.png  and refresh.`
      )

    // ── Resize: re-render ASCII when section resizes ──────────────────────────
    const ro = new ResizeObserver(render)
    ro.observe(canvas)

    // ── Scroll parallax (pure CSS — zero canvas redraws) ─────────────────────
    // We move the wrapper div with a CSS transform so the canvas content
    // drifts slightly as the user scrolls, giving a layered depth feel.
    const section   = canvas.closest('#about')
    let   rafId     = null

    const onScroll = () => {
      if (!wrapperRef.current || !section) return
      if (rafId) return   // already scheduled

      rafId = requestAnimationFrame(() => {
        rafId = null
        if (!wrapperRef.current) return
        const top    = section.getBoundingClientRect().top
        const offset = -top * PARALLAX_STRENGTH
        wrapperRef.current.style.transform = `translateY(${offset.toFixed(2)}px)`
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      ro.disconnect()
      window.removeEventListener('scroll', onScroll)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    // Wrapper handles parallax via CSS transform (wrapper overflows → clip by section)
    <div
      ref={wrapperRef}
      className="absolute inset-0 pointer-events-none will-change-transform"
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
      />
    </div>
  )
}
