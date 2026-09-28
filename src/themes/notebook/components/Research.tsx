import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { LuArrowUpRight, LuCopy, LuQuote } from 'react-icons/lu'
import { publications } from '../../../data'
import { useUI } from '../ui'
import Section from './Section'

export default function Research() {
  const { toast } = useUI()
  const [format, setFormat] = useState<'apa' | 'bibtex' | null>(null)
  if (publications.length === 0) return null

  const copy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast(`${label} citation copied`)
    } catch {
      toast('Copy failed, select the text instead')
    }
  }

  return (
    <Section id="research" title="Research" aside={`${publications.length} paper${publications.length > 1 ? 's' : ''}`}>
      <ol>
        {publications.map((p) => (
          <li key={p.title} className="border-b border-line px-4 py-5 last:border-b-0 sm:px-6">
            <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-muted">
              <span className="rounded-md bg-accent-soft px-2 py-0.5 text-accent">{p.kind}</span>
              <span>{p.year}</span>
              {p.doi && (
                <a href={`https://doi.org/${p.doi}`} target="_blank" rel="noreferrer" className="link">
                  doi:{p.doi}
                </a>
              )}
            </div>
            <h3 className="mt-3 font-serif text-[26px] leading-[1.15] text-balance" lang="id">
              <a href={p.href} target="_blank" rel="noreferrer" className="group">
                {p.title}
                <LuArrowUpRight className="ml-1 inline size-5 align-baseline text-faint transition-colors group-hover:text-ink" aria-hidden="true" />
              </a>
            </h3>
            <p className="mt-2 text-[14px]">
              {p.authors.split(', ').map((a, i, arr) => (
                <span key={a}>
                  <span className={a.startsWith('Sarah') ? 'font-medium text-ink underline decoration-accent decoration-2 underline-offset-4' : 'text-muted'}>{a}</span>
                  {i < arr.length - 1 && <span className="text-muted">, </span>}
                </span>
              ))}
            </p>
            <p className="mt-0.5 text-[14px] italic text-muted">{p.venue}</p>
            {p.summary && (
              <p className="mt-4 border-l-2 border-line pl-4 text-[14px] text-muted">
                <LuQuote className="mr-1.5 inline size-3.5 -translate-y-px text-faint" aria-hidden="true" />
                {p.summary}
              </p>
            )}
            {p.keywords && (
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {p.keywords.map((k) => (
                  <li key={k} className="rounded-md border border-line bg-panel px-2 py-0.5 font-mono text-[11px] text-muted">
                    {k}
                  </li>
                ))}
              </ul>
            )}
            {p.cite && (
              <div className="mt-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[12px] text-muted">Cite:</span>
                  {(['apa', 'bibtex'] as const).map((f) => (
                    <button
                      key={f}
                      aria-pressed={format === f}
                      onClick={() => setFormat(format === f ? null : f)}
                      className="rounded-md border border-line px-2.5 py-1 font-mono text-[12px] transition-colors hover:border-ink aria-pressed:border-ink aria-pressed:bg-ink aria-pressed:text-bg"
                    >
                      {f === 'apa' ? 'APA' : 'BibTeX'}
                    </button>
                  ))}
                </div>
                <AnimatePresence initial={false}>
                  {format && (
                    <motion.div
                      key={format}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="relative mt-3 rounded-lg border border-line bg-panel">
                        <pre className="overflow-x-auto whitespace-pre-wrap p-4 pr-12 font-mono text-[12px] leading-relaxed text-muted">
                          {p.cite[format]}
                        </pre>
                        <button
                          onClick={() => copy(p.cite![format], format === 'apa' ? 'APA' : 'BibTeX')}
                          className="absolute right-2 top-2 grid size-8 place-items-center rounded-md border border-line bg-bg text-muted transition-colors hover:text-ink"
                          aria-label="Copy citation"
                        >
                          <LuCopy className="size-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </li>
        ))}
      </ol>
    </Section>
  )
}
