import { FormEvent, useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../../hooks/useAuth'
import { api } from '../../../lib/api'
import type { AuthUser } from '../../../hooks/useAuth'
import { Button } from '../../ui/Button'
import { Card } from '../../ui/Card'
import { Input } from '../../ui/Input'

const ERROR_MESSAGES: Record<string, string> = {
  INVALID_CREDENTIALS: 'Invalid email or password.',
  INVALID_REQUEST: 'Please enter a valid email and password.',
}

export function LoginForm() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/explore'
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setLoading(true)

    const data = new FormData(event.currentTarget)
    const email = data.get('email') as string
    const password = data.get('password') as string

    try {
      const res = await api<{ data: { token: string; user: AuthUser } }>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })
      login(res.data.token, res.data.user)
      navigate(from, { replace: true })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'INTERNAL_SERVER_ERROR'
      setError(ERROR_MESSAGES[msg] ?? 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="border-neutral-900/20 p-8">
      <p className="mb-3 font-mono text-sm uppercase tracking-[0.18em] text-accent">Access</p>
      <h1 className="mb-5 font-mono text-4xl font-semibold uppercase leading-none text-neutral-950">Log In</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input name="email" label="Email" type="email" placeholder="you@example.com" required />
        <Input name="password" label="Password" type="password" placeholder="••••••••" required />
        {error && <p className="text-sm font-medium text-red-600">{error}</p>}
        <Button variant="solid" className="w-full" disabled={loading}>
          {loading ? 'Signing in…' : 'Continue'}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-neutral-500">
        Don't have an account?{' '}
        <Link to="/signup" className="font-semibold text-neutral-950 transition hover:text-accent">
          Sign up
        </Link>
      </p>
    </Card>
  )
}
