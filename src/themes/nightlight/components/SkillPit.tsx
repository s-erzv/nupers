import { useEffect, useRef, useState } from 'react'
import Matter from 'matter-js'
import { skillGroups, skills, type Skill } from '../../../data'

const { Engine, Bodies, Body, Composite, Constraint } = Matter

export default function SkillPit({ reducedMotion }: { reducedMotion: boolean }) {
  const box = useRef<HTMLDivElement>(null)
  const pills = useRef<(HTMLButtonElement | null)[]>([])
  const [started, setStarted] = useState(false)
  const [filter, setFilter] = useState<Skill['group'] | null>(null)

  useEffect(() => {
    const el = box.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setStarted(true)
          io.disconnect()
        }
      },
      { threshold: 0.35 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    const el = box.current
    if (!started || !el) return
    const W = el.clientWidth
    const H = el.clientHeight
    const engine = Engine.create({ gravity: { x: 0, y: 1.1 } })
    const wall = { isStatic: true, restitution: 0.4 }
    const t = 200
    Composite.add(engine.world, [
      Bodies.rectangle(W / 2, H + t / 2, W * 3, t, wall),
      Bodies.rectangle(-t / 2, H / 2, t, H * 4, wall),
      Bodies.rectangle(W + t / 2, H / 2, t, H * 4, wall),
    ])

    const bodies = pills.current.map((p, i) => {
      const w = p!.offsetWidth
      const h = p!.offsetHeight
      const x = reducedMotion ? 40 + ((i * 97) % Math.max(1, W - 80)) : W / 2 + (Math.random() - 0.5) * W * 0.7
      const y = reducedMotion ? H - 30 - Math.floor(i / 6) * h : -80 - i * 45
      const b = Bodies.rectangle(x, y, w, h, {
        chamfer: { radius: h / 2 },
        restitution: 0.55,
        friction: 0.08,
        frictionAir: 0.012,
        angle: (Math.random() - 0.5) * 0.6,
      })
      Composite.add(engine.world, b)
      return b
    })

    let grab: Matter.Constraint | null = null
    let grabbed = -1
    const point = { x: 0, y: 0 }
    const local = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      return { x: e.clientX - r.left, y: e.clientY - r.top }
    }
    const downs = pills.current.map((p, i) => {
      const fn = (e: PointerEvent) => {
        e.preventDefault()
        p!.setPointerCapture(e.pointerId)
        Object.assign(point, local(e))
        const b = bodies[i]
        grabbed = i
        grab = Constraint.create({
          pointA: point,
          bodyB: b,
          pointB: Matter.Vector.rotate(Matter.Vector.sub(point, b.position), -b.angle),
          stiffness: 0.2,
          damping: 0.1,
          length: 0,
        })
        Composite.add(engine.world, grab)
        p!.classList.add('is-held')
      }
      p!.addEventListener('pointerdown', fn)
      return fn
    })
    const move = (e: PointerEvent) => {
      if (grab) Object.assign(point, local(e))
    }
    const up = () => {
      if (grab) {
        Composite.remove(engine.world, grab)
        pills.current[grabbed]?.classList.remove('is-held')
        grab = null
        grabbed = -1
      }
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', up)

    let raf = 0
    let last = performance.now()
    const tick = (now: number) => {
      const dt = Math.min(now - last, 16.6)
      last = now
      Engine.update(engine, dt)
      bodies.forEach((b, i) => {
        const p = pills.current[i]
        if (!p) return
        if (b.position.y > H + 300) Body.setPosition(b, { x: W / 2, y: -60 })
        p.style.transform = `translate(${b.position.x - p.offsetWidth / 2}px, ${b.position.y - p.offsetHeight / 2}px) rotate(${b.angle}rad)`
      })
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    const shake = () => {
      bodies.forEach((b) =>
        Body.setVelocity(b, { x: (Math.random() - 0.5) * 18, y: -10 - Math.random() * 14 }),
      )
    }
    el.addEventListener('shake', shake)

    return () => {
      cancelAnimationFrame(raf)
      pills.current.forEach((p, i) => p?.removeEventListener('pointerdown', downs[i]))
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', up)
      el.removeEventListener('shake', shake)
      Engine.clear(engine)
    }
  }, [started, reducedMotion])

  return (
    <div className="pit-wrap">
      <div className="pit-bar">
        <div className="pit-legend" role="group" aria-label="Highlight a group">
          {(Object.keys(skillGroups) as Skill['group'][]).map((g) => (
            <button
              key={g}
              className={`legend legend--${g}`}
              aria-pressed={filter === g}
              onClick={() => setFilter(filter === g ? null : g)}
            >
              <span className="dot" />
              {skillGroups[g]}
            </button>
          ))}
        </div>
        <button className="btn btn--ghost btn--sm" onClick={() => box.current?.dispatchEvent(new Event('shake'))}>
          Shake it up
        </button>
      </div>
      <div ref={box} className="pit" data-filter={filter ?? ''}>
        {skills.map((s, i) => (
          <button
            key={s.name}
            ref={(n) => {
              pills.current[i] = n
            }}
            className={`pill pill--${s.group}`}
            data-group={s.group}
            style={started ? undefined : { visibility: 'hidden' }}
            tabIndex={-1}
          >
            {s.name}
          </button>
        ))}
        <p className="pit-hint">Grab a pill and throw it.</p>
      </div>
      <ul className="sr-only">
        {skills.map((s) => (
          <li key={s.name}>
            {s.name} ({skillGroups[s.group]})
          </li>
        ))}
      </ul>
    </div>
  )
}
