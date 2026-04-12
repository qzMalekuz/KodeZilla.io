import { cn } from '../../lib/utils'

type BadgeVariant = 'easy' | 'medium' | 'hard' | 'default'

interface BadgeProps {
  label: string
  variant?: BadgeVariant
}

const styles: Record<BadgeVariant, string> = {
  easy: 'bg-emerald-500/15 text-emerald-300',
  medium: 'bg-amber-500/15 text-amber-300',
  hard: 'bg-red-500/15 text-red-300',
  default: 'bg-white/10 text-slate-200',
}

export function Badge({ label, variant = 'default' }: BadgeProps) {
  return (
    <span className={cn('inline-flex rounded-full px-2.5 py-1 text-xs font-mono uppercase', styles[variant])}>
      {label}
    </span>
  )
}
