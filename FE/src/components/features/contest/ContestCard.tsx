import { Users, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { timeRemaining } from '../../../lib/utils'
import type { Contest } from '../../../types'

interface ContestCardProps {
  contest: Contest
}

function difficultyFromCount(count: number): { label: string; bg: string; text: string; dot: string } {
  if (count <= 2) return { label: 'Beginner',     bg: 'bg-emerald-500', text: 'text-emerald-700', dot: 'bg-emerald-500' }
  if (count <= 4) return { label: 'Intermediate', bg: 'bg-amber-400',   text: 'text-amber-700',   dot: 'bg-amber-400'   }
  return              { label: 'Advanced',      bg: 'bg-red-500',     text: 'text-red-700',     dot: 'bg-red-500'     }
}

function getStatus(startTime: string, endTime: string): 'live' | 'upcoming' | 'ended' {
  const now = Date.now()
  if (now < new Date(startTime).getTime()) return 'upcoming'
  if (now <= new Date(endTime).getTime()) return 'live'
  return 'ended'
}

export function ContestCard({ contest }: ContestCardProps) {
  const diff   = difficultyFromCount(contest.problems.length)
  const status = getStatus(contest.startTime, contest.endTime)
  const tags   = contest.tags ?? []

  return (
    <Link
      to={`/contest/${contest.id}`}
      className="editorial-card group relative flex flex-col overflow-hidden border border-neutral-900 bg-white transition-all duration-300 hover:border-black hover:shadow-xl hover:shadow-black/20"
    >
      {/* Live accent bar */}
      {status === 'live' && (
        <div className="absolute inset-x-0 top-0 h-[3px] bg-accent" />
      )}

      <div className="flex flex-1 flex-col p-8 pt-6">

        {/* Top row: status + difficulty badge */}
        <div className="mb-6 flex items-center justify-between">
          {/* Status label */}
          {status === 'live' ? (
            <span className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.18em] text-accent">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
              Live Now
            </span>
          ) : status === 'upcoming' ? (
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-sky-500">Upcoming</span>
          ) : (
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-neutral-400">Ended</span>
          )}

          {/* Difficulty — solid pill with dot */}
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] ${diff.text} bg-opacity-10 rounded-sm`}
            style={{ background: `color-mix(in srgb, currentColor 12%, transparent)` }}>
            <span className={`h-1.5 w-1.5 rounded-full ${diff.bg}`} />
            {diff.label}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-mono text-3xl font-semibold uppercase leading-tight text-neutral-950 transition-colors duration-200 group-hover:text-accent md:text-4xl">
          {contest.title}
        </h3>

        {/* Description */}
        <p className="mt-3 text-sm leading-7 text-neutral-500 transition-colors duration-200 group-hover:text-neutral-700">
          {contest.description}
        </p>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-x-3 gap-y-1">
            {tags.map((tag) => (
              <span
                key={tag}
                className="font-mono text-[11px] uppercase tracking-[0.12em] text-neutral-400"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Footer: time + participants */}
        <div className="mt-6 flex items-center justify-between border-t border-neutral-100 pt-4 text-xs">
          <span className="font-mono uppercase tracking-[0.12em] text-neutral-400">
            {timeRemaining(contest.endTime)}
          </span>
          <span className="inline-flex items-center gap-1.5 font-mono tracking-[0.12em] text-neutral-400">
            <Users size={11} />
            {contest.participantCount.toLocaleString()}
          </span>
        </div>

        {/* CTA */}
        <div className={[
          'mt-4 flex items-center justify-between py-2.5 font-mono text-xs uppercase tracking-[0.14em] transition-all duration-200',
          status === 'live'
            ? 'text-accent group-hover:text-accent'
            : 'text-neutral-400 group-hover:text-neutral-950',
        ].join(' ')}>
          <span>
            {status === 'live' ? 'Enter Contest' : status === 'upcoming' ? 'View Details' : 'View Results'}
          </span>
          <ArrowRight size={13} className="transition-transform duration-200 group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  )
}
