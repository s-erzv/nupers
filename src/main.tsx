import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import DaySwitcher from './DaySwitcher'
import { resolveTheme } from './themes'

const { theme, isToday } = resolveTheme()
const Theme = lazy(theme.load)

document.documentElement.dataset.week = theme.id

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense fallback={<div className="wk-loading" aria-label="Loading" />}>
      <Theme />
    </Suspense>
    <DaySwitcher current={theme} isToday={isToday} />
  </StrictMode>,
)
