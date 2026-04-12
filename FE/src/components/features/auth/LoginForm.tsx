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
    <Card>
      <h1 className="mb-5 font-mono text-2xl font-bold text-white">Log In</h1>
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
