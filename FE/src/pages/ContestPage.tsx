import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { ContestHeader } from '../components/features/contest/ContestHeader'
import { ContestStats } from '../components/features/contest/ContestStats'
import { LeaderboardTable } from '../components/features/leaderboard/LeaderboardTable'
import { ProblemList } from '../components/features/problem/ProblemList'
import { PageWrapper } from '../components/layout/PageWrapper'
import { Button } from '../components/ui/Button'
import { useContest, useContestLeaderboard } from '../hooks/useContests'
import { useAuthStore } from '../store/authStore'
import type { LeaderboardEntry } from '../types'

export function ContestPage() {
  const { id } = useParams()
  const [activeTab, setActiveTab] = useState<'problems' | 'leaderboard'>('problems')
  const { user } = useAuthStore()

  const { data: contest, isLoading, isError } = useContest(id)
  const { data: leaderboardData = [] } = useContestLeaderboard(id)

  if (isLoading) {
    return (
      <PageWrapper>
        <p className="text-neutral-600">Loading contest…</p>
      </PageWrapper>
    )
  }

  if (isError || !contest) {
    return (
      <PageWrapper>
        <p className="text-neutral-600">Contest not found.</p>
      </PageWrapper>
    )
  }

  const start = new Date(contest.startTime)
  const end = new Date(contest.endTime)
  const durationMs = end.getTime() - start.getTime()
  const durationHrs = Math.floor(durationMs / 3_600_000)
  const durationMins = Math.floor((durationMs % 3_600_000) / 60_000)
  const durationStr = durationHrs > 0
    ? `${durationHrs}h ${durationMins > 0 ? `${durationMins}m` : ''}`.trim()
    : `${durationMins}m`

  const leaderboard: LeaderboardEntry[] = leaderboardData.map((entry) => ({
    rank: entry.rank,
    user: { id: String(entry.userId), username: entry.name, email: '', rating: 0, rank: entry.rank },
    score: entry.totalPoints,
    solvedCount: 0,
    lastSubmission: '',
  }))

  return (
    <PageWrapper>
      <ContestHeader contest={contest} />
      <ContestStats
        stats={[
          { label: 'Participants', value: String(leaderboard.length || '—') },
          { label: 'Problems', value: String(contest.problems.length) },
          { label: 'Duration', value: durationStr },
          { label: 'Public', value: contest.isPublic ? 'YES' : 'NO' },
        ]}
      />

      <div className="mt-8 flex gap-3">
        <Button variant={activeTab === 'problems' ? 'solid' : 'outline'} onClick={() => setActiveTab('problems')}>
          Problems
        </Button>
        <Button variant={activeTab === 'leaderboard' ? 'solid' : 'outline'} onClick={() => setActiveTab('leaderboard')}>
          Leaderboard
        </Button>
      </div>

      <section className="mt-6">
        {activeTab === 'problems' ? (
          <ProblemList problems={contest.problems} />
        ) : (
          <LeaderboardTable entries={leaderboard} currentUsername={user?.name} />
        )}
      </section>
    </PageWrapper>
  )
}
