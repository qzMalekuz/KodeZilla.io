import { Route, Routes } from 'react-router-dom'
import { LoginForm } from './components/features/auth/LoginForm'
import { SignupForm } from './components/features/auth/SignupForm'
import { PageWrapper } from './components/layout/PageWrapper'
import { ContestPage } from './pages/ContestPage'
import { ExplorePage } from './pages/ExplorePage'
import { HostContestPage } from './pages/HostContestPage'
import { LandingPage } from './pages/LandingPage'
import { LeaderboardPage } from './pages/LeaderboardPage'
import { ProblemPage } from './pages/ProblemPage'
import { ProfilePage } from './pages/ProfilePage'

export function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/explore" element={<ExplorePage />} />
      <Route path="/leaderboard" element={<LeaderboardPage />} />
      <Route path="/contest/:id" element={<ContestPage />} />
      <Route path="/contest/:id/problem/:pid" element={<ProblemPage />} />
      <Route path="/host" element={<HostContestPage />} />
      <Route path="/profile/:username" element={<ProfilePage />} />
      <Route
        path="/login"
        element={
          <PageWrapper>
            <div className="mx-auto max-w-md py-20">
              <LoginForm />
            </div>
          </PageWrapper>
        }
      />
      <Route
        path="/signup"
        element={
          <PageWrapper>
            <div className="mx-auto max-w-md py-20">
              <SignupForm />
            </div>
          </PageWrapper>
        }
      />
    </Routes>
  )
}
