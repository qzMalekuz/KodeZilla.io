import { useMemo, useState } from 'react'
import { ContestList } from '../components/features/contest/ContestList'
import { Input } from '../components/ui/Input'
import { useContests } from '../hooks/useContests'
import { PageWrapper } from '../components/layout/PageWrapper'

export function ExplorePage() {
  const { publicContests, isLoading } = useContests()
  const [query, setQuery] = useState('')

  const filtered = useMemo(
    () => publicContests.filter((contest) => contest.title.toLowerCase().includes(query.toLowerCase())),
    [publicContests, query],
  )

  return (
    <PageWrapper>
      <section className="space-y-8">
        <div className="space-y-3 border-b border-neutral-900 pb-6">
          <p className="font-mono text-sm uppercase tracking-[0.18em] text-accent">Contest Index</p>
          <h1 className="font-mono text-5xl font-semibold uppercase leading-none text-neutral-950 md:text-6xl">Explore Contests</h1>
          <p className="max-w-2xl text-lg text-neutral-600">Join active and upcoming coding rounds.</p>
        </div>
        <div className="max-w-md">
          <Input
            label="Search contests"
            placeholder="Night Sprint, Graph Masters..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        {isLoading ? <p className="text-neutral-500">Loading contests...</p> : <ContestList contests={filtered} />}
      </section>
    </PageWrapper>
  )
}
