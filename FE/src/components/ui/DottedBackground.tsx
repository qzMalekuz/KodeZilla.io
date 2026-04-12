import type { PropsWithChildren } from 'react'
import { cn } from '../../lib/utils'

interface DottedBackgroundProps extends PropsWithChildren {
  className?: string
}

export function DottedBackground({ children, className }: DottedBackgroundProps) {
  return (
    <div
      className={cn('min-h-screen bg-stone-100', className)}
      style={{
        backgroundImage:
          'radial-gradient(circle at 78% 18%, rgba(255, 106, 0, 0.08) 0%, transparent 24%), linear-gradient(rgba(17, 17, 17, 0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(17, 17, 17, 0.12) 1px, transparent 1px)',
        backgroundSize: 'cover, 312px 312px, 312px 312px',
      }}
    >
      {children}
    </div>
  )
}
