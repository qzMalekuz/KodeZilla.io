import { Users, Clock, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { timeRemaining } from '../../../lib/utils'
import type { Contest } from '../../../types'

interface ContestCardProps {
  contest: Contest
}

function difficultyFromCount(count: number): { label: string; classes: string } {
  if (count <= 2) return { label: 'Beginner', classes: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' }
  if (count <= 4) return { label: 'Intermediate', classes: 'text-amber-400 border-amber-500/30 bg-amber-500/10' }
  return { label: 'Advanced', classes: 'text-red-400 border-red-500/30 bg-red-500/10' }
}

function getStatus(startTime: string, endTime: string): 'live' | 'upcoming' | 'ended' {
  const now = Date.now()
  if (now < new Date(startTime).getTime()) return 'upcoming'
  if (now <= new Date(endTime).getTime()) return 'live'
  return 'ended'
}

export function ContestCard({ contest }: ContestCardProps) {
  const diff = difficultyFromCount(contest.problems.length)
  const status = getStatus(contest.startTime, contest.endTime)
  const tags = contest.tags ?? []

  return (
    <Link
      to={`/contest/${contest.id}`}
      className="group relative flex flex-col gap-5 overflow-hidden border border-white/5 bg-neutral-950 p-6 text-white shadow-2xl shadow-black/40 transition-all duration-300 hover:-translate-y-1 hover:border-white/15 hover:shadow-black/60"
    >
      {/* Live accent bar */}
      {status === 'live' && (
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent" />
      )}

      {/* Hover radial glow */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: 'radial-gradient(ellipse at top left, rgba(255,106,0,0.07) 0%, transparent 60%)' }}
      />

      {/* Top row: status + difficulty */}
      <div className="flex items-center justify-between">
        {status === 'live' ? (
          <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
            Live Now
          </span>
        ) : status === 'upcoming' ? (
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-sky-400">Upcoming</span>
        ) : (
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-600">Ended</span>
        )}

        <span className={`rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] ${diff.classes}`}>
          {diff.label}
        </span>
      </div>

      {/* Title */}
      <div className="border-b border-white/10 pb-4">
        <h3 className="font-mono text-[1.4rem] font-semibold uppercase leading-tight text-white transition-colors duration-200 group-hover:text-accent">
          {contest.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-neutral-400 transition-colors duration-200 group-hover:text-neutral-300">
          {contest.description}
        </p>
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.08em] text-neutral-500 transition-colors duration-200 group-hover:border-white/20 group-hover:text-neutral-400"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="mt-auto flex items-center justify-between text-xs">
        <span className="inline-flex items-center gap-1.5 font-mono text-neutral-500">
          <Clock size={11} />
          {timeRemaining(contest.endTime)}
        </span>
        <span className="inline-flex items-center gap-1.5 font-mono text-neutral-500">
          <Users size={11} />
          {contest.participantCount.toLocaleString()}
        </span>
      </div>

      {/* CTA row */}
      <div className={[
        'flex items-center justify-between border px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] transition-all duration-200',
        status === 'live'
          ? 'border-accent bg-accent/10 text-accent group-hover:bg-accent group-hover:text-white'
          : status === 'upcoming'
            ? 'border-white/10 bg-white/5 text-neutral-400 group-hover:border-white/20 group-hover:text-white'
            : 'border-white/5 bg-transparent text-neutral-600 group-hover:text-neutral-400',
      ].join(' ')}>
        <span className="font-mono">
          {status === 'live' ? 'Enter Contest' : status === 'upcoming' ? 'View Details' : 'View Results'}
        </span>
        <ArrowRight size={13} className="transition-transform duration-200 group-hover:translate-x-1" />
      </div>
    </Link>
  )
}
