import { FormEvent, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api } from '../../../lib/api'
import { Button } from '../../ui/Button'
import { Card } from '../../ui/Card'
import { Input } from '../../ui/Input'

const ERROR_MESSAGES: Record<string, string> = {
  EMAIL_ALREADY_EXISTS: 'An account with this email already exists.',
  INVALID_REQUEST: 'Please fill in all fields correctly.',
}

export function SignupForm() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setLoading(true)

    const data = new FormData(event.currentTarget)
    const name = data.get('name') as string
    const email = data.get('email') as string
    const password = data.get('password') as string

    try {
      await api('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      })
      // Account created — send them to login
      navigate('/login', { state: { registered: true } })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'INTERNAL_SERVER_ERROR'
      setError(ERROR_MESSAGES[msg] ?? 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="border-neutral-900/20 p-8">
      <p className="mb-3 font-mono text-sm uppercase tracking-[0.18em] text-accent">Join</p>
      <h1 className="mb-5 font-mono text-4xl font-semibold uppercase leading-none text-neutral-950">Create Account</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input name="name" label="Name" type="text" placeholder="Your name" required />
        <Input name="email" label="Email" type="email" placeholder="you@example.com" required />
        <Input name="password" label="Password" type="password" placeholder="At least 8 chars" minLength={8} required />
        {error && <p className="text-sm font-medium text-red-600">{error}</p>}
        <Button variant="solid" className="w-full" disabled={loading}>
          {loading ? 'Creating account…' : 'Sign Up'}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-neutral-500">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-neutral-950 transition hover:text-accent">
          Log in
        </Link>
      </p>
    </Card>
  )
}
