import { motion } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'
import SectionHeader from './SectionHeader'
import AsciiPortraitBackground from './AsciiPortraitBackground'
import Ticker from './Ticker'

export default function About() {
  const { bg, border, mutedText } = useTheme()

  return (
    // overflow-hidden clips the parallax wrapper so it never pokes outside
    <section id="about" className={`${bg} pt-24 pb-0 relative overflow-hidden`}>

      {/* ── ASCII PORTRAIT BACKGROUND ─────────────────────────────────────────
          Renders the portrait as a faint code-character texture.
          Sits at z-index 0, behind all content.

          HOW TO REPLACE THE IMAGE:
            Drop your portrait at  /public/portrait.png  — no code change needed.

          HOW TO HIDE IT TEMPORARILY:
            Comment out the line below.
      ──────────────────────────────────────────────────────────────────────── */}
      <AsciiPortraitBackground />

      {/* ── CONTENT — sits above background ──────────────────────────────── */}
      <div className="relative z-10 px-6 md:px-14 lg:px-20">

        <SectionHeader index="01" title="ABOUT" />

        {/*
          Bio + metadata — NO box, NO border card.
          Raw text sits directly on the red surface, brutalist style.
          Max-width keeps the paragraph readable without crowding the portrait.
        */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-xl mb-0 pb-16"
        >

          {/* ── Bio paragraphs ───────────────────────────────────────────────
              HOW TO EDIT: change the text inside the <p> tags below.
          ─────────────────────────────────────────────────────────────────── */}
          <p className="font-body text-base md:text-lg leading-relaxed text-black mb-5">
            I'm <strong>Mokshad Kanaujia</strong> — a Computer Science
            student specializing in Cybersecurity.
          </p>

          <p className="font-body text-base md:text-lg leading-relaxed text-black/75">
I’m deeply curious about how systems are built, where they fail, and how they can be made secure and reliable. I enjoy breaking things down to understand them, and then rebuilding them better.

Alongside security, I have a strong interest in UI/UX design. I believe technology should not only be functional but also intuitive and engaging, and I enjoy crafting interfaces that make complex ideas feel simple.

I approach projects with a builder’s mindset — I like taking ideas from a problem statement to a working MVP. I’m especially interested in startup environments where speed, ownership, and real-world impact matter more than perfect plans.

My focus is on creating practical, AI-driven solutions that solve meaningful problems, with the long-term goal of building products that are scalable, impactful, and grounded in strong engineering and thoughtful design.

          </p>

          {/* ── Metadata grid ────────────────────────────────────────────────
              No box — just a thin top rule to separate from the copy above.
              HOW TO EDIT: update the value strings in the array below.
          ─────────────────────────────────────────────────────────────────── */}
          <div className={`mt-10 pt-8 border-t ${border} grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4`}>
            {[
              { label: 'Focus',    value: 'Cybersecurity' },
              { label: 'Status',   value: 'Open to Internships' },
              { label: 'Based in', value: 'mumbai - bangalore' },
              { label: 'Degree',   value: 'B.Tech / B.S. CS' },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className={`font-body text-[10px] tracking-[0.3em] uppercase ${mutedText}`}>
                  {label}
                </p>
                <p className="font-body text-sm font-semibold mt-1">{value}</p>
              </div>
            ))}
          </div>

        </motion.div>
      </div>

      <Ticker />
    </section>
  )
}
