import { useParams } from 'react-router-dom'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { PageWrapper } from '../components/layout/PageWrapper'
import { currentUser } from '../lib/mockData'

export function ProfilePage() {
  const { username } = useParams()

  return (
    <PageWrapper>
      <section className="space-y-6">
        <h1 className="font-mono text-4xl font-bold text-white">@{username}</h1>
        <div className="grid gap-5 md:grid-cols-2">
          <Card>
            <p className="text-sm text-slate-400">Current Rating</p>
            <p className="mt-2 font-mono text-4xl font-bold text-white">{currentUser.rating}</p>
            <p className="mt-2 text-slate-300">Global Rank #{currentUser.rank}</p>
          </Card>
          <Card>
            <p className="mb-3 text-sm text-slate-400">Top Skill Tags</p>
            <div className="flex flex-wrap gap-2">
              <Badge label="graphs" />
              <Badge label="dp" />
              <Badge label="binary-search" />
            </div>
          </Card>
        </div>
      </section>
    </PageWrapper>
  )
}
