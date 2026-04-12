import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ProblemEditor } from '../components/features/problem/ProblemEditor'
import { PageWrapper } from '../components/layout/PageWrapper'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { useContests } from '../hooks/useContests'

const template = `#include <bits/stdc++.h>
using namespace std;

int main() {
  ios::sync_with_stdio(false);
  cin.tie(nullptr);

  return 0;
}`

export function ProblemPage() {
  const { id, pid } = useParams()
  const { data = [] } = useContests()
  const [code, setCode] = useState(template)
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
      <div className="mb-6 space-y-3 border-b border-neutral-900 pb-6">
        <p className="font-mono text-sm uppercase tracking-[0.18em] text-accent">Problem View</p>
        <h1 className="font-mono text-4xl font-semibold uppercase text-neutral-950 md:text-5xl">{problem.title}</h1>
        <p className="text-neutral-500">Difficulty: {problem.difficulty.toUpperCase()}</p>
      </div>
      <ProblemEditor
        statement="Given an array and target sum, compute the maximum valid score under the round constraints."
        code={code}
        onCodeChange={setCode}
        onSubmit={() => setShowSubmitModal(true)}
      />
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
