import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { LuCornerDownLeft, LuMoon, LuSearch, LuSun } from 'react-icons/lu'
import { allProjects, profile } from '../../../data'
import { useUI } from '../ui'
import PixelBulb from './PixelBulb'

const links = [
  { href: '#about', label: 'About' },
  { href: '#projects', label: 'Projects' },
  { href: '#research', label: 'Research' },
  { href: '#contact', label: 'Contact' },
]

export default function Nav() {
  const { theme, toggleTheme, setPaletteOpen } = useUI()
  const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPaletteOpen(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [setPaletteOpen])

  return (
    <>
      <div className="sticky top-0 z-50 border-b border-line bg-bg/80 backdrop-blur-md">
        <nav className="mx-auto flex h-14 max-w-3xl items-center gap-2 border-x border-line px-4 sm:px-6" aria-label="Main">
          <a href="#top" className="mr-auto flex items-center gap-2 font-serif text-2xl leading-none" aria-label="nuza, back to top">
            <PixelBulb lit={theme === 'dark'} className="size-6" />
            <span>
              nuza<span className="text-amber">.</span>
            </span>
          </a>
          <ul className="hidden items-center gap-1 sm:flex">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="rounded-md px-2.5 py-1.5 text-[14px] text-muted transition-colors hover:text-ink">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <button
            onClick={() => setPaletteOpen(true)}
            className="flex items-center gap-2 rounded-lg border border-line bg-panel py-1.5 pl-2.5 pr-1.5 text-[13px] text-muted transition-colors hover:border-ink hover:text-ink"
            aria-label="Open command menu"
          >
            <LuSearch className="size-3.5" aria-hidden="true" />
            <kbd className="rounded border border-line bg-bg px-1.5 font-mono text-[11px]">{isMac ? '⌘' : 'Ctrl'} K</kbd>
          </button>
          <button
            onClick={(e) => {
              const r = e.currentTarget.getBoundingClientRect()
              toggleTheme({ x: r.left + r.width / 2, y: r.top + r.height / 2 })
            }}
            className="grid size-8 place-items-center rounded-lg border border-line bg-panel text-muted transition-colors hover:border-ink hover:text-ink"
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            {theme === 'dark' ? <LuSun className="size-4" /> : <LuMoon className="size-4" />}
          </button>
        </nav>
      </div>
      <CommandPalette />
    </>
  )
}

type Item = { id: string; group: string; label: string; hint?: string; run: () => void }

function CommandPalette() {
  const { paletteOpen, setPaletteOpen, toggleTheme, copyEmail } = useUI()
  const [q, setQ] = useState('')
  const [index, setIndex] = useState(0)
  const input = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const items = useMemo<Item[]>(() => {
    const go = (hash: string) => () => document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' })
    return [
      ...[
        ['#about', 'About'],
        ['#github', 'Commits'],
        ['#stack', 'Stack'],
        ['#experience', 'Experience'],
        ['#projects', 'Projects'],
        ['#research', 'Research'],
        ['#contact', 'Contact'],
      ].map(([h, l]) => ({ id: h, group: 'Go to', label: l, run: go(h) })),
      ...allProjects.map((p) => ({
        id: p.slug,
        group: 'Projects',
        label: p.name,
        hint: p.category,
        run: () => window.dispatchEvent(new CustomEvent('open-project', { detail: p.slug })),
      })),
      { id: 'theme', group: 'Actions', label: 'Toggle light or dark theme', run: () => toggleTheme() },
      { id: 'email', group: 'Actions', label: 'Copy email address', hint: profile.email, run: copyEmail },
      { id: 'resume', group: 'Actions', label: 'Download résumé', run: () => window.open(profile.resume, '_blank') },
      ...profile.socials.map((s) => ({
        id: s.label,
        group: 'Links',
        label: s.label,
        hint: s.handle,
        run: () => window.open(s.href, '_blank', 'noopener'),
      })),
    ]
  }, [toggleTheme, copyEmail])

  const results = useMemo(() => {
    const t = q.trim().toLowerCase()
    return t ? items.filter((i) => `${i.label} ${i.hint ?? ''} ${i.group}`.toLowerCase().includes(t)) : items
  }, [q, items])

  useEffect(() => {
    if (paletteOpen) {
      setQ('')
      setIndex(0)
      requestAnimationFrame(() => input.current?.focus())
    }
  }, [paletteOpen])

  useEffect(() => setIndex(0), [q])

  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>(`[data-index="${index}"]`)?.scrollIntoView({ block: 'nearest' })
  }, [index])

  const run = (item?: Item) => {
    if (!item) return
    setPaletteOpen(false)
    setTimeout(item.run, 60)
  }

  let lastGroup = ''
  return (
    <AnimatePresence>
      {paletteOpen && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-start justify-center bg-black/30 px-4 pt-[14vh] backdrop-blur-[2px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(e) => e.target === e.currentTarget && setPaletteOpen(false)}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command menu"
            className="w-full max-w-lg overflow-hidden rounded-xl border border-line bg-panel shadow-2xl"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.16 }}
            onKeyDown={(e) => {
              if (e.key === 'Escape') setPaletteOpen(false)
              if (e.key === 'ArrowDown') {
                e.preventDefault()
                setIndex((i) => Math.min(results.length - 1, i + 1))
              }
              if (e.key === 'ArrowUp') {
                e.preventDefault()
                setIndex((i) => Math.max(0, i - 1))
              }
              if (e.key === 'Enter') run(results[index])
            }}
          >
            <div className="flex items-center gap-2 border-b border-line px-4">
              <LuSearch className="size-4 text-muted" aria-hidden="true" />
              <input
                ref={input}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search projects, sections, actions…"
                className="h-12 flex-1 bg-transparent text-[14px] outline-none placeholder:text-faint focus-visible:outline-none"
                role="combobox"
                aria-expanded="true"
                aria-controls="palette-list"
                aria-activedescendant={results[index] ? `opt-${results[index].id}` : undefined}
              />
              <kbd className="rounded border border-line px-1.5 font-mono text-[11px] text-muted">esc</kbd>
            </div>
            <ul ref={listRef} id="palette-list" role="listbox" className="max-h-[50vh] overflow-y-auto p-2">
              {results.length === 0 && <li className="px-3 py-8 text-center text-[13px] text-muted">Nothing matches “{q}”. Try a project name.</li>}
              {results.map((item, i) => {
                const header = item.group !== lastGroup
                lastGroup = item.group
                return (
                  <li key={item.id} role="presentation">
                    {header && <p className="px-3 pb-1 pt-2 font-mono text-[11px] text-faint">{item.group}</p>}
                    <div
                      id={`opt-${item.id}`}
                      role="option"
                      aria-selected={i === index}
                      data-index={i}
                      onMouseMove={() => setIndex(i)}
                      onClick={() => run(item)}
                      className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-[14px] aria-selected:bg-bg"
                    >
                      <span className="flex-1 truncate">{item.label}</span>
                      {item.hint && <span className="truncate font-mono text-[11px] text-muted">{item.hint}</span>}
                      {i === index && <LuCornerDownLeft className="size-3.5 text-muted" aria-hidden="true" />}
                    </div>
                  </li>
                )
              })}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
