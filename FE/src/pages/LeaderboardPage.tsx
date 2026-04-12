import { LeaderboardTable } from '../components/features/leaderboard/LeaderboardTable'
import { PageWrapper } from '../components/layout/PageWrapper'
import { currentUser, leaderboard } from '../lib/mockData'

export function LeaderboardPage() {
  return (
    <PageWrapper>
      <section className="space-y-5">
        <h1 className="font-mono text-4xl font-bold text-white">Global Leaderboard</h1>
        <p className="text-slate-300">Rankings across all active public contests.</p>
        <LeaderboardTable entries={leaderboard} currentUsername={currentUser.username} />
      </section>
    </PageWrapper>
  )
}
