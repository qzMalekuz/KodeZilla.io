import { Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { timeRemaining } from '../../../lib/utils'
import type { Contest } from '../../../types'
import { Badge } from '../../ui/Badge'
import { Button } from '../../ui/Button'
import { Card } from '../../ui/Card'

interface ContestCardProps {
  contest: Contest
}

function contestDifficulty(problemCount: number): 'easy' | 'medium' | 'hard' {
  if (problemCount <= 3) {
    return 'easy'
  }
  if (problemCount <= 5) {
    return 'medium'
  }
  return 'hard'
}

export function ContestCard({ contest }: ContestCardProps) {
  return (
    <Card className="space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-mono text-xl font-bold text-white">{contest.title}</h3>
          <p className="mt-2 text-sm text-slate-300">{contest.description}</p>
        </div>
        <Badge label={contestDifficulty(contest.problems.length)} variant={contestDifficulty(contest.problems.length)} />
      </div>

      <div className="flex items-center justify-between text-sm text-slate-400">
        <span>{timeRemaining(contest.endTime)}</span>
        <span className="inline-flex items-center gap-2">
          <Users size={14} /> {contest.participantCount}
        </span>
      </div>

      <Link to={`/contest/${contest.id}`}>
        <Button className="w-full">Join</Button>
      </Link>
    </Card>
  )
}
