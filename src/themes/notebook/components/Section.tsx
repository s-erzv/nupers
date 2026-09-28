import type { ReactNode } from 'react'

export default function Section({
  id,
  title,
  aside,
  children,
}: {
  id: string
  title: string
  aside?: ReactNode
  children: ReactNode
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`}>
      <div className="hatch rule-b" aria-hidden="true" />
      <div className="rule-b flex items-baseline justify-between gap-4 px-4 py-3 sm:px-6">
        <h2 id={`${id}-title`} className="font-serif text-[32px] leading-none">
          {title}
        </h2>
        {aside && <div className="font-mono text-[12px] text-muted">{aside}</div>}
      </div>
      <div className="rule-b">{children}</div>
    </section>
  )
}
