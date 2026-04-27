import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export function Input({ label, error, className, id, ...props }: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={inputId} className="block text-xs tracking-[0.1em] uppercase font-semibold text-charcoal-600">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          'w-full px-4 py-3 bg-cream-100 border border-cream-300 text-charcoal-800 text-sm',
          'placeholder:text-charcoal-400 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500',
          'transition-all duration-300',
          error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
          className,
        )}
        {...props}
      />
      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
    </div>
  )
}
