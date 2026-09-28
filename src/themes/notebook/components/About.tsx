import { useState } from 'react'
import { stack } from '../../../stack'
import Section from './Section'

export function About() {
  return (
    <Section id="about" title="About">
      <ul className="space-y-3 px-4 py-5 text-[15px] text-muted sm:px-6 [&>li]:relative [&>li]:pl-5 [&>li]:before:absolute [&>li]:before:left-0 [&>li]:before:top-[0.7em] [&>li]:before:size-1.5 [&>li]:before:rounded-full [&>li]:before:bg-faint">
        <li>
          I'm Sarah Fajriah Rahmah, but you can call me <span className="text-ink">Nuza</span>. Information Systems undergrad
          at UIN Syarif Hidayatullah Jakarta (2024–2028).
        </li>
        <li>
          Fullstack developer at <span className="text-ink">PT. Bikin Semua Mudah</span>. I usually handle the whole thing,
          from the database to the deploy.
        </li>
      </ul>
    </Section>
  )
}

export function TechStack() {
  const [active, setActive] = useState<string | null>(null)
  const groups = ['Frontend', 'Backend', 'Web3', 'Tools'] as const
  return (
    <Section id="stack" title="Stack" aside={active ?? `${stack.length} tools`}>
      <div className="grid gap-px bg-line sm:grid-cols-[120px_1fr]">
        {groups.map((g) => (
          <div key={g} className="contents">
            <p className="bg-bg px-4 pt-3 font-mono text-[12px] text-muted sm:px-6 sm:py-4">{g}</p>
            <ul className="flex flex-wrap gap-1.5 bg-bg px-4 pb-4 pt-2 sm:px-4 sm:py-3">
              {stack
                .filter((s) => s.group === g)
                .map(({ name, icon: Icon }) => (
                  <li key={name}>
                    <span
                      tabIndex={0}
                      onMouseEnter={() => setActive(name)}
                      onMouseLeave={() => setActive(null)}
                      onFocus={() => setActive(name)}
                      onBlur={() => setActive(null)}
                      className="group relative grid size-10 place-items-center rounded-lg border border-line bg-panel text-muted transition-all hover:-translate-y-0.5 hover:border-ink hover:text-ink focus-visible:text-ink"
                    >
                      <Icon className="size-[18px]" aria-hidden="true" />
                      <span className="sr-only">{name}</span>
                      <span
                        className="pointer-events-none absolute -top-8 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-md bg-ink px-2 py-1 font-mono text-[11px] text-bg opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
                        aria-hidden="true"
                      >
                        {name}
                      </span>
                    </span>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  )
}
