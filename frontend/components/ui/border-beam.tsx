"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface BorderBeamProps {
  /**
   * The size of the border beam.
   */
  size?: number
  /**
   * The duration of the border beam animation in seconds.
   */
  duration?: number
  /**
   * The delay of the border beam.
   */
  delay?: number
  /**
   * The color of the border beam from.
   */
  colorFrom?: string
  /**
   * The color of the border beam to.
   */
  colorTo?: string
  /**
   * The class name of the border beam.
   */
  className?: string
  /**
   * The style of the border beam.
   */
  style?: React.CSSProperties
  /**
   * Whether to reverse the animation direction.
   */
  reverse?: boolean
  /**
   * The border width of the beam.
   */
  borderWidth?: number
}

/**
 * BorderBeam Component - Optimized without motion/react
 * Uses CSS animations for the beam effect
 */
export const BorderBeam = React.memo(function BorderBeam({
  className,
  size = 50,
  delay = 0,
  duration = 6,
  colorFrom = "#ffaa40",
  colorTo = "#9c40ff",
  style,
  reverse = false,
  borderWidth = 1,
}: BorderBeamProps) {
  const id = React.useId().replace(/:/g, "")
  const scopeClass = `border-beam-${id}`

  const extraCssVars = Object.entries(style ?? {})
    .filter(([key]) => key.startsWith("--"))
    .map(([key, value]) => `${key}:${String(value)};`)
    .join("")

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 rounded-[inherit] border-(length:--border-beam-width) border-transparent [mask-image:linear-gradient(transparent,transparent),linear-gradient(#000,#000)] [mask-composite:intersect] [mask-clip:padding-box,border-box]",
        scopeClass
      )}
    >
      <div
        className={cn(
          "border-beam__beam absolute aspect-square",
          "bg-gradient-to-l from-[var(--color-from)] via-[var(--color-to)] to-transparent",
          className
        )}
        style={{
          animation: `border-beam-${reverse ? 'reverse' : 'forward'} ${duration}s linear infinite`,
          animationDelay: `-${delay}s`,
        }}
      />
      <style>{`
        .${scopeClass}{--border-beam-width:${borderWidth}px;}
        .${scopeClass} .border-beam__beam{
          width:${size}px;
          offset-path:rect(0 auto auto 0 round ${size}px);
          --color-from:${colorFrom};
          --color-to:${colorTo};
          ${extraCssVars}
        }
        @keyframes border-beam-forward {
          0% { offset-distance: 0%; }
          100% { offset-distance: 100%; }
        }
        @keyframes border-beam-reverse {
          0% { offset-distance: 100%; }
          100% { offset-distance: 0%; }
        }
      `}</style>
    </div>
  )
})
