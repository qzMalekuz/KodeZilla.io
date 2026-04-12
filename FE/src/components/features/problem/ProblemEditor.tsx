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
      <article className="rounded-2xl border border-border bg-black/35 p-5">
        <h2 className="mb-3 font-mono text-xl text-white">Problem Statement</h2>
        <p className="leading-7 text-slate-300">{statement}</p>
      </article>

      <article className="rounded-2xl border border-border bg-black/35 p-5">
        <h2 className="mb-3 font-mono text-xl text-white">Code Editor</h2>
        <textarea
          className="min-h-80 w-full resize-y rounded-xl border border-border bg-slate-950/80 p-4 font-mono text-sm text-slate-100 outline-none ring-accent/50 transition focus:ring-2"
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
