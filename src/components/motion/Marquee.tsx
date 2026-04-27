'use client'

import { cn } from '@/lib/utils'

interface MarqueeProps {
  items: string[]
  className?: string
  separator?: string
}

export function Marquee({ items, className, separator = '  /  ' }: MarqueeProps) {
  const text = items.join(separator) + separator

  return (
    <div className={cn('overflow-hidden whitespace-nowrap', className)}>
      <div className="animate-marquee inline-block">
        <span>{text}</span>
        <span>{text}</span>
        <span>{text}</span>
      </div>
    </div>
  )
}
