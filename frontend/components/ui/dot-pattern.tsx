"use client"

import React, { useId, useMemo, memo } from "react"
import { cn } from "@/lib/utils"

/**
 * DotPattern Component Props - Optimized version without framer-motion
 */
interface DotPatternProps extends React.SVGProps<SVGSVGElement> {
  width?: number
  height?: number
  x?: number
  y?: number
  cx?: number
  cy?: number
  cr?: number
  className?: string
  glow?: boolean
}

/**
 * DotPattern Component - Optimized
 * 
 * Uses CSS pattern instead of rendering individual dots for massive performance improvement.
 * This eliminates hundreds of DOM nodes and removes framer-motion dependency.
 */
export const DotPattern = memo(function DotPattern({
  width = 16,
  height = 16,
  x: _x = 0,
  y: _y = 0,
  cx = 1,
  cy = 1,
  cr = 1,
  className,
  glow = false,
  ...props
}: DotPatternProps) {
  const id = useId()

  // Memoize the pattern to prevent recalculation
  const patternElement = useMemo(() => (
    <defs>
      <pattern
        id={`${id}-pattern`}
        x="0"
        y="0"
        width={width}
        height={height}
        patternUnits="userSpaceOnUse"
      >
        <circle
          cx={cx}
          cy={cy}
          r={cr}
          fill="currentColor"
          className={glow ? "animate-pulse" : undefined}
        />
      </pattern>
      {glow && (
        <radialGradient id={`${id}-gradient`}>
          <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
      )}
    </defs>
  ), [id, width, height, cx, cy, cr, glow]);

  return (
    <svg
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full text-neutral-400/80",
        className
      )}
      {...props}
    >
      {patternElement}
      <rect
        x="0"
        y="0"
        width="100%"
        height="100%"
        fill={`url(#${id}-pattern)`}
      />
    </svg>
  )
})

DotPattern.displayName = "DotPattern"
