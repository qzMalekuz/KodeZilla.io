import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { contests } from '../lib/mockData'

export function useContests() {
  const query = useQuery({
    queryKey: ['contests'],
    queryFn: async () => contests,
  })

  const publicContests = useMemo(
    () => (query.data ?? []).filter((contest) => contest.isPublic),
    [query.data],
  )

  return { ...query, publicContests }
}
