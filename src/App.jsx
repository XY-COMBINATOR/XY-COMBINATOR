import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom'

import arishImg from './assets/work-imgs/arish-travels.webp'
import innovickImg from './assets/work-imgs/innovick.webp'
import jcreationImg from './assets/work-imgs/jcreation.webp'
import kasemImg from './assets/work-imgs/kasem-garments.webp'
import slrImg from './assets/work-imgs/slr-playground.webp'
import { MeltyText } from './components/MeltyText'
import { Nav } from './components/Nav'
import { NoiseOverlay } from './components/NoiseOverlay'
import { SmokeOverlay, SMOKE_DURATION, SWAP_DELAY } from './components/SmokeOverlay'
import { TextAnimate } from '@/registry/magicui/text-animate'
import './App.css'

const pages = [
  { path: '/', id: 'home' },
  { path: '/work', id: 'work' },
  { path: '/about', id: 'about' },
  { path: '/services', id: 'services' },
  { path: '/contact', id: 'contact' },
]

const services = [
  {
    title: 'product design',
    text: 'Interfaces and prototypes that make the product obvious, with user flows, UI, and a design system you can keep building on.',
    tags: ['UI/UX', 'prototypes', 'design systems'],
  },
  {
    title: 'websites',
    text: 'Marketing sites, e-commerce and catalogs that load fast, rank well, and turn visitors into customers.',
    tags: ['marketing sites', 'e-commerce', 'SEO'],
  },
  {
    title: 'mobile apps',
    text: 'Cross-platform apps from first build to store release, with one codebase, native feel and backend included.',
    tags: ['React Native', 'Expo', 'Firebase'],
  },
  {
    title: 'launch support',
    text: 'Deployment, analytics and iteration after day one. We stay till it works in production, not just till handoff.',
    tags: ['deployment', 'analytics', 'iteration'],
  },
]

const processSteps = [
  { title: 'say hello', text: 'Tell us what you are building and where you are stuck.' },
  { title: 'scope in days', text: 'Fixed scope and timeline, no endless discovery phase.' },
  { title: 'design & build', text: 'Weekly releases you can click, test and react to.' },
  { title: 'launch & iterate', text: 'Ship to real users, then keep improving what works.' },
]

const EMAIL = 'hello@xycombinators.com'

const socials = [
  { label: 'github', href: 'https://github.com' },
  { label: 'x / twitter', href: 'https://x.com' },
  { label: 'linkedin', href: 'https://linkedin.com' },
  { label: 'instagram', href: 'https://instagram.com' },
]

const heroStats = [
  { value: '0 → 100', label: 'from idea to launch' },
  { value: '50+', label: 'products shipped' },
  { value: '2 wks', label: 'avg. to first release' },
]

const aboutValues = [
  {
    title: 'ship, then polish',
    text: 'A rough version in front of real users beats a perfect one in a doc.',
  },
  {
    title: 'founders in the room',
    text: 'No account managers. You work directly with the people building it.',
  },
  {
    title: 'own the outcome',
    text: 'We stay through launch and iteration, not just until the hand-off.',
  },
]

const workProjects = [
  {
    name: 'J Creation',
    category: 'e-commerce',
    href: 'https://jcreationbd.com/shop',
    image: jcreationImg,
    description:
      "Grooms' exclusive wear shop with catalog, product pages, and checkout flow.",
    tags: ['shop', 'catalog', 'checkout'],
  },
  {
    name: 'Arish Travels & Tours',
    category: 'website',
    href: 'https://arishbd.com/',
    image: arishImg,
    description:
      'Hajj & Umrah agency site with packages, visa guidance, and pre-registration.',
    tags: ['hajj & umrah', 'packages', 'booking'],
  },
  {
    name: 'SLR Playground',
    category: 'website',
    href: 'https://slrplaygroundmalaysia.com/',
    image: slrImg,
    description:
      'Playground supplier catalog & project gallery for the Malaysian market.',
    tags: ['catalog', 'gallery', 'malaysia'],
  },
  {
    name: 'Kasem Garments',
    category: 'mobile app',
    href: 'https://github.com/mihsanalam/Kasem-Garments',
    image: kasemImg,
    description:
      'Inventory app (React Native + Expo + Firebase) for stock, sales and invoicing.',
    tags: ['react native', 'firebase', 'inventory'],
  },
  {
    name: 'Innovick',
    category: 'website',
    href: 'https://innovick.vercel.app/',
    image: innovickImg,
    description: 'Fast, minimal studio site for the team behind these builds.',
    tags: ['vercel', 'minimal', 'studio'],
  },
]

