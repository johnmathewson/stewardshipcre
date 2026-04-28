import { cn } from '@/lib/utils'
import Link from 'next/link'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonBaseProps {
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
  children: React.ReactNode
}

interface ButtonAsButton extends ButtonBaseProps, Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps> {
  href?: never
}

interface ButtonAsLink extends ButtonBaseProps {
  href: string
}

type ButtonProps = ButtonAsButton | ButtonAsLink

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-coral-400 text-charcoal-950 hover:bg-coral-300 hover:shadow-lg hover:shadow-coral-400/20',
  secondary: 'bg-charcoal-800 text-cream-100 hover:bg-charcoal-700 border border-charcoal-700',
  ghost: 'text-cream-300 hover:text-coral-400 hover:bg-charcoal-800/50',
  outline: 'border border-coral-400/40 text-coral-400 hover:bg-coral-400 hover:text-charcoal-950',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-6 py-3 text-xs',
  lg: 'px-8 py-4 text-sm',
}

export function Button({ variant = 'primary', size = 'md', className, children, ...props }: ButtonProps) {
  const classes = cn(
    'inline-flex items-center justify-center gap-2 font-semibold tracking-[0.15em] uppercase transition-all duration-500 cursor-pointer',
    variants[variant],
    sizes[size],
    className,
  )

  if ('href' in props && props.href) {
    return (
      <Link href={props.href} className={classes}>
        {children}
      </Link>
    )
  }

  const { href: _, ...buttonProps } = props as ButtonAsButton
  return (
    <button className={classes} {...buttonProps}>
      {children}
    </button>
  )
}
