import { Route, Routes } from 'react-router-dom'
import { LoginForm } from './components/features/auth/LoginForm'
import { SignupForm } from './components/features/auth/SignupForm'
import { PageWrapper } from './components/layout/PageWrapper'
import { ProtectedRoute } from './components/layout/ProtectedRoute'
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

      {/* Protected: require authentication */}
      <Route path="/explore" element={<ProtectedRoute><ExplorePage /></ProtectedRoute>} />
      <Route path="/leaderboard" element={<ProtectedRoute><LeaderboardPage /></ProtectedRoute>} />
      <Route path="/contest/:id" element={<ProtectedRoute><ContestPage /></ProtectedRoute>} />
      <Route path="/contest/:id/problem/:pid" element={<ProtectedRoute><ProblemPage /></ProtectedRoute>} />
      <Route path="/host" element={<ProtectedRoute><HostContestPage /></ProtectedRoute>} />
      <Route path="/profile/:username" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

      <Route
        path="/login"
        element={
          <PageWrapper>
            <div className="mx-auto w-full max-w-[624px] py-16 md:py-24">
              <LoginForm />
            </div>
          </PageWrapper>
        }
      />
      <Route
        path="/signup"
        element={
          <PageWrapper>
            <div className="mx-auto w-full max-w-[624px] py-16 md:py-24">
              <SignupForm />
            </div>
          </PageWrapper>
        }
      />
    </Routes>
  )
}
