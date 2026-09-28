import { useEffect, useRef } from 'react'


/**
 * A dot-matrix light board. The word is spelled in dots; the cursor paints warm light
 * that slowly fades, and a click sends a ripple across the board.
 */
export default function DotMatrix({ word = 'nuza.' }: { word?: string }) {
  const canvas = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const c = canvas.current
    if (!c) return
    const ctx = c.getContext('2d')!
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let GAP = 11
    let W = 0
    let H = 0
    let cols = 0
    let rows = 0
    let heat = new Float32Array(0)
    let mask = new Uint8Array(0)
    let raf = 0
    let visible = true
    const pointer = { x: -999, y: -999, inside: false }
    const ripples: { x: number; y: number; t: number }[] = []
    let colors = readColors()

    function readColors() {
      const s = getComputedStyle(document.documentElement)
      return {
        dot: s.getPropertyValue('--line').trim(),
        word: s.getPropertyValue('--muted').trim(),
        wordLit: s.getPropertyValue('--ink').trim(),
        warm: s.getPropertyValue('--amber').trim(),
        cool: s.getPropertyValue('--accent').trim(),
      }
    }

    function layout() {
      const rect = c!.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      W = rect.width
      H = rect.height
      GAP = W < 520 ? 8 : 11
      c!.width = W * dpr
      c!.height = H * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      cols = Math.floor(W / GAP)
      rows = Math.floor(H / GAP)
      heat = new Float32Array(cols * rows)

      // rasterise the word at 6x grid resolution, then keep dots whose cell is mostly ink
      const S = 6
      const off = document.createElement('canvas')
      off.width = cols * S
      off.height = rows * S
      const o = off.getContext('2d')!
      const size = Math.min(rows * 0.8, (cols / word.length) * 1.7) * S
      o.font = `800 ${size}px "Geist", system-ui, sans-serif`
      o.textAlign = 'center'
      o.textBaseline = 'middle'
      o.fillStyle = '#000'
      o.fillText(word, (cols * S) / 2, (rows * S) / 2 + size * 0.03)
      const data = o.getImageData(0, 0, cols * S, rows * S).data
      mask = new Uint8Array(cols * rows)
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          let sum = 0
          for (let dy = 0; dy < S; dy++)
            for (let dx = 0; dx < S; dx++) sum += data[((y * S + dy) * cols * S + x * S + dx) * 4 + 3]
          mask[y * cols + x] = sum / (S * S * 255) > 0.22 ? 1 : 0
        }
      }
    }

    function draw(now: number) {
      ctx.clearRect(0, 0, W, H)
      const ox = (W - (cols - 1) * GAP) / 2
      const oy = (H - (rows - 1) * GAP) / 2
      for (let i = ripples.length - 1; i >= 0; i--) if (now - ripples[i].t > 1600) ripples.splice(i, 1)

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = y * cols + x
          const px = ox + x * GAP
          const py = oy + y * GAP
          if (pointer.inside) {
            const d = Math.hypot(px - pointer.x, py - pointer.y)
            if (d < 70) heat[i] = Math.min(1, heat[i] + (1 - d / 70) * 0.35)
          }
          let ring = 0
          for (const r of ripples) {
            const radius = ((now - r.t) / 1600) * Math.max(W, H)
            const d = Math.abs(Math.hypot(px - r.x, py - r.y) - radius)
            if (d < 16) ring = Math.max(ring, (1 - d / 16) * (1 - (now - r.t) / 1600))
          }
          heat[i] *= 0.955
          const h = Math.max(heat[i], ring)
          const inWord = mask[i] === 1
          const twinkle = !reduced && inWord ? (Math.sin(now / 700 + x * 0.7 + y * 1.3) + 1) * 0.08 : 0
          const radius = (inWord ? 2.3 : 1.1) + h * 2.2
          ctx.beginPath()
          ctx.arc(px, py, radius, 0, Math.PI * 2)
          if (h > 0.04) {
            ctx.fillStyle = ring > heat[i] ? colors.cool : colors.warm
            ctx.globalAlpha = 0.35 + h * 0.65
          } else {
            ctx.fillStyle = inWord ? colors.word : colors.dot
            ctx.globalAlpha = inWord ? 0.62 + twinkle : 1
          }
          ctx.fill()
        }
      }
      ctx.globalAlpha = 1
    }

    const loop = (now: number) => {
      draw(now)
      raf = visible ? requestAnimationFrame(loop) : 0
    }

    const onMove = (e: PointerEvent) => {
      const r = c.getBoundingClientRect()
      pointer.x = e.clientX - r.left
      pointer.y = e.clientY - r.top
      pointer.inside = true
    }
    const onLeave = () => {
      pointer.inside = false
    }
    const onDown = (e: PointerEvent) => {
      const r = c.getBoundingClientRect()
      ripples.push({ x: e.clientX - r.left, y: e.clientY - r.top, t: performance.now() })
    }

    layout()
    raf = requestAnimationFrame(loop)
    const ro = new ResizeObserver(layout)
    ro.observe(c)
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      if (visible && !raf) raf = requestAnimationFrame(loop)
    })
    io.observe(c)
    const mo = new MutationObserver(() => (colors = readColors()))
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    document.fonts?.ready.then(layout)

    c.addEventListener('pointermove', onMove)
    c.addEventListener('pointerleave', onLeave)
    c.addEventListener('pointerdown', onDown)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      mo.disconnect()
      c.removeEventListener('pointermove', onMove)
      c.removeEventListener('pointerleave', onLeave)
      c.removeEventListener('pointerdown', onDown)
    }
  }, [word])

  return <canvas ref={canvas} className="block h-full w-full touch-pan-y" aria-hidden="true" />
}
