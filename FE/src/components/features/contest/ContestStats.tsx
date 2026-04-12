interface ContestStatsProps {
  stats: Array<{ label: string; value: string }>
}

export function ContestStats({ stats }: ContestStatsProps) {
  return (
    <section className="grid border border-neutral-900 bg-white md:grid-cols-4">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className={index < stats.length - 1 ? 'border-b border-neutral-900 p-6 md:border-b-0 md:border-r' : 'p-6'}
        >
          <p className="font-mono text-4xl font-semibold uppercase leading-none text-neutral-950">{stat.value}</p>
          <p className="mt-3 text-xs uppercase tracking-[0.2em] text-neutral-500">{stat.label}</p>
        </div>
      ))}
    </section>
  )
}
