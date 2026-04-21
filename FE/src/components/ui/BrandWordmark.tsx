import { cn } from '../../lib/utils'

interface BrandWordmarkProps {
  className?: string
  animate?: boolean
  tone?: 'dark' | 'light'
}

export function BrandWordmark({ className, animate = false, tone = 'dark' }: BrandWordmarkProps) {
  const content = (
    <>
      <span className={cn('brand-wordmark font-brand text-[1em] tracking-[0.01em]', tone === 'light' ? 'text-white' : 'text-neutral-950')}>
        Kode
      </span>
      <span className="brand-wordmark font-brand text-[1em] tracking-[0.03em] text-accent">Zilla</span>
      <span className={cn('pb-[0.12em] font-mono text-[0.34em] uppercase tracking-[0.18em]', tone === 'light' ? 'text-neutral-400' : 'text-neutral-500')}>
        .io
      </span>
    </>
  )

  if (animate) {
    return (
      <span className={cn('typing-brand-shell', className)}>
        <span className="typing-brand-track">{content}</span>
        <span className="typing-brand-caret" aria-hidden="true" />
      </span>
    )
  }

  // Non-animated: show wordmark + persistent blinking caret
  return (
    <span className={cn('inline-flex items-end whitespace-nowrap leading-none', className)}>
      {content}
      <span className="typing-brand-caret" aria-hidden="true" />
    </span>
  )
}
