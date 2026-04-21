import { useMemo, useState } from 'react'
import { ContestList } from '../components/features/contest/ContestList'
import { Input } from '../components/ui/Input'
import { useContests } from '../hooks/useContests'
import { PageWrapper } from '../components/layout/PageWrapper'

const GENRES = [
  'All',
  'graphs',
  'dynamic-programming',
  'binary-search',
  'strings',
  'data-structures',
  'math',
  'greedy',
  'implementation',
]

export function ExplorePage() {
  const { publicContests, isLoading } = useContests()
  const [query, setQuery] = useState('')
  const [activeGenre, setActiveGenre] = useState('All')

  const filtered = useMemo(() => {
    return publicContests.filter((contest) => {
      const matchesQuery = contest.title.toLowerCase().includes(query.toLowerCase()) ||
        contest.description.toLowerCase().includes(query.toLowerCase())
      const matchesGenre = activeGenre === 'All' || (contest.tags ?? []).includes(activeGenre)
      return matchesQuery && matchesGenre
    })
  }, [publicContests, query, activeGenre])

  return (
    <PageWrapper>
      <section className="space-y-8">
        <div className="space-y-3 border-b border-neutral-900 pb-6">
          <p className="font-mono text-sm uppercase tracking-[0.18em] text-accent">Contest Index</p>
          <h1 className="font-mono text-5xl font-semibold uppercase leading-none text-neutral-950 md:text-6xl">
            Explore Contests
          </h1>
          <p className="max-w-2xl text-lg text-neutral-600">Join active and upcoming coding rounds.</p>
        </div>

        {/* Search + Filter row */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end">
          <div className="w-full md:max-w-sm">
            <Input
              label="Search contests"
              placeholder="Night Sprint, Graph Masters..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-neutral-500">Filter by genre</p>
            <div className="flex flex-wrap gap-2">
              {GENRES.map((genre) => (
                <button
                  key={genre}
                  onClick={() => setActiveGenre(genre)}
                  className={[
                    'rounded-none border px-3 py-1.5 font-mono text-xs uppercase tracking-[0.1em] transition',
                    activeGenre === genre
                      ? 'border-neutral-900 bg-neutral-900 text-white'
                      : 'border-neutral-300 bg-white text-neutral-600 hover:border-neutral-900 hover:text-neutral-900',
                  ].join(' ')}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results count */}
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-neutral-400">
          {filtered.length} contest{filtered.length !== 1 ? 's' : ''} found
        </p>

        {isLoading ? (
          <p className="text-neutral-500">Loading contests...</p>
        ) : filtered.length === 0 ? (
          <p className="text-neutral-500">No contests match your filters.</p>
        ) : (
          <ContestList contests={filtered} />
        )}
      </section>
    </PageWrapper>
  )
}
