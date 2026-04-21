import { Users, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { timeRemaining } from '../../../lib/utils'
import type { Contest } from '../../../types'

interface ContestCardProps {
  contest: Contest
}

function difficultyFromCount(count: number): { label: string; classes: string } {
  if (count <= 2) return { label: 'Beginner',     classes: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' }
  if (count <= 4) return { label: 'Intermediate', classes: 'text-amber-400  border-amber-500/30  bg-amber-500/10'  }
  return              { label: 'Advanced',      classes: 'text-red-400    border-red-500/30    bg-red-500/10'    }
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
      className="editorial-card group relative flex flex-col overflow-hidden border border-neutral-900 bg-neutral-950 text-white transition-all duration-300 hover:-translate-y-[2px] hover:border-neutral-700 hover:shadow-2xl hover:shadow-black/50"
    >
      {/* Live top accent bar — matches landing page hero accent */}
      {status === 'live' && (
        <div className="absolute inset-x-0 top-0 h-[2px] bg-accent" />
      )}

      {/* Content */}
      <div className="flex flex-1 flex-col gap-0 p-0">

        {/* Label row — mirrors "Evidence Log / Developer / Creator" pattern */}
        <div className="flex items-center justify-between border-b border-neutral-900 px-8 py-4">
          {status === 'live' ? (
            <span className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.18em] text-accent">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
              Live Now
            </span>
          ) : status === 'upcoming' ? (
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-sky-400">Upcoming</span>
          ) : (
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-neutral-600">Ended</span>
          )}

          <span className={`rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] ${diff.classes}`}>
            {diff.label}
          </span>
        </div>

        {/* Title block — matches "Our Arena / Climb Ranked Boards" sizing */}
        <div className="border-b border-neutral-900 px-8 py-6">
          <h3 className="font-mono text-4xl font-semibold uppercase leading-none text-white transition-colors duration-200 group-hover:text-accent md:text-5xl">
            {contest.title}
          </h3>
          <p className="mt-4 text-base leading-8 text-stone-400 transition-colors duration-200 group-hover:text-stone-300">
            {contest.description}
          </p>
        </div>

        {/* Tags — same chip style as landing page stat labels */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 border-b border-neutral-900 px-8 py-4">
            {tags.map((tag) => (
              <span
                key={tag}
                className="font-mono text-xs uppercase tracking-[0.14em] text-neutral-500 transition-colors duration-200 group-hover:text-neutral-400"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Stats row */}
        <div className="flex items-center justify-between px-8 py-4 text-xs">
          <span className="font-mono uppercase tracking-[0.14em] text-neutral-600">
            {timeRemaining(contest.endTime)}
          </span>
          <span className="inline-flex items-center gap-1.5 font-mono uppercase tracking-[0.14em] text-neutral-600">
            <Users size={11} />
            {contest.participantCount.toLocaleString()}
          </span>
        </div>

        {/* CTA — mirrors the landing page "Start Competing" button style */}
        <div className={[
          'flex items-center justify-between px-8 py-4 font-mono text-xs uppercase tracking-[0.14em] transition-all duration-200',
          status === 'live'
            ? 'bg-accent/10 text-accent group-hover:bg-accent group-hover:text-white'
            : 'border-t border-neutral-900 text-neutral-500 group-hover:text-neutral-300',
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
