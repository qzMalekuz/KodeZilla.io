import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '../store/authStore'

interface ApiContest {
  id: string
  title: string
  description: string
  startTime: string
  endTime: string
  creatorId: string
  creatorName: string
  mcqCount: number
  dsaCount: number
}

interface ApiContestDetail {
  id: string
  title: string
  description: string
  startTime: string
  endTime: string
  creatorId: string
  mcqs: unknown[]
  dsaProblems: {
    id: string
    title: string
    description: string
    tags: string[]
    points: number
    timeLimit: number
    memoryLimit: number
  }[]
}

function mapContest(c: ApiContest) {
  return {
    id: c.id,
    title: c.title,
    description: c.description,
    startTime: c.startTime,
    endTime: c.endTime,
    participantCount: 0,
    problems: [] as import('../types').Problem[],
    isPublic: true,
    tags: [] as string[],
    creatorName: c.creatorName,
    problemCount: c.dsaCount + c.mcqCount,
  }
}

export function useContests() {
  const { token } = useAuthStore()

  const query = useQuery({
    queryKey: ['contests'],
    queryFn: async () => {
      const res = await fetch('/api/contests', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Failed to fetch contests')
      const json = await res.json()
      return (json.data as ApiContest[]).map(mapContest)
    },
    enabled: !!token,
  })

  const publicContests = useMemo(
    () => (query.data ?? []).filter((c) => c.isPublic),
    [query.data],
  )

  return { ...query, publicContests }
}

export function useContest(contestId: string | undefined) {
  const { token } = useAuthStore()

  return useQuery({
    queryKey: ['contest', contestId],
    queryFn: async () => {
      const res = await fetch(`/api/contests/${contestId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Contest not found')
      const json = await res.json()
      const c = json.data as ApiContestDetail
      return {
        id: c.id,
        title: c.title,
        description: c.description,
        startTime: c.startTime,
        endTime: c.endTime,
        participantCount: 0,
        isPublic: true,
        tags: [],
        problems: c.dsaProblems.map((p) => ({
          id: p.id,
          title: p.title,
          difficulty: 'medium' as const,
          tags: p.tags,
          points: p.points,
          timeLimit: `${p.timeLimit}ms`,
          memoryLimit: `${p.memoryLimit}MB`,
          statement: p.description,
        })),
      }
    },
    enabled: !!token && !!contestId,
  })
}

export function useContestLeaderboard(contestId: string | undefined) {
  const { token } = useAuthStore()

  return useQuery({
    queryKey: ['leaderboard', contestId],
    queryFn: async () => {
      const res = await fetch(`/api/contests/${contestId}/leaderboard`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Failed to fetch leaderboard')
      const json = await res.json()
      return json.data as { rank: number; userId: number; name: string; totalPoints: number }[]
    },
    enabled: !!token && !!contestId,
  })
}
