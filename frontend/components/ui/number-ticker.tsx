"use client"

import { ComponentPropsWithoutRef, useEffect, useRef, useState, memo } from "react"
import { cn } from "@/lib/utils"

interface NumberTickerProps extends ComponentPropsWithoutRef<"span"> {
  value: number
  startValue?: number
  direction?: "up" | "down"
  delay?: number
  decimalPlaces?: number
  duration?: number
}

/**
 * NumberTicker Component - Optimized without motion/react
 * Uses requestAnimationFrame for smooth number animation
 */
export const NumberTicker = memo(function NumberTicker({
  value,
  startValue = 0,
  direction = "up",
  delay = 0,
  className,
  decimalPlaces = 0,
  duration = 1.5,
  ...props
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const [displayValue, setDisplayValue] = useState(direction === "down" ? value : startValue)
  const [isInView, setIsInView] = useState(false)
  const animationRef = useRef<number>()

  // IntersectionObserver for visibility
  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  // Animation logic using requestAnimationFrame
  useEffect(() => {
    if (!isInView) return

    const timeout = setTimeout(() => {
      const targetValue = direction === "down" ? startValue : value
      const fromValue = direction === "down" ? value : startValue
      const startTime = performance.now()
      const durationMs = duration * 1000

      const easeOutQuad = (t: number) => t * (2 - t)

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / durationMs, 1)
        const easedProgress = easeOutQuad(progress)
        
        const currentValue = fromValue + (targetValue - fromValue) * easedProgress
        setDisplayValue(currentValue)

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate)
        }
      }

      animationRef.current = requestAnimationFrame(animate)
    }, delay * 1000)

    return () => {
      clearTimeout(timeout)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isInView, value, startValue, direction, delay, duration])

  // Format the display value
  const formattedValue = Intl.NumberFormat("vi-VN", {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  }).format(Number(displayValue.toFixed(decimalPlaces)))

  return (
    <span
      ref={ref}
      className={cn(
        "inline-block tracking-wider text-foreground tabular-nums",
        className
      )}
      {...props}
    >
      {formattedValue}
    </span>
  )
})
