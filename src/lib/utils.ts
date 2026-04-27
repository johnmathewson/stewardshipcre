import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  if (price >= 1_000_000) {
    return `$${(price / 1_000_000).toFixed(1)}M`
  }
  if (price >= 1_000) {
    return `$${(price / 1_000).toFixed(0)}K`
  }
  return `$${price.toLocaleString()}`
}

export function formatSqft(sqft: number): string {
  return `${sqft.toLocaleString()} SF`
}

export function formatAcres(acres: number): string {
  return `${acres.toFixed(2)} AC`
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}
