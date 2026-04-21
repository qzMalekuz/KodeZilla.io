import { useMemo, useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'
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
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const filtered = useMemo(() => {
    return publicContests.filter((contest) => {
      const matchesQuery =
        contest.title.toLowerCase().includes(query.toLowerCase()) ||
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
        <div className="flex flex-col gap-3 md:flex-row md:items-end">
          {/* Search */}
          <div className="w-full md:max-w-sm">
            <Input
              label="Search contests"
              placeholder="Night Sprint, Graph Masters..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          {/* Genre dropdown */}
          <div className="flex flex-col gap-2" ref={dropdownRef}>
            <p className="text-sm font-medium text-neutral-500">Filter by genre</p>
            <div className="relative">
              <button
                onClick={() => setDropdownOpen((v) => !v)}
                className="flex min-w-[180px] items-center justify-between gap-3 border border-neutral-900 bg-white px-4 py-3 text-sm font-medium text-neutral-900 transition hover:bg-neutral-50"
              >
                <span className="font-mono uppercase tracking-[0.1em]">
                  {activeGenre === 'All' ? 'All Genres' : activeGenre}
                </span>
                <ChevronDown
                  size={15}
                  className={`shrink-0 text-neutral-500 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {dropdownOpen && (
                <div className="absolute left-0 top-full z-30 mt-1 w-full min-w-[220px] border border-neutral-900 bg-white shadow-xl">
                  {GENRES.map((genre) => (
                    <button
                      key={genre}
                      onClick={() => { setActiveGenre(genre); setDropdownOpen(false) }}
                      className={[
                        'flex w-full items-center justify-between px-4 py-2.5 text-left transition',
                        activeGenre === genre
                          ? 'bg-neutral-950 text-white'
                          : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-950',
                      ].join(' ')}
                    >
                      <span className="font-mono text-xs uppercase tracking-[0.1em]">
                        {genre === 'All' ? 'All Genres' : genre}
                      </span>
                      {activeGenre === genre && <Check size={13} />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Results count */}
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-neutral-400">
          {filtered.length} contest{filtered.length !== 1 ? 's' : ''} found
          {activeGenre !== 'All' && (
            <button
              onClick={() => setActiveGenre('All')}
              className="ml-3 text-accent underline underline-offset-2 hover:opacity-70"
            >
              clear filter
            </button>
          )}
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
