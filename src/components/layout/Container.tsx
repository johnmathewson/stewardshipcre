import { cn } from '@/lib/utils'

interface ContainerProps {
  children: React.ReactNode
  className?: string
  narrow?: boolean
}

export function Container({ children, className, narrow }: ContainerProps) {
  return (
    <div
      className={cn(
        'mx-auto w-full px-6 md:px-8',
        narrow ? 'max-w-[800px]' : 'max-w-[1400px]',
        className,
      )}
    >
      {children}
    </div>
  )
}
