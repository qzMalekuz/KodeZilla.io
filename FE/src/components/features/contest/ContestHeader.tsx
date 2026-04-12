import type { Contest } from '../../../types'
import { formatDate } from '../../../lib/utils'

interface ContestHeaderProps {
  contest: Contest
}

export function ContestHeader({ contest }: ContestHeaderProps) {
  return (
    <header className="mb-8 space-y-3 border-b border-neutral-900 pb-6">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">Contest</p>
      <h1 className="font-mono text-4xl font-semibold uppercase tracking-tight text-neutral-950 md:text-6xl">{contest.title}</h1>
      <p className="max-w-3xl text-lg leading-8 text-neutral-600">{contest.description}</p>
      <p className="text-sm text-neutral-500">Starts {formatDate(contest.startTime)}</p>
    </header>
  )
}
