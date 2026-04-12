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
        <div className="space-y-3 border-b border-neutral-900 pb-6">
          <p className="font-mono text-sm uppercase tracking-[0.18em] text-accent">Profile</p>
          <h1 className="font-mono text-5xl font-semibold uppercase leading-none text-neutral-950 md:text-6xl">@{username}</h1>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <Card className="border-neutral-900/20">
            <p className="text-sm uppercase tracking-[0.16em] text-neutral-500">Current Rating</p>
            <p className="mt-2 font-mono text-5xl font-semibold text-neutral-950">{currentUser.rating}</p>
            <p className="mt-2 text-neutral-600">Global Rank #{currentUser.rank}</p>
          </Card>
          <Card className="border-neutral-900/20">
            <p className="mb-3 text-sm uppercase tracking-[0.16em] text-neutral-500">Top Skill Tags</p>
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
