import { Suspense, useEffect, useMemo, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Smoke } from 'react-smoke'
import * as THREE from 'three'

import './SmokeOverlay.css'

export const SMOKE_DURATION = 1400
export const SWAP_DELAY = 750

function supportsWebGL() {
  try {
    if (typeof document === 'undefined') return false
    const canvas = document.createElement('canvas')
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext('webgl2') || canvas.getContext('webgl'))
    )
  } catch {
    return false
  }
}

function isMobileDevice() {
  if (typeof window === 'undefined' || typeof navigator === 'undefined')
    return false
  const coarse = window.matchMedia?.('(pointer: coarse)').matches ?? false
  const smallScreen = window.innerWidth < 768
  const lowCores =
    typeof navigator.hardwareConcurrency === 'number' &&
    navigator.hardwareConcurrency <= 4
  return coarse || smallScreen || lowCores
}

export function SmokeOverlay({ running, direction = 1, runId = 0 }) {
  const color = useMemo(() => new THREE.Color('#ffffff'), [])
  // runId is kept in the API for future restarts; particles persist
  // across transitions on purpose so smoke is instant on slow devices.
  void runId
  const [webglSupported] = useState(supportsWebGL)
  const [mobile] = useState(isMobileDevice)
  const [webglFailed, setWebglFailed] = useState(false)
  const [warmed, setWarmed] = useState(false)

  const reducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

  const useWebGL = webglSupported && !webglFailed && !reducedMotion

  // Pre-warm: render hidden particles on mount so the FIRST scroll
  // already has full smoke. Without this, shaders compile + particles
  // spawn from zero during the transition -> blank on slow devices.
  useEffect(() => {
    if (!useWebGL) return
    const t = setTimeout(() => setWarmed(true), 2000)
    return () => clearTimeout(t)
  }, [useWebGL])

  // If the GPU context is lost on any device, fall back to CSS smoke
  // instead of showing nothing.
  useEffect(() => {
    const onContextLost = () => setWebglFailed(true)
    window.addEventListener('webglcontextlost', onContextLost)
    return () => window.removeEventListener('webglcontextlost', onContextLost)
  }, [])

  // Keep the same Smoke instance across scrolls (no key={runId} remount).
  // Remounting resets particles to zero every time, which is exactly why
  // slow devices saw an empty flash. Direction updates via prop instead.
  const frameloop = running || !warmed ? 'always' : 'never'

  return (
    <div
      className={running ? 'smoke is-active' : 'smoke'}
      style={{ '--smoke-dir': direction }}
      aria-hidden="true"
    >
      <div className="smoke-core" />

      {/* CSS fallback: always animates, guarantees visible smoke on
          every device even if WebGL is slow, blocked or unsupported. */}
      <div className="smoke-fallback" aria-hidden="true">
        <span className="smoke-puff smoke-puff--1" />
        <span className="smoke-puff smoke-puff--2" />
        <span className="smoke-puff smoke-puff--3" />
        <span className="smoke-puff smoke-puff--4" />
        <span className="smoke-puff smoke-puff--5" />
      </div>

      {useWebGL && (
        <div className="smoke-webgl">
          <Canvas
            frameloop={frameloop}
            dpr={mobile ? [1, 1] : [1, 1.5]}
            gl={{
              alpha: true,
              antialias: !mobile,
              powerPreference: mobile ? 'low-power' : 'default',
              failIfMajorPerformanceCaveat: false,
              depth: false,
              stencil: false,
            }}
            camera={{ fov: 60, position: [0, 0, 500], far: 6000 }}
            onCreated={({ gl }) => {
              gl.setClearColor(0x000000, 0)
            }}
          >
            <ambientLight intensity={1} />
            <directionalLight intensity={1} position={[-1, 0, 1]} />
            <Suspense fallback={null}>
              <Smoke
                color={color}
                density={mobile ? 32 : 55}
                opacity={mobile ? 0.55 : 0.42}
                enableFrustumCulling
                enableTurbulence={!mobile}
                turbulenceStrength={[0.05, 0.05, 0]}
                enableWind
                windStrength={mobile ? [0.35, 0.06, 0] : [0.5, 0.08, 0]}
                windDirection={[-direction, 0, 0]}
                maxVelocity={mobile ? [50, 12, 0] : [70, 16, 0]}
                enableRotation
                rotation={[0, 0, 0.12]}
              />
            </Suspense>
          </Canvas>
        </div>
      )}
    </div>
  )
}
