import type { Contest } from '../../../types'
import { ContestCard } from './ContestCard'

interface ContestListProps {
  contests: Contest[]
}

export function ContestList({ contests }: ContestListProps) {
  return (
    <section className="grid gap-5 md:grid-cols-2">
      {contests.map((contest) => (
        <ContestCard key={contest.id} contest={contest} />
      ))}
    </section>
  )
}
