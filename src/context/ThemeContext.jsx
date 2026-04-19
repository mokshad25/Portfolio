import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

// ─────────────────────────────────────────────────────────────────────────────
//  DEFAULT THEME
//  HOW TO CHANGE: set INITIAL_IS_RED to true/false.
//    false = start in LIGHT mode  ← current default
//    true  = start in RED dark mode
//
//  Note: if the user has already saved a preference in localStorage,
//  that takes priority over this value.
// ─────────────────────────────────────────────────────────────────────────────
const INITIAL_IS_RED = false

// localStorage key — change this string if you ever need to reset all users
const STORAGE_KEY = 'theme'

export function ThemeProvider({ children }) {
  // ── Initialise from localStorage, fall back to INITIAL_IS_RED ─────────────
  // Using a lazy initialiser so localStorage is only read once on mount,
  // not on every render.
  //
  // HOW TO DISABLE PERSISTENCE: replace the arrow function body with just:
  //   return INITIAL_IS_RED
  //
  const [isRed, setIsRed] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved === 'red')   return true
      if (saved === 'light') return false
    } catch {
      // localStorage unavailable (SSR, incognito restriction, etc.) — use default
    }
    return INITIAL_IS_RED
  })

  // ── Persist preference whenever it changes ────────────────────────────────
  // Runs after every isRed change so the next page load restores the choice.
  // HOW TO DISABLE PERSISTENCE: remove this useEffect.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, isRed ? 'red' : 'light')
    } catch { /* ignore write errors */ }
  }, [isRed])

  // ── Toggle ─────────────────────────────────────────────────────────────────
  const toggle = () => setIsRed(prev => !prev)

  // ── Convenience class strings (consumed by every component) ───────────────
  //
  // HOW TO CHANGE LIGHT MODE BACKGROUND:
  //   Replace 'bg-[#f5f5f5]' with any Tailwind bg class or arbitrary value.
  //   e.g. 'bg-white', 'bg-stone-100', 'bg-[#ebebeb]'
  //
  // DO NOT change the red value — that is the existing dark theme.
  //
  const bg       = isRed ? 'bg-[#c30101]' : 'bg-[#f5f5f5]'
  const text     = 'text-black'
  const border   = 'border-black'
  const cardBg   = isRed ? 'bg-black/[0.07]' : 'bg-black/[0.04]'
  const mutedText = isRed ? 'text-black/60' : 'text-black/50'

  return (
    <ThemeContext.Provider value={{ isRed, toggle, bg, text, border, cardBg, mutedText }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
