import type { PointerEvent as RPointerEvent } from 'react'

export function tiltHandlers(strength = 8) {
  return {
    onPointerMove(e: RPointerEvent<HTMLElement>) {
      if (e.pointerType !== 'mouse') return
      const el = e.currentTarget
      const r = el.getBoundingClientRect()
      const x = (e.clientX - r.left) / r.width - 0.5
      const y = (e.clientY - r.top) / r.height - 0.5
      el.style.setProperty('--rx', `${(-y * strength).toFixed(2)}deg`)
      el.style.setProperty('--ry', `${(x * strength).toFixed(2)}deg`)
      el.style.setProperty('--mx', `${((x + 0.5) * 100).toFixed(1)}%`)
      el.style.setProperty('--my', `${((y + 0.5) * 100).toFixed(1)}%`)
    },
    onPointerLeave(e: RPointerEvent<HTMLElement>) {
      e.currentTarget.style.setProperty('--rx', '0deg')
      e.currentTarget.style.setProperty('--ry', '0deg')
    },
  }
}
