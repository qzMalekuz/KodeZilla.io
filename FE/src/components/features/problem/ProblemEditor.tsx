import { Button } from '../../ui/Button'

interface ProblemEditorProps {
  statement: string
  code: string
  onCodeChange: (value: string) => void
  onSubmit: () => void
}

export function ProblemEditor({ statement, code, onCodeChange, onSubmit }: ProblemEditorProps) {
  return (
    <section className="grid gap-4 lg:grid-cols-2">
      <article className="border border-neutral-900 bg-white p-6">
        <h2 className="mb-3 font-mono text-2xl font-semibold uppercase text-neutral-950">Problem Statement</h2>
        <p className="leading-8 text-neutral-700">{statement}</p>
      </article>

      <article className="border border-neutral-900 bg-neutral-950 p-6">
        <h2 className="mb-3 font-mono text-2xl font-semibold uppercase text-white">Code Editor</h2>
        <textarea
          className="min-h-80 w-full resize-y border border-white/10 bg-black/30 p-4 font-mono text-sm text-stone-100 outline-none ring-accent/40 transition focus:border-accent focus:ring-2"
          value={code}
          onChange={(event) => onCodeChange(event.target.value)}
          spellCheck={false}
        />
        <div className="mt-4 flex justify-end">
          <Button variant="solid" onClick={onSubmit}>
            Submit Solution
          </Button>
        </div>
      </article>
    </section>
  )
}
