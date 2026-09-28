import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { allProjects, experience, profile, publications, type Project } from '../../data'
import { stack } from '../../stack'
import { themes } from '../../themes'
import { LuBookOpen, LuBriefcase, LuCalendarDays, LuDownload, LuFolder, LuMail, LuPalette, LuSearch, LuWrench } from 'react-icons/lu'
import { LookPanel, Wallpaper, useLook } from './Look'

type Msg = { id: number; from: 'bot' | 'me'; body: ReactNode; time: string }

const SUGGEST_START = ['Who are you?', 'Show me your projects', 'What’s your stack?', 'Any research?', 'How do I contact you?']

const now = () => new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Jakarta', hour: '2-digit', minute: '2-digit' }).format(new Date())

function matchProject(text: string): Project | undefined {
  const t = text.toLowerCase()
  return allProjects.find((p) => t.includes(p.name.toLowerCase()) || t.includes(p.slug.replace('-', ' ')))
}

export default function Chat() {
  const [msgs, setMsgs] = useState<Msg[]>([])
  const [typing, setTyping] = useState(false)
  const [chips, setChips] = useState<string[]>([])
  const [text, setText] = useState('')
  const [copied, setCopied] = useState<string | null>(null)
  const [look, setLook] = useLook()
  const [lookOpen, setLookOpen] = useState(false)
  const scroller = useRef<HTMLDivElement>(null)
  const pinned = useRef(true)
  const id = useRef(0)
  const queue = useRef(Promise.resolve())

  const push = useCallback((from: Msg['from'], body: ReactNode) => {
    setMsgs((m) => [...m, { id: id.current++, from, body, time: now() }])
  }, [])

  /** Bot replies one bubble at a time, with a short typing pause. */
  const say = useCallback(
    (bubbles: ReactNode[], next: string[]) => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      queue.current = queue.current.then(async () => {
        setChips([])
        for (const b of bubbles) {
          setTyping(true)
          await new Promise((r) => setTimeout(r, reduced ? 0 : 550 + Math.random() * 450))
          setTyping(false)
          push('bot', b)
        }
        setChips(next)
      })
    },
    [push],
  )

  const copy = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(label)
      setTimeout(() => setCopied(null), 1800)
    } catch {
      /* ignore */
    }
  }

  const projectCard = (p: Project, compact = false) => (
    <article className={`c-card ${compact ? 'c-card--compact' : ''}`}>
      {p.image && <img src={p.image} alt={compact ? '' : `Screens from ${p.name}`} loading="lazy" />}
      <div className="c-card-body">
        <p className="c-card-kicker">
          {p.category}
          {p.year && ` · ${p.year}`}
        </p>
        <h3>{p.name}</h3>
        <p>{p.tagline}</p>
        {!compact && p.highlights && (
          <ul>
            {p.highlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        )}
        {!compact && p.stats && (
          <p className="c-stat">
            {p.stats.map((s) => (
              <span key={s.label}>
                <b>{s.value}</b> {s.label}
              </span>
            ))}
          </p>
        )}
        {!compact && <p className="c-muted">{p.stack.join(' · ')}</p>}
        {compact && (
          <button className="c-card-btn" onClick={() => ask(`Tell me about ${p.name}`)}>
            Tell me more
          </button>
        )}
      </div>
    </article>
  )

  const reply = (input: string) => {
    const t = input.toLowerCase()
    const p = matchProject(t)
    if (p) {
      say(
        [projectCard(p), p.context ? `${p.context}. Want to see another one?` : 'Want to see another one?'],
        ['Show me your projects', 'What’s your stack?', 'How do I contact you?'],
      )
      return
    }
    if (/\b(hi|hai|halo|hello|hey|pagi|siang|sore|malam|assalamualaikum)\b/.test(t)) {
      say(['Haii 👋', 'What do you want to know?'], SUGGEST_START)
    } else if (/(who|siapa|about|tentang|kamu|yourself|nuza)/.test(t)) {
      say(
        [
          <>
            My name's <b>Sarah Fajriah Rahmah</b>, but you can call me <b>Nuza</b>.
          </>,
          'Information Systems undergrad at UIN Syarif Hidayatullah Jakarta, and fullstack dev at PT. Bikin Semua Mudah.',
          'I usually handle the whole thing, from the database to the deploy.',
        ],
        ['Show me your projects', 'Where have you worked?', 'Any research?'],
      )
    } else if (/(project|projek|proyek|work|karya|portfolio|porto|built|bikin)/.test(t) && !/(worked|kerja|job|experience|pengalaman)/.test(t)) {
      say(
        [
          `${allProjects.length} of them, swipe →`,
          <div className="c-carousel" role="list">
            {allProjects.map((x) => (
              <div role="listitem" key={x.slug}>
                {projectCard(x, true)}
              </div>
            ))}
          </div>,
        ],
        ['Tell me about Luckoo', 'Tell me about Saku', 'What’s your stack?'],
      )
    } else if (/(stack|skill|tech|tools|bahasa|language|framework)/.test(t)) {
      say(
        [
          'Day to day it’s Next.js, TypeScript and Supabase. For on-chain stuff, Solidity on Arbitrum and Base.',
          <div className="c-skills">
            {stack.map(({ name, icon: Icon }) => (
              <span key={name}>
                <Icon aria-hidden="true" /> {name}
              </span>
            ))}
          </div>,
        ],
        ['Show me your projects', 'Where have you worked?'],
      )
    } else if (/(experience|pengalaman|kerja|job|worked|career|karir|intern|magang)/.test(t)) {
      say(
        [
          'So far:',
          <ol className="c-timeline">
            {experience.map((r) => (
              <li key={r.org + r.title}>
                <b>{r.title}</b>
                <span>
                  {r.org} · {r.period}
                  {r.current && <em> · now</em>}
                </span>
              </li>
            ))}
          </ol>,
        ],
        ['Any research?', 'Can I see your résumé?', 'How do I contact you?'],
      )
    } else if (/(research|paper|jurnal|journal|publika|publication|riset|penelitian|cite)/.test(t)) {
      const pub = publications[0]
      say(
        pub
          ? [
              'Yep, my first paper came out in 2026 📄',
              <article className="c-paper">
                <p className="c-card-kicker">{pub.venue}</p>
                <h3 lang="id">{pub.title}</h3>
                <p className="c-muted">{pub.authors}</p>
                <p>{pub.summary}</p>
                <div className="c-actions">
                  {pub.href && (
                    <a href={pub.href} target="_blank" rel="noreferrer">
                      Read paper
                    </a>
                  )}
                  {pub.cite && (
                    <>
                      <button onClick={() => copy(pub.cite!.apa, 'APA')}>Copy APA</button>
                      <button onClick={() => copy(pub.cite!.bibtex, 'BibTeX')}>Copy BibTeX</button>
                    </>
                  )}
                </div>
              </article>,
            ]
          : ['No papers yet, but stay tuned.'],
        ['Show me your projects', 'How do I contact you?'],
      )
    } else if (/(resume|résumé|cv|curriculum)/.test(t)) {
      say(
        [
          'Here:',
          <a className="c-file" href={profile.resume} download>
            <span className="c-file-icon" aria-hidden="true">
              PDF
            </span>
            <span>
              <b>Resume_Sarah_Fajriah_Rahmah.pdf</b>
              <small>2 pages · tap to download</small>
            </span>
          </a>,
        ],
        ['How do I contact you?', 'Show me your projects'],
      )
    } else if (/(contact|kontak|email|hire|reach|hubungi|dm|linkedin|instagram|github)/.test(t)) {
      say(
        [
          'Email is the fastest. I actually read those:',
          <div className="c-contact">
            <a className="c-primary" href={`mailto:${profile.email}`}>
              ✉️ {profile.email}
            </a>
            <button onClick={() => copy(profile.email, 'email')}>Copy email</button>
            {profile.socials.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer">
                {s.label} <small>{s.handle}</small>
              </a>
            ))}
          </div>,
        ],
        ['Can I see your résumé?', 'Show me your projects'],
      )
    } else if (/(week|theme|tema|day|hari|monday|senin|besok|tomorrow)/.test(t)) {
      say(
        [
          'This site changes every day. Sunday is this chat. The rest of the week:',
          <ul className="c-week">
            {themes.map((th) => (
              <li key={th.id}>
                <a href={`?theme=${th.id}`}>
                  <b>{th.hari}</b> {th.name}
                </a>
              </li>
            ))}
          </ul>,
        ],
        SUGGEST_START,
      )
    } else if (/(thank|makasih|terima kasih|thx|mantap|keren|cool|nice|wow)/.test(t)) {
      say(['Sama-sama! Anything else?'], SUGGEST_START)
    } else {
      say(["I pre-wrote these replies, so I didn't catch that one 😅", 'Try one of these, or just email me:'], [...SUGGEST_START, 'Can I see your résumé?'])
    }
  }

  const ask = (q: string) => {
    if (!q.trim()) return
    pinned.current = true
    push('me', q)
    reply(q)
  }

  const greeted = useRef(false)
  useEffect(() => {
    if (greeted.current) return
    greeted.current = true
    say(['Hii, Nuza here 👋', 'Ask me about my work, or tap one of the questions below.'], SUGGEST_START)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // follow new messages only while the reader is at the bottom, so scrolling up to reread stays put
  useEffect(() => {
    const el = scroller.current
    if (el && pinned.current) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  }, [msgs, typing, chips])

  const threads = [
    { icon: LuFolder, ink: '#1d4ed8', label: 'Projects', preview: `${allProjects.length} things I've built`, q: 'Show me your projects', badge: allProjects.length },
    { icon: LuBookOpen, ink: '#be123c', label: 'Research', preview: 'My first paper is out', q: 'Any research?', badge: 1 },
    { icon: LuWrench, ink: '#b45309', label: 'Stack', preview: 'Next.js, Supabase, Solidity…', q: 'What’s your stack?' },
    { icon: LuBriefcase, ink: '#15803d', label: 'Experience', preview: 'Where I’ve worked', q: 'Where have you worked?' },
    { icon: LuMail, ink: '#4338ca', label: 'Contact', preview: profile.email, q: 'How do I contact you?' },
    { icon: LuCalendarDays, ink: '#7e22ce', label: 'This week', preview: 'A new look every day', q: 'What theme is tomorrow?' },
  ]
  const shared = allProjects.filter((x) => x.image).slice(0, 9)

  return (
    <div
      className="c-root"
      data-dark={look.dark || undefined}
      style={{ '--c-accent': look.accent } as React.CSSProperties}
    >
      <aside className="c-side" aria-label="Chats">
        <p className="c-side-title">Chats</p>
        <label className="c-search">
          <LuSearch aria-hidden="true" />
          <span className="c-sr">Ask anything</span>
          <input
            placeholder="Search or ask"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                ask(e.currentTarget.value)
                e.currentTarget.value = ''
              }
            }}
          />
        </label>
        <button className="c-thread is-active">
          <Avatar />
          <span className="c-thread-text">
            <span className="c-thread-top">
              <b>Nuza</b>
              <time>{msgs.at(-1)?.time ?? now()}</time>
            </span>
            <small>{typing ? <em>typing…</em> : 'Ask me anything'}</small>
          </span>
        </button>
        {threads.map(({ icon: Icon, ink, label, preview, q, badge }) => (
          <button key={label} className="c-thread" onClick={() => ask(q)}>
            <span className="c-avatar" style={{ background: `color-mix(in srgb, ${ink} 14%, transparent)`, color: ink }} aria-hidden="true">
              <Icon />
            </span>
            <span className="c-thread-text">
              <span className="c-thread-top">
                <b>{label}</b>
              </span>
              <small>{preview}</small>
            </span>
            {badge && <span className="c-badge">{badge}</span>}
          </button>
        ))}
      </aside>

      <main className="c-main">
        <header className="c-head">
          <Avatar />
          <div>
            <h1>Nuza</h1>
            <p>{typing ? 'typing…' : 'online'}</p>
          </div>
          <button
            className="c-head-btn c-look-btn"
            onClick={() => setLookOpen((o) => !o)}
            aria-expanded={lookOpen}
            aria-label="Change appearance"
          >
            <LuPalette aria-hidden="true" />
            <span>Appearance</span>
          </button>
          <a className="c-head-btn" href={profile.resume} download aria-label="Download résumé">
            <LuDownload aria-hidden="true" />
            <span>Résumé</span>
          </a>
          {lookOpen && <LookPanel look={look} setLook={setLook} close={() => setLookOpen(false)} />}
        </header>

        <Wallpaper wall={look.wall} />
        <div
          className="c-scroll"
          aria-live="polite"
          ref={scroller}
          onScroll={(e) => {
            const el = e.currentTarget
            pinned.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80
          }}
        >
          <p className="c-day">Today</p>
          <p className="c-notice">Replies here are pre-written by me. For a real conversation, email me.</p>
          {msgs.map((m, i) => {
            const cont = msgs[i + 1]?.from === m.from
            return (
              <div key={m.id} className={`c-row c-row--${m.from} ${cont ? 'c-row--cont' : ''}`}>
                <div className={`c-bubble ${typeof m.body === 'string' ? '' : 'c-bubble--rich'}`}>
                  {m.body}
                  <span className="c-time">
                    {m.time}
                    {m.from === 'me' && <span className="c-ticks"> ✓✓</span>}
                  </span>
                </div>
              </div>
            )
          })}
          {typing && (
            <div className="c-row c-row--bot">
              <div className="c-bubble c-typing" aria-label="Nuza is typing">
                <i />
                <i />
                <i />
              </div>
            </div>
          )}
          {chips.length > 0 && (
            <div className="c-chips" aria-label="Suggestions">
              {chips.map((c) => (
                <button key={c} onClick={() => ask(c)}>
                  {c}
                </button>
              ))}
            </div>
          )}
        </div>

        <form
          className="c-compose"
          onSubmit={(e) => {
            e.preventDefault()
            ask(text)
            setText('')
          }}
        >
          <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Message" aria-label="Message" />
          <button type="submit" aria-label="Send" disabled={!text.trim()}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M3 11.5 20 4l-7.5 17-2-7.5z" fill="currentColor" />
            </svg>
          </button>
        </form>
        {copied && (
          <p className="c-toast" role="status">
            Copied {copied}!
          </p>
        )}
      </main>

      <aside className="c-info" aria-label="Profile">
        <Avatar size="lg" />
        <h2>Sarah Fajriah Rahmah</h2>
        <p className="c-muted">@nuza</p>
        <dl className="c-info-list">
          <div>
            <dt>Bio</dt>
            <dd>Information Systems undergrad. Fullstack dev at PT. Bikin Semua Mudah.</dd>
          </div>
          <div>
            <dt>Email</dt>
            <dd>
              <button className="c-linkish" onClick={() => copy(profile.email, 'email')}>
                {profile.email}
              </button>
            </dd>
          </div>
          <div>
            <dt>Links</dt>
            <dd className="c-info-links">
              {profile.socials.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noreferrer">
                  {s.label}
                </a>
              ))}
            </dd>
          </div>
        </dl>
        <p className="c-info-title">Shared media</p>
        <ul className="c-media">
          {shared.map((x) => (
            <li key={x.slug}>
              <button onClick={() => ask(`Tell me about ${x.name}`)} aria-label={`Ask about ${x.name}`}>
                <img src={x.image} alt="" loading="lazy" />
              </button>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  )
}

function Avatar({ size = 'md' }: { size?: 'md' | 'lg' }) {
  return (
    <span className={`c-avatar c-avatar--me c-avatar--${size}`} aria-hidden="true">
      S
    </span>
  )
}
