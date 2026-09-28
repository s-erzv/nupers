import { useEffect, useMemo, useState } from 'react'
import { FaGithub } from 'react-icons/fa6'
import Section from './Section'

type Day = { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 }
type State = { status: 'loading' } | { status: 'error' } | { status: 'ready'; total: number; days: Day[] }

const USER = 's-erzv'
const fmt = new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
const monthFmt = new Intl.DateTimeFormat('en-US', { month: 'short' })

export default function Contributions() {
  const [state, setState] = useState<State>({ status: 'loading' })
  const [hover, setHover] = useState<Day | null>(null)

  useEffect(() => {
    const ctrl = new AbortController()
    fetch(`https://github-contributions-api.jogruber.de/v4/${USER}?y=last`, { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((d: { total: { lastYear: number }; contributions: Day[] }) =>
        setState({ status: 'ready', total: d.total.lastYear, days: d.contributions }),
      )
      .catch((e) => {
        if (e?.name !== 'AbortError') setState({ status: 'error' })
      })
    return () => ctrl.abort()
  }, [])

  // pad the first week so columns line up with weekdays
  const weeks = useMemo(() => {
    if (state.status !== 'ready') return []
    const first = new Date(state.days[0].date).getDay()
    const cells: (Day | null)[] = [...Array(first).fill(null), ...state.days]
    const out: (Day | null)[][] = []
    for (let i = 0; i < cells.length; i += 7) out.push(cells.slice(i, i + 7))
    return out
  }, [state])

  const months = useMemo(() => {
    const labels: { col: number; label: string }[] = []
    let last = -1
    weeks.forEach((w, col) => {
      const d = w.find(Boolean)
      if (!d) return
      const m = new Date(d.date).getMonth()
      if (m !== last && new Date(d.date).getDate() <= 7) {
        labels.push({ col, label: monthFmt.format(new Date(d.date)) })
        last = m
      }
    })
    return labels
  }, [weeks])

  return (
    <Section
      id="github"
      title="Commits"
      aside={
        <a href={`https://github.com/${USER}`} target="_blank" rel="noreferrer" className="link inline-flex items-center gap-1.5">
          <FaGithub aria-hidden="true" /> {USER}
        </a>
      }
    >
      <div className="px-4 py-5 sm:px-6">
        {state.status === 'loading' && <div className="h-[118px] animate-pulse rounded-lg bg-line/60" aria-label="Loading contributions" />}
        {state.status === 'error' && (
          <p className="font-mono text-[13px] text-muted">
            Couldn't reach GitHub right now.{' '}
            <a className="link text-ink" href={`https://github.com/${USER}`} target="_blank" rel="noreferrer">
              See the graph on GitHub
            </a>
            .
          </p>
        )}
        {state.status === 'ready' && (
          <>
            <div className="overflow-x-auto pb-1 [scrollbar-width:none]" dir="rtl">
              <div dir="ltr" className="w-max">
                <div className="relative mb-1.5 h-4 font-mono text-[10px] text-muted">
                  {months.map((m) => (
                    <span key={m.col} className="absolute" style={{ left: m.col * 13 }}>
                      {m.label}
                    </span>
                  ))}
                </div>
                <div className="flex gap-[3px]" role="img" aria-label={`${state.total} contributions in the last year`}>
                  {weeks.map((w, i) => (
                    <div key={i} className="flex flex-col gap-[3px]">
                      {w.map((d, j) =>
                        d ? (
                          <span
                            key={d.date}
                            onMouseEnter={() => setHover(d)}
                            onMouseLeave={() => setHover(null)}
                            className="size-[10px] rounded-[2px] outline-ink transition-transform hover:scale-125 hover:outline"
                            style={{ background: `var(--heat-${d.level})` }}
                          />
                        ) : (
                          <span key={`e${j}`} className="size-[10px]" />
                        ),
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 font-mono text-[12px] text-muted">
              <p aria-live="polite">
                {hover
                  ? `${hover.count} contribution${hover.count === 1 ? '' : 's'} on ${fmt.format(new Date(hover.date))}`
                  : `${state.total.toLocaleString()} contributions in the last year`}
              </p>
              <p className="flex items-center gap-1" aria-hidden="true">
                Less
                {[0, 1, 2, 3, 4].map((l) => (
                  <span key={l} className="size-[10px] rounded-[2px]" style={{ background: `var(--heat-${l})` }} />
                ))}
                More
              </p>
            </div>
          </>
        )}
      </div>
    </Section>
  )
}
