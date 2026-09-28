import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { profile } from '../../data'

type Theme = 'light' | 'dark'

type UI = {
  theme: Theme
  toggleTheme: (origin?: { x: number; y: number }) => void
  toast: (message: string) => void
  copyEmail: () => void
  paletteOpen: boolean
  setPaletteOpen: (open: boolean) => void
}

const Ctx = createContext<UI | null>(null)

export const useUI = () => {
  const ui = useContext(Ctx)
  if (!ui) throw new Error('useUI must be used inside <UIProvider>')
  return ui
}

function initialTheme(): Theme {
  try {
    const saved = localStorage.getItem('nuza-nb-theme')
    if (saved === 'light' || saved === 'dark') return saved
  } catch {
    /* storage unavailable */
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function UIProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(initialTheme)
  const [message, setMessage] = useState<string | null>(null)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const timer = useRef<number>(0)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try {
      localStorage.setItem('nuza-nb-theme', theme)
    } catch {
      /* storage unavailable */
    }
  }, [theme])

  const toggleTheme = useCallback((origin?: { x: number; y: number }) => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'
    const doc = document as Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void> } }
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!doc.startViewTransition || reduced) {
      setTheme(next)
      return
    }
    const x = origin?.x ?? window.innerWidth - 40
    const y = origin?.y ?? 32
    const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))
    const t = doc.startViewTransition(() => {
      document.documentElement.dataset.theme = next
      setTheme(next)
    })
    t.ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
        { duration: 550, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', pseudoElement: '::view-transition-new(root)' },
      )
    })
  }, [])

  const toast = useCallback((m: string) => {
    setMessage(m)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setMessage(null), 2200)
  }, [])

  const copyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      toast('Email copied to clipboard')
    } catch {
      window.location.href = `mailto:${profile.email}`
    }
  }, [toast])

  return (
    <Ctx.Provider value={{ theme, toggleTheme, toast, copyEmail, paletteOpen, setPaletteOpen }}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[80] flex justify-center" aria-live="polite">
        <AnimatePresence>
          {message && (
            <motion.p
              key={message}
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8 }}
              className="rounded-full border border-line bg-panel px-4 py-2 font-mono text-[13px] text-ink shadow-lg"
            >
              {message}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </Ctx.Provider>
  )
}

const GLYPHS = '!<>-_\\/[]{}=+*^?#abcdefxyz'

/** Cycles through phrases with a short scramble between them. */
export function Scramble({ phrases, interval = 2800 }: { phrases: string[]; interval?: number }) {
  const [text, setText] = useState(phrases[0])
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let i = 0
    let raf = 0
    const run = () => {
      const from = phrases[i % phrases.length]
      const to = phrases[++i % phrases.length]
      const len = Math.max(from.length, to.length)
      const start = performance.now()
      const frame = (now: number) => {
        const p = Math.min(1, (now - start) / 700)
        let out = ''
        for (let k = 0; k < len; k++) {
          const settle = k / len
          if (p > settle + 0.25) out += to[k] ?? ''
          else if (p > settle) out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
          else out += from[k] ?? ''
        }
        setText(out)
        if (p < 1) raf = requestAnimationFrame(frame)
        else setText(to)
      }
      raf = requestAnimationFrame(frame)
    }
    const id = window.setInterval(run, interval)
    return () => {
      window.clearInterval(id)
      cancelAnimationFrame(raf)
    }
  }, [phrases, interval])
  return (
    <span aria-live="off">
      <span className="sr-only">{phrases.join(', ')}</span>
      <span aria-hidden="true">{text}</span>
    </span>
  )
}
