import type { LeaderboardEntry } from '../../../types'
import { cn, formatDate } from '../../../lib/utils'

interface LeaderboardRowProps {
  entry: LeaderboardEntry
  highlight?: boolean
}

export function LeaderboardRow({ entry, highlight = false }: LeaderboardRowProps) {
  return (
    <tr
      className={cn(
        'border-b border-neutral-900/10 text-sm text-neutral-700 odd:bg-neutral-50',
        highlight && 'border-l-4 border-accent bg-accent/5',
      )}
    >
      <td className="px-4 py-4 font-mono text-neutral-900">#{entry.rank}</td>
      <td className="px-4 py-4 font-semibold text-neutral-900">{entry.user.username}</td>
      <td className="px-4 py-4 font-mono text-neutral-900">{entry.score}</td>
      <td className="px-4 py-4">{entry.solvedCount}</td>
      <td className="px-4 py-4 text-neutral-500">{formatDate(entry.lastSubmission)}</td>
    </tr>
  )
}
