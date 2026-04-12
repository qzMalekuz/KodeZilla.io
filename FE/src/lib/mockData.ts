import type { Contest, LeaderboardEntry, Problem, User } from '../types'

const users: User[] = [
  { id: 'u1', username: 'byteblade', email: 'byte@arena.dev', rating: 1842, rank: 33 },
  { id: 'u2', username: 'loopqueen', email: 'loop@arena.dev', rating: 1765, rank: 61 },
  { id: 'u3', username: 'stackstorm', email: 'stack@arena.dev', rating: 1912, rank: 18 },
]

const problemPool: Problem[] = [
  { id: 'p1', title: 'Binary Search Range', difficulty: 'easy', tags: ['binary-search'], points: 100 },
  { id: 'p2', title: 'Shortest Teleport Path', difficulty: 'medium', tags: ['graphs', 'bfs'], points: 250 },
  { id: 'p3', title: 'Segment Tree Beats', difficulty: 'hard', tags: ['segment-tree'], points: 500 },
  { id: 'p4', title: 'Rolling Hash Duel', difficulty: 'medium', tags: ['strings'], points: 300 },
]

export const contests: Contest[] = [
  {
    id: 'c1',
    title: 'Night Sprint 42',
    description: 'Fast-paced 90 min round with implementation-heavy tasks.',
    startTime: '2026-04-20T17:00:00.000Z',
    endTime: '2026-04-20T18:30:00.000Z',
    participantCount: 862,
    problems: [problemPool[0], problemPool[1], problemPool[3]],
    isPublic: true,
  },
  {
    id: 'c2',
    title: 'Graph Masters Open',
    description: 'Weighted paths, shortest routes, and dynamic constraints.',
    startTime: '2026-04-22T13:30:00.000Z',
    endTime: '2026-04-22T16:00:00.000Z',
    participantCount: 1310,
    problems: [problemPool[1], problemPool[2]],
    isPublic: true,
  },
  {
    id: 'c3',
    title: 'Creators Invitational',
    description: 'Private contest tooling benchmark for hosts.',
    startTime: '2026-04-24T09:00:00.000Z',
    endTime: '2026-04-24T11:00:00.000Z',
    participantCount: 226,
    problems: [problemPool[0], problemPool[2], problemPool[3]],
    isPublic: false,
  },
]

export const problems: Problem[] = problemPool

export const leaderboard: LeaderboardEntry[] = [
  { rank: 1, user: users[2], score: 1150, solvedCount: 4, lastSubmission: '2026-04-20T18:08:00.000Z' },
  { rank: 2, user: users[0], score: 980, solvedCount: 3, lastSubmission: '2026-04-20T18:15:00.000Z' },
  { rank: 3, user: users[1], score: 910, solvedCount: 3, lastSubmission: '2026-04-20T18:20:00.000Z' },
]

export const currentUser: User = users[0]
