import type { PropsWithChildren } from 'react'
import { Button } from './Button'

interface ModalProps extends PropsWithChildren {
  title: string
  open: boolean
  onClose: () => void
}

export function Modal({ title, open, onClose, children }: ModalProps) {
  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-neutral-950/55 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-xl border border-neutral-900 bg-stone-50 p-6 shadow-2xl shadow-black/20" onClick={(event) => event.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-mono text-2xl uppercase tracking-[0.08em] text-neutral-950">{title}</h3>
          <Button size="sm" variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
        {children}
      </div>
    </div>
  )
}
