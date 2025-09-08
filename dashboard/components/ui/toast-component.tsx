"use client"

import * as React from "react"
import * as ToastPrimitives from "@radix-ui/react-toast"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

type ToastVariant = 'default' | 'destructive'

// ToastProvider
export const ToastProvider = ToastPrimitives.Provider

interface ToastViewportProps 
  extends React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport> {}

export const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  ToastViewportProps
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
      className
    )}
    {...props}
  />
))

ToastViewport.displayName = "ToastViewport"

// Toast
interface ToastProps 
  extends React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> {
  variant?: ToastVariant
}

export const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  ToastProps
>(({ className, variant = 'default', ...props }, ref) => (
  <ToastPrimitives.Root
    ref={ref}
    className={cn(
      "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border border-gray-200 bg-white p-6 pr-8 shadow-lg transition-all",
      variant === 'destructive' && "bg-red-600 text-white border-red-700",
      className
    )}
    {...props}
  />
))

Toast.displayName = "Toast"

// ToastAction
interface ToastActionProps 
  extends React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action> {}

export const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  ToastActionProps
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border border-gray-200 bg-transparent px-3 text-sm font-medium ring-offset-white transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      className
    )}
    {...props}
  />
))

ToastAction.displayName = "ToastAction"

// ToastClose
interface ToastCloseProps 
  extends React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close> {}

export const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  ToastCloseProps
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "absolute right-2 top-2 rounded-md p-1 text-gray-500 opacity-0 transition-opacity hover:text-gray-900 focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100",
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
))

ToastClose.displayName = "ToastClose"

// ToastTitle
interface ToastTitleProps 
  extends React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title> {}

export const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  ToastTitleProps
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn("text-sm font-semibold", className)}
    {...props}
  />
))

ToastTitle.displayName = "ToastTitle"

// ToastDescription
interface ToastDescriptionProps 
  extends React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description> {}

export const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  ToastDescriptionProps
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn("text-sm opacity-90", className)}
    {...props}
  />
))

ToastDescription.displayName = "ToastDescription"

// useToast hook
export function useToast() {
  const [toast, setToast] = React.useState<{
    title: string
    description?: string
    variant?: ToastVariant
    action?: React.ReactNode
    open: boolean
    onOpenChange: (open: boolean) => void
  } | null>(null)

  const showToast = React.useCallback(({ 
    title, 
    description, 
    variant = 'default', 
    action 
  }: {
    title: string
    description?: string
    variant?: ToastVariant
    action?: React.ReactNode
  }) => {
    setToast({
      title,
      description,
      variant,
      action,
      open: true,
      onOpenChange: (open) => {
        if (!open) setToast(null)
      }
    })
  }, [])

  const ToastComponent = toast ? (
    <ToastProvider>
      <ToastViewport />
      <Toast
        open={toast.open}
        onOpenChange={toast.onOpenChange}
        variant={toast.variant}
      >
        <div className="grid gap-1">
          {toast.title && <ToastTitle>{toast.title}</ToastTitle>}
          {toast.description && (
            <ToastDescription>{toast.description}</ToastDescription>
          )}
        </div>
        {toast.action}
        <ToastClose />
      </Toast>
    </ToastProvider>
  ) : null

  return { showToast, ToastComponent }
}
