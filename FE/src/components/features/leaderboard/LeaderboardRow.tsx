import type { LeaderboardEntry } from '../../../types'
import { cn, formatDate } from '../../../lib/utils'

interface LeaderboardRowProps {
  entry: LeaderboardEntry
  highlight?: boolean
}

export function LeaderboardRow({ entry, highlight = false }: LeaderboardRowProps) {
  return (
    <tr className={cn('border-b border-border/80 text-sm text-slate-200 odd:bg-white/[0.02]', highlight && 'border-l-2 border-l-accent')}>
      <td className="px-4 py-3 font-mono">#{entry.rank}</td>
      <td className="px-4 py-3">{entry.user.username}</td>
      <td className="px-4 py-3 font-mono">{entry.score}</td>
      <td className="px-4 py-3">{entry.solvedCount}</td>
      <td className="px-4 py-3 text-slate-400">{formatDate(entry.lastSubmission)}</td>
    </tr>
  )
}
