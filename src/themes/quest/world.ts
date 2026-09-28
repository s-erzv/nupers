export const TILE = 16
export const COLS = 24
export const ROWS = 16

export type PlaceId = 'house' | 'workshop' | 'library' | 'guild' | 'post' | 'armory'

export type Building = {
  id: PlaceId
  name: string
  label: string
  x: number
  y: number
  w: number
  h: number
  roof: string
  roofDark: string
  door: { x: number; y: number }
}

function building(id: PlaceId, name: string, label: string, x: number, y: number, w: number, h: number, roof: string, roofDark: string): Building {
  return { id, name, label, x, y, w, h, roof, roofDark, door: { x: x + Math.floor(w / 2), y: y + h - 1 } }
}

export const buildings: Building[] = [
  building('house', "nuza' House", 'About', 2, 1, 5, 4, '#9ea8ff', '#6f79e0'),
  building('workshop', 'Workshop', 'Projects', 9, 1, 6, 4, '#f5a547', '#d07f22'),
  building('library', 'Library', 'Research', 17, 1, 5, 4, '#5fa8d3', '#3d82ad'),
  building('guild', 'Guild Hall', 'Experience', 2, 10, 5, 4, '#e36d6d', '#b94a4a'),
  building('post', 'Post Office', 'Contact', 10, 11, 4, 3, '#ff9fb7', '#e07392'),
  building('armory', 'Armory', 'Skills', 17, 10, 5, 4, '#8fbf6a', '#6a9a48'),
]

export type Ground = 'grass' | 'flower' | 'path' | 'tree' | 'water'

export const SIGN = { x: 11, y: 7 }
export const CAT = { x: 20, y: 8 }
export const SPAWN = { x: 12, y: 8 }

export const IDEA_SPOTS = [
  { x: 1, y: 6 },
  { x: 22, y: 7 },
  { x: 9, y: 12 },
  { x: 15, y: 12 },
  { x: 1, y: 14 },
  { x: 22, y: 14 },
  { x: 16, y: 3 },
]

// deterministic noise so the town looks the same on every visit
function hash(x: number, y: number, s = 0) {
  let h = (x * 374761393 + y * 668265263 + s * 2147483647) | 0
  h = (h ^ (h >>> 13)) * 1274126177
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295
}

export const ground: Ground[][] = Array.from({ length: ROWS }, (_, y) =>
  Array.from({ length: COLS }, (_, x): Ground => {
    if (y === 0 || y === ROWS - 1 || x === 0 || x === COLS - 1) return 'tree'
    // roads: two main streets, two connectors, and a stub up to each door
    if (y === 6 || y === 7 || y === 14) return 'path'
    if ((x === 8 || x === 15) && y >= 6 && y <= 14) return 'path'
    if (y === 5 && buildings.some((b) => b.door.x === x && b.door.y === 4)) return 'path'
    if (y === 8 && x >= 11 && x <= 13) return 'path'
    if (x >= 3 && x <= 5 && y === 8) return 'water'
    if (x >= 3 && x <= 5 && y === 9) return 'water'
    return hash(x, y) > 0.86 ? 'flower' : 'grass'
  }),
)
// the bottom row street needs to reach the lower doors from below: doors face down onto row 14
for (const b of buildings) if (b.door.y + 1 < ROWS - 1) ground[b.door.y + 1][b.door.x] = 'path'
// a few trees for shade
for (const [x, y] of [
  [7, 2],
  [16, 1],
  [22, 3],
  [1, 9],
  [7, 11],
  [22, 11],
  [14, 9],
  [9, 9],
] as const)
  ground[y][x] = 'tree'
ground[SIGN.y][SIGN.x] = 'path'

export function buildingAt(x: number, y: number) {
  return buildings.find((b) => x >= b.x && x < b.x + b.w && y >= b.y && y < b.y + b.h)
}

export function isDoor(x: number, y: number) {
  return buildings.find((b) => b.door.x === x && b.door.y === y)
}

