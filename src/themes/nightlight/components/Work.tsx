import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { allProjects, alsoBuilt, featured, more, type Category, type Project } from '../../../data'
import { tiltHandlers } from '../tilt'

function withTransition(update: () => void) {
  const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown }
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (doc.startViewTransition && !reduced) doc.startViewTransition(() => flushSync(update))
  else update()
}

function Stack({ items, limit }: { items: string[]; limit?: number }) {
  const shown = limit ? items.slice(0, limit) : items
  const rest = items.length - shown.length
  return (
    <ul className="stack" aria-label="Built with">
      {shown.map((s) => (
        <li key={s}>{s}</li>
      ))}
      {rest > 0 && <li className="stack-more">+{rest}</li>}
    </ul>
  )
}

function Meta({ p }: { p: Project }) {
  return (
    <div className="meta">
      <span className="cat">{p.category}</span>
      {p.year && <span className="meta-year">{p.year}</span>}
    </div>
  )
}

function FeatureCard({ p, index, onOpen }: { p: Project; index: number; onOpen: (p: Project) => void }) {
  return (
    <article className={`feature tone-${p.tone}`} style={{ ['--i' as string]: index }} data-feature aria-labelledby={`f-${p.slug}`}>
      <div className="feature-inner">
        <div className="feature-copy">
          <Meta p={p} />
          <h3 id={`f-${p.slug}`}>{p.name}</h3>
          <p className="feature-tagline">{p.tagline}</p>
          {p.highlights && (
            <ul className="highlights">
              {p.highlights.slice(0, 3).map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          )}
          {p.stats && (
            <dl className="stats">
              {p.stats.map((s) => (
                <div key={s.label}>
                  <dt>{s.label}</dt>
                  <dd>{s.value}</dd>
                </div>
              ))}
            </dl>
          )}
          <div className="feature-foot">
            <Stack items={p.stack} limit={4} />
            <button className="btn btn--primary btn--sm" onClick={() => onOpen(p)}>
              Read the case study
            </button>
          </div>
        </div>
        <div className="stage">
          <button className="shot" {...tiltHandlers(10)} onClick={() => onOpen(p)} aria-label={`Open ${p.name} case study`}>
            <img src={p.image} alt="" loading="lazy" />
            <span className="shot-shine" />
          </button>
          {p.context && <p className="stage-note">{p.context}</p>}
        </div>
      </div>
    </article>
  )
}

type Filter = 'All' | Category

export default function Work() {
  const list = useRef<HTMLDivElement>(null)
  const dialog = useRef<HTMLDialogElement>(null)
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [filter, setFilter] = useState<Filter>('All')

  const filters = useMemo(() => {
    const counts = new Map<Filter, number>([['All', more.length]])
    more.forEach((p) => counts.set(p.category, (counts.get(p.category) ?? 0) + 1))
    return Array.from(counts.entries())
  }, [])
  const shown = filter === 'All' ? more : more.filter((p) => p.category === filter)

  const rail = useRef<HTMLUListElement>(null)
  const [edges, setEdges] = useState({ start: true, end: false })
  const measure = useCallback(() => {
    const r = rail.current
    if (!r) return
    setEdges({ start: r.scrollLeft < 8, end: r.scrollLeft + r.clientWidth > r.scrollWidth - 8 })
  }, [])
  useEffect(() => {
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [measure, filter])
  const slide = (dir: 1 | -1) => {
    const r = rail.current
    if (!r) return
    const card = r.querySelector('li')
    const stepPx = card ? card.getBoundingClientRect().width + 20 : r.clientWidth * 0.8
    r.scrollBy({ left: dir * stepPx, behavior: 'smooth' })
  }

  // mouse users can drag the rail; touch already scrolls natively
  const drag = useRef({ active: false, x: 0, left: 0, moved: false })
  const onRailDown = (e: React.PointerEvent<HTMLUListElement>) => {
    if (e.pointerType !== 'mouse' || !rail.current) return
    drag.current = { active: true, x: e.clientX, left: rail.current.scrollLeft, moved: false }
  }
  const onRailMove = (e: React.PointerEvent<HTMLUListElement>) => {
    const d = drag.current
    if (!d.active || !rail.current) return
    const dx = e.clientX - d.x
    if (Math.abs(dx) > 5 && !d.moved) {
      d.moved = true
      rail.current.classList.add('is-dragging')
      rail.current.setPointerCapture(e.pointerId)
    }
    if (d.moved) rail.current.scrollLeft = d.left - dx
  }
  const onRailUp = () => {
    drag.current.active = false
    rail.current?.classList.remove('is-dragging')
  }

  useEffect(() => {
    const root = list.current
    if (!root) return
    const cards = Array.from(root.querySelectorAll<HTMLElement>('[data-feature]'))
    let raf = 0
    const update = () => {
      raf = 0
      cards.forEach((card, i) => {
        const next = cards[i + 1]
        if (!next) return
        const a = card.getBoundingClientRect()
        const b = next.getBoundingClientRect()
        const t = Math.min(1, Math.max(0, 1 - (b.top - a.top) / a.height))
        card.style.setProperty('--covered', t.toFixed(3))
      })
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  const show = (p: Project) => {
    setOpenIndex(allProjects.indexOf(p))
    if (!dialog.current?.open) dialog.current?.showModal()
  }

  const step = useCallback((dir: 1 | -1) => {
    setOpenIndex((i) => (i === null ? i : (i + dir + allProjects.length) % allProjects.length))
    dialog.current?.querySelector('.sheet-scroll')?.scrollTo({ top: 0 })
  }, [])

  const open = openIndex === null ? null : allProjects[openIndex]

  return (
    <>
      <div className="features" ref={list}>
        {featured.map((p, i) => (
          <FeatureCard key={p.slug} p={p} index={i} onOpen={show} />
        ))}
      </div>

      <div className="more-head" id="more">
        <h3 className="subhead">More things I've made</h3>
        <div className="rail-arrows">
          <button className="icon-btn" onClick={() => slide(-1)} disabled={edges.start} aria-label="Scroll projects left">
            ‹
          </button>
          <button className="icon-btn" onClick={() => slide(1)} disabled={edges.end} aria-label="Scroll projects right">
            ›
          </button>
        </div>
      </div>
      <div className="filters" role="group" aria-label="Filter projects by category">
        {filters.map(([f, n]) => (
          <button
            key={f}
            className="filter"
            aria-pressed={filter === f}
            onClick={() =>
              withTransition(() => {
                setFilter(f)
                rail.current?.scrollTo({ left: 0 })
              })
            }
          >
            {f}
            <span className="filter-count">{n}</span>
          </button>
        ))}
      </div>

      <ul
        className="tiles"
        ref={rail}
        onScroll={measure}
        onPointerDown={onRailDown}
        onPointerMove={onRailMove}
        onPointerUp={onRailUp}
        onPointerCancel={onRailUp}
        onClickCapture={(e) => {
          if (drag.current.moved) {
            e.stopPropagation()
            e.preventDefault()
            drag.current.moved = false
          }
        }}
      >
        {shown.map((p) => (
          <li key={p.slug} style={{ viewTransitionName: `tile-${p.slug}` }}>
            <button className={`tile tone-${p.tone}`} onClick={() => show(p)} {...tiltHandlers(8)}>
              <span className="tile-img">
                <img src={p.image} alt="" loading="lazy" />
              </span>
              <span className="tile-body">
                <Meta p={p} />
                <span className="tile-name">{p.name}</span>
                <span className="tile-line">{p.tagline}</span>
                <Stack items={p.stack} limit={3} />
              </span>
            </button>
          </li>
        ))}
      </ul>

      <div className="also">
        <p className="also-title">Also built, screenshots coming soon</p>
        <ul>
          {alsoBuilt.map((a) => (
            <li key={a.name}>
              <strong>{a.name}</strong>
              <span>{a.note}</span>
            </li>
          ))}
        </ul>
      </div>

      <dialog
        ref={dialog}
        className="sheet"
        aria-labelledby="sheet-title"
        onClose={() => setOpenIndex(null)}
        onClick={(e) => {
          if (e.target === e.currentTarget) dialog.current?.close()
        }}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') step(1)
          if (e.key === 'ArrowLeft') step(-1)
        }}
      >
        {open && (
          <div className={`sheet-body tone-${open.tone}`}>
            <div className="sheet-bar">
              <p className="sheet-pos">
                {openIndex! + 1} of {allProjects.length}
              </p>
              <div className="sheet-nav">
                <button className="icon-btn" onClick={() => step(-1)} aria-label="Previous project">
                  ‹
                </button>
                <button className="icon-btn" onClick={() => step(1)} aria-label="Next project">
                  ›
                </button>
                <button className="icon-btn" onClick={() => dialog.current?.close()} aria-label="Close">
                  ×
                </button>
              </div>
            </div>
            <div className="sheet-scroll">
              <div className="sheet-hero">
                <img key={open.slug} src={open.image} alt={`Screens from ${open.name}`} />
              </div>
              <div className="sheet-content">
                <div className="sheet-main">
                  <Meta p={open} />
                  <h3 id="sheet-title">{open.name}</h3>
                  <p className="feature-tagline">{open.tagline}</p>
                  <p className="sheet-desc">{open.description}</p>
                  {open.highlights && (
                    <>
                      <h4>What it does</h4>
                      <ul className="highlights">
                        {open.highlights.map((h) => (
                          <li key={h}>{h}</li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
                <aside className="sheet-side">
                  {open.stats && (
                    <dl className="stats stats--stacked">
                      {open.stats.map((s) => (
                        <div key={s.label}>
                          <dt>{s.label}</dt>
                          <dd>{s.value}</dd>
                        </div>
                      ))}
                    </dl>
                  )}
                  <dl className="sheet-facts">
                    {open.context && (
                      <div>
                        <dt>Context</dt>
                        <dd>{open.context}</dd>
                      </div>
                    )}
                    <div>
                      <dt>Stack</dt>
                      <dd>
                        <Stack items={open.stack} />
                      </dd>
                    </div>
                  </dl>
                  {open.links && open.links.length > 0 && (
                    <div className="sheet-links">
                      {open.links.map((l) => (
                        <a key={l.href} className="btn btn--ghost btn--sm" href={l.href} target="_blank" rel="noreferrer">
                          {l.label}
                        </a>
                      ))}
                    </div>
                  )}
                </aside>
              </div>
            </div>
          </div>
        )}
      </dialog>
    </>
  )
}
