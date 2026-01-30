"use client"

import { useRef, useEffect, useState, memo } from "react"
import { cn } from "@/lib/utils"

interface BlurFadeProps {
 children: React.ReactNode
 className?: string
 duration?: number
 delay?: number
 offset?: number
 direction?: "up" | "down" | "left" | "right"
 inView?: boolean
 blur?: string
}

/**
 * BlurFade Component - Optimized without framer-motion
 * Uses CSS animations + IntersectionObserver for scroll-triggered animations
 */
export const BlurFade = memo(function BlurFade({
 children,
 className,
 duration = 0.4,
 delay = 0,
 offset = 6,
 direction = "down",
 inView = false,
 blur = "6px",
}: BlurFadeProps) {
 const ref = useRef<HTMLDivElement>(null)
 const [isVisible, setIsVisible] = useState(false)

 useEffect(() => {
 if (!inView) {
 // If not using inView, animate immediately
 const timer = setTimeout(() => setIsVisible(true), delay * 1000)
 return () => clearTimeout(timer)
 }

 const element = ref.current
 if (!element) return

 const observer = new IntersectionObserver(
 (entries) => {
 entries.forEach((entry) => {
 if (entry.isIntersecting) {
 setIsVisible(true)
 observer.unobserve(entry.target)
 }
 })
 },
 { rootMargin: "-50px",
 threshold: 0.1 }
 )

 observer.observe(element)
 return () => observer.disconnect()
 }, [inView, delay])

 // Determine initial transform based on direction
 const getInitialTransform = () => {
 switch (direction) {
 case "up": return `translateY(${offset}px)`
 case "down": return `translateY(-${offset}px)`
 case "left": return `translateX(${offset}px)`
 case "right": return `translateX(-${offset}px)`
 default: return `translateY(-${offset}px)`
 }
 }

 return (
 <div
 ref={ref}
 className={cn(className)}
 style={{
 opacity: isVisible ? 1 : 0,
 filter: isVisible ? "blur(0px)" : `blur(${blur})`,
 transform: isVisible ? "translate(0)" : getInitialTransform(),
 transition: `opacity ${duration}s ease-out, filter ${duration}s ease-out, transform ${duration}s ease-out`,
 transitionDelay: `${delay}s`,
 }}
 >
 {children}
 </div>
 )
})