"use client"

import { useEffect, useRef, memo } from "react"
import { cn } from "@/lib/utils"

interface ScrollProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  ref?: React.Ref<HTMLDivElement>
}

/**
 * ScrollProgress Component - Optimized without motion/react
 * Uses vanilla scroll listener for progress tracking
 */
export const ScrollProgress = memo(function ScrollProgress({
  className,
  ...props
}: ScrollProgressProps) {
  const progressRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const updateProgress = () => {
      if (!progressRef.current) return

      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = docHeight > 0 ? scrollTop / docHeight : 0

      progressRef.current.style.transform = `scaleX(${progress})`
    }

    // Use requestAnimationFrame for smooth updates
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateProgress()
          ticking = false
        })
        ticking = true
      }
    }

    // Initial update
    updateProgress()

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div
      ref={progressRef}
      className={cn(
        "fixed inset-x-0 top-0 z-50 h-px origin-left bg-gradient-to-r from-[#A97CF8] via-[#F38CB8] to-[#FDCC92]",
        className
      )}
      style={{ transform: "scaleX(0)" }}
      {...props}
    />
  )
})
