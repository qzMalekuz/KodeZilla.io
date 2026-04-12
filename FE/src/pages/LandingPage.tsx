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
      <section className="space-y-0 border border-neutral-900">
        <div className="grid border-b border-neutral-900 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="hero-panel flex min-h-[560px] flex-col justify-between p-8 md:p-12">
            <div className="space-y-6">
              <motion.p
                custom={0}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="font-mono text-sm uppercase tracking-[0.18em] text-accent"
              >
                Next-Gen Contest Infrastructure
              </motion.p>
              <motion.h1
                custom={0.1}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="max-w-4xl font-mono text-6xl font-semibold uppercase leading-[0.92] text-white md:text-8xl"
              >
                Code Battles At The Core.
              </motion.h1>
              <motion.p
                custom={0.2}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="max-w-2xl text-lg leading-8 text-stone-200"
              >
                KodeZilla.io is the high-pressure arena for algorithm rounds, ranked leaderboards, and creator-led contests built to feel sharp, fast, and deliberate.
              </motion.p>
              <motion.div
                custom={0.3}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="flex flex-wrap gap-4"
              >
                <Link to="/explore">
                  <Button size="lg" variant="solid">
                    Start Competing
                  </Button>
                </Link>
                <Link to="/host">
                  <Button size="lg" variant="ghost">
                    Host Contest
                  </Button>
                </Link>
              </motion.div>
            </div>

            <div className="max-w-xl border-l-2 border-accent pl-5 text-base leading-8 text-stone-300">
              We do not just list problems. We stage ranked competitive experiences with clear pacing, clean problem views, and fast leaderboard feedback.
            </div>
          </div>

          <div className="flex min-h-[560px] flex-col justify-between bg-neutral-950 p-8 md:p-12">
            <div className="space-y-4">
              <p className="font-mono text-sm uppercase tracking-[0.18em] text-stone-400">Live Snapshot</p>
              <div className="border-t border-white/10 pt-6">
                <p className="font-mono text-5xl font-semibold uppercase leading-none text-accent md:text-6xl">92%</p>
                <p className="mt-2 font-mono text-xs uppercase tracking-[0.18em] text-stone-500">Submission Accuracy</p>
              </div>
              <div className="border-t border-white/10 pt-6">
                <p className="font-mono text-5xl font-semibold uppercase leading-none text-white md:text-6xl">14K+</p>
                <p className="mt-2 font-mono text-xs uppercase tracking-[0.18em] text-stone-500">Active Competitors</p>
              </div>
            </div>

            <div className="space-y-4 border border-white/10 bg-white/5 p-6">
              <p className="font-mono text-sm uppercase tracking-[0.14em] text-stone-300">Why Teams Choose KodeZilla.io</p>
              <p className="text-base leading-7 text-stone-400">
                Editorial layouts, creator-first hosting tools, and a contest experience that feels more flagship product than template dashboard.
              </p>
            </div>
          </div>
        </div>

        <section className="grid border-b border-neutral-900 bg-stone-50 md:grid-cols-4">
          {[
            ['Accounts', '84K+'],
            ['Traffic', '2.4M'],
            ['Events', '900+'],
            ['Regions', '68'],
          ].map(([label, value]) => (
            <div key={label} className="border-b border-neutral-900 p-8 last:border-b-0 md:border-b-0 md:border-r last:md:border-r-0">
              <p className="font-mono text-5xl font-semibold uppercase leading-none text-neutral-950">{value}</p>
              <p className="mt-3 font-mono text-xs uppercase tracking-[0.18em] text-neutral-500">{label}</p>
            </div>
          ))}
        </section>

        <section className="grid lg:grid-cols-[0.34fr_0.66fr]">
          <div className="border-b border-neutral-900 bg-stone-50 p-8 md:p-10 lg:border-b-0 lg:border-r">
            <p className="font-mono text-sm uppercase tracking-[0.18em] text-accent">Evidence Log</p>
            <h2 className="mt-4 font-mono text-5xl font-semibold uppercase leading-none text-neutral-950">Our Arena</h2>
            <p className="mt-6 max-w-sm text-base leading-8 text-neutral-600">
              Explore a contest platform that treats participation and creation like flagship product experiences, not utility screens.
            </p>
          </div>

          <div className="grid gap-px bg-neutral-900 md:grid-cols-2">
            <Card className="flex min-h-[390px] flex-col justify-between border-0 bg-neutral-950 p-8 text-white shadow-none">
              <p className="font-mono text-sm uppercase tracking-[0.18em] text-accent">Developer</p>
              <h3 className="mt-4 font-mono text-4xl font-semibold uppercase leading-none text-white">Climb Ranked Boards</h3>
              <p className="mt-5 max-w-md text-base leading-8 text-stone-400">
                Enter live rounds, track solved counts, and compete in a focused interface that keeps the pressure on the code.
              </p>
            </Card>
            <Card className="flex min-h-[390px] flex-col justify-between border-0 bg-white p-8 shadow-none">
              <p className="font-mono text-sm uppercase tracking-[0.18em] text-accent">Creator</p>
              <h3 className="mt-4 font-mono text-4xl font-semibold uppercase leading-none text-neutral-950">Ship Signature Contests</h3>
              <p className="mt-5 max-w-md text-base leading-8 text-neutral-600">
                Build rounds with strong pacing, publication controls, and a visual identity that feels premium from the first click.
              </p>
            </Card>
          </div>
        </section>
      </section>
    </PageWrapper>
  )
}
