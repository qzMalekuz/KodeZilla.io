import { Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { timeRemaining } from '../../../lib/utils'
import type { Contest } from '../../../types'
import { Button } from '../../ui/Button'
import { Card } from '../../ui/Card'

interface ContestCardProps {
  contest: Contest
}

function difficultyFromCount(count: number): { label: string; color: string } {
  if (count <= 2) return { label: 'Beginner', color: 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10' }
  if (count <= 4) return { label: 'Intermediate', color: 'text-amber-400 border-amber-400/30 bg-amber-400/10' }
  return { label: 'Advanced', color: 'text-red-400 border-red-400/30 bg-red-400/10' }
}

function isLive(startTime: string, endTime: string): boolean {
  const now = Date.now()
  return now >= new Date(startTime).getTime() && now <= new Date(endTime).getTime()
}

function isUpcoming(startTime: string): boolean {
  return Date.now() < new Date(startTime).getTime()
}

export function ContestCard({ contest }: ContestCardProps) {
  const diff = difficultyFromCount(contest.problems.length)
  const live = isLive(contest.startTime, contest.endTime)
  const upcoming = isUpcoming(contest.startTime)
  const tags = contest.tags ?? []

  return (
    <Card className={[
      'relative flex flex-col gap-5 overflow-hidden border-0 bg-neutral-950 text-white shadow-2xl shadow-black/30',
      live ? 'ring-2 ring-accent/60' : '',
    ].join(' ')}>
      {/* Live glow strip */}
      {live && (
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-accent via-orange-300 to-accent" />
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-4">
        <div className="min-w-0">
          {/* Status badge */}
          <div className="mb-2 flex items-center gap-2">
            {live ? (
              <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-accent">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
                Live
              </span>
            ) : upcoming ? (
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-sky-400">Upcoming</span>
            ) : (
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-500">Ended</span>
            )}
          </div>

          <h3 className="truncate font-mono text-2xl font-semibold uppercase leading-tight text-white">
            {contest.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-stone-400">{contest.description}</p>
        </div>

        {/* Difficulty chip */}
        <span className={`shrink-0 rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] ${diff.color}`}>
          {diff.label}
        </span>
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-none border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-neutral-400"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="mt-auto space-y-3">
        <div className="flex items-center justify-between text-xs text-stone-500">
          <span className="font-mono">{timeRemaining(contest.endTime)}</span>
          <span className="inline-flex items-center gap-1.5">
            <Users size={12} />
            {contest.participantCount.toLocaleString()}
          </span>
        </div>

        <Link to={`/contest/${contest.id}`}>
          <Button
            className="w-full"
            variant={live ? 'solid' : 'ghost'}
          >
            {live ? 'Enter Contest' : upcoming ? 'View Details' : 'View Results'}
          </Button>
        </Link>
      </div>
    </Card>
  )
}
