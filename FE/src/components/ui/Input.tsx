import type { InputHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
}

export function Input({ label, className, id, ...props }: InputProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-')
  return (
    <label className="flex flex-col gap-2 text-sm font-medium text-neutral-500" htmlFor={inputId}>
      {label}
      <input
        id={inputId}
        className={cn(
          'w-full border border-neutral-900/15 bg-white px-4 py-3 text-neutral-950 outline-none ring-accent/35 transition placeholder:text-neutral-400 focus:border-accent focus:ring-2',
          className,
        )}
        {...props}
      />
    </label>
  )
}
