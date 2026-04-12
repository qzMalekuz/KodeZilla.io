import type { ButtonHTMLAttributes, PropsWithChildren } from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'

type Variant = 'ghost' | 'solid' | 'outline'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, PropsWithChildren {
  variant?: Variant
  size?: Size
}

const variantClasses: Record<Variant, string> = {
  ghost: 'border border-white bg-transparent text-white hover:bg-white/5',
  solid: 'border border-white bg-white text-black hover:bg-slate-100',
  outline: 'border border-border bg-transparent text-slate-100 hover:border-white/30',
}

const sizeClasses: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
}

export function Button({ variant = 'ghost', size = 'md', className, children, ...props }: ButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.97 }}
      className={cn(
        'rounded-full font-mono uppercase tracking-wide transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {children}
    </motion.button>
  )
}
