import { useEffect, useRef, type RefObject } from 'react'

const COUNT = 700
const COLORS = ['#f4f1ff', '#f4f1ff', '#f4f1ff', '#ff5fb8', '#6ff3ff']

/** Star field flying toward the viewer. The faster you scroll, the longer the streaks. */
export default function Stars({ speed }: { speed: RefObject<number> }) {
  const canvas = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const cv = canvas.current!
    const ctx = cv.getContext('2d')!
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let w = 0
    let h = 0
    const stars = Array.from({ length: COUNT }, () => ({
      x: (Math.random() - 0.5) * 2,
      y: (Math.random() - 0.5) * 2,
      z: Math.random(),
      c: COLORS[(Math.random() * COLORS.length) | 0],
    }))

    const resize = () => {
      w = window.innerWidth
      h = window.innerHeight
      cv.width = w * dpr
      cv.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()

    let raf = 0
    let v = 0
    const project = (s: { x: number; y: number }, z: number) => {
      const f = 0.5 / Math.max(z, 0.001)
      return [w / 2 + s.x * f * w * 0.5, h / 2 + s.y * f * h * 0.5]
    }
    const tick = () => {
      raf = requestAnimationFrame(tick)
      // idle drift plus whatever the camera is doing
      const target = 0.0012 + Math.max(-0.02, Math.min(0.06, (speed.current ?? 0) * 0.00018))
      v += (target - v) * 0.1
      ctx.fillStyle = 'rgba(6, 5, 26, 0.55)'
      ctx.fillRect(0, 0, w, h)
      for (const s of stars) {
        const z0 = s.z
        s.z -= v
        if (s.z <= 0.02) {
          s.z = 1
          s.x = (Math.random() - 0.5) * 2
          s.y = (Math.random() - 0.5) * 2
          continue
        }
        if (s.z > 1) s.z = 0.02
        const [x1, y1] = project(s, z0)
        const [x2, y2] = project(s, s.z)
        const a = Math.min(1, (1 - s.z) * 1.4)
        ctx.globalAlpha = a
        ctx.strokeStyle = s.c
        ctx.lineWidth = Math.max(0.6, (1 - s.z) * 2.4)
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2 + 0.1, y2 + 0.1)
        ctx.stroke()
      }
      ctx.globalAlpha = 1
    }
    raf = requestAnimationFrame(tick)
    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [speed])

  return <canvas ref={canvas} className="w-stars" aria-hidden="true" />
}
