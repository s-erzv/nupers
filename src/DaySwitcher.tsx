import { useEffect, useRef, useState } from 'react'
import './switcher.css'
import { themes, todaysTheme, type ThemeInfo } from './themes'

/** Small floating control that says which day's theme is showing and lets visitors peek at the others. */
export default function DaySwitcher({ current, isToday }: { current: ThemeInfo; isToday: boolean }) {
  const [open, setOpen] = useState(false)
  const panel = useRef<HTMLDivElement>(null)
  const today = todaysTheme()

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    const onDown = (e: PointerEvent) => {
      if (panel.current && !panel.current.contains(e.target as Node)) setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('pointerdown', onDown)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('pointerdown', onDown)
    }
  }, [open])

  const href = (t: ThemeInfo) => (t.id === today.id ? location.pathname : `?theme=${t.id}`)

  return (
    <div className="wk" ref={panel}>
      {open && (
        <div className="wk-panel" role="dialog" aria-label="Pick a day">
          <p className="wk-title">A different portfolio every day</p>
          <p className="wk-sub">Today is {today.dayName}. Peek at the rest of the week:</p>
          <ul className="wk-list">
            {themes.map((t) => (
              <li key={t.id}>
                <a href={href(t)} className="wk-item" aria-current={t.id === current.id ? 'page' : undefined}>
                  <span className="wk-sw" style={{ background: `linear-gradient(135deg, ${t.swatch[0]} 50%, ${t.swatch[1]} 50%)` }} />
                  <span className="wk-text">
                    <span className="wk-name">
                      {t.name}
                      {t.id === today.id && <span className="wk-today">today</span>}
                    </span>
                    <span className="wk-day">
                      {t.dayName} · {t.hari}
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      <button className="wk-pill" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <span className="wk-sw" style={{ background: `linear-gradient(135deg, ${current.swatch[0]} 50%, ${current.swatch[1]} 50%)` }} />
        <span>
          {isToday ? `${current.dayName}'s theme` : `Previewing ${current.dayName}`}: <b>{current.name}</b>
        </span>
        <span className="wk-caret" aria-hidden="true">
          {open ? '×' : '▴'}
        </span>
      </button>
    </div>
  )
}
