import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { PageWrapper } from '../components/layout/PageWrapper'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (delay: number) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay } }),
}

export function LandingPage() {
  return (
    <PageWrapper>
      <section className="space-y-14 py-8">
        <div className="space-y-6">
          <motion.p
            custom={0}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="font-mono text-xs uppercase tracking-[0.25em] text-slate-400"
          >
            Minimal. Competitive. Global.
          </motion.p>
          <motion.h1
            custom={0.1}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="max-w-4xl font-mono text-5xl font-bold leading-tight tracking-tight text-white md:text-7xl"
          >
            COMPETITIVE PROGRAMMING
          </motion.h1>
          <motion.p
            custom={0.2}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="max-w-2xl text-lg leading-8 text-slate-300"
          >
            Host rounds, solve under pressure, and benchmark your growth with a clean high-focus interface.
          </motion.p>
          <motion.div custom={0.3} initial="hidden" animate="visible" variants={fadeUp} className="flex flex-wrap gap-4">
            <Link to="/explore">
              <Button size="lg">Start Competing</Button>
            </Link>
            <Link to="/host">
              <Button size="lg" variant="outline">
                Host Contest
              </Button>
            </Link>
          </motion.div>
        </div>

        <section className="grid gap-4 rounded-2xl border border-border bg-black/40 p-6 md:grid-cols-4">
          {[
            ['ACCOUNTS', '84K+'],
            ['TRAFFIC', '2.4M'],
            ['EVENTS', '900+'],
            ['REGIONS', '68'],
          ].map(([label, value], index) => (
            <div key={label} className="md:border-r md:border-border md:pr-4 last:md:border-none">
              <p className="font-mono text-4xl font-bold text-white">{value}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-400">{label}</p>
              {index === 3 ? null : null}
            </div>
          ))}
        </section>

        <section className="grid gap-5 md:grid-cols-2">
          <Card>
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-accent">Developer</p>
            <h2 className="text-2xl font-bold text-white">Compete in curated rounds.</h2>
            <p className="mt-3 leading-7 text-slate-300">
              Solve problems with live ranking updates and clean score visibility across every division.
            </p>
          </Card>
          <Card>
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-accent">Creator</p>
            <h2 className="text-2xl font-bold text-white">Design and host modern contests.</h2>
            <p className="mt-3 leading-7 text-slate-300">
              Publish problem sets, tune timings, and analyze participant performance after each event.
            </p>
          </Card>
        </section>
      </section>
    </PageWrapper>
  )
}
