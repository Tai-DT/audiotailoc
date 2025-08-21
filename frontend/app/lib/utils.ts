import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(priceInCents: number): string {
  const amount = typeof priceInCents === 'number' ? priceInCents / 100 : 0
  return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
}
