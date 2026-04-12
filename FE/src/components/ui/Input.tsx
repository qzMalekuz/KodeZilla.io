import type { InputHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
}

export function Input({ label, className, id, ...props }: InputProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-')
  return (
    <label className="flex flex-col gap-2 text-sm text-slate-300" htmlFor={inputId}>
      {label}
      <input
        id={inputId}
        className={cn(
          'rounded-xl border border-border bg-black/40 px-4 py-2 text-slate-100 outline-none ring-accent/60 transition focus:ring-2',
          className,
        )}
        {...props}
      />
    </label>
  )
}
