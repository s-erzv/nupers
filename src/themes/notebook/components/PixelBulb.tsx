// o outline, g glass, h highlight, f filament, b base, . empty
const MAP = [
  '...oooooo...',
  '..oggggghho.',
  '.ogggggggho.',
  '.oggfggfggo.',
  '.ogggffgggo.',
  '.ogggffgggo.',
  '..oggffggo..',
  '...oggggo...',
  '...obbbbo...',
  '...oooooo...',
  '...obbbbo...',
  '....oooo....',
  '.....oo.....',
]

/** Pixel-art bulb avatar. It lights up while `lit` is true. */
export default function PixelBulb({ lit = false, className = '' }: { lit?: boolean; className?: string }) {
  const fill = (ch: string) => {
    switch (ch) {
      case 'o':
        return 'var(--ink)'
      case 'g':
        return lit ? '#ffd88a' : 'var(--accent-soft)'
      case 'h':
        return lit ? '#fff6dc' : 'var(--panel)'
      case 'f':
        return lit ? '#e8870c' : 'var(--faint)'
      case 'b':
        return 'var(--muted)'
      default:
        return null
    }
  }
  return (
    <svg
      viewBox="-1 -1 14 15"
      shapeRendering="crispEdges"
      className={className}
      style={{ filter: lit ? 'drop-shadow(0 0 10px rgba(255,190,90,.75))' : undefined, transition: 'filter .3s' }}
      aria-hidden="true"
    >
      {MAP.flatMap((row, y) =>
        [...row].map((ch, x) => {
          const f = fill(ch)
          return f ? <rect key={`${x}-${y}`} x={x} y={y} width="1.02" height="1.02" fill={f} /> : null
        }),
      )}
    </svg>
  )
}
