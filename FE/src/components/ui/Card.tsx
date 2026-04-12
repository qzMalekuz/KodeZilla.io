import type { PropsWithChildren } from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'

interface CardProps extends PropsWithChildren {
  className?: string
}

export function Card({ className, children }: CardProps) {
  return (
    <motion.article
      whileHover={{ scale: 1.01, borderColor: 'rgba(17,17,17,0.55)' }}
      className={cn('border border-neutral-900/15 bg-white p-6 shadow-xl shadow-black/5 transition', className)}
    >
      {children}
    </motion.article>
  )
}
