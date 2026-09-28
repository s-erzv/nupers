import { useEffect, useState } from 'react'
import { FaGithub, FaInstagram, FaLinkedinIn, FaXTwitter } from 'react-icons/fa6'
import { LuArrowUp, LuCopy, LuMail } from 'react-icons/lu'
import { profile } from '../../../data'
import { useUI } from '../ui'
import Section from './Section'

const icons = { GitHub: FaGithub, LinkedIn: FaLinkedinIn, X: FaXTwitter, Instagram: FaInstagram } as const

export function Contact() {
  const { copyEmail } = useUI()
  return (
    <Section id="contact" title="Contact">
      <div className="px-4 py-8 sm:px-6">
        <p className="max-w-lg font-serif text-[34px] leading-[1.1] sm:text-[40px]">
          Got an idea at 2 a.m.? <span className="text-muted">Send it my way.</span>
        </p>
        <p className="mt-3 text-[14px] text-muted">Freelance work, collaborations, or just saying hi.</p>
        <div className="mt-6 flex flex-wrap gap-2">
          <a
            href={`mailto:${profile.email}`}
            className="inline-flex items-center gap-2 rounded-lg bg-ink px-4 py-2 text-[14px] font-medium text-bg transition-opacity hover:opacity-85"
          >
            <LuMail className="size-4" aria-hidden="true" />
            Write an email
          </a>
          <button
            onClick={copyEmail}
            className="inline-flex items-center gap-2 rounded-lg border border-line bg-panel px-4 py-2 font-mono text-[13px] transition-colors hover:border-ink"
          >
            <LuCopy className="size-3.5" aria-hidden="true" />
            {profile.email}
          </button>
        </div>
      </div>
      <ul className="grid grid-cols-2 gap-px border-t border-line bg-line sm:grid-cols-4">
        {profile.socials.map((s) => {
          const Icon = icons[s.label as keyof typeof icons]
          return (
            <li key={s.label} className="bg-bg">
              <a href={s.href} target="_blank" rel="noreferrer" className="group flex items-center gap-3 px-4 py-4 transition-colors hover:bg-panel sm:px-6">
                <Icon className="size-5 transition-transform group-hover:-rotate-6 group-hover:scale-110" aria-hidden="true" />
                <span className="min-w-0">
                  <span className="block text-[14px] font-medium">{s.label}</span>
                  <span className="block truncate font-mono text-[11px] text-muted">{s.handle}</span>
                </span>
              </a>
            </li>
          )
        })}
      </ul>
    </Section>
  )
}

export function Footer() {
  const [time, setTime] = useState('')
  useEffect(() => {
    const f = () =>
      setTime(new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Jakarta', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(new Date()))
    f()
    const id = window.setInterval(f, 1000)
    return () => window.clearInterval(id)
  }, [])
  return (
    <footer>
      <div className="hatch rule-b" aria-hidden="true" />
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-6 font-mono text-[12px] text-muted sm:px-6">
        <p>
          © 2026 nuza. Designed and built after midnight, <span className="tabular-nums text-ink">{time}</span> WIB.
        </p>
        <a href="#top" className="inline-flex items-center gap-1 transition-colors hover:text-ink">
          <LuArrowUp className="size-3.5" aria-hidden="true" /> Back to top
        </a>
      </div>
    </footer>
  )
}
