import { FormEvent, useState } from 'react'
import { PageWrapper } from '../components/layout/PageWrapper'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { Modal } from '../components/ui/Modal'

export function HostContestPage() {
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <PageWrapper>
      <section className="mx-auto max-w-[960px] space-y-6">
        <div className="space-y-4 border-b border-neutral-900 pb-8">
          <p className="font-mono text-sm uppercase tracking-[0.18em] text-accent">Creator Console</p>
          <h1 className="font-mono text-5xl font-semibold uppercase leading-none text-neutral-950 md:text-6xl">Host Contest</h1>
          <p className="max-w-2xl text-lg text-neutral-600">
            Launch a polished contest with clear timings, sharp descriptions, and creator-first controls.
          </p>
        </div>
        <Card className="editorial-card border-neutral-900/20 p-8 md:p-10">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input label="Title" placeholder="Weekly Array Arena" required />
            <Input label="Start Time" type="datetime-local" required />
            <Input label="End Time" type="datetime-local" required />
            <label className="flex flex-col gap-2 text-sm font-medium text-neutral-500">
              Description
              <textarea
                className="min-h-36 w-full border border-neutral-900/15 bg-white px-4 py-3 text-neutral-950 outline-none ring-accent/35 transition placeholder:text-neutral-400 focus:border-accent focus:ring-2"
                placeholder="Describe the contest format, problem style, and target participants."
                required
              />
            </label>
            <Button variant="solid" className="w-full">
              Create Contest
            </Button>
          </form>
        </Card>
        <Modal open={submitted} onClose={() => setSubmitted(false)} title="Contest Created">
          <div className="space-y-5">
            <p className="text-base leading-7 text-neutral-700">
              Your `KodeZilla.io` contest draft is ready. You can now attach problems, review timings, and publish when the round looks right.
            </p>
            <div className="flex justify-end">
              <Button variant="solid" onClick={() => setSubmitted(false)}>
                Continue
              </Button>
            </div>
          </div>
        </Modal>
      </section>
    </PageWrapper>
  )
}
