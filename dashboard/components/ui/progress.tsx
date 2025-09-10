"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
}

export function Progress({ value = 0, className, ...props }: ProgressProps) {
  const clamped = Math.max(0, Math.min(100, value))
  return (
    <div
      className={cn(
        "relative w-full h-2 rounded bg-muted overflow-hidden",
        className
      )}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={clamped}
      {...props}
    >
      <div
        className="h-full bg-primary transition-all"
        style={{ width: `${clamped}%` }}
      />
    </div>
  )
}

