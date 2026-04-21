import type { Contest } from '../../../types'
import { ContestCard } from './ContestCard'

interface ContestListProps {
  contests: Contest[]
}

export function ContestList({ contests }: ContestListProps) {
  return (
    <section className="border border-neutral-900">
      <div className="grid md:grid-cols-2">
        {contests.map((contest, i) => (
          <div
            key={contest.id}
            className={[
              // right border on left-column items
              i % 2 === 0 ? 'md:border-r md:border-neutral-900' : '',
              // top border on all rows after the first
              i >= 2 ? 'border-t border-neutral-900' : '',
            ].join(' ')}
          >
            <ContestCard contest={contest} />
          </div>
        ))}
      </div>
    </section>
  )
}
