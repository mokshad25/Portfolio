import { motion } from 'framer-motion'
import { ExternalLink, Github } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import SectionHeader from './SectionHeader'
import Ticker from './Ticker'

/*
  ────────────────────────────────────────────────────────────────────────────
  HOW TO ADD / UPDATE PROJECTS
  Edit the PROJECTS array below. Each project object has:

    title       : string  — project name
    description : string  — 1–2 sentence summary
    tags        : string[] — tech stack
    live        : string  — live URL, or null to hide button
    github      : string  — GitHub URL, or null to hide button
    figma       : string  — Figma URL (see instructions below), or null

  HOW TO EMBED / LINK A FIGMA PROJECT
    Option A (link card): set `figma: "YOUR_FIGMA_FILE_URL"` — a "View in Figma →"
    button appears automatically on that card.

    Option B (iframe embed): Replace the card body with:
      <iframe
        src="https://www.figma.com/embed?embed_host=share&url=YOUR_ENCODED_FIGMA_URL"
        className="w-full h-[400px] border-0"
        allowFullScreen
      />
    Figma embed URLs follow the pattern above — enable "Anyone with link can view"
    in your Figma share settings first.
  ────────────────────────────────────────────────────────────────────────────
*/
const PROJECTS = [
  {
    title: 'Project Alpha',
    description:
      'A short, punchy description of what this project does and why it matters. Replace this with your actual project summary.',
    tags: ['Python', 'Network Security', 'Bash'],
    live: null,
    github: 'https://github.com/mokshad25',
    figma: null,
  },
  {
    title: 'LinkedIn-Style Professional Networking & Job Platform',
    description:
      '•	Built a full-stack LinkedIn-style platform with authentication, role-based access (student, recruiter, admin), and scalable architecture using Supabase',
    tags: ['React', 'Node.js', 'Docker'],
    live: '#',
    github: 'https://github.com/mokshad25',
    figma: null,
  },
  {
    title: 'Figma / Design Work',
    description:
      'Replace this card with your Figma project. Set the `figma` URL in the PROJECTS array above and it will show a "View in Figma" button automatically.',
    tags: ['Figma', 'UI/UX', 'Prototyping'],
    live: null,
    github: null,
    figma: '#',   // ← replace with your actual Figma share URL
  },
   {
    title: 'Figma / Design Work',
    description:
      'Replace this card with your Figma project. Set the `figma` URL in the PROJECTS array above and it will show a "View in Figma" button automatically.',
    tags: ['Figma', 'UI/UX', 'Prototyping'],
    live: null,
    github: null,
    figma: '#',   // ← replace with your actual Figma share URL
  }, {
    title: 'Figma / Design Work',
    description:
      'Replace this card with your Figma project. Set the `figma` URL in the PROJECTS array above and it will show a "View in Figma" button automatically.',
    tags: ['Figma', 'UI/UX', 'Prototyping'],
    live: null,
    github: null,
    figma: '#',   // ← replace with your actual Figma share URL
  }, {
    title: 'Figma / Design Work',
    description:
      'Replace this card with your Figma project. Set the `figma` URL in the PROJECTS array above and it will show a "View in Figma" button automatically.',
    tags: ['Figma', 'UI/UX', 'Prototyping'],
    live: null,
    github: null,
    figma: '#',   // ← replace with your actual Figma share URL
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}
const cardVariants = {
  hidden:  { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

function ProjectCard({ project }) {
  const { border, cardBg, mutedText } = useTheme()
  const { title, description, tags, live, github, figma } = project

  return (
    <motion.article
      variants={cardVariants}
      className={`border ${border} ${cardBg} p-7 flex flex-col group hover:bg-black hover:text-white transition-colors duration-300`}
    >
      {/* Index dot */}
      <span className={`font-body text-[10px] tracking-[0.3em] uppercase ${mutedText} group-hover:text-white/40 mb-3`}>
        Project
      </span>

      <h3 className="font-heading text-3xl md:text-4xl tracking-wide mb-3">{title}</h3>

      <p className={`font-body text-sm leading-relaxed ${mutedText} group-hover:text-white/60 flex-1 mb-5`}>
        {description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tags.map(tag => (
          <span
            key={tag}
            className={`font-body text-[10px] tracking-[0.2em] uppercase border ${border} px-2 py-1 group-hover:border-white/30`}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap gap-3 mt-auto">
        {github && (
          <a
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1.5 font-body text-[11px] tracking-[0.2em] uppercase border ${border} px-3 py-1.5 hover:bg-white hover:text-black group-hover:border-white transition-colors`}
          >
            <Github size={12} /> GitHub
          </a>
        )}
        {live && (
          <a
            href={live}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1.5 font-body text-[11px] tracking-[0.2em] uppercase border ${border} px-3 py-1.5 hover:bg-white hover:text-black group-hover:border-white transition-colors`}
          >
            <ExternalLink size={12} /> Live
          </a>
        )}
        {figma && (
          <a
            href={figma}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1.5 font-body text-[11px] tracking-[0.2em] uppercase border ${border} px-3 py-1.5 hover:bg-white hover:text-black group-hover:border-white transition-colors`}
          >
            <ExternalLink size={12} /> View in Figma
          </a>
        )}
      </div>
    </motion.article>
  )
}

export default function Work() {
  const { bg } = useTheme()

  return (
    <section id="work" className={`${bg} pt-24 pb-0`}>
      <div className="px-6 md:px-14 lg:px-20">
        <SectionHeader index="03" title="WORK" />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-16"
        >
          {PROJECTS.map(p => <ProjectCard key={p.title} project={p} />)}
        </motion.div>
      </div>
      <Ticker />
    </section>
  )
}
