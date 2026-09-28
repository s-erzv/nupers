import { useMemo, useState, type ComponentType } from 'react'
import type { IconBaseProps } from 'react-icons'
import { LuArrowLeft, LuBookOpen, LuBriefcase, LuCpu, LuDownload, LuFolder, LuMail, LuUser } from 'react-icons/lu'
import { allProjects, alsoBuilt, experience, profile, publications, type Category, type Project } from '../../data'
import { stack } from '../../stack'

export type AppId = 'about' | 'projects' | 'research' | 'experience' | 'stack' | 'contact'

export const apps: { id: AppId; title: string; icon: ComponentType<IconBaseProps> }[] = [
  { id: 'about', title: 'About', icon: LuUser },
  { id: 'projects', title: 'Projects', icon: LuFolder },
  { id: 'research', title: 'Research', icon: LuBookOpen },
  { id: 'experience', title: 'Experience', icon: LuBriefcase },
  { id: 'stack', title: 'Stack', icon: LuCpu },
  { id: 'contact', title: 'Contact', icon: LuMail },
]

type Toast = (m: string) => void

export function AppBody({ app, toast, initial }: { app: AppId; toast: Toast; initial?: string }) {
  switch (app) {
    case 'about':
      return <About />
    case 'projects':
      return <Projects initial={initial} />
    case 'research':
      return <Research toast={toast} />
    case 'experience':
      return <Experience />
    case 'stack':
      return <Stack />
    case 'contact':
      return <Contact toast={toast} />
  }
}

function About() {
  return (
    <div className="nz-about">
      <p className="nz-lead">
        I'm Sarah Fajriah Rahmah, but you can call me Nuza. Information Systems undergrad at UIN Syarif Hidayatullah Jakarta (2024–2028).
      </p>
      <p>
        Fullstack developer at PT. Bikin Semua Mudah. I usually handle the whole thing, from the database to the deploy.
      </p>
      <dl className="nz-spec">
        <div>
          <dt>Handle</dt>
          <dd>nuza</dd>
        </div>
        <div>
          <dt>Studying</dt>
          <dd>Information Systems, 2024–2028</dd>
        </div>
        <div>
          <dt>Working</dt>
          <dd>PT. Bikin Semua Mudah</dd>
        </div>
        <div>
          <dt>Shipped</dt>
          <dd>{allProjects.length} projects, 1 paper</dd>
        </div>
      </dl>
      <a className="nz-key nz-key--wide" href={profile.resume} download>
        <LuDownload aria-hidden="true" /> Download résumé
      </a>
    </div>
  )
}

function Projects({ initial }: { initial?: string }) {
  const [cat, setCat] = useState<'All' | Category>('All')
  const [open, setOpen] = useState<string | undefined>(initial)
  const cats = useMemo(() => ['All', ...new Set(allProjects.map((p) => p.category))] as ('All' | Category)[], [])
  const list = cat === 'All' ? allProjects : allProjects.filter((p) => p.category === cat)
  const current = allProjects.find((p) => p.slug === open)

  if (current) return <Detail p={current} back={() => setOpen(undefined)} />

  return (
    <div className="nz-projects">
      <div className="nz-seg" role="group" aria-label="Filter by category">
        {cats.map((c) => (
          <button key={c} aria-pressed={cat === c} onClick={() => setCat(c)}>
            {c}
          </button>
        ))}
      </div>
      <ul className="nz-grid">
        {list.map((p) => (
          <li key={p.slug}>
            <button className="nz-tile" onClick={() => setOpen(p.slug)}>
              <span className="nz-tile-img">{p.image && <img src={p.image} alt="" loading="lazy" />}</span>
              <span className="nz-tile-name">{p.name}</span>
              <span className="nz-tile-line">{p.tagline}</span>
            </button>
          </li>
        ))}
      </ul>
      <p className="nz-foot">Also built: {alsoBuilt.map((a) => a.name).join(', ')}.</p>
    </div>
  )
}

