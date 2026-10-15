import { Suspense, useEffect, useMemo, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Smoke } from 'react-smoke'
import * as THREE from 'three'

import './SmokeOverlay.css'

export const SMOKE_DURATION = 1400
export const SWAP_DELAY = 750

export function SmokeOverlay({ running, direction = 1, runId = 0 }) {
  const color = useMemo(() => new THREE.Color('#ffffff'), [])
  const [live, setLive] = useState(false)

  useEffect(() => {
    const start = setTimeout(() => setLive(true), 0)
    const stop = setTimeout(
      () => setLive(false),
      running ? SMOKE_DURATION + 500 : 1600
    )
    return () => {
      clearTimeout(start)
      clearTimeout(stop)
    }
  }, [running])

  return (
    <div className={running ? 'smoke is-active' : 'smoke'} aria-hidden="true">
      <div className="smoke-core" />
      <Canvas
        frameloop={live ? 'always' : 'never'}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        camera={{ fov: 60, position: [0, 0, 500], far: 6000 }}
      >
        <ambientLight intensity={1} />
        <directionalLight intensity={1} position={[-1, 0, 1]} />
        <Suspense fallback={null}>
          <Smoke
            key={runId}
            color={color}
            density={70}
            opacity={0.42}
            enableFrustumCulling
            enableTurbulence
            turbulenceStrength={[0.05, 0.05, 0]}
            enableWind
            windStrength={[0.5, 0.08, 0]}
            windDirection={[-direction, 0, 0]}
            maxVelocity={[70, 16, 0]}
            enableRotation
            rotation={[0, 0, 0.12]}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}
