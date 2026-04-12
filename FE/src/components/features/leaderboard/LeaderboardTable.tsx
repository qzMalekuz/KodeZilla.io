import type { LeaderboardEntry } from '../../../types'
import { LeaderboardRow } from './LeaderboardRow'

interface LeaderboardTableProps {
  entries: LeaderboardEntry[]
  currentUsername?: string
}

export function LeaderboardTable({ entries, currentUsername }: LeaderboardTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-black/35">
      <table className="min-w-full border-collapse">
        <thead className="bg-white/[0.03] text-left text-xs uppercase tracking-[0.15em] text-slate-400">
          <tr>
            <th className="px-4 py-3">Rank</th>
            <th className="px-4 py-3">User</th>
            <th className="px-4 py-3">Score</th>
            <th className="px-4 py-3">Solved</th>
            <th className="px-4 py-3">Last Submission</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <LeaderboardRow key={entry.user.id} entry={entry} highlight={entry.user.username === currentUsername} />
          ))}
        </tbody>
      </table>
    </div>
  )
}
