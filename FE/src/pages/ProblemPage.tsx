import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ProblemEditor } from '../components/features/problem/ProblemEditor'
import { PageWrapper } from '../components/layout/PageWrapper'
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

  const problem = useMemo(() => {
    const contest = data.find((item) => item.id === id)
    return contest?.problems.find((item) => item.id === pid)
  }, [data, id, pid])

  if (!problem) {
    return (
      <PageWrapper>
        <p className="text-slate-300">Problem not found.</p>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      <div className="mb-6">
        <h1 className="font-mono text-3xl font-bold text-white">{problem.title}</h1>
        <p className="mt-2 text-slate-400">Difficulty: {problem.difficulty.toUpperCase()}</p>
      </div>
      <ProblemEditor
        statement="Given an array and target sum, compute the maximum valid score under the round constraints."
        code={code}
        onCodeChange={setCode}
        onSubmit={() => window.alert('Submission queued (mock).')}
      />
    </PageWrapper>
  )
}
