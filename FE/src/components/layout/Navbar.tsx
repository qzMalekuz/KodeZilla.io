import { Link } from 'react-router-dom'
import { Button } from '../ui/Button'

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-neutral-900 bg-stone-50/95 backdrop-blur-sm">
      <nav className="mx-auto flex w-full max-w-[1400px] items-center justify-between px-4 py-4 md:px-6">
        <Link to="/" className="flex items-end gap-1 leading-none text-neutral-950">
          <span className="brand-wordmark font-brand text-[2.55rem] leading-none tracking-[0.01em]">Kode</span>
          <span className="brand-wordmark font-brand text-[2.55rem] leading-none tracking-[0.03em] text-accent">Zilla</span>
          <span className="pb-1 font-mono text-base uppercase tracking-[0.18em] text-neutral-500">.io</span>
        </Link>
        <div className="hidden items-center gap-10 border-x border-neutral-900 px-10 py-2 md:flex">
          <Link to="/explore" className="font-mono text-sm uppercase tracking-[0.12em] text-neutral-900 transition hover:text-accent">
            Explore
          </Link>
          <Link to="/leaderboard" className="font-mono text-sm uppercase tracking-[0.12em] text-neutral-900 transition hover:text-accent">
            Rankings
          </Link>
          <Link to="/host" className="font-mono text-sm uppercase tracking-[0.12em] text-neutral-900 transition hover:text-accent">
            Host
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm font-semibold text-neutral-700 transition hover:text-neutral-950">
            Log in
          </Link>
          <Link to="/signup">
            <Button size="sm" variant="solid">
              Start Round
            </Button>
          </Link>
        </div>
      </nav>
    </header>
  )
}
