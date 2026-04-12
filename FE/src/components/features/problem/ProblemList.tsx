import type { Problem } from '../../../types'
import { ProblemCard } from './ProblemCard'

interface ProblemListProps {
  problems: Problem[]
}

export function ProblemList({ problems }: ProblemListProps) {
  return (
    <div className="space-y-4">
      {problems.map((problem) => (
        <ProblemCard key={problem.id} problem={problem} />
      ))}
    </div>
  )
}
