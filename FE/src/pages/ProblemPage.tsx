import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ProblemEditor } from '../components/features/problem/ProblemEditor'
import { PageWrapper } from '../components/layout/PageWrapper'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { useContest } from '../hooks/useContests'
import { useAuthStore } from '../store/authStore'

type SubmitResult = { status: 'queued' } | { status: 'done'; verdict: string; passed: number; total: number } | { status: 'error'; message: string }

export function ProblemPage() {
  const { id, pid } = useParams()
  const { token } = useAuthStore()
  const { data: contest, isLoading } = useContest(id)
  const [code, setCode] = useState('')
  const [submitResult, setSubmitResult] = useState<SubmitResult | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const problem = useMemo(() => {
    return contest?.problems.find((item) => item.id === pid)
  }, [contest, pid])

  async function handleSubmit(language: string) {
    if (!pid || !code.trim()) return
    setSubmitting(true)
    setSubmitResult(null)
    try {
      const res = await fetch(`/api/problems/${pid}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ code, language }),
      })
      const json = await res.json()
      if (!res.ok) {
        const msg = json.error === 'CONTEST_NOT_ACTIVE'
          ? 'This contest is not currently active.'
          : json.error === 'FORBIDDEN'
          ? 'Contest creators cannot submit to their own contest.'
          : json.error ?? 'Submission failed.'
        setSubmitResult({ status: 'error', message: msg })
      } else {
        setSubmitResult({
          status: 'done',
          verdict: json.data.status,
          passed: json.data.testCasesPassed,
          total: json.data.totalTestCases,
        })
      }
    } catch {
      setSubmitResult({ status: 'error', message: 'Network error. Is the server running?' })
    } finally {
      setSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <PageWrapper>
        <p className="text-neutral-600">Loading…</p>
      </PageWrapper>
    )
  }

  if (!problem) {
    return (
      <PageWrapper>
        <p className="text-neutral-600">Problem not found.</p>
      </PageWrapper>
    )
  }

  const verdictColor =
    submitResult?.status === 'done'
      ? submitResult.verdict === 'accepted'
        ? 'text-green-600'
        : 'text-red-600'
      : 'text-red-600'

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
          onSubmit={handleSubmit}
          submitting={submitting}
        />
      </div>

      <Modal
        open={!!submitResult}
        onClose={() => setSubmitResult(null)}
        title={submitResult?.status === 'done' ? 'Submission Result' : submitResult?.status === 'error' ? 'Submission Failed' : 'Submission Queued'}
      >
        <div className="space-y-5">
          {submitResult?.status === 'done' && (
            <>
              <p className={`font-mono text-lg font-semibold uppercase ${verdictColor}`}>
                {submitResult.verdict.replace(/_/g, ' ')}
              </p>
              <p className="leading-7 text-neutral-700">
                Passed <strong>{submitResult.passed}</strong> of <strong>{submitResult.total}</strong> test cases.
              </p>
            </>
          )}
          {submitResult?.status === 'error' && (
            <p className="leading-7 text-neutral-700">{submitResult.message}</p>
          )}
          <div className="flex justify-end">
            <Button variant="solid" onClick={() => setSubmitResult(null)}>
              Done
            </Button>
          </div>
        </div>
      </Modal>
    </PageWrapper>
  )
}
