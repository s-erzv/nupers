import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { LuArrowUpRight, LuDownload, LuX } from 'react-icons/lu'
import { experience, featured, more, profile, publications, type Project } from '../../data'
import { stack } from '../../stack'
import Stars from './Stars'

/** Depth units between two stops in the tunnel, and how many depth units one pixel of scroll moves the camera. */
const GAP = 1100
const K = 2.2
/** Depth of stop i. The intro gets extra room so nothing overlaps the name on load. */
const zOf = (i: number) => (i === 0 ? 0 : i * GAP + 1000)

type Stop = { key: string; x: number; y: number; node: ReactNode; wide?: boolean }

export default function Warp() {
  const [reduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [open, setOpen] = useState<Project | null>(null)
  const refs = useRef<(HTMLDivElement | null)[]>([])
  const cam = useRef(0)
  const speed = useRef(0)
  const hud = useRef<HTMLSpanElement>(null)
  const bar = useRef<HTMLSpanElement>(null)

  const paper = publications[0]
  const current = experience.find((r) => r.current)

  const stops: Stop[] = useMemo(() => {
    const s: Stop[] = []
    s.push({
      key: 'intro',
      x: 0,
      y: 0,
      wide: true,
      node: (
        <header className="w-intro">
          <h1>
            <span>Call me</span>
            <span>Nuza</span>
          </h1>
          <p>
            I'm Sarah Fajriah Rahmah, fullstack developer and Information Systems undergrad. Scroll to fly through what I've
            built.
          </p>
          <span className="w-scrollcue" aria-hidden="true" />
        </header>
      ),
    })
    featured.forEach((p, i) => {
      s.push({
        key: p.slug,
        x: i % 2 ? 0.2 : -0.2,
        y: i % 3 === 0 ? -0.06 : 0.05,
        node: <Card p={p} onOpen={setOpen} big />,
      })
    })
    s.push({
      key: 'more-title',
      x: 0,
      y: 0,
      wide: true,
      node: <p className="w-shout">and {more.length} more</p>,
    })
    more.forEach((p, i) => {
      const slot = i % 3
      s.push({
        key: p.slug,
        x: [-0.26, 0.26, 0][slot],
        y: [0.1, -0.08, 0.16][slot],
        node: <Card p={p} onOpen={setOpen} />,
      })
    })
    if (paper)
      s.push({
        key: 'paper',
        x: 0,
        y: 0,
        node: (
          <article className="w-panel w-paper">
            <p className="w-kicker">Published {paper.year}</p>
            <h2 lang="id">{paper.title}</h2>
            <p className="w-dim">{paper.venue}</p>
            {paper.href && (
              <a className="w-btn" href={paper.href} target="_blank" rel="noreferrer">
                Read the paper <LuArrowUpRight aria-hidden="true" />
              </a>
            )}
          </article>
        ),
      })
    s.push({
      key: 'xp',
      x: 0,
      y: 0,
      wide: true,
      node: (
        <section className="w-xp" aria-label="Experience">
          <h2 className="w-shout">Where I've been</h2>
          <ol>
            {experience.map((r) => (
              <li key={r.org + r.title}>
                <b>{r.title}</b>
                <span>
                  {r.org}, {r.period}
                </span>
              </li>
            ))}
          </ol>
        </section>
      ),
    })
    s.push({
      key: 'stack',
      x: 0,
      y: 0,
      wide: true,
      node: (
        <section className="w-ring" aria-label="Stack">
          <ul>
            {stack.map(({ name, icon: Icon }, i) => (
              <li key={name} style={{ '--a': `${(360 / stack.length) * i}deg` } as React.CSSProperties} title={name}>
                <Icon aria-hidden="true" />
                <span className="w-sr">{name}</span>
              </li>
            ))}
          </ul>
          <p>
            Mostly Next.js, TypeScript and Supabase.
            <br />
            Solidity when it goes on-chain.
          </p>
        </section>
      ),
    })
    s.push({
      key: 'end',
      x: 0,
      y: 0,
      wide: true,
      node: (
        <footer className="w-end">
          <p className="w-kicker">End of the tunnel</p>
          <h2>Say hi.</h2>
          <a className="w-mail" href={`mailto:${profile.email}`}>
            {profile.email}
          </a>
          <div className="w-row">
            {profile.socials.map((x) => (
              <a key={x.label} className="w-btn w-btn--ghost" href={x.href} target="_blank" rel="noreferrer">
                {x.label}
              </a>
            ))}
            <a className="w-btn" href={profile.resume} download>
              <LuDownload aria-hidden="true" /> Résumé
            </a>
          </div>
          {current && <p className="w-dim">Currently {current.title.toLowerCase()} at {current.org}.</p>}
        </footer>
      ),
    })
    return s
  }, [paper, current])

  const depth = zOf(stops.length - 1)

  // the flight loop: ease the camera toward the scroll position and place every stop in 3D
  useEffect(() => {
    if (reduced) return
    let raf = 0
    const tick = () => {
      raf = requestAnimationFrame(tick)
      const target = window.scrollY * K
      const prev = cam.current
      cam.current += (target - cam.current) * 0.09
      speed.current = cam.current - prev
      const vw = window.innerWidth
      const vh = window.innerHeight
      const spread = vw < 700 ? 0.35 : 1
      stops.forEach((st, i) => {
        const el = refs.current[i]
        if (!el) return
        const rel = zOf(i) - cam.current
        if (rel > 5200 || rel < -900) {
          el.style.visibility = 'hidden'
          return
        }
        el.style.visibility = 'visible'
        el.style.zIndex = String(stops.length - i)
        const fadeIn = Math.min(1, (5200 - rel) / 1600)
        const fadeOut = rel < 0 ? Math.max(0, 1 + rel / 700) : 1
        // keep the intro clean until the flight starts
        const launch = i === 0 ? 1 : Math.min(1, cam.current / 500)
        el.style.opacity = String(Math.min(fadeIn, fadeOut) * launch)
        el.style.transform = `translate(-50%, -50%) translate3d(${st.x * vw * spread}px, ${st.y * vh}px, ${-rel}px)`
        el.style.pointerEvents = rel < 1400 && rel > -200 ? 'auto' : 'none'
        el.style.filter = rel > 2400 ? `blur(${Math.min(4, (rel - 2400) / 600)}px)` : 'none'
      })
      if (hud.current) hud.current.textContent = (cam.current / 1000).toFixed(1)
      if (bar.current) bar.current.style.transform = `scaleX(${Math.min(1, cam.current / depth)})`
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [stops, reduced, depth])

  // when a card is focused with the keyboard, fly to it
  const flyTo = (i: number) => {
    if (reduced) return
    const y = (zOf(i) - 250) / K
    if (Math.abs(window.scrollY - y) > 40) window.scrollTo({ top: y })
  }

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  if (reduced)
    return (
      <div className="w-flat">
        {stops.map((st) => (
          <div key={st.key} className="w-flat-item">
            {st.node}
          </div>
        ))}
        {open && <Detail p={open} close={() => setOpen(null)} />}
      </div>
    )

  return (
    <div className="w-root">
      <Stars speed={speed} />
      <div className="w-stage" aria-live="off">
        {stops.map((st, i) => (
          <div
            key={st.key}
            ref={(el) => {
              refs.current[i] = el
            }}
            className={`w-stop ${st.wide ? 'w-stop--wide' : ''}`}
            onFocusCapture={() => flyTo(i)}
          >
            {st.node}
          </div>
        ))}
      </div>
      <div className="w-hud" aria-hidden="true">
        <span className="w-hud-num">
          <span ref={hud}>0.0</span> ly
        </span>
        <span className="w-hud-bar">
          <span ref={bar} />
        </span>
      </div>
      {/* the page's real height drives the flight */}
      <div style={{ height: `calc(${depth / K}px + 100svh)` }} aria-hidden="true" />
      {open && <Detail p={open} close={() => setOpen(null)} />}
    </div>
  )
}

function Card({ p, onOpen, big }: { p: Project; onOpen: (p: Project) => void; big?: boolean }) {
  return (
    <button className={`w-card ${big ? 'w-card--big' : ''}`} onClick={() => onOpen(p)}>
      {p.image && <img src={p.image} alt="" loading="lazy" draggable={false} />}
      <span className="w-card-body">
        <span className="w-card-name">{p.name}</span>
        <span className="w-card-line">{p.tagline}</span>
        {big && p.stats && (
          <span className="w-card-stat">
            <b>{p.stats[0].value}</b> {p.stats[0].label}
          </span>
        )}
      </span>
    </button>
  )
}

function Detail({ p, close }: { p: Project; close: () => void }) {
  return (
    <div className="w-scrim" onPointerDown={(e) => e.target === e.currentTarget && close()}>
      <article className="w-detail" role="dialog" aria-modal="true" aria-labelledby="w-detail-title">
        <button className="w-close" onClick={close} aria-label="Close" autoFocus>
          <LuX />
        </button>
        {p.image && <img src={p.image} alt={`Screens from ${p.name}`} />}
        <div className="w-detail-body">
          <p className="w-kicker">
            {p.category}
            {p.year && `, ${p.year}`}
            {p.context && `. ${p.context}`}
          </p>
          <h2 id="w-detail-title">{p.name}</h2>
          <p className="w-lead">{p.tagline}</p>
          <p>{p.description}</p>
          {p.highlights && (
            <ul>
              {p.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          )}
          {p.stats && (
            <div className="w-stats">
              {p.stats.map((s) => (
                <div key={s.label}>
                  <b>{s.value}</b>
                  <span>{s.label}</span>
                </div>
              ))}
            </div>
          )}
          <p className="w-tags">
            {p.stack.map((s) => (
              <span key={s}>{s}</span>
            ))}
          </p>
        </div>
      </article>
    </div>
  )
}
