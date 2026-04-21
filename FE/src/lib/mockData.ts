import type { Contest, LeaderboardEntry, Problem, User } from '../types'

const users: User[] = [
  { id: 'u1', username: 'qzmalekuz', email: 'qzmalekuz@kodezilla.io', rating: 1842, rank: 33 },
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
    description: 'Fast-paced 90 min round with implementation-heavy tasks and tight time constraints.',
    startTime: '2026-04-20T17:00:00.000Z',
    endTime: '2026-04-20T18:30:00.000Z',
    participantCount: 862,
    problems: [problemPool[0], problemPool[1], problemPool[3]],
    isPublic: true,
    tags: ['implementation', 'greedy'],
  },
  {
    id: 'c2',
    title: 'Graph Masters Open',
    description: 'Weighted paths, shortest routes, and dynamic constraints across graph structures.',
    startTime: '2026-04-22T13:30:00.000Z',
    endTime: '2026-04-22T16:00:00.000Z',
    participantCount: 1310,
    problems: [problemPool[1], problemPool[2]],
    isPublic: true,
    tags: ['graphs', 'bfs', 'dijkstra'],
  },
  {
    id: 'c4',
    title: 'DP Gauntlet',
    description: 'Pure dynamic programming from classic knapsack to interval DP and bitmask tricks.',
    startTime: '2026-04-23T10:00:00.000Z',
    endTime: '2026-04-23T13:00:00.000Z',
    participantCount: 744,
    problems: [problemPool[2], problemPool[3]],
    isPublic: true,
    tags: ['dynamic-programming', 'bitmask'],
  },
  {
    id: 'c5',
    title: 'Binary Blitz',
    description: 'Binary search on answer, search on functions, and predicates under pressure.',
    startTime: '2026-04-24T15:00:00.000Z',
    endTime: '2026-04-24T16:30:00.000Z',
    participantCount: 533,
    problems: [problemPool[0], problemPool[1]],
    isPublic: true,
    tags: ['binary-search', 'math'],
  },
  {
    id: 'c6',
    title: 'String Theory Cup',
    description: 'Hashing, KMP, Z-function, and suffix arrays in a strings-only battle.',
    startTime: '2026-04-25T09:00:00.000Z',
    endTime: '2026-04-25T11:30:00.000Z',
    participantCount: 419,
    problems: [problemPool[3], problemPool[0]],
    isPublic: true,
    tags: ['strings', 'hashing'],
  },
  {
    id: 'c7',
    title: 'Data Structures Duel',
    description: 'Segment trees, BITs, sparse tables, and persistent structures under the clock.',
    startTime: '2026-04-26T14:00:00.000Z',
    endTime: '2026-04-26T17:00:00.000Z',
    participantCount: 681,
    problems: [problemPool[2], problemPool[1], problemPool[0]],
    isPublic: true,
    tags: ['data-structures', 'segment-tree'],
  },
  {
    id: 'c8',
    title: 'Math Olympiad Round',
    description: 'Number theory, combinatorics, modular arithmetic, and prime sieves.',
    startTime: '2026-04-27T11:00:00.000Z',
    endTime: '2026-04-27T13:00:00.000Z',
    participantCount: 390,
    problems: [problemPool[0], problemPool[3]],
    isPublic: true,
    tags: ['math', 'number-theory'],
  },
  {
    id: 'c9',
    title: 'Greedy Games',
    description: 'Exchange arguments, interval scheduling, and activity selection problems.',
    startTime: '2026-04-28T16:00:00.000Z',
    endTime: '2026-04-28T17:30:00.000Z',
    participantCount: 298,
    problems: [problemPool[1], problemPool[3]],
    isPublic: true,
    tags: ['greedy', 'implementation'],
  },
  {
    id: 'c3',
    title: 'Creators Invitational',
    description: 'Private contest tooling benchmark for hosts.',
    startTime: '2026-04-29T09:00:00.000Z',
    endTime: '2026-04-29T11:00:00.000Z',
    participantCount: 226,
    problems: [problemPool[0], problemPool[2], problemPool[3]],
    isPublic: false,
    tags: ['mixed'],
  },
]

export const problems: Problem[] = problemPool

export const leaderboard: LeaderboardEntry[] = [
  { rank: 1, user: users[2], score: 1150, solvedCount: 4, lastSubmission: '2026-04-20T18:08:00.000Z' },
  { rank: 2, user: users[0], score: 980, solvedCount: 3, lastSubmission: '2026-04-20T18:15:00.000Z' },
  { rank: 3, user: users[1], score: 910, solvedCount: 3, lastSubmission: '2026-04-20T18:20:00.000Z' },
]

export const currentUser: User = users[0]
