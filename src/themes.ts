import type { ComponentType } from 'react'

export type ThemeId = 'notebook' | 'terminal' | 'quest' | 'os' | 'nightlight' | 'warp' | 'chat'

export type ThemeInfo = {
  id: ThemeId
  /** 1 = Monday … 7 = Sunday */
  day: number
  dayName: string
  hari: string
  name: string
  blurb: string
  swatch: [string, string]
  load: () => Promise<{ default: ComponentType }>
}

export const themes: ThemeInfo[] = [
  {
    id: 'notebook',
    day: 1,
    dayName: 'Monday',
    hari: 'Senin',
    name: 'Notebook',
    blurb: 'Clean and professional, to start the week.',
    swatch: ['#f6f6f4', '#5b63f5'],
    load: () => import('./themes/notebook'),
  },
  {
    id: 'terminal',
    day: 2,
    dayName: 'Tuesday',
    hari: 'Selasa',
    name: 'Terminal',
    blurb: 'Type commands to explore.',
    swatch: ['#0f1115', '#b8f26b'],
    load: () => import('./themes/terminal'),
  },
  {
    id: 'quest',
    day: 3,
    dayName: 'Wednesday',
    hari: 'Rabu',
    name: 'Quest',
    blurb: 'A tiny pixel town to walk around.',
    swatch: ['#7ec46a', '#f7d774'],
    load: () => import('./themes/quest'),
  },
  {
    id: 'os',
    day: 4,
    dayName: 'Thursday',
    hari: 'Kamis',
    name: 'nuzOS',
    blurb: 'A little OS of mine, with widgets and real keys.',
    swatch: ['#d6d7d1', '#2440ff'],
    load: () => import('./themes/os'),
  },
  {
    id: 'nightlight',
    day: 5,
    dayName: 'Friday',
    hari: 'Jumat',
    name: 'Late Night',
    blurb: 'A 3D bulb to swing, for Friday night.',
    swatch: ['#15162c', '#ffc56b'],
    load: () => import('./themes/nightlight'),
  },
  {
    id: 'warp',
    day: 6,
    dayName: 'Saturday',
    hari: 'Sabtu',
    name: 'Warp',
    blurb: 'Scroll to fly through a tunnel of my work.',
    swatch: ['#06051a', '#ff3da8'],
    load: () => import('./themes/warp'),
  },
  {
    id: 'chat',
    day: 7,
    dayName: 'Sunday',
    hari: 'Minggu',
    name: 'Chat',
    blurb: 'A lazy Sunday chat with my bot.',
    swatch: ['#e9f3ef', '#1f9d74'],
    load: () => import('./themes/chat'),
  },
]

/** Day of week in Jakarta time, 1 = Monday … 7 = Sunday. */
export function jakartaDay(date = new Date()): number {
  const name = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Jakarta', weekday: 'short' }).format(date)
  return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].indexOf(name) + 1
}

export function todaysTheme(): ThemeInfo {
  return themes.find((t) => t.day === jakartaDay())!
}

/** The theme to show: ?theme=… wins, otherwise today's. */
export function resolveTheme(): { theme: ThemeInfo; isToday: boolean } {
  const today = todaysTheme()
  const wanted = new URLSearchParams(location.search).get('theme')
  const theme = themes.find((t) => t.id === wanted) ?? today
  return { theme, isToday: theme.id === today.id }
}

/** Adds a Google Fonts stylesheet once. */
export function loadFonts(families: string) {
  const href = `https://fonts.googleapis.com/css2?${families}&display=swap`
  if (document.querySelector(`link[href="${href}"]`)) return
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = href
  document.head.appendChild(link)
}
