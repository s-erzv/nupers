import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { FaGithub, FaInstagram, FaLinkedinIn, FaXTwitter } from 'react-icons/fa6'
import { FiMail } from 'react-icons/fi'
import type { IconType } from 'react-icons'
import DeskIllustration from './components/DeskIllustration'
import Publications from './components/Publications'
import SkillPit from './components/SkillPit'
import Work from './components/Work'
import { experience, profile, publications } from '../../data'
import { tiltHandlers } from './tilt'

const socialIcons: Record<string, IconType> = {
  GitHub: FaGithub,
  LinkedIn: FaLinkedinIn,
  X: FaXTwitter,
  Instagram: FaInstagram,
}

const BulbScene = lazy(() => import('./components/BulbScene'))

type Theme = 'night' | 'day'

function readTheme(): Theme {
  try {
    const saved = localStorage.getItem('nupers-theme')
    if (saved === 'night' || saved === 'day') return saved
  } catch {
    /* storage unavailable */
  }
  return 'night'
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const fn = () => setReduced(mq.matches)
    mq.addEventListener('change', fn)
    return () => mq.removeEventListener('change', fn)
  }, [])
  return reduced
}

export default function App() {
  const [theme, setTheme] = useState<Theme>(readTheme)
  const [copied, setCopied] = useState(false)
  const reducedMotion = useReducedMotion()
  const headline = useRef<HTMLHeadingElement>(null)
  const lightsOn = theme === 'night'

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try {
      localStorage.setItem('nupers-theme', theme)
    } catch {
      /* storage unavailable */
    }
  }, [theme])

  const toggle = useCallback(() => setTheme((t) => (t === 'night' ? 'day' : 'night')), [])

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      window.location.href = `mailto:${profile.email}`
    }
  }

  return (
    <>
      <a className="skip" href="#work">
        Skip to work
      </a>
      <header className="nav">
        <a className="logo" href="#top" aria-label="nuza, back to top">
          nuza<span>.</span>
        </a>
        <nav aria-label="Sections">
          <a href="#work">Work</a>
          {publications.length > 0 && <a href="#research">Research</a>}
          <a href="#about">About</a>
          <a href="#stack">Stack</a>
          <a href="#contact">Contact</a>
        </nav>
        <button className="switch" onClick={toggle} aria-pressed={!lightsOn}>
          <span className="switch-knob" aria-hidden="true" />
          <span className="switch-label">{lightsOn ? 'Late night' : 'Morning'}</span>
        </button>
      </header>

      <main id="top">
        <section className="hero">
          <Suspense fallback={<div className="scene" />}>
            <BulbScene lightsOn={lightsOn} onToggle={toggle} glowTarget={headline} reducedMotion={reducedMotion} />
          </Suspense>
          <div className="hero-copy">
            <p className="hero-intro">
              <span className="intro-mark" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.6 10.8c.4.3.6.8.6 1.2v1h6v-1c0-.4.2-.9.6-1.2A6 6 0 0 0 12 3z" />
                </svg>
              </span>
              Fullstack developer & Information Systems undergrad
            </p>
            <h1 ref={headline} className="headline">
              Turning late‑night ideas into real web experiences.
            </h1>
            <p className="hero-sub">
              I build production web apps for e-commerce, fintech, civic tech and Web3, from the database schema to the
              last hover state.
            </p>
            <div className="hero-actions">
              <a className="btn btn--primary" href="#work">
                See my work
              </a>
              <a className="btn btn--ghost" href={profile.resume} download>
                Download résumé
              </a>
            </div>
          </div>
          <p className="hero-hint" aria-hidden="true">
            <span className="hint-dot" />
            Grab the bulb to swing it. Pull it down, or tap it, to {lightsOn ? 'turn the lights off' : 'turn them back on'}.
          </p>
        </section>

        <section id="work" className="section">
          <div className="section-head">
            <h2>Selected work</h2>
            <p>
              Things people use every day, and a few I built to learn something new. Click a screenshot to look closer.
            </p>
          </div>
          <Work />
        </section>

        <Publications />

        <section id="about" className="section about">
          <div className="portrait" {...tiltHandlers(10)}>
            <DeskIllustration />
            <span className="portrait-tag">Where the late-night ideas happen.</span>
          </div>
          <div className="about-copy">
            <h2>Hi, I'm Sarah. Call me Nuza.</h2>
            <p>
              Information Systems undergrad at UIN Syarif Hidayatullah Jakarta, and fullstack developer at PT. Bikin Semua
              Mudah. I usually handle the whole thing, from the database to the deploy.
            </p>
            <dl className="facts">
              <div>
                <dt>Studying</dt>
                <dd>Information Systems, 2024–2028</dd>
              </div>
              <div>
                <dt>Currently</dt>
                <dd>Fullstack at PT. Bikin Semua Mudah</dd>
              </div>
              <div>
                <dt>Open to</dt>
                <dd>Freelance work and collaborations</dd>
              </div>
            </dl>
          </div>
        </section>

        <section id="stack" className="section">
          <div className="section-head">
            <h2>What I work with</h2>
            <p>The tools I reach for most. Go ahead and play with them.</p>
          </div>
          <SkillPit reducedMotion={reducedMotion} />
        </section>

        <section id="journey" className="section">
          <div className="section-head">
            <h2>Where I've been</h2>
            <p>Newest first.</p>
          </div>
          <ol className="timeline">
            {experience.map((r) => (
              <li key={r.title + r.org}>
                <p className="tl-period">{r.period}</p>
                <div className="tl-body">
                  <h3>
                    {r.title} <span>at {r.org}</span>
                  </h3>
                  <ul>
                    {r.points.map((pt) => (
                      <li key={pt}>{pt}</li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section id="contact" className="section contact">
          <h2>
            Got an idea at 2 a.m.? <br />
            Send it my way.
          </h2>
          <p>I read every message, usually with a cup of something warm.</p>
          <div className="contact-actions">
            <button className="btn btn--primary btn--lg" onClick={copyEmail}>
              <FiMail aria-hidden="true" />
              {copied ? 'Email copied' : profile.email}
            </button>
            <a className="btn btn--ghost btn--lg" href={`mailto:${profile.email}`}>
              Write an email
            </a>
          </div>
          <span className="sr-only" aria-live="polite">
            {copied ? 'Email address copied to clipboard' : ''}
          </span>
          <ul className="socials">
            {profile.socials.map((s) => {
              const Icon = socialIcons[s.label]
              return (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noreferrer" className={`social social--${s.label.toLowerCase()}`}>
                    <span className="social-icon" aria-hidden="true">
                      {Icon && <Icon />}
                    </span>
                    <span className="social-text">
                      <span>{s.label}</span>
                      <span className="social-handle">{s.handle}</span>
                    </span>
                  </a>
                </li>
              )
            })}
          </ul>
        </section>
      </main>

      <footer className="footer">
        <p>© 2026 Sarah Fajriah Rahmah</p>
        <p>Built with React and Three.js, mostly after midnight.</p>
      </footer>
    </>
  )
}
