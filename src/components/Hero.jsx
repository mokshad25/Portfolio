import { motion } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'
import DistortedGridBackground from './DistortedGridBackground'
import Ticker from './Ticker'

export default function Hero() {
  const { bg } = useTheme()

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

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-body text-[10px] tracking-[0.5em] uppercase text-black/60 mb-4"
        >
          Portfolio — 2025
        </motion.p>

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
