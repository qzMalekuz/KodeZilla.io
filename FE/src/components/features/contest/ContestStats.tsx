interface ContestStatsProps {
  stats: Array<{ label: string; value: string }>
}

export function ContestStats({ stats }: ContestStatsProps) {
  return (
    <section className="grid gap-4 rounded-2xl border border-border bg-black/40 p-6 md:grid-cols-4">
      {stats.map((stat, index) => (
        <div key={stat.label} className="space-y-1 md:pl-4">
          <p className="font-mono text-3xl font-bold text-white">{stat.value}</p>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{stat.label}</p>
          {index < stats.length - 1 ? <div className="hidden border-r border-border md:block" /> : null}
        </div>
      ))}
    </section>
  )
}
