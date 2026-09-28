import { About, TechStack } from './components/About'
import { Contact, Footer } from './components/Contact'
import Contributions from './components/Contributions'
import Experience from './components/Experience'
import Nav from './components/Nav'
import Profile from './components/Profile'
import Projects from './components/Projects'
import Research from './components/Research'
import { UIProvider } from './ui'

export default function App() {
  return (
    <UIProvider>
      <a
        href="#projects"
        className="fixed left-4 top-[-60px] z-[90] rounded-md bg-ink px-3 py-2 text-[13px] text-bg focus:top-3"
      >
        Skip to projects
      </a>
      <Nav />
      <main className="mx-auto max-w-3xl border-x border-line">
        <Profile />
        <About />
        <Projects />
        <Research />
        <Experience />
        <TechStack />
        <Contributions />
        <Contact />
        <Footer />
      </main>
    </UIProvider>
  )
}
