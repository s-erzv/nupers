import { useEffect, useState } from 'react'
import { FaGithub, FaInstagram, FaLinkedinIn, FaXTwitter } from 'react-icons/fa6'
import { LuArrowUpRight, LuClock, LuCode, LuFileText, LuGraduationCap, LuMail } from 'react-icons/lu'
import { profile } from '../../../data'
import { Scramble, useUI } from '../ui'
import DotMatrix from './DotMatrix'
import PixelBulb from './PixelBulb'

const ROLES = ['Fullstack developer', 'Web3 builder', 'Published researcher', 'Late-night idea shipper']

function useJakartaTime() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 15_000)
    return () => window.clearInterval(id)
  }, [])
  const time = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Jakarta', hour: '2-digit', minute: '2-digit' }).format(now)
  const visitorOffset = -now.getTimezoneOffset() / 60
  const diff = 7 - visitorOffset
  const rel = diff === 0 ? 'same time as you' : `${Math.abs(diff)}h ${diff > 0 ? 'ahead of' : 'behind'} you`
  return { time, rel }
}

const socials = [
  { label: 'GitHub', icon: FaGithub },
  { label: 'LinkedIn', icon: FaLinkedinIn },
  { label: 'X', icon: FaXTwitter },
  { label: 'Instagram', icon: FaInstagram },
] as const

export default function Profile() {
  const { copyEmail, toggleTheme, theme } = useUI()
  const { time, rel } = useJakartaTime()
  const [hover, setHover] = useState(false)

  return (
    <header id="top">
      {/* cover */}
      <div className="rule-b relative h-52 sm:h-60">
        <DotMatrix />
        <p className="pointer-events-none absolute right-3 top-3 hidden rotate-[4deg] font-hand text-xl leading-tight text-muted sm:block">
          move your cursor,
          <br />
          it glows. click it too
        </p>
        <svg
          className="pointer-events-none absolute right-24 top-[70px] hidden h-10 w-10 text-muted sm:block"
          viewBox="0 0 40 40"
          fill="none"
          aria-hidden="true"
        >
          <path d="M34 4 C 30 18, 20 26, 6 30 M6 30 l7 -7 M6 30 l9 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </div>

      {/* identity */}
      <div className="rule-b flex items-end gap-4 px-4 pb-4 sm:px-6">
        <button
          className="relative -mt-12 grid size-24 shrink-0 place-items-center rounded-2xl border border-line bg-panel shadow-sm transition-transform hover:-rotate-3 sm:-mt-14 sm:size-28"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onClick={(e) => {
            const r = e.currentTarget.getBoundingClientRect()
            toggleTheme({ x: r.left + r.width / 2, y: r.top + r.height / 2 })
          }}
          aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          title="Click me"
        >
          <PixelBulb lit={hover || theme === 'dark'} className="size-16 sm:size-[72px]" />
          <span className="absolute -bottom-1 -right-1 size-4 rounded-full border-2 border-panel bg-lime" aria-hidden="true" />
        </button>
        <div className="min-w-0 pb-1">
          <h1 className="flex items-center gap-2 font-serif text-4xl leading-none sm:text-5xl">
            nuza
            <svg viewBox="0 0 24 24" className="mt-1 size-6 text-accent" aria-label="Verified">
              <path
                fill="currentColor"
                d="M12 1.5l2.4 1.8 3-.1 1 2.8 2.5 1.7-.8 2.9.8 2.9-2.5 1.7-1 2.8-3-.1L12 22.5l-2.4-1.8-3 .1-1-2.8-2.5-1.7.8-2.9-.8-2.9 2.5-1.7 1-2.8 3 .1z"
              />
              <path d="M8 12.2l2.7 2.6L16.2 9" fill="none" stroke="var(--panel)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </h1>
          <p className="mt-2 font-mono text-[13px] text-muted">
            <Scramble phrases={ROLES} />
          </p>
        </div>
      </div>

      {/* info grid */}
      <div className="rule-b grid gap-x-8 gap-y-3 px-4 py-5 font-mono text-[13px] sm:grid-cols-2 sm:px-6">
        <Info icon={<LuCode />}>
          Fullstack developer <span className="text-muted">@</span>Bikin Semua Mudah
        </Info>
        <Info icon={<LuGraduationCap />}>
          Information Systems <span className="text-muted">@</span>UIN Jakarta
        </Info>
        <Info icon={<LuClock />}>
          {time} WIB <span className="text-muted">// {rel}</span>
        </Info>
        <Info icon={<LuMail />}>
          <button onClick={copyEmail} className="link text-left" title="Copy email">
            {profile.email}
          </button>
        </Info>
        <Info icon={<LuFileText />}>
          <a href={profile.resume} download className="link">
            Download résumé (PDF)
          </a>
        </Info>
      </div>

      {/* socials */}
      <ul className="rule-b flex flex-wrap gap-2 px-4 py-4 sm:px-6">
        {socials.map(({ label, icon: Icon }) => {
          const s = profile.socials.find((x) => x.label === label)!
          return (
            <li key={label}>
              <a
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-2 rounded-lg border border-line bg-panel px-3 py-1.5 text-[13px] transition-colors hover:border-ink"
              >
                <Icon className="size-4" aria-hidden="true" />
                {label}
                <LuArrowUpRight className="size-3.5 text-faint transition-transform group-hover:-translate-y-px group-hover:translate-x-px group-hover:text-ink" aria-hidden="true" />
              </a>
            </li>
          )
        })}
      </ul>
    </header>
  )
}

function Info({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <span aria-hidden="true" className="grid size-7 shrink-0 place-items-center rounded-md border border-line bg-panel text-muted [&>svg]:size-3.5">
        {icon}
      </span>
      <span className="min-w-0 truncate">{children}</span>
    </div>
  )
}
