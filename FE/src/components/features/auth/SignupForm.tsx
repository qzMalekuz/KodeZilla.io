import { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../hooks/useAuth'
import { Button } from '../../ui/Button'
import { Card } from '../../ui/Card'
import { Input } from '../../ui/Input'

export function SignupForm() {
  const { login } = useAuth()
  const navigate = useNavigate()

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    login('mock-token')
    navigate('/profile/byteblade')
  }

  return (
    <Card className="border-neutral-900/20 p-8">
      <p className="mb-3 font-mono text-sm uppercase tracking-[0.18em] text-accent">Join</p>
      <h1 className="mb-5 font-mono text-4xl font-semibold uppercase leading-none text-neutral-950">Create Account</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input label="Username" type="text" placeholder="byteblade" required />
        <Input label="Email" type="email" placeholder="you@example.com" required />
        <Input label="Password" type="password" placeholder="At least 8 chars" required />
        <Button variant="ghost" className="w-full">
          Sign Up
        </Button>
      </form>
    </Card>
  )
}
