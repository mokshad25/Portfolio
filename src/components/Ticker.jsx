import { useTheme } from '../context/ThemeContext'

const ITEMS = [
  'MOKSHAD KANAUJIA',
  '✦',
  'COMPUTER SCIENCE',
  '✦',
  'CYBERSECURITY',
  '✦',
  'AVAILABLE FOR INTERNSHIPS',
  '✦',
  'ETHICAL HACKING',
  '✦',
  'NETWORK SECURITY',
  '✦',
  'CREATIVE DEVELOPER',
  '✦',
]

// Duplicate so the seamless loop works (50% → 50% trick)
const REPEATED = [...ITEMS, ...ITEMS]

export default function Ticker({ className = '' }) {
  const { border } = useTheme()

  return (
    <div className={`border-t border-b ${border} overflow-hidden py-2 ${className}`}>
      <div className="ticker-track select-none">
        {REPEATED.map((item, i) => (
          <span
            key={i}
            className="font-body text-[10px] tracking-[0.3em] uppercase font-medium px-4 whitespace-nowrap"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
