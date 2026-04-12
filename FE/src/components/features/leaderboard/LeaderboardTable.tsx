import type { LeaderboardEntry } from '../../../types'
import { LeaderboardRow } from './LeaderboardRow'

interface LeaderboardTableProps {
  entries: LeaderboardEntry[]
  currentUsername?: string
}

export function LeaderboardTable({ entries, currentUsername }: LeaderboardTableProps) {
  return (
    <div className="overflow-x-auto border border-neutral-900 bg-white shadow-xl shadow-black/5">
      <table className="min-w-[760px] w-full border-collapse">
        <thead className="bg-neutral-950 text-left text-xs uppercase tracking-[0.18em] text-neutral-400">
          <tr>
            <th className="px-4 py-4">Rank</th>
            <th className="px-4 py-4">User</th>
            <th className="px-4 py-4">Score</th>
            <th className="px-4 py-4">Solved</th>
            <th className="px-4 py-4">Last Submission</th>
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
