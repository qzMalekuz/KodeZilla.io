import { useQuery } from '@tanstack/react-query'
import { problems } from '../lib/mockData'

export function useProblems() {
  return useQuery({
    queryKey: ['problems'],
    queryFn: async () => problems,
  })
}
