import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ProblemEditor } from '../components/features/problem/ProblemEditor'
import { PageWrapper } from '../components/layout/PageWrapper'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { useContests } from '../hooks/useContests'

export function ProblemPage() {
  const { id, pid } = useParams()
  const { data = [] } = useContests()
  const [code, setCode] = useState('')
  const [showSubmitModal, setShowSubmitModal] = useState(false)

  const problem = useMemo(() => {
    const contest = data.find((item) => item.id === id)
    return contest?.problems.find((item) => item.id === pid)
  }, [data, id, pid])

  if (!problem) {
    return (
      <PageWrapper>
        <p className="text-neutral-600">Problem not found.</p>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      <div className="-mt-8 md:-mt-10">
        <div className="relative mb-4 flex items-center border-y border-neutral-900 py-4">
          <p className="font-mono text-sm uppercase tracking-[0.18em] text-accent">Problem View</p>
          <h1 className="absolute left-1/2 -translate-x-1/2 font-mono text-2xl font-semibold uppercase text-neutral-950">{problem.title}</h1>
          <p className="ml-auto font-mono text-sm uppercase tracking-[0.18em] text-neutral-500">Difficulty: {problem.difficulty}</p>
        </div>
        <ProblemEditor
          problem={problem}
          code={code}
          onCodeChange={setCode}
          onSubmit={() => setShowSubmitModal(true)}
        />
      </div>
      <Modal open={showSubmitModal} onClose={() => setShowSubmitModal(false)} title="Submission Queued">
        <div className="space-y-5">
          <p className="leading-7 text-neutral-700">
            Your solution has been queued for judging. Watch the leaderboard and resubmit if you want to optimize runtime.
          </p>
          <div className="flex justify-end">
            <Button variant="solid" onClick={() => setShowSubmitModal(false)}>
              Done
            </Button>
          </div>
        </div>
      </Modal>
    </PageWrapper>
  )
}