function HeroPage({ onNavigate }) {
  return (
    <main className="page page--hero">
      <div className="hero">
        <MeltyText text="XY Combinators" className="hero-title" />
        <p className="hero-tagline">
          a design & engineering studio for founders who move fast.
        </p>
        <p className="hero-body">
          We partner with early-stage teams to shape the product, ship the
          first version, and get it in front of real users. No endless decks,
          no hand-offs. Just working software, built alongside you.
        </p>
        <div className="hero-actions">
          <button
            type="button"
            className="hero-cta"
            onClick={() => onNavigate?.('/work')}
          >
            see the work
          </button>
          <a className="hero-link" href="mailto:hello@xycombinators.com">
            start a project
          </a>
        </div>
        <ul className="hero-stats">
          {heroStats.map((stat) => (
            <li key={stat.label} className="hero-stat">
              <span className="hero-stat-value">{stat.value}</span>
              <span className="hero-stat-label">{stat.label}</span>
            </li>
          ))}
        </ul>
      </div>
      <footer className="hero-footer">
        <ul className="hero-socials">
          {socials.map((social) => (
            <li key={social.label}>
              <a href={social.href} target="_blank" rel="noreferrer">
                {social.label} ↗
              </a>
            </li>
          ))}
        </ul>
      </footer>
    </main>
  )
}

function ServicesPage({ onNavigate }) {
  return (
    <main className="page">
      <div className="services">
        <TextAnimate as="h2" animation="blurIn" className="section-title">
          services
        </TextAnimate>
        <p className="services-intro">
          Product design, full-stack engineering, and launch support for
          early-stage teams.
        </p>
        <ul className="services-list">
          {services.map((service, i) => (
            <li key={service.title} className="services-item">
              <span className="about-value-index">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="services-item-title">{service.title}</span>
              <span className="services-item-body">
                <span className="services-item-text">{service.text}</span>
                <span className="work-item-tags">
                  {service.tags.map((tag) => (
                    <span key={tag} className="work-item-tag">
                      {tag}
                    </span>
                  ))}
                </span>
              </span>
            </li>
          ))}
        </ul>
        <h3 className="services-subhead">how it works</h3>
        <ol className="services-process">
          {processSteps.map((step, i) => (
            <li key={step.title} className="services-step">
              <span className="about-value-index">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="services-step-title">{step.title}</span>
              <span className="services-step-text">{step.text}</span>
            </li>
          ))}
        </ol>
        <div className="services-cta">
          <p>Have a project in mind?</p>
          <button
            type="button"
            className="hero-cta"
            onClick={() => onNavigate?.('/contact')}
          >
            start a project
          </button>
        </div>
      </div>
    </main>
  )
}

