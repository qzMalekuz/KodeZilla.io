import { Link } from 'react-router-dom'
import { Button } from '../ui/Button'

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-black/70 backdrop-blur-sm">
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="font-mono text-lg font-bold tracking-tight text-white">
          CONTEST.PLATFORM
        </Link>
        <Link to="/explore" className="font-mono text-sm uppercase text-slate-300 transition hover:text-white">
          Explore
        </Link>
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm text-slate-300 transition hover:text-white">
            Log in
          </Link>
          <Link to="/signup">
            <Button size="sm" variant="ghost">
              Sign up
            </Button>
          </Link>
        </div>
      </nav>
    </header>
  )
}
