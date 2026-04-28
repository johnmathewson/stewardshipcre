import { cn } from '@/lib/utils'

type BadgeVariant = 'default' | 'teal' | 'navy' | 'outline'

interface BadgeProps {
  variant?: BadgeVariant
  className?: string
  children: React.ReactNode
}

const variants: Record<BadgeVariant, string> = {
  default: 'bg-charcoal-800/80 text-cream-200 border border-charcoal-700/50',
  teal: 'bg-coral-400/10 text-coral-400 border border-coral-400/20',
  navy: 'bg-navy-600/10 text-navy-300 border border-navy-600/20',
  outline: 'border border-charcoal-600 text-charcoal-300',
}

export function Badge({ variant = 'default', className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 text-[10px] font-semibold tracking-[0.15em] uppercase backdrop-blur-sm',
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}
