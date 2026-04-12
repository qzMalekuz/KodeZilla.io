import type { PropsWithChildren } from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { cn } from '../../lib/utils'

type Variant = 'ghost' | 'solid' | 'outline'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends PropsWithChildren, Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: Variant
  size?: Size
}

const variantClasses: Record<Variant, string> = {
  ghost: 'border border-accent bg-transparent text-accent hover:bg-accent hover:text-white',
  solid: 'border border-accent bg-accent text-white hover:bg-orange-500',
  outline: 'border border-neutral-900/15 bg-white text-neutral-900 hover:border-neutral-900 hover:bg-neutral-50',
}

const sizeClasses: Record<Size, string> = {
  sm: 'px-3 py-2 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base',
}

export function Button({ variant = 'ghost', size = 'md', className, children, ...props }: ButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.97 }}
      className={cn(
        'font-mono uppercase tracking-[0.14em] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
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
