import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
 "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-display font-bold transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none uppercase tracking-widest",
 {
 variants: {
 variant: {
 default:
 "bg-gradient-to-br from-primary via-red-600 to-primary text-foreground dark:text-white shadow-[0_10px_35px_-5px_rgba(220,38,38,0.45)] hover:bg-red-700 hover:shadow-[0_15px_45px_-5px_rgba(220,38,38,0.6)] hover:-translate-y-1 hover:brightness-110 active:translate-y-0 active:scale-95 border-none relative overflow-hidden",
 destructive:
 "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
 outline:
 "border border-border/60 bg-background/50 backdrop-blur-sm shadow-sm hover:bg-muted/50 hover:text-accent-foreground hover:border-primary/40",
 secondary:
 "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
 ghost: "hover:bg-muted/50 hover:text-accent-foreground border-none",
 link: "text-primary underline-offset-4 hover:underline border-none",
 premium: "bg-gradient-to-br from-primary via-primary to-accent text-primary-foreground shadow-[0_10px_40px_-10px_rgba(220,38,38,0.5)] hover:shadow-[0_15px_50px_-10px_rgba(220,38,38,0.6)] hover:brightness-110 hover:-translate-y-1 transition-all duration-500 border-none",
 gold: "bg-gradient-to-br from-accent via-accent/90 to-accent/70 text-accent-foreground shadow-[0_10px_35px_-10px_rgba(180,140,50,0.4)] hover:shadow-[0_15px_45px_-10px_rgba(180,140,50,0.5)] hover:brightness-110 hover:-translate-y-1 transition-all duration-500 border-none",
 },
 size: {
 default: "h-11 px-6 text-[10px]",
 sm: "h-9 px-4 text-[9px]",
 lg: "h-14 px-10 text-[11px] tracking-[0.2em]",
 icon: "size-11",
 },
 },
 defaultVariants: {
 variant: "default",
 size: "default",
 },
 }
)

function Button({
 className,
 variant,
 size,
 asChild = false,
 ...props
}: React.ComponentProps<"button"> &
 VariantProps<typeof buttonVariants> & {
 asChild?: boolean
 }) {
 const Comp = asChild ? Slot : "button"

 return (
 <Comp
 data-slot="button"
 className={cn(buttonVariants({ variant, size, className }))}
 {...props}
 />
 )
}

export { Button, buttonVariants }
