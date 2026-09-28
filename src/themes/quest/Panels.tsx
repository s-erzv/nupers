import { useEffect, useState } from 'react'
import { allProjects, experience, profile, publications } from '../../data'
import { stack } from '../../stack'
import type { PlaceId } from './world'

/** Arrow-key list selection shared by the menus. */
function useSelect(length: number, active: boolean) {
  const [i, setI] = useState(0)
  useEffect(() => {
    if (!active) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 's') {
        e.preventDefault()
        setI((v) => (v + 1) % length)
      }
      if (e.key === 'ArrowUp' || e.key === 'w') {
        e.preventDefault()
        setI((v) => (v - 1 + length) % length)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [length, active])
  return [i, setI] as const
}

export function PlacePanel({ id, toast }: { id: PlaceId; toast: (m: string) => void }) {
  switch (id) {
    case 'house':
      return <House />
    case 'workshop':
      return <Workshop />
    case 'library':
      return <Library toast={toast} />
    case 'guild':
      return <Guild />
    case 'armory':
      return <Armory />
    case 'post':
      return <Post toast={toast} />
  }
}

function House() {
  const stats = [
    ['Class', 'Fullstack developer'],
    ['Guild', 'PT. Bikin Semua Mudah'],
    ['Academy', 'Information Systems, UIN Jakarta'],
    ['Specialty', 'Next.js, Supabase, Solidity'],
    ['Side quest', 'Writing research papers'],
  ]
  return (
    <div className="q-house">
      <div className="q-portrait" aria-hidden="true">
        <span className="q-bulb" />
      </div>
      <div>
        <p className="q-lead">
          Hi, I'm Sarah Fajriah Rahmah, but you can call me <b>Nuza</b>. I build web apps end to end, from the database to the deploy, and some of them
          live on-chain.
        </p>
        <dl className="q-stats">
          {stats.map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
        <p className="q-note">
          Real-world stats: 4,300+ users on Luckoo, 7 companies on Ringkas, 1 published paper.
        </p>
      </div>
    </div>
  )
}

function Workshop() {
  const [i, setI] = useSelect(allProjects.length, true)
  const p = allProjects[i]
  return (
    <div className="q-split">
      <ul className="q-menu" role="listbox" aria-label="Projects">
        {allProjects.map((x, k) => (
          <li key={x.slug} role="option" aria-selected={k === i}>
            <button onClick={() => setI(k)} onMouseEnter={() => setI(k)}>
              <span className="q-cursor">{k === i ? '▶' : ''}</span>
              {x.name}
            </button>
          </li>
        ))}
      </ul>
      <div className="q-detail" aria-live="polite">
        {p.image && <img src={p.image} alt={`Screens from ${p.name}`} />}
        <p className="q-kicker">
          {p.category}
          {p.year && ` · ${p.year}`}
        </p>
        <h3>{p.name}</h3>
        <p>{p.tagline}</p>
        {p.highlights && (
          <ul className="q-bullets">
            {p.highlights.slice(0, 3).map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        )}
        {p.stats && (
          <p className="q-reward">
            Reward:{' '}
            {p.stats.map((s) => (
              <span key={s.label}>
                <b>{s.value}</b> {s.label}{' '}
              </span>
            ))}
          </p>
        )}
        <p className="q-tags">{p.stack.join(' · ')}</p>
      </div>
    </div>
  )
}

function Library({ toast }: { toast: (m: string) => void }) {
  const p = publications[0]
  if (!p) return <p>The shelves are empty for now.</p>
  const copy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast(`${label} citation copied!`)
    } catch {
      toast('Could not copy. Select the text instead.')
    }
  }
  return (
    <div className="q-book">
      <p className="q-kicker">
        Rare tome · {p.kind} · {p.year}
      </p>
      <h3 lang="id">{p.title}</h3>
      <p className="q-muted">
        {p.authors} — <i>{p.venue}</i>
      </p>
      {p.summary && <p>{p.summary}</p>}
      <div className="q-actions">
        {p.href && (
          <a className="q-btn" href={p.href} target="_blank" rel="noreferrer">
            Read the paper
          </a>
        )}
        {p.cite && (
          <>
            <button className="q-btn" onClick={() => copy(p.cite!.apa, 'APA')}>
              Copy APA
            </button>
            <button className="q-btn" onClick={() => copy(p.cite!.bibtex, 'BibTeX')}>
              Copy BibTeX
            </button>
          </>
        )}
      </div>
    </div>
  )
}

function Guild() {
  return (
    <ol className="q-quests">
      {experience.map((r) => (
        <li key={r.org + r.title}>
          <div className="q-quest-head">
            <b>{r.title}</b>
            <span className={r.current ? 'q-status q-status--live' : 'q-status'}>{r.current ? 'In progress' : 'Complete'}</span>
          </div>
          <p className="q-muted">
            {r.org} · {r.period}
          </p>
          <p>{r.points[0]}</p>
        </li>
      ))}
    </ol>
  )
}

function Armory() {
  const [i, setI] = useState(0)
  const item = stack[i]
  return (
    <div>
      <ul className="q-inventory" aria-label="Skills">
        {stack.map(({ name, icon: Icon }, k) => (
          <li key={name}>
            <button
              className="q-slot"
              aria-pressed={k === i}
              onClick={() => setI(k)}
              onMouseEnter={() => setI(k)}
              onFocus={() => setI(k)}
              aria-label={name}
            >
              <Icon aria-hidden="true" />
            </button>
          </li>
        ))}
      </ul>
      <p className="q-item" aria-live="polite">
        <b>{item.name}</b> <span className="q-muted">({item.group})</span>
      </p>
    </div>
  )
}

function Post({ toast }: { toast: (m: string) => void }) {
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      toast('Email copied! Send me a letter.')
    } catch {
      location.href = `mailto:${profile.email}`
    }
  }
  return (
    <div>
      <p className="q-lead">Got an idea at 2 a.m.? Drop it in the mailbox.</p>
      <div className="q-actions">
        <a className="q-btn q-btn--primary" href={`mailto:${profile.email}`}>
          Write a letter
        </a>
        <button className="q-btn" onClick={copy}>
          Copy {profile.email}
        </button>
        <a className="q-btn" href={profile.resume} download>
          Take the résumé
        </a>
      </div>
      <ul className="q-links">
        {profile.socials.map((s) => (
          <li key={s.label}>
            <a href={s.href} target="_blank" rel="noreferrer">
              {s.label} <span className="q-muted">{s.handle}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
