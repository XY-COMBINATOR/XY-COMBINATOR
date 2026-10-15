import { MeshGradient } from '@paper-design/shaders-react'

import './HeroVisual.css'

const projects = [
  { name: 'ledgerly', kind: 'fintech dashboard' },
  { name: 'orbit crm', kind: 'sales os' },
  { name: 'kiln', kind: 'ai writing tool' },
]

export function HeroVisual() {
  return (
    <aside className="hero-visual" aria-hidden="true">
      <div className="hero-visual-frame">
        <MeshGradient
          className="hero-visual-shader"
          speed={0.45}
          distortion={1.1}
          swirl={0.8}
          colors={['#1a1a2e', '#4c1d95', '#0f172a', '#6d28d9']}
        />
        <div className="hero-visual-overlay">
          <span className="hero-visual-badge">now shipping</span>
          <ul className="hero-visual-list">
            {projects.map((project) => (
              <li key={project.name} className="hero-visual-item">
                <span className="hero-visual-dot" />
                <span className="hero-visual-name">{project.name}</span>
                <span className="hero-visual-kind">{project.kind}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  )
}
