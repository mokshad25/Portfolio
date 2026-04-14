import { createContext, useContext, useState } from 'react'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  // true  = RED mode  (dark)
  // false = WHITE mode (light)
  const [isRed, setIsRed] = useState(true)

  const toggle = () => setIsRed(prev => !prev)

  // Convenience class strings used across every component
  const bg      = isRed ? 'bg-[#c30101]' : 'bg-white'
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
