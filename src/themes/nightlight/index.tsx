import { loadFonts } from '../../themes'
import App from './App'
import './index.css'

loadFonts('family=Bricolage+Grotesque:opsz,wdth,wght@12..96,75..100,400..800&family=Plus+Jakarta+Sans:wght@400;500;600;700')
document.title = 'nuza · late night'
try {
  const t = localStorage.getItem('nupers-theme')
  if (t) document.documentElement.dataset.theme = t
} catch {
  /* storage unavailable */
}

export default App
