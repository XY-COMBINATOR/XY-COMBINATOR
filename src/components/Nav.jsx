import { Link } from 'react-router-dom'

import { TextAnimate } from "@/registry/magicui/text-animate"

import "./Nav.css"

const links = [
  { label: "work", to: "/work" },
  { label: "about", to: "/about" },
  { label: "services", to: "/services" },
  { label: "contact", to: "/contact" },
]

export function Nav({ onNavigate }) {
  const handleNav = (event, to) => {
    if (!onNavigate) return
    event.preventDefault()
    onNavigate(to)
  }

  return (
    <header className="nav">
      <Link
        className="nav-logo"
        to="/"
        onClick={(event) => handleNav(event, '/')}
        aria-label="XY Combinators, home"
      >
        <img src="/logo.png" alt="XY" className="nav-logo-img" draggable="false" />
        <span className="nav-logo-text">Combinators</span>
      </Link>
      <nav className="nav-links" aria-label="primary">
        {links.map((link, i) => (
          <Link
            key={link.label}
            className={`nav-link${link.label === 'contact' ? ' nav-link--pill' : ''}`}
            to={link.to}
            onClick={(event) => handleNav(event, link.to)}
          >
            <TextAnimate
              as="span"
              animation="blurIn"
              startOnView={false}
              delay={i * 0.08}
            >
              {link.label}
            </TextAnimate>
          </Link>
        ))}
      </nav>
    </header>
  )
}
