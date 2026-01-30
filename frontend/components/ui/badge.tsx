import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
 "inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-widest transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
 {
 variants: {
 variant: {
 default:
 "border-transparent bg-primary text-foreground dark:text-white shadow-[0_4px_10px_rgba(220,38,38,0.4)] hover:shadow-[0_4px_15px_rgba(220,38,38,0.5)]",
 secondary:
 "border-accent/30 bg-accent/10 text-accent-foreground hover:bg-accent/20",
 destructive:
 "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
 outline: "border-border/60 text-foreground hover:bg-muted/50",
 premium: "border-accent/40 bg-gradient-to-tr from-primary/20 to-accent/20 text-primary shadow-[0_0_15px_rgba(180,140,50,0.2)]",
 },
 },
 defaultVariants: {
 variant: "default",
 },
 }
)

export interface BadgeProps
 extends React.HTMLAttributes<HTMLDivElement>,
 VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
 return (
 <div className={cn(badgeVariants({ variant }), className)} {...props} />
 )
}

export { Badge, badgeVariants }


