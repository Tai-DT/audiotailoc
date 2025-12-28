import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl border font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background aria-invalid:ring-destructive/25 aria-invalid:border-destructive/70",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-[0_20px_60px_-28px_rgba(0,0,0,0.45)] hover:from-primary/90 hover:to-accent/90 border-none",
        destructive:
          "bg-destructive text-destructive-foreground border-destructive/50 shadow-[0_10px_40px_-24px_rgba(0,0,0,0.6)] hover:bg-destructive/90 focus-visible:ring-destructive/30",
        outline:
          "border-border bg-card/60 text-foreground shadow-[0_10px_40px_-28px_rgba(0,0,0,0.35)] hover:bg-card/80 hover:border-border/80",
        secondary: "bg-secondary/70 text-secondary-foreground hover:bg-secondary/90",
        ghost:
          "text-foreground hover:bg-muted/60 hover:text-foreground data-[state=open]:bg-muted/60",
        link: "text-primary underline-offset-4 hover:underline decoration-2",
      },
      size: {
        default: "h-11 px-5 text-sm rounded-xl has-[>svg]:px-4",
        sm: "h-9 rounded-lg gap-1.5 px-3 text-sm has-[>svg]:px-2.5",
        lg: "h-12 px-6 text-base rounded-2xl has-[>svg]:px-4",
        icon: "size-10 rounded-xl",
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
