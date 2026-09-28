import { useCallback, useEffect, useRef, useState } from 'react'
import { PlacePanel } from './Panels'
import {
  CAT,
  COLS,
  IDEA_SPOTS,
  ROWS,
  SIGN,
  SPAWN,
  TILE,
  buildingAt,
  buildings,
  drawBuilding,
  drawCat,
  drawGround,
  drawIdea,
  drawPlayer,
  drawSign,
  isDoor,
  walkable,
  type PlaceId,
} from './world'

type Dir = 'up' | 'down' | 'left' | 'right'
type Dialog = { kind: 'place'; id: PlaceId } | { kind: 'talk'; speaker: string; lines: string[] } | { kind: 'map' } | null

const DELTA: Record<Dir, [number, number]> = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] }
const KEYS: Record<string, Dir> = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  w: 'up',
  s: 'down',
  a: 'left',
  d: 'right',
  W: 'up',
  S: 'down',
  A: 'left',
  D: 'right',
}
const STEP_MS = 150
const STORE = 'nupers-quest-ideas'

const SIGN_LINES = [
  'Welcome to Nuza Town!',
  'Walk with the arrow keys or WASD. On a phone, use the pad at the bottom.',
  'Step into a door to enter. Press Enter or Space to talk to things you face.',
  'There are 7 late-night ideas glowing around town. One for each day of the week.',
]
const CAT_LINES = ['Meow.', '...', "Mochi says: she debugs best after midnight. Don't tell her manager."]

