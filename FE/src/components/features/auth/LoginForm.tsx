import { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../hooks/useAuth'
import { Button } from '../../ui/Button'
import { Card } from '../../ui/Card'
import { Input } from '../../ui/Input'

export function LoginForm() {
  const { login } = useAuth()
  const navigate = useNavigate()

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    login('mock-token')
    navigate('/explore')
  }

  return (
    <Card className="border-neutral-900/20 p-8">
      <p className="mb-3 font-mono text-sm uppercase tracking-[0.18em] text-accent">Access</p>
      <h1 className="mb-5 font-mono text-4xl font-semibold uppercase leading-none text-neutral-950">Log In</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input label="Email" type="email" placeholder="you@example.com" required />
        <Input label="Password" type="password" placeholder="••••••••" required />
        <Button variant="solid" className="w-full">
          Continue
        </Button>
      </form>
    </Card>
  )
}
