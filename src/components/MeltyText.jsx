import { useEffect, useId, useRef } from "react"

import { cn } from "@/lib/utils"

import "./MeltyText.css"

export function MeltyText({ text, className }) {
  const filterId = `melty-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`
  const turbulenceRef = useRef(null)
  const displacementRef = useRef(null)

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const start = performance.now()
    let frame

    const tick = (now) => {
      const t = (now - start) / 1000
      const freqX = 0.009 + Math.sin(t * 0.7) * 0.003
      const freqY = 0.016 + Math.sin(t * 0.5 + 1.3) * 0.005
      const intro = 1 + Math.pow(Math.max(1 - t / 1.6, 0), 2) * 1.4

      turbulenceRef.current?.setAttribute(
        "baseFrequency",
        `${freqX.toFixed(4)} ${freqY.toFixed(4)}`
      )
      displacementRef.current?.setAttribute("scale", (4 * intro).toFixed(2))

      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [])

  const characters = [...text]

  return (
    <>
      <svg className="melty-defs" aria-hidden="true" focusable="false">
        <defs>
          <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              ref={turbulenceRef}
              type="fractalNoise"
              baseFrequency="0.009 0.016"
              numOctaves="2"
              seed="7"
              result="noise"
            />
            <feDisplacementMap
              ref={displacementRef}
              in="SourceGraphic"
              in2="noise"
              scale="4"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>
      <h1
        className={cn("melty-text", className)}
        style={{ "--melty-filter": `url(#${filterId})` }}
      >
        {characters.map((character, i) => (
          <span
            key={`${character}-${i}`}
            className="melty-char"
            style={{ animationDelay: `${i * 0.06}s` }}
          >
            {character === " " ? "\u00A0" : character}
          </span>
        ))}
      </h1>
    </>
  )
}
