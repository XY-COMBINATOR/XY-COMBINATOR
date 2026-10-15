import { Link } from 'react-router-dom'

import { TextAnimate } from "@/registry/magicui/text-animate"

import "./Nav.css"

const links = [
  { label: "work", to: "/work" },
  { label: "about", to: "/about" },
  { label: "services", to: "/services" },
]

export function Nav({ onNavigate }) {
  return (
    <nav className="nav">
      {links.map((link, i) => (
        <Link
          key={link.label}
          className="nav-link"
          to={link.to}
          onClick={(event) => {
            if (!onNavigate) return
            event.preventDefault()
            onNavigate(link.to)
          }}
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
  )
}
