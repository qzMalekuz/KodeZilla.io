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
    <Card className="space-y-6 bg-neutral-950 text-white shadow-2xl shadow-black/20">
      <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-5">
        <div>
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.16em] text-accent">Live Arena</p>
          <h3 className="font-mono text-3xl font-semibold uppercase leading-none text-white">{contest.title}</h3>
          <p className="mt-3 max-w-md text-sm leading-7 text-stone-300">{contest.description}</p>
        </div>
        <Badge label={contestDifficulty(contest.problems.length)} variant={contestDifficulty(contest.problems.length)} />
      </div>

      <div className="flex items-center justify-between text-sm text-stone-400">
        <span>{timeRemaining(contest.endTime)}</span>
        <span className="inline-flex items-center gap-2">
          <Users size={14} /> {contest.participantCount}
        </span>
      </div>

      <Link to={`/contest/${contest.id}`}>
        <Button className="w-full" variant="solid">
          Enter Contest
        </Button>
      </Link>
    </Card>
  )
}
