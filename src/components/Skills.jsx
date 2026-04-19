import { motion } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'
import SectionHeader from './SectionHeader'

/*
  ────────────────────────────────────────────────────────────────────────────
  HOW TO UPDATE SKILLS
  Edit the SKILL_CATEGORIES array below.
  Each category has:
    - title   : display name
    - icon    : emoji or remove it
    - items   : array of skill strings

  Simply add / remove strings from `items`. The grid resizes automatically.
  ────────────────────────────────────────────────────────────────────────────
*/
const SKILL_CATEGORIES = [
  {
    title: 'Programming',
    icon: '{ }',
    items: [
      'Python',
      'C',
      'Next.js',
      'MySQL',
      'MERN stack',
    ],
  },
  {
    title: 'Tools',
    icon: '⚙',
    items: [
      'Full stack web development',
      'Kali Linux',
      'supabase',
      'vercel',
      'version control with Google Collab',
      'OPENCV',
      'MediaPipe',
    ],
  },
  {
    title: 'Technologies',
    icon: '◈',
    items: [
      'React',
      'Node.js',
      'Git/GitHub',
      'Linux',
      'Flask',
      'FastAPI',
    ],
  },
  {
    title: 'AI and Machine Learning',
    icon: '⬡',
    items: [
      'LLMs and SMLs',
      'TensorFlow',
      'PyTorch',
    ],
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}
const cardVariants = {
  hidden:  { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55 } },
}

export default function Skills() {
  const { bg, border, cardBg, mutedText } = useTheme()

  return (
    <section id="skills" className={`${bg} pt-24 pb-24`}>
      <div className="px-6 md:px-14 lg:px-20">
        <SectionHeader index="02" title="SKILLS" />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {SKILL_CATEGORIES.map(({ title, icon, items }) => (
            <motion.div
              key={title}
              variants={cardVariants}
              className={`border ${border} ${cardBg} p-6 group hover:bg-black hover:text-white transition-colors duration-300`}
            >
              {/* Card header */}
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-heading text-2xl tracking-wide">{title}</h3>
                <span className="font-body text-lg opacity-30 group-hover:opacity-60">{icon}</span>
              </div>

              {/* Skill list */}
              <ul className="flex flex-col gap-2">
                {items.map(item => (
                  <li
                    key={item}
                    className={`font-body text-xs tracking-wide flex items-center gap-2
                      ${item.startsWith('[') ? `${mutedText} group-hover:text-white/40 italic` : ''}
                    `}
                  >
                    <span className="inline-block w-1 h-1 rounded-full bg-current opacity-60 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
