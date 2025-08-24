import * as React from "react";

import { cn } from "../../lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "destructive" | "outline";
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const base =
      "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors";
    const variants: Record<NonNullable<BadgeProps["variant"]>, string> = {
      default:
        "border-transparent bg-blue-600 text-white hover:bg-blue-700",
      secondary:
        "border-transparent bg-gray-100 text-gray-900 hover:bg-gray-200",
      destructive:
        "border-transparent bg-red-600 text-white hover:bg-red-700",
      outline: "text-gray-900",
    };

    return (
      <span
        ref={ref}
        className={cn(base, variants[variant], className)}
        {...props}
      />
    );
  }
);
Badge.displayName = "Badge";


