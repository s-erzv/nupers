import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring } from 'motion/react'
import { LuPlus } from 'react-icons/lu'
import { allProjects, alsoBuilt, featured, type Category, type Project } from '../../../data'
import Section from './Section'

const INITIAL = 6

export default function Projects() {
  const [filter, setFilter] = useState<'All' | Category>('All')
  const [open, setOpen] = useState<string | null>(null)
  const [showAll, setShowAll] = useState(false)
  const [preview, setPreview] = useState<Project | null>(null)
  const canHover = useRef(typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches)

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 300, damping: 30, mass: 0.5 })
  const sy = useSpring(y, { stiffness: 300, damping: 30, mass: 0.5 })

  const categories = useMemo(() => ['All', ...new Set(allProjects.map((p) => p.category))] as ('All' | Category)[], [])
  const filtered = filter === 'All' ? allProjects : allProjects.filter((p) => p.category === filter)
  const list = showAll || filter !== 'All' ? filtered : filtered.slice(0, INITIAL)

  // the command palette and in-page links can ask for a project to open
  useEffect(() => {
    const openSlug = (slug: string) => {
      if (!allProjects.some((p) => p.slug === slug)) return
      setFilter('All')
      setShowAll(true)
      setOpen(slug)
      // wait for the previously open row to finish collapsing before measuring
      window.setTimeout(() => document.getElementById(`project-${slug}`)?.scrollIntoView({ block: 'start', behavior: 'smooth' }), 380)
    }
    const onEvent = (e: Event) => openSlug((e as CustomEvent<string>).detail)
    const onHash = () => {
      const m = location.hash.match(/^#project-(.+)$/)
      if (m) openSlug(m[1])
    }
    window.addEventListener('open-project', onEvent)
    window.addEventListener('hashchange', onHash)
    onHash()
    return () => {
      window.removeEventListener('open-project', onEvent)
      window.removeEventListener('hashchange', onHash)
    }
  }, [])

  return (
    <Section id="projects" title="Projects" aside={`${allProjects.length} shipped`}>
      <div className="flex gap-1.5 overflow-x-auto border-b border-line px-4 py-3 [scrollbar-width:none] sm:px-6" role="group" aria-label="Filter by category">
        {categories.map((c) => (
          <button
            key={c}
            aria-pressed={filter === c}
            onClick={() => {
              setFilter(c)
              setOpen(null)
            }}
            className="shrink-0 rounded-full border border-line px-3 py-1 font-mono text-[12px] text-muted transition-colors hover:text-ink aria-pressed:border-ink aria-pressed:bg-ink aria-pressed:text-bg"
          >
            {c}
          </button>
        ))}
      </div>

      <ul
        onPointerMove={(e) => {
          x.set(e.clientX)
          y.set(e.clientY)
        }}
        onPointerLeave={() => setPreview(null)}
      >
        {list.map((p) => {
          const isOpen = open === p.slug
          const star = featured.includes(p)
          return (
            <li key={p.slug} id={`project-${p.slug}`} className="border-b border-line last:border-b-0">
              <button
                className="group flex w-full items-center gap-4 px-4 py-3.5 text-left transition-colors hover:bg-panel sm:px-6"
                aria-expanded={isOpen}
                aria-controls={`pj-${p.slug}`}
                onClick={() => {
                  setOpen(isOpen ? null : p.slug)
                  setPreview(null)
                }}
                onPointerEnter={() => canHover.current && !isOpen && setPreview(p)}
                onPointerLeave={() => setPreview(null)}
              >
                <span className="w-10 shrink-0 font-mono text-[12px] text-faint">{p.year || '—'}</span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2 font-medium">
                    {p.name}
                    {star && (
                      <span className="text-amber" title="Featured" aria-label="Featured">
                        ✦
                      </span>
                    )}
                  </span>
                  <span className="block truncate text-[13px] text-muted">{p.tagline}</span>
                </span>
                <span className="hidden shrink-0 rounded-md border border-line px-2 py-0.5 font-mono text-[11px] text-muted sm:inline">
                  {p.category}
                </span>
                <LuPlus className={`size-4 shrink-0 text-muted transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`} aria-hidden="true" />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={`pj-${p.slug}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.32, ease: [0.2, 0.8, 0.2, 1] }}
                    className="overflow-hidden"
                  >
                    <ProjectDetail p={p} />
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          )
        })}
      </ul>

      {filter === 'All' && !showAll && filtered.length > INITIAL && (
        <div className="flex justify-center border-t border-line py-3">
          <button onClick={() => setShowAll(true)} className="rounded-full border border-line bg-panel px-4 py-1.5 font-mono text-[12px] transition-colors hover:border-ink">
            Show all {filtered.length} projects
          </button>
        </div>
      )}

      <div className="border-t border-line px-4 py-4 sm:px-6">
        <p className="font-mono text-[12px] text-muted">Also on the shelf</p>
        <ul className="mt-2 grid gap-x-6 gap-y-1 text-[13px] sm:grid-cols-2">
          {alsoBuilt.map((a) => (
            <li key={a.name}>
              <span className="text-ink">{a.name}</span> <span className="text-muted">{a.note}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* cursor preview */}
      <AnimatePresence>
        {preview && (
          <motion.div
            key={preview.slug}
            className="pointer-events-none fixed left-0 top-0 z-40 w-72 overflow-hidden rounded-xl border border-line bg-panel shadow-2xl"
            style={{ x: sx, y: sy, translateX: 24, translateY: '-50%' }}
            initial={{ opacity: 0, scale: 0.9, rotate: -3 }}
            animate={{ opacity: 1, scale: 1, rotate: -2 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.18 }}
          >
            <img src={preview.image} alt="" className="aspect-[16/11] w-full object-cover object-top" />
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  )
}

function ProjectDetail({ p }: { p: Project }) {
  return (
    <div className="grid gap-5 px-4 pb-6 pt-1 sm:grid-cols-[1.1fr_1fr] sm:px-6">
      {p.image && (
        <a href={p.image} target="_blank" rel="noreferrer" className="block self-start overflow-hidden rounded-xl border border-line bg-panel">
          <img src={p.image} alt={`Screens from ${p.name}`} loading="lazy" className="aspect-[16/11] w-full object-cover object-top transition-transform duration-500 hover:scale-[1.03]" />
        </a>
      )}
      <div className="min-w-0">
        <p className="text-[14px] text-muted">{p.description}</p>
        {p.highlights && (
          <ul className="mt-3 space-y-1 text-[13px]">
            {p.highlights.map((h) => (
              <li key={h} className="flex gap-2">
                <span className="text-lime" aria-hidden="true">
                  ✓
                </span>
                {h}
              </li>
            ))}
          </ul>
        )}
        {p.stats && (
          <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
            {p.stats.map((s) => (
              <div key={s.label} className="flex flex-col-reverse">
                <dt className="font-mono text-[11px] text-muted">{s.label}</dt>
                <dd className="m-0 font-serif text-3xl leading-none">{s.value}</dd>
              </div>
            ))}
          </dl>
        )}
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {p.stack.map((s) => (
            <li key={s} className="rounded-md border border-line bg-panel px-2 py-0.5 font-mono text-[11px] text-muted">
              {s}
            </li>
          ))}
        </ul>
        {p.context && <p className="mt-3 font-mono text-[11px] text-faint">{p.context}</p>}
      </div>
    </div>
  )
}
