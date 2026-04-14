import { motion } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'
import SectionHeader from './SectionHeader'

const CERTS = [
  {
    name:   'Anywhere door, ethical hacking and cyber security workshop',
    issuer: 'Anywhere door',
    date:   '2025',
    link:   null,
    badge:  '◈',
  },
  {
    name:   'Tata Group - Cybersecurity Analyst Job Simulation',
    issuer: 'Tata Group',
    date:   '2025',
    link:   null,
    badge:  '◈',
  },
]

const rowVariants = {
  hidden:  { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
}

export default function Certifications() {
  const { bg, border, mutedText } = useTheme()

  return (
    <section id="certifications" className={`${bg} pt-24 pb-24`}>
      <div className="px-6 md:px-14 lg:px-20">
        <SectionHeader index="04" title="CERTIFICATIONS" />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          transition={{ staggerChildren: 0.1 }}
          className={`border ${border} divide-y divide-black/20`}
        >
          {/* Table header */}
          <div className="grid grid-cols-12 px-6 py-3">
            <span className={`col-span-1 font-body text-[10px] tracking-[0.3em] uppercase ${mutedText}`}>#</span>
            <span className={`col-span-5 font-body text-[10px] tracking-[0.3em] uppercase ${mutedText}`}>Certification</span>
            <span className={`col-span-4 font-body text-[10px] tracking-[0.3em] uppercase ${mutedText}`}>Issuer</span>
            <span className={`col-span-2 font-body text-[10px] tracking-[0.3em] uppercase ${mutedText} text-right`}>Date</span>
          </div>

          {CERTS.map((cert, i) => (
            <motion.div
              key={i}
              variants={rowVariants}
              className="grid grid-cols-12 px-6 py-5 items-center group hover:bg-black hover:text-white transition-colors duration-300 cursor-default"
            >
              <span className={`col-span-1 font-body text-xs ${mutedText} group-hover:text-white/40`}>
                {cert.badge}
              </span>

              <div className="col-span-5">
                <p className="font-body text-sm font-semibold tracking-wide">{cert.name}</p>
                {cert.link && (
                  <a
                    href={cert.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`font-body text-[10px] tracking-widest uppercase ${mutedText} group-hover:text-white/50 hover:underline`}
                  >
                    Verify ↗
                  </a>
                )}
              </div>

              <p className={`col-span-4 font-body text-xs tracking-wide ${mutedText} group-hover:text-white/60`}>
                {cert.issuer}
              </p>

              <p className={`col-span-2 font-body text-xs tracking-widest text-right ${mutedText} group-hover:text-white/60`}>
                {cert.date}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
