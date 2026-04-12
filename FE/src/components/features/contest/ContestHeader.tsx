import type { Contest } from '../../../types'
import { formatDate } from '../../../lib/utils'

interface ContestHeaderProps {
  contest: Contest
}

export function ContestHeader({ contest }: ContestHeaderProps) {
  return (
    <header className="mb-8 space-y-3">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-slate-400">Contest</p>
      <h1 className="font-mono text-3xl font-bold tracking-tight text-white md:text-4xl">{contest.title}</h1>
      <p className="max-w-3xl text-slate-300">{contest.description}</p>
      <p className="text-sm text-slate-400">Starts {formatDate(contest.startTime)}</p>
    </header>
  )
}