export function walkable(x: number, y: number) {
  if (x < 0 || y < 0 || x >= COLS || y >= ROWS) return false
  if (isDoor(x, y)) return true
  if (buildingAt(x, y)) return false
  if ((x === SIGN.x && y === SIGN.y) || (x === CAT.x && y === CAT.y)) return false
  const g = ground[y][x]
  return g !== 'tree' && g !== 'water'
}

/* ------------------------------------------------------------------ drawing */

const px = (c: CanvasRenderingContext2D, color: string, x: number, y: number, w = 1, h = 1) => {
  c.fillStyle = color
  c.fillRect(x, y, w, h)
}

export function drawGround(c: CanvasRenderingContext2D) {
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const g = ground[y][x]
      const ox = x * TILE
      const oy = y * TILE
      if (g === 'path') {
        px(c, '#ecd6a3', ox, oy, TILE, TILE)
        for (let i = 0; i < 3; i++) {
          const r = hash(x, y, i + 3)
          px(c, '#d8bd84', ox + Math.floor(r * 14), oy + Math.floor(hash(y, x, i) * 14), 2, 1)
        }
        continue
      }
      if (g === 'water') {
        px(c, '#5cb3e0', ox, oy, TILE, TILE)
        px(c, '#8fd1f0', ox + 3 + ((x * 5) % 7), oy + 5, 4, 1)
        px(c, '#8fd1f0', ox + 8 - ((y * 3) % 5), oy + 11, 3, 1)
        continue
      }
      px(c, (x + y) % 2 ? '#7ec46a' : '#79c065', ox, oy, TILE, TILE)
      for (let i = 0; i < 4; i++) {
        const r = hash(x, y, i + 10)
        if (r > 0.45) px(c, '#68ab56', ox + Math.floor(hash(x, y, i + 20) * 15), oy + Math.floor(r * 15), 1, 2)
      }
      if (g === 'flower') {
        const colors = ['#fff4f4', '#ffd166', '#ff9fb7', '#b8b8ff']
        for (let i = 0; i < 3; i++) {
          const fx = ox + 2 + Math.floor(hash(x, y, i + 30) * 11)
          const fy = oy + 2 + Math.floor(hash(x, y, i + 40) * 11)
          px(c, colors[(x + y + i) % colors.length], fx, fy, 2, 2)
          px(c, '#e8a33a', fx, fy, 1, 1)
        }
      }
      if (g === 'tree') drawTree(c, ox, oy)
    }
  }
  // pond edge
  c.strokeStyle = '#4a9a3d'
  c.lineWidth = 1
  c.strokeRect(3 * TILE + 0.5, 8 * TILE + 0.5, 3 * TILE - 1, 2 * TILE - 1)
}

function drawTree(c: CanvasRenderingContext2D, ox: number, oy: number) {
  px(c, '#6b4a2b', ox + 6, oy + 10, 4, 6)
  px(c, '#2f7a3a', ox + 2, oy + 2, 12, 10)
  px(c, '#2f7a3a', ox + 4, oy, 8, 14)
  px(c, '#3f9449', ox + 4, oy + 2, 6, 5)
  px(c, '#58ad5c', ox + 5, oy + 3, 2, 2)
}

export function drawBuilding(c: CanvasRenderingContext2D, b: Building, lit: boolean) {
  const x = b.x * TILE
  const y = b.y * TILE
  const w = b.w * TILE
  const h = b.h * TILE
  const roofH = Math.floor(h * 0.45)
  // shadow
  c.fillStyle = 'rgba(0,0,0,0.15)'
  c.fillRect(x + 3, y + h - 2, w, 4)
  // walls
  px(c, '#f6ecd9', x + 2, y + roofH, w - 4, h - roofH)
  px(c, '#e5d6bb', x + 2, y + h - 3, w - 4, 3)
  // roof, stepped
  for (let i = 0; i < roofH; i++) {
    const inset = Math.max(0, Math.floor((roofH - i) / 3) - 1)
    px(c, i % 4 === 3 ? b.roofDark : b.roof, x + inset, y + i, w - inset * 2, 1)
  }
  px(c, b.roofDark, x, y + roofH - 2, w, 2)
  // windows
  const winY = y + roofH + 5
  const glass = lit ? '#ffd88a' : '#bfe3f7'
  for (let wx = x + 6; wx < x + w - 10; wx += 14) {
    if (Math.abs(wx + 3 - (b.door.x * TILE + 8)) < 10) continue
    px(c, '#8b6a45', wx - 1, winY - 1, 8, 8)
    px(c, glass, wx, winY, 6, 6)
    px(c, '#8b6a45', wx + 3, winY, 1, 6)
  }
  // door
  const dx = b.door.x * TILE + 4
  const dy = y + h - 12
  px(c, '#6b4a2b', dx - 1, dy - 1, 10, 13)
  px(c, lit ? '#ffcf7a' : '#9c6b3f', dx, dy, 8, 12)
  px(c, '#f5d25e', dx + 6, dy + 6, 1, 1)
}

