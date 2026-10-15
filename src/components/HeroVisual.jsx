import cardBg from '@/assets/home card bg.png'

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
        <img className="hero-visual-shader" src={cardBg} alt="" draggable="false" />
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
