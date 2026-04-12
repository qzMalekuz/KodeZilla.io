import type { PropsWithChildren } from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'

interface CardProps extends PropsWithChildren {
  className?: string
}

export function Card({ className, children }: CardProps) {
  return (
    <motion.article
      whileHover={{ scale: 1.01, borderColor: 'rgba(255,255,255,0.2)' }}
      className={cn('rounded-2xl border border-border bg-black/30 p-6 transition', className)}
    >
      {children}
    </motion.article>
  )
}