export function drawSign(c: CanvasRenderingContext2D) {
  const x = SIGN.x * TILE
  const y = SIGN.y * TILE
  px(c, '#6b4a2b', x + 7, y + 8, 2, 8)
  px(c, '#8b6a45', x + 1, y + 2, 14, 8)
  px(c, '#b08a5a', x + 2, y + 3, 12, 6)
  px(c, '#6b4a2b', x + 4, y + 5, 8, 1)
  px(c, '#6b4a2b', x + 4, y + 7, 6, 1)
}

export function drawCat(c: CanvasRenderingContext2D, t: number) {
  const x = CAT.x * TILE
  const y = CAT.y * TILE + (Math.floor(t / 500) % 2)
  const fur = '#8a8aa0'
  px(c, 'rgba(0,0,0,0.15)', x + 3, y + 14, 10, 2)
  px(c, fur, x + 4, y + 7, 9, 7)
  px(c, fur, x + 3, y + 4, 6, 5)
  px(c, fur, x + 3, y + 2, 2, 2)
  px(c, fur, x + 7, y + 2, 2, 2)
  px(c, '#2b2340', x + 4, y + 6, 1, 1)
  px(c, '#2b2340', x + 7, y + 6, 1, 1)
  px(c, '#ff9fb7', x + 5, y + 7, 2, 1)
  const tail = Math.floor(t / 300) % 2
  px(c, fur, x + 12, y + 6 + tail, 2, 5)
}

export function drawIdea(c: CanvasRenderingContext2D, sx: number, sy: number, t: number) {
  const x = sx * TILE
  const y = sy * TILE + Math.round(Math.sin(t / 250 + sx) * 2)
  c.fillStyle = 'rgba(255, 214, 102, 0.35)'
  c.beginPath()
  c.arc(x + 8, y + 8, 7, 0, Math.PI * 2)
  c.fill()
  px(c, '#ffd166', x + 7, y + 3, 2, 10)
  px(c, '#ffd166', x + 3, y + 7, 10, 2)
  px(c, '#fff4c2', x + 6, y + 6, 4, 4)
}

/** The player: a walking lightbulb. No face, no case. */
export function drawPlayer(c: CanvasRenderingContext2D, x: number, y: number, step: number, facing: 'up' | 'down' | 'left' | 'right') {
  const legA = step % 2 === 0
  px(c, 'rgba(0,0,0,0.2)', x + 3, y + 14, 10, 2)
  // legs
  px(c, '#2b2340', x + 5, y + 11, 2, legA ? 4 : 3)
  px(c, '#2b2340', x + 9, y + 11, 2, legA ? 3 : 4)
  // socket body
  px(c, '#7a7a90', x + 5, y + 8, 6, 4)
  px(c, '#a9a9bd', x + 5, y + 9, 6, 1)
  // bulb
  px(c, '#2b2340', x + 3, y - 1, 10, 10)
  px(c, '#ffd88a', x + 4, y, 8, 8)
  px(c, '#2b2340', x + 4, y - 2, 8, 1)
  px(c, '#ffd88a', x + 5, y - 1, 6, 1)
  px(c, '#fff6dc', facing === 'left' ? x + 5 : x + 9, y + 1, 2, 2)
  px(c, '#e8870c', x + 7, y + 3, 2, 3)
}
