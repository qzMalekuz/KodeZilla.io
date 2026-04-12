import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ContestHeader } from '../components/features/contest/ContestHeader'
import { ContestStats } from '../components/features/contest/ContestStats'
import { LeaderboardTable } from '../components/features/leaderboard/LeaderboardTable'
import { ProblemList } from '../components/features/problem/ProblemList'
import { PageWrapper } from '../components/layout/PageWrapper'
import { Button } from '../components/ui/Button'
import { currentUser, leaderboard } from '../lib/mockData'
import { useContests } from '../hooks/useContests'

export function ContestPage() {
  const { id } = useParams()
  const [activeTab, setActiveTab] = useState<'problems' | 'leaderboard'>('problems')
  const { data = [] } = useContests()

  const contest = useMemo(() => data.find((item) => item.id === id), [data, id])

  if (!contest) {
    return (
      <PageWrapper>
        <p className="text-neutral-600">Contest not found.</p>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      <ContestHeader contest={contest} />
      <ContestStats
        stats={[
          { label: 'Participants', value: contest.participantCount.toString() },
          { label: 'Problems', value: contest.problems.length.toString() },
          { label: 'Duration', value: '2h 30m' },
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
          <LeaderboardTable entries={leaderboard} currentUsername={currentUser.username} />
        )}
      </section>
    </PageWrapper>
  )
}
