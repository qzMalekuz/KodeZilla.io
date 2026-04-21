import { create } from 'zustand'

export interface AuthUser {
  id: string
  name: string
  email: string
  role: string
}

interface AuthState {
  user: AuthUser | null
  token: string | null
  login: (token: string, user: AuthUser) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  login: (token, user) => set({ token, user }),
  logout: () => set({ token: null, user: null }),
}))
