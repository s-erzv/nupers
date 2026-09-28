import { useCallback, useEffect, useRef, useState } from 'react'
import { LuArrowUpRight, LuX } from 'react-icons/lu'
import { allProjects, experience, featured, profile, publications } from '../../data'
import { stack } from '../../stack'
import { AppBody, apps, type AppId } from './apps'

const fmt = (d: Date, o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Jakarta', ...o }).format(d)

function useNow() {
  const [t, setT] = useState(() => new Date())
  useEffect(() => {
    const id = window.setInterval(() => setT(new Date()), 1000)
    return () => window.clearInterval(id)
  }, [])
  return t
}

export default function Desktop() {
  const now = useNow()
  const [locked, setLocked] = useState(true)
  const [leaving, setLeaving] = useState(false)
  const [open, setOpen] = useState<{ app: AppId; initial?: string } | null>(null)
  const [toastMsg, setToastMsg] = useState<string | null>(null)
  const [slide, setSlide] = useState(0)
  const timer = useRef(0)

  const time = fmt(now, { hour: '2-digit', minute: '2-digit' })
  const secs = fmt(now, { second: '2-digit' }).padStart(2, '0')
  const date = fmt(now, { weekday: 'long', day: 'numeric', month: 'long' })

  const toast = useCallback((m: string) => {
    setToastMsg(m)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setToastMsg(null), 2400)
  }, [])

  const unlock = useCallback(() => {
    if (leaving) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setLeaving(true)
    window.setTimeout(() => setLocked(false), reduced ? 0 : 520)
  }, [leaving])

  // keyboard: any key unlocks, 1–6 open apps, Esc closes
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (locked) {
        if (!e.metaKey && !e.ctrlKey && !e.altKey) unlock()
        return
      }
      if (e.key === 'Escape') setOpen(null)
      const tag = (e.target as HTMLElement).tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      const n = Number(e.key)
      if (n >= 1 && n <= apps.length) setOpen({ app: apps[n - 1].id })
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [locked, unlock])

  // rotate the projects widget
  useEffect(() => {
    if (locked || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setInterval(() => setSlide((s) => (s + 1) % featured.length), 3800)
    return () => window.clearInterval(id)
  }, [locked])

  if (locked)
    return (
      <div className={`nz-lock ${leaving ? 'is-leaving' : ''}`} onClick={unlock} role="button" tabIndex={0} aria-label="Unlock nuzOS">
        <p className="nz-lock-brand">nuzOS</p>
        <p className="nz-lock-time" aria-hidden="true">
          {time}
        </p>
        <p className="nz-lock-date">{date}</p>
        <p className="nz-lock-hint">Press any key or click to unlock</p>
      </div>
    )

  const current = experience.find((r) => r.current)
  const paper = publications[0]
  const p = featured[slide]
  const openApp = (app: AppId, initial?: string) => setOpen({ app, initial })

  return (
    <div className="nz-root">
      <header className="nz-bar">
        <span className="nz-brand">
          <span className="nz-led" aria-hidden="true" /> nuzOS
        </span>
        <span className="nz-bar-mid">Sarah Fajriah Rahmah</span>
        <span className="nz-bar-time">
          {time}
          <span className="nz-secs">:{secs}</span>
        </span>
      </header>

      <main className="nz-home">
        <h1 className="nz-sr">nuza, fullstack developer: an OS-style portfolio</h1>

        <section className="nz-w nz-w--clock" aria-label="Clock">
          <p className="nz-lcd">
            {time}
            <span>{secs}</span>
          </p>
          <p className="nz-w-foot">{date}</p>
        </section>

        <button className="nz-w nz-w--hello" onClick={() => openApp('about')}>
          <span className="nz-w-label">About</span>
          <span className="nz-hello">Call me Nuza.</span>
          <span className="nz-w-text">Information Systems undergrad and fullstack developer.</span>
          <LuArrowUpRight className="nz-w-go" aria-hidden="true" />
        </button>

        <button className="nz-w nz-w--projects" onClick={() => openApp('projects', p.slug)}>
          <span className="nz-w-label">
            Projects
            <span className="nz-count">
              {slide + 1}/{featured.length}
            </span>
          </span>
          <span className="nz-screen">
            {featured.map((f, i) => (
              <img key={f.slug} src={f.image} alt="" className={i === slide ? 'is-on' : ''} loading={i === 0 ? 'eager' : 'lazy'} />
            ))}
          </span>
          <span className="nz-proj-name">{p.name}</span>
          <span className="nz-w-text">{p.tagline}</span>
          <span className="nz-dots" aria-hidden="true">
            {featured.map((f, i) => (
              <i key={f.slug} className={i === slide ? 'is-on' : ''} />
            ))}
          </span>
        </button>

        <button className="nz-w nz-w--now" onClick={() => openApp('experience')}>
          <span className="nz-w-label">
            Now <span className="nz-led" aria-hidden="true" />
          </span>
          <span className="nz-w-big">{current?.title}</span>
          <span className="nz-w-text">at {current?.org}</span>
          <span className="nz-w-foot">Since {current?.period.split(' –')[0]}, and {experience.length - 1} roles before this</span>
        </button>

        <button className="nz-w nz-w--research" onClick={() => openApp('research')}>
          <span className="nz-w-label">Research</span>
          <span className="nz-w-text nz-clamp" lang="id">
            {paper?.title}
          </span>
          <span className="nz-w-foot">Published {paper?.year}</span>
        </button>

        <button className="nz-w nz-w--stack" onClick={() => openApp('stack')}>
          <span className="nz-w-label">
            Stack <span className="nz-count">{stack.length}</span>
          </span>
          <span className="nz-icons" aria-hidden="true">
            {stack.slice(0, 12).map(({ name, icon: Icon }) => (
              <Icon key={name} />
            ))}
          </span>
        </button>

        <button className="nz-w nz-w--stat" onClick={() => openApp('projects')}>
          <span className="nz-lcd nz-lcd--sm">{allProjects.length}</span>
          <span className="nz-w-text">projects shipped</span>
        </button>

        <button className="nz-w nz-w--contact" onClick={() => openApp('contact')}>
          <span className="nz-w-label">Contact</span>
          <span className="nz-hello">Say hi</span>
          <span className="nz-w-text">{profile.email}</span>
        </button>
      </main>

      <nav className="nz-keys" aria-label="Apps">
        {apps.map((a, i) => {
          const Icon = a.icon
          return (
            <button key={a.id} className="nz-hwkey" onClick={() => openApp(a.id)} aria-pressed={open?.app === a.id}>
              <span className="nz-hwkey-n" aria-hidden="true">
                {i + 1}
              </span>
              <Icon aria-hidden="true" />
              <span className="nz-hwkey-t">{a.title}</span>
            </button>
          )
        })}
      </nav>

      {open && (
        <div className="nz-scrim" onPointerDown={(e) => e.target === e.currentTarget && setOpen(null)}>
          <section className="nz-sheet" role="dialog" aria-modal="true" aria-labelledby="nz-sheet-title">
            <header className="nz-sheet-head">
              <h2 id="nz-sheet-title">{apps.find((a) => a.id === open.app)?.title}</h2>
              <button className="nz-close" onClick={() => setOpen(null)} aria-label="Close" autoFocus>
                <LuX />
              </button>
            </header>
            <div className="nz-sheet-body">
              <AppBody key={open.app + (open.initial ?? '')} app={open.app} initial={open.initial} toast={toast} />
            </div>
          </section>
        </div>
      )}

      {toastMsg && (
        <p className="nz-toast" role="status">
          {toastMsg}
        </p>
      )}
    </div>
  )
}
