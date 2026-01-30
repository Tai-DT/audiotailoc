"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

function Tabs({
 className,
 ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
 return (
 <TabsPrimitive.Root
 data-slot="tabs"
 className={cn("flex flex-col gap-2", className)}
 {...props}
 />
 )
}

function TabsList({
 className,
 ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
 return (
 <TabsPrimitive.List
 data-slot="tabs-list"
 className={cn(
 "bg-muted/50 text-muted-foreground inline-flex h-11 items-center justify-center rounded-xl p-1 border border-border/40",
 className
 )}
 {...props}
 />
 )
}

function TabsTrigger({
 className,
 ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
 return (
 <TabsPrimitive.Trigger
 data-slot="tabs-trigger"
 className={cn(
 "data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:border-primary/20",
 "dark:data-[state=active]:bg-primary/20 dark:data-[state=active]:text-primary dark:data-[state=active]:border-primary/40",
 "focus-visible:ring-primary/20 text-muted-foreground hover:text-foreground inline-flex h-full items-center justify-center gap-1.5 rounded-lg border border-transparent px-4 py-1.5 text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
 className
 )}
 {...props}
 />
 )
}

function TabsContent({
 className,
 ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
 return (
 <TabsPrimitive.Content
 data-slot="tabs-content"
 className={cn("flex-1 outline-none", className)}
 {...props}
 />
 )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }