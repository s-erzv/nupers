import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { allProjects, alsoBuilt, experience, profile, publications, type Project } from '../../data'
import { stack } from '../../stack'
import { themes } from '../../themes'
import Backdrop from './Backdrop'

type Entry = { id: number; input?: string; output: ReactNode }

const PROMPT = 'nuza@web:~$'
const COMMANDS = [
  'help',
  'about',
  'projects',
  'open',
  'skills',
  'experience',
  'research',
  'cite',
  'contact',
  'email',
  'socials',
  'resume',
  'neofetch',
  'week',
  'ls',
  'cat',
  'history',
  'date',
  'echo',
  'clear',
  'sudo',
]
const FILES: Record<string, string> = {
  'about.md': 'about',
  'projects/': 'projects',
  'research.pdf': 'research',
  'resume.pdf': 'resume',
  'contact.txt': 'contact',
  'skills.json': 'skills',
}

const BULB = String.raw`
    .-""-.
   /  ..  \
  |  (__)  |
   \  ||  /
    |====|
    |====|
     '--'  `

function findProject(q: string): Project | undefined {
  const s = q.trim().toLowerCase()
  if (!s) return undefined
  const n = Number(s)
  if (Number.isInteger(n) && n >= 1 && n <= allProjects.length) return allProjects[n - 1]
  return (
    allProjects.find((p) => p.slug === s) ??
    allProjects.find((p) => p.name.toLowerCase() === s) ??
    allProjects.find((p) => p.name.toLowerCase().startsWith(s) || p.slug.startsWith(s))
  )
}

