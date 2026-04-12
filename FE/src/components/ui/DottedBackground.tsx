import type { PropsWithChildren } from 'react'
import { cn } from '../../lib/utils'

interface DottedBackgroundProps extends PropsWithChildren {
  className?: string
}

export function DottedBackground({ children, className }: DottedBackgroundProps) {
  return (
    <div
      className={cn('min-h-screen bg-slate-950', className)}
      style={{
        backgroundImage:
          'radial-gradient(circle at 70% 40%, rgba(99, 179, 237, 0.07) 0%, transparent 60%), radial-gradient(rgba(255, 255, 255, 0.07) 1px, transparent 1px)',
        backgroundSize: 'cover, 24px 24px',
      }}
    >
      {children}
    </div>
  )
}
