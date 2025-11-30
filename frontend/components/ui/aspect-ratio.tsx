"use client"

import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio"

function AspectRatio({
  className,
  ...props
}: React.ComponentProps<typeof AspectRatioPrimitive.Root>) {
  return (
    <AspectRatioPrimitive.Root 
      data-slot="aspect-ratio" 
      className={`relative ${className || ''}`}
      {...props} 
    />
  )
}

export { AspectRatio }
