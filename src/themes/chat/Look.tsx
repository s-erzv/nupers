import { useEffect, useRef, useState } from 'react'
import { LuCheck, LuMoon, LuSun } from 'react-icons/lu'

export type Wall = 'doodles' | 'bubbles' | 'grid' | 'plain'
export type Look = { dark: boolean; wall: Wall; accent: string }

export const ACCENTS = [
  { name: 'Green', value: '#1f9d74' },
  { name: 'Blue', value: '#2f6bff' },
  { name: 'Pink', value: '#e0457b' },
  { name: 'Orange', value: '#e8772e' },
  { name: 'Purple', value: '#7c5cff' },
]
const WALLS: { id: Wall; name: string }[] = [
  { id: 'doodles', name: 'Doodles' },
  { id: 'bubbles', name: 'Bubbles' },
  { id: 'grid', name: 'Grid' },
  { id: 'plain', name: 'Plain' },
]
const KEY = 'nupers-chat-look'

export function useLook() {
  const [look, setLook] = useState<Look>(() => {
    const fallback: Look = {
      dark: window.matchMedia('(prefers-color-scheme: dark)').matches,
      wall: 'doodles',
      accent: ACCENTS[0].value,
    }
    try {
      return { ...fallback, ...JSON.parse(localStorage.getItem(KEY) ?? '{}') }
    } catch {
      return fallback
    }
  })
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(look))
    } catch {
      /* private mode: the look just isn't remembered */
    }
  }, [look])
  return [look, setLook] as const
}

/** The animated chat wallpaper. */
export function Wallpaper({ wall }: { wall: Wall }) {
  const grid = useRef<HTMLDivElement>(null)

  // the grid wallpaper lights up around the cursor
  useEffect(() => {
    if (wall !== 'grid') return
    const el = grid.current!
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      el.style.setProperty('--gx', `${e.clientX - r.left}px`)
      el.style.setProperty('--gy', `${e.clientY - r.top}px`)
    }
    window.addEventListener('pointermove', move)
    return () => window.removeEventListener('pointermove', move)
  }, [wall])

  if (wall === 'plain') return null
  if (wall === 'grid')
    return (
      <div className="c-wall c-wall--grid" ref={grid} aria-hidden="true">
        <span />
      </div>
    )
  if (wall === 'bubbles')
    return (
      <div className="c-wall c-wall--bubbles" aria-hidden="true">
        {Array.from({ length: 14 }, (_, i) => (
          <i
            key={i}
            style={
              {
                '--x': `${(i * 37) % 100}%`,
                '--s': `${24 + ((i * 53) % 90)}px`,
                '--d': `${14 + ((i * 7) % 12)}s`,
                '--delay': `${-((i * 3.1) % 20)}s`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>
    )
  return <div className="c-wall c-wall--doodles" aria-hidden="true" />
}

export function LookPanel({ look, setLook, close }: { look: Look; setLook: (l: Look) => void; close: () => void }) {
  const panel = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close()
    const onDown = (e: PointerEvent) => {
      if (panel.current && !panel.current.contains(e.target as Node) && !(e.target as HTMLElement).closest('.c-look-btn')) close()
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('pointerdown', onDown)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('pointerdown', onDown)
    }
  }, [close])

  return (
    <div className="c-look" ref={panel} role="dialog" aria-label="Chat appearance">
      <p className="c-look-title">Appearance</p>
      <div className="c-look-mode" role="group" aria-label="Color mode">
        <button aria-pressed={!look.dark} onClick={() => setLook({ ...look, dark: false })}>
          <LuSun aria-hidden="true" /> Light
        </button>
        <button aria-pressed={look.dark} onClick={() => setLook({ ...look, dark: true })}>
          <LuMoon aria-hidden="true" /> Dark
        </button>
      </div>
      <p className="c-look-title">Wallpaper</p>
      <div className="c-look-walls" role="group" aria-label="Wallpaper">
        {WALLS.map((w) => (
          <button key={w.id} aria-pressed={look.wall === w.id} onClick={() => setLook({ ...look, wall: w.id })}>
            <span className={`c-look-thumb c-look-thumb--${w.id}`} aria-hidden="true" />
            {w.name}
          </button>
        ))}
      </div>
      <p className="c-look-title">Accent</p>
      <div className="c-look-accents" role="group" aria-label="Accent color">
        {ACCENTS.map((a) => (
          <button
            key={a.value}
            aria-pressed={look.accent === a.value}
            aria-label={a.name}
            style={{ background: a.value }}
            onClick={() => setLook({ ...look, accent: a.value })}
          >
            {look.accent === a.value && <LuCheck aria-hidden="true" />}
          </button>
        ))}
      </div>
    </div>
  )
}
