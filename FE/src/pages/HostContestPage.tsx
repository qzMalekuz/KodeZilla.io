import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageWrapper } from '../components/layout/PageWrapper'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { Modal } from '../components/ui/Modal'
import { useAuthStore } from '../store/authStore'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function pad(n: number) {
  return String(n).padStart(2, '0')
}

interface DateTimeParts {
  year: string
  month: string
  day: string
  hour: string
  minute: string
}

function toISO(p: DateTimeParts) {
  return `${p.year}-${pad(Number(p.month) + 1)}-${pad(Number(p.day))}T${pad(Number(p.hour))}:${pad(Number(p.minute))}:00`
}

function isComplete(p: DateTimeParts) {
  return p.year && p.month !== '' && p.day && p.hour !== '' && p.minute !== ''
}

const now = new Date()
const currentYear = now.getFullYear()
const years = Array.from({ length: 5 }, (_, i) => currentYear + i)
const hours = Array.from({ length: 24 }, (_, i) => i)
const minutes = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]

interface DateTimePickerProps {
  label: string
  value: DateTimeParts
  onChange: (v: DateTimeParts) => void
}

function DateTimePicker({ label, value, onChange }: DateTimePickerProps) {
  const numDays = value.year && value.month !== ''
    ? daysInMonth(Number(value.year), Number(value.month))
    : 31
  const days = Array.from({ length: numDays }, (_, i) => i + 1)

  function set(key: keyof DateTimeParts, val: string) {
    const next = { ...value, [key]: val }
    if (key === 'year' || key === 'month') {
      const nd = daysInMonth(Number(next.year || currentYear), Number(next.month !== '' ? next.month : 0))
      if (Number(next.day) > nd) next.day = String(nd)
    }
    onChange(next)
  }

  const selectClass =
    'flex-1 border border-neutral-900/20 bg-white px-3 py-2.5 text-sm text-neutral-950 outline-none ring-accent/35 transition focus:border-accent focus:ring-2 appearance-none cursor-pointer'

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-neutral-500">{label}</span>
      <div className="flex gap-2">
        <select className={selectClass} value={value.year} onChange={e => set('year', e.target.value)}>
          <option value="" disabled>Year</option>
          {years.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
        <select className={selectClass} value={value.month} onChange={e => set('month', e.target.value)}>
          <option value="" disabled>Month</option>
          {MONTHS.map((m, i) => <option key={i} value={i}>{m}</option>)}
        </select>
        <select className={selectClass} value={value.day} onChange={e => set('day', e.target.value)}>
          <option value="" disabled>Day</option>
          {days.map(d => <option key={d} value={d}>{pad(d)}</option>)}
        </select>
      </div>
      <div className="flex gap-2">
        <select className={selectClass} value={value.hour} onChange={e => set('hour', e.target.value)}>
          <option value="" disabled>Hour</option>
          {hours.map(h => <option key={h} value={h}>{pad(h)}:00</option>)}
        </select>
        <select className={selectClass} value={value.minute} onChange={e => set('minute', e.target.value)}>
          <option value="" disabled>Minute</option>
          {minutes.map(m => <option key={m} value={m}>:{pad(m)}</option>)}
        </select>
      </div>
    </div>
  )
}

const emptyDT = (): DateTimeParts => ({ year: String(currentYear), month: '', day: '', hour: '', minute: '' })

export function HostContestPage() {
  const { token } = useAuthStore()
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [startDT, setStartDT] = useState<DateTimeParts>(emptyDT)
  const [endDT, setEndDT] = useState<DateTimeParts>(emptyDT)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [createdId, setCreatedId] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    if (!isComplete(startDT) || !isComplete(endDT)) {
      setError('Please fill in all date and time fields.')
      return
    }

    const startISO = toISO(startDT)
    const endISO = toISO(endDT)

    if (new Date(endISO) <= new Date(startISO)) {
      setError('End time must be after start time.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/contests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description, startTime: startISO, endTime: endISO }),
      })
      const json = await res.json()
      if (!res.ok || !json.success) {
        setError(json.error === 'FORBIDDEN' ? 'Only creators can host contests.' : 'Failed to create contest. Try again.')
        return
      }
      setCreatedId(json.data.id)
    } catch {
      setError('Network error. Is the server running?')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageWrapper>
      <section className="space-y-6">
        <div className="space-y-4 border-b border-neutral-900 pb-8">
          <p className="font-mono text-sm uppercase tracking-[0.18em] text-accent">Creator Console</p>
          <h1 className="font-mono text-5xl font-semibold uppercase leading-none text-neutral-950 md:text-6xl">Host Contest</h1>
          <p className="max-w-2xl text-lg text-neutral-600">
            Launch a polished contest with clear timings, sharp descriptions, and creator-first controls.
          </p>
        </div>
        <Card className="editorial-card border-neutral-900/20 p-8 md:p-10">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <Input
              label="Title"
              placeholder="Weekly Array Arena"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
            <DateTimePicker label="Start Time" value={startDT} onChange={setStartDT} />
            <DateTimePicker label="End Time" value={endDT} onChange={setEndDT} />
            <label className="flex flex-col gap-2 text-sm font-medium text-neutral-500">
              Description
              <textarea
                className="min-h-36 w-full border border-neutral-900/15 bg-white px-4 py-3 text-neutral-950 outline-none ring-accent/35 transition placeholder:text-neutral-400 focus:border-accent focus:ring-2"
                placeholder="Describe the contest format, problem style, and target participants."
                required
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </label>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button variant="solid" className="w-full" disabled={loading}>
              {loading ? 'Creating…' : 'Create Contest'}
            </Button>
          </form>
        </Card>

        <Modal open={!!createdId} onClose={() => { setCreatedId(null); navigate('/contests') }} title="Contest Created">
          <div className="space-y-5">
            <p className="text-base leading-7 text-neutral-700">
              Your contest is live. You can now attach problems, review timings, and publish when the round looks right.
            </p>
            <div className="flex justify-end">
              <Button variant="solid" onClick={() => { setCreatedId(null); navigate('/contests') }}>
                View Contests
              </Button>
            </div>
          </div>
        </Modal>
      </section>
    </PageWrapper>
  )
}