function WorkPage() {
  const [hovered, setHovered] = useState(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const previewRef = useRef(null)

  // Warm the tiny WebP previews as soon as the work page mounts,
  // so the first hover shows instantly instead of downloading.
  useEffect(() => {
    workProjects.forEach((project) => {
      if (!project.image) return
      const img = new Image()
      img.decoding = 'async'
      img.src = project.image
    })
  }, [])

  const onItemEnter = (project) => {
    if (project.image) setHovered(project)
  }

  const onItemLeave = () => setHovered(null)

  const onListMove = (event) => {
    setPos({ x: event.clientX, y: event.clientY })
  }

  useEffect(() => {
    const preview = previewRef.current
    if (!preview) return
    const width = preview.offsetWidth
    const height = preview.offsetHeight
    const flipX = pos.x + width + 40 > window.innerWidth
    const flipY = pos.y + height + 40 > window.innerHeight
    preview.style.left = `${pos.x + (flipX ? -width - 28 : 28)}px`
    preview.style.top = `${pos.y + (flipY ? -height - 28 : 28)}px`
  }, [pos, hovered])

  return (
    <main className="page">
      <div className="work" onMouseMove={onListMove}>
        <TextAnimate as="h2" animation="blurIn" className="section-title">
          work
        </TextAnimate>
        <p className="work-intro">
          A few things we've designed and shipped, from first sketch to
          production.
        </p>
        <ul className="work-list">
          {workProjects.map((project, i) => (
            <li key={project.name} className="work-item">
              <a
                className="work-item-link"
                href={project.href}
                target="_blank"
                rel="noreferrer"
                onMouseEnter={() => onItemEnter(project)}
                onMouseLeave={onItemLeave}
              >
                <span className="work-item-index">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="work-item-main">
                  <span className="work-item-head">
                    <span className="work-item-name">{project.name}</span>
                    <span className="work-item-category">{project.category}</span>
                  </span>
                  <span className="work-item-description">
                    {project.description}
                  </span>
                  <span className="work-item-tags">
                    {project.tags.map((tag) => (
                      <span key={tag} className="work-item-tag">
                        {tag}
                      </span>
                    ))}
                  </span>
                </span>
                <span className="work-item-arrow" aria-hidden="true">
                  ↗
                </span>
              </a>
            </li>
          ))}
        </ul>
        {hovered && (
          <div className="work-preview" ref={previewRef} aria-hidden="true">
            <img
              src={hovered.image}
              alt=""
              draggable="false"
              decoding="async"
              width="576"
              height="352"
            />
          </div>
        )}
      </div>
    </main>
  )
}

function AboutPage() {
  return (
    <main className="page">
      <div className="about">
        <p className="about-lead">
          XY Combinators is a studio of designers and engineers taking products from 0 to 100.
        </p>
        <p className="about-body">
          We started as a group of builders who kept watching good ideas die in slide decks.
        </p>
        <p className="about-body">
          We build custom websites, mobile apps, and digital tools that help businesses grow. Our team handles everything from your initial design ideas to final coding and launch. We focus on delivering clean, fast, and secure software that simplifies your daily operations.
        </p>
        <ul className="about-values">
          {aboutValues.map((value, i) => (
            <li key={value.title} className="about-value">
              <span className="about-value-index">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="about-value-title">{value.title}</span>
              <span className="about-value-text">{value.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}

function ContactPage() {
  const [copied, setCopied] = useState(false)

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL)
    } catch {
      const input = document.createElement('input')
      input.value = EMAIL
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      input.remove()
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }

  return (
    <main className="page">
      <div className="contact">
        <TextAnimate as="h2" animation="blurIn" className="contact-title">
          Let&apos;s build it together.
        </TextAnimate>
        <p className="contact-body">
          Tell us what you&apos;re building, where you are, and when you want
          to launch. We reply to every message.
        </p>
        <div className="contact-email-row">
          <a className="contact-email" href={`mailto:${EMAIL}`}>
            {EMAIL}
          </a>
          <button type="button" className="contact-copy" onClick={copyEmail}>
            {copied ? 'copied ✓' : 'copy'}
          </button>
        </div>
        <a className="hero-cta contact-cta" href={`mailto:${EMAIL}`}>
          start a project
        </a>
        <ul className="contact-socials">
          {socials.map((social) => (
            <li key={social.label}>
              <a href={social.href} target="_blank" rel="noreferrer">
                {social.label} ↗
              </a>
            </li>
          ))}
        </ul>
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

  // Idle-preload work previews (only ~100 KB total now) so the
  // hover card on /work renders instantly on first hover.
  useEffect(() => {
    const preload = () => {
      workProjects.forEach((project) => {
        if (!project.image) return
        const img = new Image()
        img.decoding = 'async'
        img.src = project.image
      })
    }
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      const id = window.requestIdleCallback(preload, { timeout: 3000 })
      return () => window.cancelIdleCallback?.(id)
    }
    const t = setTimeout(preload, 1500)
    return () => clearTimeout(t)
  }, [])

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
    // If the current page is scrollable, scroll gestures NEVER switch
    // pages. They only scroll content. Page switch happens via nav.
    const isPageScrollable = () => {
      const page = document.querySelector('main.page')
      return (
        page != null && page.scrollHeight > page.clientHeight + 2
      )
    }

    const onWheel = (event) => {
      if (isPageScrollable()) return
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

    // No touchmove preventDefault: blocking it kills native inner scroll,
    // which makes long pages (work/about) unscrollable on phones.
    // On a scrollable page, swipe only scrolls, it never changes pages.
    const onTouchEnd = (event) => {
      if (isPageScrollable()) return
      const dy = touchY.current - event.changedTouches[0].clientY
      if (Math.abs(dy) <= 60) return
      step(dy > 0 ? 1 : -1)
    }

    const onKeyDown = (event) => {
      // Scrollable page: let arrows/space scroll natively, don't switch.
      if (isPageScrollable()) return
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
    window.addEventListener('touchend', onTouchEnd)
    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend', onTouchEnd)
      window.removeEventListener('keydown', onKeyDown)
      clearTimeout(wheelTimer.current)
    }
  }, [step])

  return (
    <>
      <Nav onNavigate={goToPath} />
      <Routes>
        <Route path="/" element={<HeroPage onNavigate={goToPath} />} />
        <Route path="/work" element={<WorkPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route
          path="/services"
          element={<ServicesPage onNavigate={goToPath} />}
        />
        <Route path="/contact" element={<ContactPage />} />
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
