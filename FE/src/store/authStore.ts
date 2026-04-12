import { create } from 'zustand'
import type { User } from '../types'
import { currentUser } from '../lib/mockData'

interface AuthState {
  user: User | null
  token: string | null
  login: (token: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  login: (token) => set({ token, user: currentUser }),
  logout: () => set({ token: null, user: null }),
}))
