import { useEffect, useRef } from 'react'
import { useTheme } from '../context/ThemeContext'

export default function AnimatedCanvas() {
  const canvasRef   = useRef(null)
  const rafRef      = useRef(null)
  const timeRef     = useRef(0)
  const { isRed }   = useTheme()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    /* ── Resize handler ── */
    const resize = () => {
      canvas.width  = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    /* ── Draw loop ── */
    const draw = () => {
      const { width, height } = canvas
      ctx.clearRect(0, 0, width, height)

      const numLines   = Math.floor(width / 11)   // density scales with viewport
      const spacing    = width / numLines
      const t          = timeRef.current

      ctx.lineWidth    = 0.7
      ctx.strokeStyle  = 'rgba(0,0,0,0.55)'

      for (let i = 0; i < numLines; i++) {
        const xBase = i * spacing

        // Each line gets unique wave personality
        const amp1  = 18 + Math.sin(i * 0.18 + t * 0.4)  * 10
        const amp2  = 8  + Math.cos(i * 0.25 + t * 0.25) * 5
        const freq1 = 0.010 + (i / numLines) * 0.003
        const freq2 = 0.005 + (i / numLines) * 0.002
        const phase = i * 0.22 + t

        ctx.beginPath()
        for (let y = 0; y <= height; y += 3) {
          const xOff =
            Math.sin(y * freq1 + phase)       * amp1 +
            Math.sin(y * freq2 + phase * 0.6) * amp2
          if (y === 0) ctx.moveTo(xBase + xOff, y)
          else         ctx.lineTo(xBase + xOff, y)
        }
        ctx.stroke()
      }

      timeRef.current += 0.007
      rafRef.current   = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      ro.disconnect()
      cancelAnimationFrame(rafRef.current)
    }
  }, []) // canvas doesn't need to redraw when theme changes — stroke color stays black

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  )
}
