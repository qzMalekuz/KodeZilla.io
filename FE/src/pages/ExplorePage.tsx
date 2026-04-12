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
        <div className="space-y-3">
          <h1 className="font-mono text-4xl font-bold text-white">Explore Contests</h1>
          <p className="text-slate-300">Join active and upcoming coding rounds.</p>
        </div>
        <div className="max-w-md">
          <Input label="Search contests" value={query} onChange={(event) => setQuery(event.target.value)} />
        </div>
        {isLoading ? <p className="text-slate-400">Loading contests...</p> : <ContestList contests={filtered} />}
      </section>
    </PageWrapper>
  )
}
