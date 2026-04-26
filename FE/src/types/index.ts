export interface Contest {
  id: string
  title: string
  description: string
  startTime: string
  endTime: string
  participantCount: number
  problems: Problem[]
  isPublic: boolean
  tags?: string[]
}

export interface ProblemExample {
  input: string
  output: string
  explanation?: string
}

export interface Problem {
  id: string
  title: string
  difficulty: 'easy' | 'medium' | 'hard'
  tags: string[]
  points: number
  timeLimit?: string
  memoryLimit?: string
  statement?: string
  inputFormat?: string
  outputFormat?: string
  constraints?: string[]
  examples?: ProblemExample[]
  note?: string
}

export interface User {
  id: string
  username: string
  email: string
  rating: number
  rank: number
}

export interface LeaderboardEntry {
  rank: number
  user: User
  score: number
  solvedCount: number
  lastSubmission: string
}
