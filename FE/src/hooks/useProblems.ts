import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '../store/authStore'
import type { Problem } from '../types'

export function useProblem(problemId: string | undefined) {
  const { token } = useAuthStore()

  return useQuery<Problem>({
    queryKey: ['problem', problemId],
    queryFn: async () => {
      const res = await fetch(`/api/problems/${problemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Problem not found')
      const json = await res.json()
      const p = json.data
      return {
        id: p.id,
        title: p.title,
        difficulty: 'medium' as const,
        tags: p.tags ?? [],
        points: p.points,
        timeLimit: `${p.timeLimit}ms`,
        memoryLimit: `${p.memoryLimit}MB`,
        statement: p.description,
      }
    },
    enabled: !!token && !!problemId,
  })
}
