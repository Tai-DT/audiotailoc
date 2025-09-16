'use client'

import * as React from 'react'
import { ToastProvider as RadixToastProvider } from './toast'

export function ToastProvider({ children, ...props }: React.ComponentProps<'div'>) {
  return (
    <RadixToastProvider {...props}>
      {children}
      <Toaster />
    </RadixToastProvider>
  )
}

import { useToast } from './use-toast'
import { Toast, ToastDescription, ToastTitle, ToastClose, ToastViewport } from './toast'

export function Toaster() {
  const { toasts } = useToast()

  return (
    <>
      {toasts.map(({ id, title, description, action, ...props }) => {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </>
  )
}
