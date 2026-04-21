import { useParams, Navigate } from 'react-router-dom'
import { Card } from '../components/ui/Card'
import { PageWrapper } from '../components/layout/PageWrapper'
import { useAuth } from '../hooks/useAuth'

export function ProfilePage() {
  const { username } = useParams()
  const { user } = useAuth()

  // If somehow no user in store, redirect to login
  if (!user) return <Navigate to="/login" replace />

  const initials = user.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const joinedDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  })

  return (
    <PageWrapper>
      <section className="space-y-8">
        {/* Header */}
        <div className="flex items-center gap-6 border-b border-neutral-900 pb-8">
          <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full bg-neutral-900 text-2xl font-bold text-white">
            {initials}
          </div>
          <div>
            <p className="font-mono text-sm uppercase tracking-[0.18em] text-accent">Profile</p>
            <h1 className="font-mono text-4xl font-semibold uppercase leading-tight text-neutral-950 md:text-5xl">
              {username}
            </h1>
            <p className="mt-1 text-sm text-neutral-500">Member since {joinedDate}</p>
          </div>
        </div>

        {/* Account details */}
        <div className="grid gap-5 md:grid-cols-3">
          <Card className="border-neutral-900/20">
            <p className="text-xs uppercase tracking-[0.16em] text-neutral-500">Full Name</p>
            <p className="mt-2 font-mono text-xl font-semibold text-neutral-950">{user.name}</p>
          </Card>

          <Card className="border-neutral-900/20">
            <p className="text-xs uppercase tracking-[0.16em] text-neutral-500">Email</p>
            <p className="mt-2 truncate font-mono text-xl font-semibold text-neutral-950">{user.email}</p>
          </Card>

          <Card className="border-neutral-900/20">
            <p className="text-xs uppercase tracking-[0.16em] text-neutral-500">Role</p>
            <p className="mt-2 font-mono text-xl font-semibold capitalize text-neutral-950">{user.role}</p>
          </Card>
        </div>

        {/* Stats */}
        <div>
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.18em] text-neutral-500">Activity</p>
          <div className="grid gap-5 md:grid-cols-4">
            <Card className="border-neutral-900/20">
              <p className="text-xs uppercase tracking-[0.16em] text-neutral-500">Contests Joined</p>
              <p className="mt-2 font-mono text-4xl font-semibold text-neutral-950">0</p>
            </Card>
            <Card className="border-neutral-900/20">
              <p className="text-xs uppercase tracking-[0.16em] text-neutral-500">Problems Solved</p>
              <p className="mt-2 font-mono text-4xl font-semibold text-neutral-950">0</p>
            </Card>
            <Card className="border-neutral-900/20">
              <p className="text-xs uppercase tracking-[0.16em] text-neutral-500">Contests Hosted</p>
              <p className="mt-2 font-mono text-4xl font-semibold text-neutral-950">0</p>
            </Card>
            <Card className="border-neutral-900/20">
              <p className="text-xs uppercase tracking-[0.16em] text-neutral-500">Submissions</p>
              <p className="mt-2 font-mono text-4xl font-semibold text-neutral-950">0</p>
            </Card>
          </div>
        </div>

        {/* Account settings hint */}
        <Card className="border-neutral-900/20 bg-neutral-950 text-white">
          <p className="text-xs uppercase tracking-[0.16em] text-neutral-400">Account ID</p>
          <p className="mt-2 truncate font-mono text-sm text-neutral-300">{user.id}</p>
        </Card>
      </section>
    </PageWrapper>
  )
}
