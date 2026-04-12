import { Link, useParams } from 'react-router-dom'
import type { Problem } from '../../../types'
import { Badge } from '../../ui/Badge'
import { Card } from '../../ui/Card'

interface ProblemCardProps {
  problem: Problem
}

export function ProblemCard({ problem }: ProblemCardProps) {
  const { id } = useParams()

  return (
    <Link to={`/contest/${id}/problem/${problem.id}`}>
      <Card className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-mono text-lg font-bold text-white">{problem.title}</h3>
          <Badge label={problem.difficulty} variant={problem.difficulty} />
        </div>
        <div className="flex items-center justify-between text-sm text-slate-400">
          <span>{problem.tags.join(' · ')}</span>
          <span className="font-mono text-white">{problem.points} pts</span>
        </div>
      </Card>
    </Link>
  )
}
