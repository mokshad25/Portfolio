import { motion } from 'framer-motion'
import { Github, Linkedin, Mail, ArrowUpRight } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import SectionHeader from './SectionHeader'

const LINKS = [
  {
    label: 'GitHub',
    handle: '@mokshad25',
    href: 'https://github.com/mokshad25',
    Icon: Github,
  },
  {
    label: 'LinkedIn',
    handle: 'mokshad-kanaujia',
    href: 'https://www.linkedin.com/in/mokshad-kanaujia/',
    Icon: Linkedin,
  },
  {
    label: 'Email',
    handle: 'mokshadkanaujia@gmail.com',
    href: 'mailto:mokshadkanaujia@gmail.com',
    Icon: Mail,
  },
]

export default function Connect() {
  const { bg, border, mutedText } = useTheme()

  return (
    <section id="connect" className={`${bg} pt-24 pb-0`}>
      <div className="px-6 md:px-14 lg:px-20">
        <SectionHeader index="05" title="CONNECT" />

        {/* CTA headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-14"
        >
          <h3 className="font-heading text-[9vw] md:text-[6vw] leading-none tracking-tight text-black">
            LET'S BUILD<br />SOMETHING.
          </h3>
        </motion.div>

        {/* Link rows */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.1 }}
          className={`border-t ${border} divide-y divide-black/20 mb-0`}
        >
          {LINKS.map(({ label, handle, href, Icon }) => (
            <motion.a
              key={label}
              href={href}
              target={label !== 'Email' ? '_blank' : undefined}
              rel="noopener noreferrer"
              variants={{
                hidden:  { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
              }}
              className={`
                flex items-center justify-between
                px-2 py-7 group
                hover:bg-black hover:text-white
                transition-colors duration-300
              `}
            >
              <div className="flex items-center gap-5">
                <Icon size={22} strokeWidth={1.5} className="shrink-0" />
                <div>
                  <p className={`font-body text-[10px] tracking-[0.3em] uppercase ${mutedText} group-hover:text-white/40`}>
                    {label}
                  </p>
                  <p className="font-heading text-2xl md:text-3xl tracking-wide mt-0.5">
                    {handle}
                  </p>
                </div>
              </div>
              <ArrowUpRight
                size={28}
                strokeWidth={1.2}
                className="opacity-30 group-hover:opacity-80 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300"
              />
            </motion.a>
          ))}
        </motion.div>
      </div>

      {/* Footer */}
      <footer className={`border-t ${border} mt-0 px-6 md:px-14 lg:px-20 py-5 flex flex-col md:flex-row items-center justify-between gap-2`}>
        <p className={`font-body text-[10px] tracking-[0.3em] uppercase ${mutedText}`}>
          © 2025 Mokshad Kanaujia
        </p>
        <p className={`font-body text-[10px] tracking-[0.3em] uppercase ${mutedText}`}>
          Built with React + Tailwind + Framer Motion
        </p>
      </footer>
    </section>
  )
}
