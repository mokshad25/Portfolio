import { motion } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'

/**
 * Reusable section header.
 * Usage: <SectionHeader index="01" title="ABOUT" />
 */
export default function SectionHeader({ index, title }) {
  const { border } = useTheme()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6 }}
      className={`flex items-center gap-4 border-b ${border} pb-4 mb-12`}
    >
      <span className="font-body text-xs tracking-[0.3em] text-black/40">[ {index} ]</span>
      <h2 className="font-heading text-5xl md:text-7xl tracking-wide leading-none">{title}</h2>
      <span className="flex-1 h-px bg-black/20 ml-2" />
    </motion.div>
  )
}
