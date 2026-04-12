import { cn } from '../../lib/utils'

type BadgeVariant = 'easy' | 'medium' | 'hard' | 'default'

interface BadgeProps {
  label: string
  variant?: BadgeVariant
}

const styles: Record<BadgeVariant, string> = {
  easy: 'bg-emerald-100 text-emerald-600',
  medium: 'bg-amber-100 text-amber-700',
  hard: 'bg-red-100 text-red-700',
  default: 'bg-neutral-100 text-neutral-700',
}

export function Badge({ label, variant = 'default' }: BadgeProps) {
  return (
    <span className={cn('inline-flex rounded-full px-2.5 py-1 text-xs font-mono uppercase tracking-[0.12em]', styles[variant])}>
      {label}
    </span>
  )
}
