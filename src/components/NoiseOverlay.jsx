import { useId } from 'react'

import './NoiseOverlay.css'

export function NoiseOverlay() {
  const filterId = `noise-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`

  return (
    <svg className="noise-overlay" aria-hidden="true" focusable="false">
      <filter id={filterId}>
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.65"
          numOctaves="3"
          stitchTiles="stitch"
        />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter={`url(#${filterId})`} />
    </svg>
  )
}