function isNight() {
  const h = Number(new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Jakarta', hour: '2-digit', hour12: false }).format(new Date()))
  return h >= 18 || h < 6
}

function loadIdeas(): number[] {
  try {
    const v = JSON.parse(localStorage.getItem(STORE) ?? '[]')
    return Array.isArray(v) ? v.filter((n) => typeof n === 'number') : []
  } catch {
    return []
  }
}

export default function Quest() {
  const canvas = useRef<HTMLCanvasElement>(null)
  const [dialog, setDialog] = useState<Dialog>(null)
  const [found, setFound] = useState<number[]>(loadIdeas)
  const [night, setNight] = useState(isNight)
  const [toastMsg, setToastMsg] = useState<string | null>(null)
  const [hint, setHint] = useState(true)
  const toastTimer = useRef(0)

  const dialogRef = useRef(dialog)
  dialogRef.current = dialog
  const foundRef = useRef(found)
  foundRef.current = found
  const nightRef = useRef(night)
  nightRef.current = night

  const player = useRef({ x: SPAWN.x, y: SPAWN.y, fromX: SPAWN.x, fromY: SPAWN.y, t: 1, facing: 'down' as Dir, steps: 0 })
  const held = useRef<Dir[]>([])

  const toast = useCallback((m: string) => {
    setToastMsg(m)
    window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToastMsg(null), 2600)
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(STORE, JSON.stringify(found))
    } catch {
      /* storage unavailable */
    }
  }, [found])

  const openPlace = useCallback((id: PlaceId) => {
    held.current = []
    setHint(false)
    setDialog({ kind: 'place', id })
  }, [])

  const closeDialog = useCallback(() => {
    const d = dialogRef.current
    setDialog(null)
    // step back out of the doorway so closing doesn't re-open it
    if (d?.kind === 'place') {
      const b = buildings.find((x) => x.id === d.id)!
      const p = player.current
      if (p.x === b.door.x && p.y === b.door.y) {
        p.y = p.fromY = b.door.y + 1
        p.x = p.fromX = b.door.x
        p.facing = 'down'
      }
    }
  }, [])

  const interact = useCallback(() => {
    const p = player.current
    const [dx, dy] = DELTA[p.facing]
    const tx = p.x + dx
    const ty = p.y + dy
    if (tx === SIGN.x && ty === SIGN.y) setDialog({ kind: 'talk', speaker: 'Signpost', lines: SIGN_LINES })
    else if (tx === CAT.x && ty === CAT.y) setDialog({ kind: 'talk', speaker: 'Mochi', lines: CAT_LINES })
    else {
      const b = buildingAt(tx, ty)
      if (b) openPlace(b.id)
    }
  }, [openPlace])

  /* keyboard */
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.closest?.('input, textarea')) return
      if (dialogRef.current) {
        if (e.key === 'Escape') closeDialog()
        return
      }
      const dir = KEYS[e.key]
      if (dir) {
        e.preventDefault()
        setHint(false)
        if (!held.current.includes(dir)) held.current.unshift(dir)
      } else if (e.key === 'Enter' || e.key === ' ' || e.key === 'e') {
        e.preventDefault()
        interact()
      } else if (e.key === 'm') setDialog({ kind: 'map' })
    }
    const up = (e: KeyboardEvent) => {
      const dir = KEYS[e.key]
      if (dir) held.current = held.current.filter((d) => d !== dir)
    }
    const blur = () => (held.current = [])
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    window.addEventListener('blur', blur)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
      window.removeEventListener('blur', blur)
    }
  }, [closeDialog, interact])

  /* game loop */
  useEffect(() => {
    const c = canvas.current!
    const ctx = c.getContext('2d')!
    c.width = COLS * TILE
    c.height = ROWS * TILE
    ctx.imageSmoothingEnabled = false
    let raf = 0
    let last = performance.now()

    const tryMove = () => {
      const p = player.current
      const dir = held.current[0]
      if (!dir || dialogRef.current) return
      p.facing = dir
      const [dx, dy] = DELTA[dir]
      if (!walkable(p.x + dx, p.y + dy)) return
      p.fromX = p.x
      p.fromY = p.y
      p.x += dx
      p.y += dy
      p.t = 0
      p.steps++
    }

    const arrive = () => {
      const p = player.current
      const spot = IDEA_SPOTS.findIndex((s) => s.x === p.x && s.y === p.y)
      if (spot >= 0 && !foundRef.current.includes(spot)) {
        const next = [...foundRef.current, spot]
        setFound(next)
        if (next.length === IDEA_SPOTS.length)
          setDialog({
            kind: 'talk',
            speaker: 'You',
            lines: [
              'All 7 late-night ideas found!',
              'One for every day of the week. This portfolio changes every day too.',
              'Come back tomorrow for a completely different one. Or email me your own idea at the Post Office.',
            ],
          })
        else toast(`Found a late-night idea! ${next.length}/${IDEA_SPOTS.length}`)
      }
      const door = isDoor(p.x, p.y)
      if (door) openPlace(door.id)
    }

    const loop = (now: number) => {
      const dt = now - last
      last = now
      const p = player.current
      if (p.t < 1) {
        p.t = Math.min(1, p.t + dt / STEP_MS)
        if (p.t === 1) arrive()
      }
      if (p.t === 1) tryMove()

      // draw
      drawGround(ctx)
      const lit = nightRef.current
      for (const b of buildings) drawBuilding(ctx, b, lit)
      drawSign(ctx)
      IDEA_SPOTS.forEach((s, i) => !foundRef.current.includes(i) && drawIdea(ctx, s.x, s.y, now))
      drawCat(ctx, now)
      const x = (p.fromX + (p.x - p.fromX) * p.t) * TILE
      const y = (p.fromY + (p.y - p.fromY) * p.t) * TILE - (p.t < 1 && p.t > 0.3 && p.t < 0.8 ? 1 : 0)
      drawPlayer(ctx, Math.round(x), Math.round(y), p.steps, p.facing)

      if (lit) {
        // night: the town goes dark and the bulb becomes your lantern
        ctx.save()
        const g = ctx.createRadialGradient(x + 8, y + 4, 8, x + 8, y + 4, 70)
        g.addColorStop(0, 'rgba(18, 16, 48, 0)')
        g.addColorStop(1, 'rgba(18, 16, 48, 0.72)')
        ctx.fillStyle = g
        ctx.fillRect(0, 0, c.width, c.height)
        ctx.globalCompositeOperation = 'lighter'
        const warm = ctx.createRadialGradient(x + 8, y + 4, 0, x + 8, y + 4, 40)
        warm.addColorStop(0, 'rgba(255, 190, 90, 0.25)')
        warm.addColorStop(1, 'rgba(255, 190, 90, 0)')
        ctx.fillStyle = warm
        ctx.fillRect(0, 0, c.width, c.height)
        ctx.restore()
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [openPlace, toast])

  /* clicking a building, the sign or the cat opens it directly */
  const onCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    const tx = Math.floor(((e.clientX - r.left) / r.width) * COLS)
    const ty = Math.floor(((e.clientY - r.top) / r.height) * ROWS)
    const b = buildingAt(tx, ty)
    if (b) openPlace(b.id)
    else if (tx === SIGN.x && ty === SIGN.y) setDialog({ kind: 'talk', speaker: 'Signpost', lines: SIGN_LINES })
    else if (tx === CAT.x && ty === CAT.y) setDialog({ kind: 'talk', speaker: 'Mochi', lines: CAT_LINES })
  }

  const press = (dir: Dir) => ({
    onPointerDown: (e: React.PointerEvent) => {
      e.preventDefault()
      setHint(false)
      if (!held.current.includes(dir)) held.current.unshift(dir)
    },
    onPointerUp: () => (held.current = held.current.filter((d) => d !== dir)),
    onPointerLeave: () => (held.current = held.current.filter((d) => d !== dir)),
    onPointerCancel: () => (held.current = held.current.filter((d) => d !== dir)),
  })

  const place = dialog?.kind === 'place' ? buildings.find((b) => b.id === dialog.id)! : null

  return (
    <div className={`q-root ${night ? 'is-night' : ''}`}>
      <header className="q-hud">
        <div className="q-badge">
          <span className="q-mini-bulb" aria-hidden="true" />
          <span>
            <b>nuza</b>
            <small>Fullstack developer</small>
          </span>
        </div>
        <div className="q-hud-right">
          <p className="q-ideas" aria-label={`${found.length} of ${IDEA_SPOTS.length} ideas found`}>
            {IDEA_SPOTS.map((_, i) => (
              <span key={i} className={found.includes(i) ? 'is-on' : ''} aria-hidden="true" />
            ))}
          </p>
          <button className="q-btn q-btn--sm" onClick={() => setNight((n) => !n)} aria-pressed={night}>
            {night ? 'Night' : 'Day'}
          </button>
          <button className="q-btn q-btn--sm" onClick={() => setDialog({ kind: 'map' })}>
            Quick travel
          </button>
        </div>
      </header>

      <main className="q-stage">
        <h1 className="q-sr">nuza, fullstack developer: an explorable pixel town portfolio</h1>
        <div className="q-frame">
          <canvas
            ref={canvas}
            className="q-canvas"
            onClick={onCanvasClick}
            role="img"
            aria-label="Pixel town with six buildings: House (about), Workshop (projects), Library (research), Guild Hall (experience), Post Office (contact) and Armory (skills). Use Quick travel to open any of them."
          />
          {buildings.map((b) => (
            <button
              key={b.id}
              className="q-label"
              style={{ left: `${((b.x + b.w / 2) / COLS) * 100}%`, top: `${(b.y / ROWS) * 100}%` }}
              onClick={() => openPlace(b.id)}
            >
              {b.label}
            </button>
          ))}
          {hint && (
            <p className="q-hint">
              <span className="q-keys">
                <kbd>←</kbd>
                <kbd>↑</kbd>
                <kbd>↓</kbd>
                <kbd>→</kbd>
              </span>
              to walk. Walk into a door, or click a building.
            </p>
          )}
        </div>

        <div className="q-pad" aria-label="Movement controls">
          <button className="q-pad-up" aria-label="Walk up" {...press('up')}>
            ▲
          </button>
          <button className="q-pad-left" aria-label="Walk left" {...press('left')}>
            ◀
          </button>
          <button className="q-pad-right" aria-label="Walk right" {...press('right')}>
            ▶
          </button>
          <button className="q-pad-down" aria-label="Walk down" {...press('down')}>
            ▼
          </button>
          <button className="q-pad-a" aria-label="Talk or interact" onClick={interact}>
            A
          </button>
        </div>
      </main>

      {dialog && (
        <div className="q-overlay" onMouseDown={(e) => e.target === e.currentTarget && closeDialog()}>
          {dialog.kind === 'talk' && <Talk speaker={dialog.speaker} lines={dialog.lines} onDone={closeDialog} />}
          {dialog.kind === 'map' && (
            <section className="q-window q-window--sm" role="dialog" aria-modal="true" aria-labelledby="q-map-title">
              <header className="q-window-bar">
                <h2 id="q-map-title">Quick travel</h2>
                <button className="q-x" onClick={closeDialog} aria-label="Close">
                  ×
                </button>
              </header>
              <ul className="q-travel">
                {buildings.map((b) => (
                  <li key={b.id}>
                    <button onClick={() => openPlace(b.id)} autoFocus={b.id === 'house'}>
                      <span className="q-roof" style={{ background: b.roof }} />
                      <span>
                        <b>{b.name}</b>
                        <small>{b.label}</small>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )}
          {place && (
            <section className="q-window" role="dialog" aria-modal="true" aria-labelledby="q-place-title">
              <header className="q-window-bar" style={{ background: place.roof }}>
                <h2 id="q-place-title">
                  {place.name} <small>{place.label}</small>
                </h2>
                <button className="q-x" onClick={closeDialog} aria-label="Close" autoFocus>
                  ×
                </button>
              </header>
              <div className="q-window-body">
                <PlacePanel id={place.id} toast={toast} />
              </div>
              <footer className="q-window-foot">Esc to leave · ↑↓ to browse</footer>
            </section>
          )}
        </div>
      )}

      {toastMsg && (
        <p className="q-toast" role="status">
          {toastMsg}
        </p>
      )}
    </div>
  )
}

function Talk({ speaker, lines, onDone }: { speaker: string; lines: string[]; onDone: () => void }) {
  const [i, setI] = useState(0)
  const [shown, setShown] = useState('')
  const line = lines[i]

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(line)
      return
    }
    setShown('')
    let k = 0
    const id = window.setInterval(() => {
      k++
      setShown(line.slice(0, k))
      if (k >= line.length) window.clearInterval(id)
    }, 22)
    return () => window.clearInterval(id)
  }, [line])

  const next = useCallback(() => {
    if (shown.length < line.length) setShown(line)
    else if (i < lines.length - 1) setI(i + 1)
    else onDone()
  }, [shown, line, i, lines.length, onDone])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'e') {
        e.preventDefault()
        next()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next])

  return (
    <section className="q-talk" role="dialog" aria-modal="true" aria-label={speaker} onClick={next}>
      <p className="q-speaker">{speaker}</p>
      <p className="q-line" aria-live="polite">
        {shown}
      </p>
      <span className="q-more" aria-hidden="true">
        {i < lines.length - 1 ? '▼' : '■'}
      </span>
      <span className="q-sr">Press Enter to continue</span>
    </section>
  )
}
