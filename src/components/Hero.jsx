import { motion } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'
import DistortedGridBackground from './DistortedGridBackground'
import Ticker from './Ticker'

// ─────────────────────────────────────────────────────────────────────────────
//  THEME TOGGLE — configuration
// ─────────────────────────────────────────────────────────────────────────────
//
//  HOW TO ADJUST VERTICAL POSITION (relative to the name heading):
//    The toggle sits in the normal flow between the "Portfolio — 2025" label
//    and the h1. To move it further from the name, increase mb-* on the
//    toggle wrapper below. To move it closer, decrease mb-*.
//    Current: mb-8  (32px gap below toggle, above name)
//
//  HOW TO HIDE THE HERO TOGGLE:
//    Set SHOW_HERO_TOGGLE to false. The navbar toggle (top-right) still works.
//
// ─────────────────────────────────────────────────────────────────────────────
const SHOW_HERO_TOGGLE = true

export default function Hero() {
  const { isRed, toggle, bg } = useTheme()

  return (
    <section id="hero" className={`relative flex flex-col h-screen ${bg}`}>

      {/* ── Interactive distorted grid background ── */}
      <DistortedGridBackground />

      {/* ── Top binary / data strip ── */}
      <div className="relative z-10 mt-14 border-b border-black overflow-hidden py-[5px]">
        <p className="font-body text-[9px] tracking-[0.15em] text-black/40 whitespace-nowrap px-4 select-none">
          {'10110011 10101001 ////// 16090111011001 ////// 1001000010011 ////// 001100101001011 ////// 1010110011 ////// 10101011000110 ////// 110101001100010 ////// 101001001000010'.repeat(3)}
        </p>
      </div>

      {/* ── Hero text ── */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 text-center">

        {/* "Portfolio — 2025" label */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-body text-[10px] tracking-[0.5em] uppercase text-black/60 mb-4"
        >
          Portfolio — 2025
        </motion.p>

        {/* ── Theme toggle pill ─────────────────────────────────────────────
            Centered above the main heading.

            LIGHT mode (isRed=false):
              Pill → thin border, near-transparent fill, knob on LEFT (black)
            DARK / RED mode (isRed=true):
              Pill → filled black, knob on RIGHT (red)

            HOW TO REPOSITION:
              Adjust `mb-8` below to change spacing above the h1.
              The toggle inherits the parent's `items-center` so it stays
              horizontally centred at all viewport widths automatically.

            HOW TO DISABLE: set SHOW_HERO_TOGGLE = false at the top of this file.
        ─────────────────────────────────────────────────────────────────── */}
        {SHOW_HERO_TOGGLE && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            {/*
              Pill toggle — state at a glance:
                Light mode → gray track  (#d1d5db), knob LEFT,  knob = white
                Dark  mode → black track (#000000), knob RIGHT, knob = white
              Knob is always white so it has maximum contrast on both track colors.
              No text labels — the knob position communicates the state clearly.

              HOW TO REPOSITION: adjust `mb-8` on the parent div above.
              HOW TO RESIZE:     change w-14/h-7 (track) and w-5/h-5 (knob) together.
                                 If you change track width, recalculate translate-x-7:
                                 right offset = trackW - knobW - leftPad*2
                                 e.g. w-14(56px) - w-5(20px) - 1(4px) - 1(4px) = 28px = 7 * 4px
            */}
            <button
              onClick={toggle}
              aria-label={`Switch to ${isRed ? 'light' : 'dark'} mode`}
              className={`
                relative w-14 h-7 rounded-full
                transition-colors duration-300
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40
                ${isRed ? 'bg-black' : 'bg-gray-300'}
              `}
            >
              {/* Sliding knob — always white for contrast on both track colors */}
              <span
                aria-hidden="true"
                className={`
                  absolute top-1 left-1
                  w-5 h-5 rounded-full bg-white
                  shadow-sm
                  transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]
                  ${isRed ? 'translate-x-7' : 'translate-x-0'}
                `}
              />
            </button>
          </motion.div>
        )}

        {/* Name heading — unchanged */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="font-heading text-[15vw] md:text-[13vw] lg:text-[11vw] leading-[0.88] tracking-tight text-black"
        >
          MOKSHAD
          <br />
          KANAUJIA
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex items-center gap-4 mt-6"
        >
          <span className="h-px w-12 bg-black/40" />
          <p className="font-body text-[11px] tracking-[0.45em] uppercase text-black/70">
            CS Student — Cybersecurity
          </p>
          <span className="h-px w-12 bg-black/40" />
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="absolute bottom-20 flex flex-col items-center gap-1"
        >
          <span className="font-body text-[9px] tracking-[0.4em] uppercase text-black/40">Scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
            className="w-px h-8 bg-black/30"
          />
        </motion.div>
      </div>

      {/* ── Bottom binary strip ── */}
      <div className="relative z-10 border-t border-black overflow-hidden py-[5px]">
        <p className="font-body text-[9px] tracking-[0.15em] text-black/40 whitespace-nowrap px-4 select-none">
          {'10010010100010 ////// 11010101000100 ////// 100101001001001 ////// 011010101001001 ////// 10010100100100 ////// 001011010100010 ////// 11010100101000'.repeat(3)}
        </p>
      </div>

      {/* ── Ticker strip ── */}
      <Ticker className="relative z-10" />
    </section>
  )
}
