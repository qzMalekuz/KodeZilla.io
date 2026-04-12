import { LeaderboardTable } from '../components/features/leaderboard/LeaderboardTable'
import { PageWrapper } from '../components/layout/PageWrapper'
import { currentUser, leaderboard } from '../lib/mockData'

export function LeaderboardPage() {
  return (
    <PageWrapper>
      <section className="space-y-6">
        <div className="space-y-3 border-b border-neutral-900 pb-6">
          <p className="font-mono text-sm uppercase tracking-[0.18em] text-accent">Rankings</p>
          <h1 className="font-mono text-5xl font-semibold uppercase leading-none text-neutral-950 md:text-6xl">Global Leaderboard</h1>
          <p className="max-w-2xl text-lg text-neutral-600">Rankings across all active public contests.</p>
        </div>
        <LeaderboardTable entries={leaderboard} currentUsername={currentUser.username} />
      </section>
    </PageWrapper>
  )
}
