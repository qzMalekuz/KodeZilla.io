import { FormEvent, useState } from 'react'
import { PageWrapper } from '../components/layout/PageWrapper'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'

export function HostContestPage() {
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <PageWrapper>
      <section className="mx-auto max-w-2xl space-y-6">
        <h1 className="font-mono text-4xl font-bold text-white">Host Contest</h1>
        <Card>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input label="Title" placeholder="Weekly Array Arena" required />
            <Input label="Start Time" type="datetime-local" required />
            <Input label="End Time" type="datetime-local" required />
            <label className="flex flex-col gap-2 text-sm text-slate-300">
              Description
              <textarea
                className="min-h-32 rounded-xl border border-border bg-black/40 px-4 py-2 text-slate-100 outline-none ring-accent/50 transition focus:ring-2"
                required
              />
            </label>
            <Button variant="solid" className="w-full">
              Create Contest
            </Button>
          </form>
        </Card>
        {submitted ? <p className="text-accent">Contest draft created (mock).</p> : null}
      </section>
    </PageWrapper>
  )
}
