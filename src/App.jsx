import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom'

import { MeltyText } from './components/MeltyText'
import { Nav } from './components/Nav'
import { NoiseOverlay } from './components/NoiseOverlay'
import { SmokeOverlay } from './components/SmokeOverlay'
import { TextAnimate } from '@/registry/magicui/text-animate'
import './App.css'

const pages = [
  { path: '/', id: 'home' },
  {
    path: '/work',
    id: 'work',
    title: 'work',
    body: "A few things we've designed and shipped, from first sketch to production.",
  },
  {
    path: '/about',
    id: 'about',
    title: 'about',
    body: 'XY Combinators is a small studio of designers and engineers taking products from zero to one.',
  },
  {
    path: '/services',
    id: 'services',
    title: 'services',
    body: 'Product design, full-stack engineering, and launch support for early-stage teams.',
  },
  { path: '/contact', id: 'contact' },
]

const SWAP_DELAY = 800
const SMOKE_DURATION = 1800

function HeroPage() {
  return (
    <main className="page">
      <div className="hero">
        <MeltyText text="XY Combinators" />
      </div>
    </main>
  )
}

function SectionPage({ title, body }) {
  return (
    <main className="page">
      <div className="section">
        <TextAnimate as="h2" animation="blurIn" className="section-title">
          {title}
        </TextAnimate>
        <p>{body}</p>
      </div>
    </main>
  )
}

function ContactPage() {
  return (
    <main className="page">
      <div className="contact">
        <a href="mailto:hello@xycombinators.com">hello@xycombinators.com</a>
      </div>
    </main>
  )
}

function App() {
  const location = useLocation()
  const navigate = useNavigate()
  const [fx, setFx] = useState(null)
  const busy = useRef(false)
  const indexRef = useRef(0)
  const runIdRef = useRef(0)
  const timers = useRef([])
  const accWheel = useRef(0)
  const wheelTimer = useRef(0)
  const touchY = useRef(0)

  const pageIndex = useMemo(() => {
    const found = pages.findIndex((page) => page.path === location.pathname)
    return found === -1 ? 0 : found
  }, [location.pathname])

  useEffect(() => {
    indexRef.current = pageIndex
  }, [pageIndex])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const transitionTo = useCallback(
    (to) => {
      const from = indexRef.current
      if (busy.current || to === from || to < 0 || to >= pages.length) return

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        indexRef.current = to
        navigate(pages[to].path)
        return
      }

      busy.current = true
      runIdRef.current += 1
      setFx({ dir: to > from ? 1 : -1, runId: runIdRef.current })

      timers.current.push(
        setTimeout(() => {
          indexRef.current = to
          navigate(pages[to].path)
        }, SWAP_DELAY),
        setTimeout(() => {
          setFx(null)
          busy.current = false
        }, SMOKE_DURATION)
      )
    },
    [navigate]
  )

  const step = useCallback(
    (dir) => transitionTo(indexRef.current + dir),
    [transitionTo]
  )

  const goToPath = useCallback(
    (path) => transitionTo(pages.findIndex((page) => page.path === path)),
    [transitionTo]
  )

  useEffect(() => {
    const onWheel = (event) => {
      event.preventDefault()
      if (busy.current) return
      accWheel.current += event.deltaY
      clearTimeout(wheelTimer.current)
      wheelTimer.current = setTimeout(() => {
        accWheel.current = 0
      }, 160)
      if (Math.abs(accWheel.current) >= 60) {
        const dir = accWheel.current > 0 ? 1 : -1
        accWheel.current = 0
        step(dir)
      }
    }

    const onTouchStart = (event) => {
      touchY.current = event.touches[0].clientY
    }

    const onTouchMove = (event) => {
      event.preventDefault()
    }

    const onTouchEnd = (event) => {
      const dy = touchY.current - event.changedTouches[0].clientY
      if (Math.abs(dy) > 50) step(dy > 0 ? 1 : -1)
    }

    const onKeyDown = (event) => {
      if (event.key === 'ArrowDown' || event.key === 'PageDown' || event.key === ' ') {
        event.preventDefault()
        step(1)
      } else if (event.key === 'ArrowUp' || event.key === 'PageUp') {
        event.preventDefault()
        step(-1)
      }
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: false })
    window.addEventListener('touchend', onTouchEnd)
    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
      window.removeEventListener('keydown', onKeyDown)
      clearTimeout(wheelTimer.current)
    }
  }, [step])

  return (
    <>
      <Nav onNavigate={goToPath} />
      <Routes>
        <Route path="/" element={<HeroPage />} />
        {pages.slice(1).map((page) =>
          page.title ? (
            <Route
              key={page.id}
              path={page.path}
              element={<SectionPage title={page.title} body={page.body} />}
            />
          ) : (
            <Route key={page.id} path={page.path} element={<ContactPage />} />
          )
        )}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <SmokeOverlay
        running={Boolean(fx)}
        direction={fx?.dir ?? 1}
        runId={fx?.runId ?? 0}
      />
      <NoiseOverlay />
    </>
  )
}

export default App
