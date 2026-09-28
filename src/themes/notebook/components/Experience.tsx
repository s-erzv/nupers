import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { LuChevronDown } from 'react-icons/lu'
import { experience } from '../../../data'
import Section from './Section'

function initials(org: string) {
  return org
    .replace(/^PT\.\s*/, '')
    .split(/[\s,]+/)
    .filter((w) => /^[A-Z]/.test(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
}

export default function Experience() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <Section id="experience" title="Experience" aside={`${experience.length} roles`}>
      <ol>
        {experience.map((r, i) => {
          const isOpen = open === i
          return (
            <li key={r.org + r.title} className="border-b border-line last:border-b-0">
              <button
                className="flex w-full items-center gap-4 px-4 py-4 text-left transition-colors hover:bg-panel sm:px-6"
                aria-expanded={isOpen}
                aria-controls={`xp-${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-line bg-panel font-mono text-[12px] font-semibold">
                  {initials(r.org)}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">{r.org}</span>
                    {r.current && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-lime-soft px-2 py-0.5 font-mono text-[11px] text-lime">
                        <span className="relative flex size-1.5">
                          <span className="absolute inline-flex size-full animate-ping rounded-full bg-lime opacity-60" />
                          <span className="relative inline-flex size-1.5 rounded-full bg-lime" />
                        </span>
                        Working
                      </span>
                    )}
                  </span>
                  <span className="block truncate text-[13px] text-muted">
                    {r.title}
                    {r.mode && ` (${r.mode})`}
                  </span>
                </span>
                <span className="hidden text-right font-mono text-[12px] text-muted sm:block">
                  {r.period}
                </span>
                <LuChevronDown className={`size-4 shrink-0 text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={`xp-${i}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: [0.2, 0.8, 0.2, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-5 sm:pl-20 sm:pr-6">
                      <p className="mb-2 font-mono text-[12px] text-muted sm:hidden">
                        {r.period}
                      </p>
                      <ul className="list-disc space-y-1.5 pl-4 text-[14px] text-muted marker:text-faint">
                        {r.points.map((p) => (
                          <li key={p}>{p}</li>
                        ))}
                      </ul>
                      {r.skills && (
                        <ul className="mt-3 flex flex-wrap gap-1.5">
                          {r.skills.map((s) => (
                            <li key={s} className="rounded-md border border-line bg-panel px-2 py-0.5 font-mono text-[11px] text-muted">
                              {s}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          )
        })}
      </ol>
    </Section>
  )
}
