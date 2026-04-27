import { cn } from '@/lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  dark?: boolean
}

export function Card({ children, className, hover = false, dark = false }: CardProps) {
  return (
    <div
      className={cn(
        'border transition-all duration-500',
        dark
          ? 'bg-charcoal-800 border-charcoal-700'
          : 'bg-white border-cream-300',
        hover && 'hover:border-gold-500/40 hover:shadow-xl hover:-translate-y-1',
        className,
      )}
    >
      {children}
    </div>
  )
}
