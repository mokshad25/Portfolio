import { useState, useEffect } from 'react'
import { Github, Linkedin, Sun, Moon, Menu, X } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { motion, AnimatePresence } from 'framer-motion'

const NAV_LINKS = ['About', 'Skills', 'Work', 'Certifications', 'Connect']

export default function Navbar() {
  const { isRed, toggle, bg, border } = useTheme()
  const [scrolled, setScrolled]   = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (id) => {
    setMenuOpen(false)
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <nav
        className={`
          fixed top-0 left-0 right-0 z-50 border-b ${border} ${bg}
          transition-all duration-300
          ${scrolled ? 'shadow-[0_2px_0px_rgba(0,0,0,0.15)]' : ''}
        `}
      >
        <div className="flex items-center justify-between px-6 md:px-10 h-14">

          {/* ── Logo ── */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="font-heading text-3xl tracking-widest hover:opacity-60 transition-opacity"
          >
            MK
          </button>

          {/* ── Desktop nav ── */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(link => (
              <button
                key={link}
                onClick={() => scrollTo(link)}
                className="nav-link font-body text-xs tracking-[0.25em] uppercase font-medium hover:opacity-60 transition-opacity"
              >
                {link}
              </button>
            ))}
          </div>

          {/* ── Right icons ── */}
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/mokshad25"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="hover:opacity-50 transition-opacity"
            >
              <Github size={18} strokeWidth={1.8} />
            </a>
            <a
              href="https://www.linkedin.com/in/mokshad-kanaujia/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="hover:opacity-50 transition-opacity"
            >
              <Linkedin size={18} strokeWidth={1.8} />
            </a>

            {/* Theme toggle */}
            <button
              onClick={toggle}
              aria-label="Toggle theme"
              className="hover:opacity-50 transition-opacity"
            >
              {isRed ? <Sun size={18} strokeWidth={1.8} /> : <Moon size={18} strokeWidth={1.8} />}
            </button>

            {/* Mobile hamburger */}
            <button
              className="md:hidden hover:opacity-50 transition-opacity"
              onClick={() => setMenuOpen(v => !v)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile menu ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={`fixed top-14 left-0 right-0 z-40 ${bg} border-b ${border} md:hidden`}
          >
            <div className="flex flex-col px-6 py-4 gap-5">
              {NAV_LINKS.map(link => (
                <button
                  key={link}
                  onClick={() => scrollTo(link)}
                  className="font-body text-sm tracking-[0.3em] uppercase font-medium text-left hover:opacity-50 transition-opacity"
                >
                  {link}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