function Detail({ p, back }: { p: Project; back: () => void }) {
  return (
    <article className="nz-detail">
      <button className="nz-back" onClick={back}>
        <LuArrowLeft aria-hidden="true" /> All projects
      </button>
      {p.image && <img className="nz-shot" src={p.image} alt={`Screens from ${p.name}`} />}
      <p className="nz-meta">
        {p.category}
        {p.year && `, ${p.year}`}
        {p.context && `. ${p.context}`}
      </p>
      <h3>{p.name}</h3>
      <p className="nz-lead">{p.tagline}</p>
      <p>{p.description}</p>
      {p.highlights && (
        <ul className="nz-list">
          {p.highlights.map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>
      )}
      {p.stats && (
        <div className="nz-stats">
          {p.stats.map((s) => (
            <div key={s.label}>
              <b>{s.value}</b>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      )}
      <p className="nz-tags">
        {p.stack.map((s) => (
          <span key={s}>{s}</span>
        ))}
      </p>
    </article>
  )
}

function Research({ toast }: { toast: Toast }) {
  const p = publications[0]
  if (!p) return <p>No papers yet.</p>
  const copy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast(`${label} citation copied`)
    } catch {
      toast('Copy failed. Select the text instead.')
    }
  }
  return (
    <article className="nz-paper">
      <p className="nz-meta">
        {p.kind}, {p.year}. {p.venue}
      </p>
      <h3 lang="id">{p.title}</h3>
      <p className="nz-muted">{p.authors}</p>
      <p>{p.summary}</p>
      {p.keywords && (
        <p className="nz-tags">
          {p.keywords.map((k) => (
            <span key={k}>{k}</span>
          ))}
        </p>
      )}
      <div className="nz-row">
        {p.href && (
          <a className="nz-key nz-key--accent" href={p.href} target="_blank" rel="noreferrer">
            Read the paper
          </a>
        )}
        {p.cite && (
          <>
            <button className="nz-key" onClick={() => copy(p.cite!.apa, 'APA')}>
              Copy APA
            </button>
            <button className="nz-key" onClick={() => copy(p.cite!.bibtex, 'BibTeX')}>
              Copy BibTeX
            </button>
          </>
        )}
      </div>
      {p.doi && <p className="nz-muted nz-small">DOI {p.doi}</p>}
    </article>
  )
}

function Experience() {
  return (
    <ol className="nz-timeline">
      {experience.map((r) => (
        <li key={r.org + r.title} className={r.current ? 'is-now' : ''}>
          <p className="nz-meta">
            {r.period}
            {r.current && <span className="nz-led" aria-label="current" />}
          </p>
          <p className="nz-role">
            {r.title} <span className="nz-muted">at {r.org}</span>
          </p>
          <ul className="nz-list">
            {r.points.map((pt) => (
              <li key={pt}>{pt}</li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  )
}

function Stack() {
  return (
    <div className="nz-stack">
      {(['Frontend', 'Backend', 'Web3', 'Tools'] as const).map((g) => (
        <section key={g}>
          <h3>{g}</h3>
          <ul>
            {stack
              .filter((s) => s.group === g)
              .map(({ name, icon: Icon }) => (
                <li key={name}>
                  <Icon aria-hidden="true" />
                  <span>{name}</span>
                </li>
              ))}
          </ul>
        </section>
      ))}
    </div>
  )
}

function Contact({ toast }: { toast: Toast }) {
  const [subject, setSubject] = useState("Let's build something")
  const [body, setBody] = useState('')
  return (
    <form
      className="nz-mail"
      onSubmit={(e) => {
        e.preventDefault()
        window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
        toast('Opening your mail app')
      }}
    >
      <label>
        <span>To</span>
        <input value={profile.email} readOnly />
      </label>
      <label>
        <span>Subject</span>
        <input value={subject} onChange={(e) => setSubject(e.target.value)} />
      </label>
      <label>
        <span>Message</span>
        <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Hi Nuza, I have an idea…" rows={6} />
      </label>
      <div className="nz-row">
        <button className="nz-key nz-key--accent" type="submit">
          Send email
        </button>
        {profile.socials.map((s) => (
          <a key={s.label} className="nz-key" href={s.href} target="_blank" rel="noreferrer">
            {s.label}
          </a>
        ))}
      </div>
    </form>
  )
}
