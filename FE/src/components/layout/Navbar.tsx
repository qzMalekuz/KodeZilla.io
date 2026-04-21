import { useLocation, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { BrandWordmark } from '../ui/BrandWordmark'
import { Button } from '../ui/Button'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/explore', label: 'Explore' },
  { to: '/leaderboard', label: 'Rankings' },
  { to: '/host', label: 'Host' },
]

export function Navbar() {
  const location = useLocation()
  const { isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-900 bg-stone-50/95 backdrop-blur-sm">
      <nav className="mx-auto grid w-full max-w-[1280px] grid-cols-[1fr_auto_1fr] items-center px-4 py-4 md:px-0">
        {/* Left: logo */}
        <Link to="/" className="leading-none text-neutral-950">
          <BrandWordmark className="text-[2.55rem]" animate={location.pathname === '/'} />
        </Link>

        {/* Centre: nav links — only shown when authenticated */}
        {isAuthenticated ? (
          <div className="hidden items-center gap-10 border-x border-neutral-900 px-10 py-2 md:flex">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="font-mono text-sm uppercase tracking-[0.12em] text-neutral-900 transition hover:text-accent"
              >
                {label}
              </Link>
            ))}
          </div>
        ) : (
          /* Placeholder to keep the grid centred */
          <div />
        )}

        {/* Right: auth actions */}
        <div className="flex items-center justify-end gap-3">
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="text-sm font-semibold text-neutral-700 transition hover:text-neutral-950"
            >
              Log out
            </button>
          ) : (
            <>
              <Link to="/login" className="text-sm font-semibold text-neutral-700 transition hover:text-neutral-950">
                Log in
              </Link>
              <Link to="/signup">
                <Button size="sm" variant="solid">
                  Sign up
                </Button>
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}
