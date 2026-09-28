import { useEffect, useRef } from 'react'

const GLYPHS = 'アイウエオカキクケコサシスセソ01{}<>/=+*$#nuza'

/** Moving aurora blobs plus a slow rain of glyphs, sitting behind the glass terminal window. */
export default function Backdrop() {
  const root = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const el = root.current!
    const cv = canvas.current!
    const ctx = cv.getContext('2d')!
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const size = 16
    let cols: { y: number; speed: number; hue: number }[] = []
    let raf = 0
    let last = 0

    const resize = () => {
      cv.width = window.innerWidth * dpr
      cv.height = window.innerHeight * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const n = Math.ceil(window.innerWidth / size)
      cols = Array.from({ length: n }, () => ({
        y: Math.random() * -window.innerHeight,
        speed: 0.4 + Math.random() * 1.1,
        hue: Math.random(),
      }))
    }
    resize()

    const tick = (t: number) => {
      raf = requestAnimationFrame(tick)
      if (t - last < 50) return
      last = t
      // fade the previous frame instead of clearing, so each glyph leaves a trail
      ctx.fillStyle = 'rgba(8, 10, 14, 0.14)'
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight)
      ctx.font = `${size - 2}px 'JetBrains Mono', monospace`
      cols.forEach((c, i) => {
        const ch = GLYPHS[(Math.random() * GLYPHS.length) | 0]
        ctx.fillStyle = c.hue > 0.82 ? 'rgba(158, 168, 255, 0.55)' : 'rgba(184, 242, 107, 0.4)'
        ctx.fillText(ch, i * size, c.y)
        c.y += size * c.speed
        if (c.y > window.innerHeight + 40 && Math.random() > 0.96) c.y = Math.random() * -200
      })
    }

    const onMove = (e: PointerEvent) => {
      el.style.setProperty('--mx', String(e.clientX / window.innerWidth - 0.5))
      el.style.setProperty('--my', String(e.clientY / window.innerHeight - 0.5))
    }

    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onMove)
    if (!reduced) raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
    }
  }, [])

  return (
    <div className="t-bg" ref={root} aria-hidden="true">
      <canvas ref={canvas} className="t-rain" />
      <span className="t-blob t-blob--a" />
      <span className="t-blob t-blob--b" />
      <span className="t-blob t-blob--c" />
      <span className="t-grain" />
    </div>
  )
}
