import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/home/Home.jsx'
import CreateMemoPage from './pages/memos/CreateMemoPage.jsx'
import MemoListPage from './pages/memos/MemoListPage.jsx'
import AuthPage from './pages/auth/AuthPage.jsx'
import { useAuth } from './contexts/useAuth.js'
import PublicMemoPage from './pages/public/PublicMemoPage.jsx'
import Usage from './pages/usage/Usage.jsx'

function RequireAuth({ children }) {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()

  if (loading) return <main className="auth-route-loading" aria-live="polite">ログイン状態を確認しています…</main>
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  return children
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/public-memos" element={<PublicMemoPage />} />
        <Route path="/usage" element={<Usage />} />
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/register" element={<AuthPage mode="register" />} />
        <Route path="/memos/new" element={<RequireAuth><CreateMemoPage /></RequireAuth>} />
        <Route path="/memos" element={<RequireAuth><MemoListPage /></RequireAuth>} />
        <Route path="/memos/:memoId/edit" element={<RequireAuth><CreateMemoPage /></RequireAuth>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
