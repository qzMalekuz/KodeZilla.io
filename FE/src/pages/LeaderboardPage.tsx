import { PageWrapper } from '../components/layout/PageWrapper'

export function LeaderboardPage() {
  return (
    <PageWrapper>
      <section className="space-y-6">
        <div className="space-y-4 border-b border-neutral-900 pb-8">
          <p className="font-mono text-sm uppercase tracking-[0.18em] text-accent">Rankings</p>
          <h1 className="font-mono text-5xl font-semibold uppercase leading-none text-neutral-950 md:text-6xl">Global Leaderboard</h1>
          <p className="max-w-2xl text-lg text-neutral-600">Rankings across all active public contests.</p>
        </div>
        <div className="flex items-center justify-center py-24 text-neutral-400 font-mono text-sm uppercase tracking-widest">
          Global leaderboard coming soon
        </div>
      </section>
    </PageWrapper>
  )
}
