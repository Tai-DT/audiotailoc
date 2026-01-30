"use client"

import React, { useCallback, useEffect, useRef, useState, memo } from "react"
import { cn } from "@/lib/utils"

interface MagicCardProps {
 children?: React.ReactNode
 className?: string
 gradientSize?: number
 gradientColor?: string
 gradientOpacity?: number
 gradientFrom?: string
 gradientTo?: string
}

/**
 * MagicCard Component - Optimized without motion/react
 * Uses CSS variables and direct DOM updates for smooth mouse tracking
 */
export const MagicCard = memo(function MagicCard({
 children,
 className,
 gradientSize = 200,
 gradientColor = "#262626",
 gradientOpacity = 0.8,
 gradientFrom = "#9E7AFF",
 gradientTo = "#FE8BBB",
}: MagicCardProps) {
 const cardRef = useRef<HTMLDivElement>(null)
 const [mousePos, setMousePos] = useState({ x: -gradientSize, y: -gradientSize })

 const handlePointerMove = useCallback(
 (e: React.PointerEvent<HTMLDivElement>) => {
 const rect = e.currentTarget.getBoundingClientRect()
 setMousePos({
 x: e.clientX - rect.left,
 y: e.clientY - rect.top,
 })
 },
 []
 )

 const reset = useCallback(() => {
 setMousePos({ x: -gradientSize, y: -gradientSize })
 }, [gradientSize])

 useEffect(() => {
 reset()
 }, [reset])

 useEffect(() => {
 const handleGlobalPointerOut = (e: PointerEvent) => {
 if (!e.relatedTarget) {
 reset()
 }
 }

 const handleVisibility = () => {
 if (document.visibilityState !== "visible") {
 reset()
 }
 }

 window.addEventListener("pointerout", handleGlobalPointerOut)
 window.addEventListener("blur", reset)
 document.addEventListener("visibilitychange", handleVisibility)

 return () => {
 window.removeEventListener("pointerout", handleGlobalPointerOut)
 window.removeEventListener("blur", reset)
 document.removeEventListener("visibilitychange", handleVisibility)
 }
 }, [reset])

 const borderGradient = `radial-gradient(${gradientSize}px circle at ${mousePos.x}px ${mousePos.y}px, ${gradientFrom}, ${gradientTo}, var(--border) 100%)`
 const overlayGradient = `radial-gradient(${gradientSize}px circle at ${mousePos.x}px ${mousePos.y}px, ${gradientColor}, transparent 100%)`

 return (
 <div
 ref={cardRef}
 className={cn("group relative rounded-[inherit]", className)}
 onPointerMove={handlePointerMove}
 onPointerLeave={reset}
 onPointerEnter={reset}
 >
 <div
 className="bg-border pointer-events-none absolute inset-0 rounded-[inherit] duration-300 group-hover:opacity-100"
 style={{ background: borderGradient }}
 />
 <div className="bg-background absolute inset-px rounded-[inherit]" />
 <div
 className="pointer-events-none absolute inset-px rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
 style={{
 background: overlayGradient,
 opacity: gradientOpacity,
 }}
 />
 <div className="relative">{children}</div>
 </div>
 )
})