export default function Terminal() {
  const [entries, setEntries] = useState<Entry[]>([])
  const [value, setValue] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [hIndex, setHIndex] = useState<number | null>(null)
  const [booting, setBooting] = useState(true)
  const input = useRef<HTMLInputElement>(null)
  const bottom = useRef<HTMLDivElement>(null)
  const nextId = useRef(0)

  const print = useCallback((output: ReactNode, cmd?: string) => {
    setEntries((e) => [...e, { id: nextId.current++, input: cmd, output }])
  }, [])

  // a command link inside output: clicking it runs the command
  const Cmd = ({ c, children }: { c: string; children?: ReactNode }) => (
    <button className="t-cmd" onClick={() => run(c)}>
      {children ?? c}
    </button>
  )

  const copy = async (text: string, done: string) => {
    try {
      await navigator.clipboard.writeText(text)
      return done
    } catch {
      return 'Clipboard is blocked here. Select the text above instead.'
    }
  }

  const neofetch = () => (
    <div className="t-neo">
      <pre className="t-art" aria-hidden="true">
        {BULB}
      </pre>
      <div>
        <p>
          <span className="t-lime">nuza</span>@<span className="t-lime">web</span>
        </p>
        <p className="t-dim">-------------</p>
        {[
          ['Name', 'Sarah Fajriah Rahmah'],
          ['Goes by', 'Nuza'],
          ['Role', 'Fullstack developer'],
          ['Company', 'PT. Bikin Semua Mudah'],
          ['Status', 'Information Systems undergrad'],
          ['Stack', 'Next.js, TypeScript, Supabase, Solidity'],
          ['Projects', `${allProjects.length} shipped`],
          ['Papers', `${publications.length} published`],
          ['Shell', 'nuza-sh 1.0'],
        ].map(([k, v]) => (
          <p key={k}>
            <span className="t-lav">{k}</span>: {v}
          </p>
        ))}
        <p className="t-swatches" aria-hidden="true">
          {['#ff6b6b', '#ffc56b', '#b8f26b', '#6be3ff', '#9ea8ff', '#ff9fd7'].map((c) => (
            <span key={c} style={{ background: c }} />
          ))}
        </p>
      </div>
    </div>
  )

  const run = useCallback(
    async (raw: string) => {
      const line = raw.trim()
      if (line) setHistory((h) => [...h, line])
      setHIndex(null)
      const [name, ...args] = line.split(/\s+/)
      const arg = args.join(' ')
      const cmd = (name ?? '').toLowerCase()

      if (cmd === 'clear') {
        setEntries([])
        return
      }

      let out: ReactNode
      switch (cmd) {
        case '':
          out = null
          break
        case 'help':
          out = (
            <div className="t-grid">
              {[
                ['about', 'who I am'],
                ['projects', 'list everything I built'],
                ['open <name|#>', 'details and screenshots of one project'],
                ['skills', 'my stack'],
                ['experience', 'where I have worked'],
                ['research', 'my published paper'],
                ['cite apa|bibtex', 'copy a citation'],
                ['contact', 'how to reach me'],
                ['email', 'copy my email address'],
                ['resume', 'download my résumé'],
                ['week', 'this site looks different every day'],
                ['ls, cat, history, date, echo, clear', 'the usual'],
              ].map(([c, d]) => (
                <p key={c}>
                  <Cmd c={c.split(/[ ,<]/)[0]}>{c}</Cmd>
                  <span className="t-dim">{d}</span>
                </p>
              ))}
              <p className="t-dim t-span">Tip: Tab completes, ↑ ↓ walk through history, Ctrl+L clears.</p>
            </div>
          )
          break
        case 'whoami':
        case 'about':
          out = (
            <div className="t-block">
              <p>
                I'm Sarah Fajriah Rahmah, but you can call me <span className="t-lime">Nuza</span>. Information Systems
                undergrad at UIN Syarif Hidayatullah Jakarta (2024–2028).
              </p>
              <p>
                Fullstack developer at PT. Bikin Semua Mudah. I usually handle the whole thing, from the database to the
                deploy. See <Cmd c="projects" /> for what I've built.
              </p>
            </div>
          )
          break
        case 'neofetch':
          out = neofetch()
          break
        case 'ls':
          out = (
            <p className="t-ls">
              {Object.keys(FILES).map((f) => (
                <Cmd key={f} c={`cat ${f}`}>
                  <span className={f.endsWith('/') ? 't-lav' : ''}>{f}</span>
                </Cmd>
              ))}
            </p>
          )
          break
        case 'cat': {
          const target = FILES[arg] ?? FILES[arg + '/']
          if (target) {
            await run(target)
            return
          }
          out = <p className="t-err">cat: {arg || '(nothing)'}: No such file. Try <Cmd c="ls" />.</p>
          break
        }
        case 'cd':
          out = <p className="t-dim">You're already home. Everything lives here.</p>
          break
        case 'projects':
        case 'ls projects':
          out = (
            <div>
              <table className="t-table">
                <tbody>
                  {allProjects.map((p, i) => (
                    <tr key={p.slug}>
                      <td className="t-dim">{String(i + 1).padStart(2, '0')}</td>
                      <td>
                        <Cmd c={`open ${p.slug}`}>{p.name}</Cmd>
                      </td>
                      <td className="t-dim t-hide-sm">{p.category}</td>
                      <td className="t-hide-sm">{p.tagline}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="t-dim">
                Also built: {alsoBuilt.map((a) => a.name).join(', ')}. Run <Cmd c="open 1">open 1</Cmd> or click a name.
              </p>
            </div>
          )
          break
        case 'open': {
          const p = findProject(arg)
          if (!p) {
            out = (
              <p className="t-err">
                open: no project matches "{arg}". Run <Cmd c="projects" /> to see them all.
              </p>
            )
            break
          }
          out = (
            <div className="t-project">
              {p.image && <img src={p.image} alt={`Screens from ${p.name}`} loading="lazy" />}
              <div>
                <p>
                  <span className="t-lime t-big">{p.name}</span> <span className="t-dim">[{p.category}{p.year && `, ${p.year}`}]</span>
                </p>
                <p>{p.tagline}</p>
                <p className="t-dim">{p.description}</p>
                {p.highlights?.map((h) => (
                  <p key={h}>
                    <span className="t-lime">+</span> {h}
                  </p>
                ))}
                {p.stats && (
                  <p className="t-amber">
                    {p.stats.map((s) => `${s.value} ${s.label}`).join('  ·  ')}
                  </p>
                )}
                <p className="t-lav">{p.stack.join(' · ')}</p>
                {p.context && <p className="t-dim"># {p.context}</p>}
              </div>
            </div>
          )
          break
        }
        case 'skills':
          out = (
            <div className="t-block">
              {(['Frontend', 'Backend', 'Web3', 'Tools'] as const).map((g) => (
                <p key={g}>
                  <span className="t-lav">{g.padEnd(9, ' ')}</span>
                  {stack
                    .filter((s) => s.group === g)
                    .map((s) => s.name)
                    .join(', ')}
                </p>
              ))}
            </div>
          )
          break
        case 'experience':
          out = (
            <div className="t-block">
              {experience.map((r) => (
                <div key={r.org + r.title} className="t-xp">
                  <p>
                    <span className="t-lime">{r.title}</span> @ {r.org}{' '}
                    {r.current && <span className="t-live">● now</span>}
                  </p>
                  <p className="t-dim">{r.period}</p>
                  <p>{r.points[0]}</p>
                </div>
              ))}
            </div>
          )
          break
        case 'research': {
          const p = publications[0]
          out = p ? (
            <div className="t-block">
              <p className="t-lime t-big" lang="id">
                {p.title}
              </p>
              <p>
                {p.authors} ({p.year}). <i>{p.venue}</i>.
              </p>
              {p.summary && <p className="t-dim">{p.summary}</p>}
              <p>
                {p.href && (
                  <a className="t-cmd" href={p.href} target="_blank" rel="noreferrer">
                    read the paper ↗
                  </a>
                )}{' '}
                <Cmd c="cite apa">cite apa</Cmd> <Cmd c="cite bibtex">cite bibtex</Cmd>
              </p>
            </div>
          ) : (
            <p className="t-dim">No papers yet.</p>
          )
          break
        }
        case 'cite': {
          const p = publications[0]
          const fmt = arg.toLowerCase() === 'bibtex' ? 'bibtex' : 'apa'
          if (!p?.cite) {
            out = <p className="t-err">cite: nothing to cite yet.</p>
            break
          }
          const msg = await copy(p.cite[fmt], `Copied the ${fmt === 'apa' ? 'APA' : 'BibTeX'} citation to your clipboard.`)
          out = (
            <div>
              <pre className="t-pre">{p.cite[fmt]}</pre>
              <p className="t-lime">{msg}</p>
            </div>
          )
          break
        }
        case 'contact':
          out = (
            <div className="t-block">
              <p>Got an idea at 2 a.m.? Send it my way.</p>
              <p>
                <span className="t-lav">email </span>
                <a className="t-cmd" href={`mailto:${profile.email}`}>
                  {profile.email}
                </a>{' '}
                <Cmd c="email">(copy)</Cmd>
              </p>
              {profile.socials.map((s) => (
                <p key={s.label}>
                  <span className="t-lav">{s.label.toLowerCase().padEnd(10, ' ')}</span>
                  <a className="t-cmd" href={s.href} target="_blank" rel="noreferrer">
                    {s.handle}
                  </a>
                </p>
              ))}
            </div>
          )
          break
        case 'socials':
          await run('contact')
          return
        case 'email':
          out = <p className="t-lime">{await copy(profile.email, `Copied ${profile.email} to your clipboard.`)}</p>
          break
        case 'resume': {
          const a = document.createElement('a')
          a.href = profile.resume
          a.download = ''
          a.click()
          out = <p className="t-lime">Downloading résumé… (Resume_Sarah_Fajriah_Rahmah.pdf)</p>
          break
        }
        case 'week':
        case 'theme':
          out = (
            <div className="t-block">
              <p>This portfolio has a different look every day of the week:</p>
              {themes.map((t) => (
                <p key={t.id}>
                  <span className="t-lav">{t.dayName.padEnd(10, ' ')}</span>
                  <a className="t-cmd" href={`?theme=${t.id}`}>
                    {t.name}
                  </a>{' '}
                  <span className="t-dim">{t.blurb}</span>
                </p>
              ))}
            </div>
          )
          break
        case 'history':
          out = (
            <div>
              {history.map((h, i) => (
                <p key={i}>
                  <span className="t-dim">{String(i + 1).padStart(3, ' ')}</span> {h}
                </p>
              ))}
            </div>
          )
          break
        case 'date':
          out = <p>{new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Jakarta', dateStyle: 'full', timeStyle: 'short' }).format(new Date())} WIB</p>
          break
        case 'echo':
          out = <p>{arg}</p>
          break
        case 'sudo':
          out =
            arg.replace(/\s+/g, '-').toLowerCase() === 'hire-me' ? (
              <div className="t-block">
                <p className="t-lime">[sudo] password for recruiter: ********</p>
                <p>Access granted. Great choice.</p>
                <p>
                  Next step: <a className="t-cmd" href={`mailto:${profile.email}?subject=Let's%20work%20together`}>send me an email</a> or{' '}
                  <Cmd c="resume">grab my résumé</Cmd>.
                </p>
              </div>
            ) : (
              <p className="t-err">nuza is not in the sudoers file. This incident will be reported. (Try: sudo hire-me)</p>
            )
          break
        case 'hire-me':
          out = <p className="t-err">Permission denied. Try: <Cmd c="sudo hire-me" /></p>
          break
        case 'exit':
          out = <p className="t-dim">There is no escape. But you can <Cmd c="week">visit another day</Cmd>.</p>
          break
        case 'coffee':
        case 'teh':
          out = <p>☕ Brewing… done. That's how late-night ideas start.</p>
          break
        default:
          out = (
            <p className="t-err">
              command not found: {name}. Type <Cmd c="help" /> for the list.
            </p>
          )
      }
      print(out, line)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [history, print],
  )

  /* boot sequence */
  const booted = useRef(false)
  useEffect(() => {
    if (booted.current) return
    booted.current = true
    const cancelled = false
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, reduced ? 0 : ms))
    ;(async () => {
      await sleep(250)
      const cmd = 'neofetch'
      for (let i = 1; i <= cmd.length && !cancelled; i++) {
        setValue(cmd.slice(0, i))
        await sleep(70)
      }
      await sleep(200)
      if (cancelled) return
      setValue('')
      print(neofetch(), cmd)
      print(
        <p>
          Welcome! Type <Cmd c="help" /> to see what you can do, or start with <Cmd c="projects" />.
        </p>,
      )
      setBooting(false)
    })()
    // no cleanup: the ref guard above means the boot runs exactly once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!booting) input.current?.focus({ preventScroll: true })
  }, [booting])

  useEffect(() => {
    bottom.current?.scrollIntoView({ block: 'end' })
  }, [entries])

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      run(value)
      setValue('')
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (!history.length) return
      const i = hIndex === null ? history.length - 1 : Math.max(0, hIndex - 1)
      setHIndex(i)
      setValue(history[i])
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (hIndex === null) return
      const i = hIndex + 1
      if (i >= history.length) {
        setHIndex(null)
        setValue('')
      } else {
        setHIndex(i)
        setValue(history[i])
      }
    } else if (e.key === 'Tab') {
      e.preventDefault()
      const [c, ...rest] = value.split(' ')
      if (rest.length === 0) {
        const m = COMMANDS.filter((x) => x.startsWith(c.toLowerCase()))
        if (m.length === 1) setValue(m[0] + ' ')
        else if (m.length > 1) print(<p className="t-dim">{m.join('   ')}</p>, value)
      } else if (c === 'open') {
        const q = rest.join(' ').toLowerCase()
        const m = allProjects.filter((p) => p.slug.startsWith(q))
        if (m.length === 1) setValue(`open ${m[0].slug}`)
        else if (m.length > 1) print(<p className="t-dim">{m.map((p) => p.slug).join('   ')}</p>, value)
      } else if (c === 'cat') {
        const q = rest.join(' ')
        const m = Object.keys(FILES).filter((f) => f.startsWith(q))
        if (m.length === 1) setValue(`cat ${m[0]}`)
      }
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault()
      setEntries([])
    }
  }

  return (
    <div className="t-root" onClick={(e) => !(e.target as HTMLElement).closest('a, button, img, pre') && !window.getSelection()?.toString() && input.current?.focus({ preventScroll: true })}>
      <Backdrop />
      <div className="t-window">
        <header className="t-bar">
          <span className="t-dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <h1>nuza@web: ~ <span className="t-dim">— nuza-sh</span></h1>
        </header>
        <main className="t-screen" aria-live="polite">
          {entries.map((e) => (
            <div key={e.id} className="t-entry">
              {e.input !== undefined && (
                <p className="t-line">
                  <span className="t-prompt">{PROMPT}</span> {e.input}
                </p>
              )}
              {e.output && <div className="t-out">{e.output}</div>}
            </div>
          ))}
          <label className="t-line t-input-line">
            <span className="t-prompt">{PROMPT}</span>
            <span className="t-sr">Command</span>
            <input
              ref={input}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={onKeyDown}
              disabled={booting}
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              aria-label="Type a command"
            />
          </label>
          <div ref={bottom} />
        </main>
        <nav className="t-chips" aria-label="Quick commands">
          {['help', 'about', 'projects', 'skills', 'experience', 'research', 'contact', 'sudo hire-me', 'clear'].map((c) => (
            <button key={c} onClick={() => run(c)} disabled={booting}>
              {c}
            </button>
          ))}
        </nav>
      </div>
    </div>
  )
}
