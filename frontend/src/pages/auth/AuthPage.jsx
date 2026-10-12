import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/useAuth.js'
import PageLayout from '../../components/PageLayout.jsx'
import '../Page.css'
import './AuthPage.css'

function AuthPage({ mode }) {
  const isRegister = mode === 'register'
  const { isAuthenticated, loading, login, register } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  if (!loading && isAuthenticated) return <Navigate to="/memos" replace />

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      const credentials = { email, password, ...(isRegister ? { name } : {}) }
      if (isRegister) await register(credentials)
      else await login(credentials)
      navigate(location.state?.from || '/memos', { replace: true })
    } catch (authError) {
      setError(authError.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <PageLayout>
      <main className="page-content auth-page">
        <section className="auth-panel">
          <p className="page-eyebrow">YOUR PRIVATE NOTEBOOK</p>
          <h1 className="page-title">{isRegister ? 'アカウントを作成' : 'おかえりなさい'}</h1>
          <p className="page-description">
            {isRegister ? '登録して、自分だけのメモ帳をはじめましょう。' : 'ログインして、あなたのメモを開きましょう。'}
          </p>

          {error && <p className="auth-error" role="alert">{error}</p>}

          <form className="auth-form" onSubmit={handleSubmit}>
            {isRegister && (
              <>
                <label htmlFor="auth-name">お名前</label>
                <input id="auth-name" name="name" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} maxLength={80} />
              </>
            )}
            <label htmlFor="auth-email">メールアドレス</label>
            <input id="auth-email" name="email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
            <label htmlFor="auth-password">パスワード</label>
            <input id="auth-password" name="password" type="password" autoComplete={isRegister ? 'new-password' : 'current-password'} value={password} onChange={(event) => setPassword(event.target.value)} minLength={isRegister ? 8 : undefined} required />
            <button className="button button-primary auth-submit" type="submit" disabled={submitting || loading}>
              {submitting ? '処理中…' : isRegister ? '新規登録' : 'ログイン'}
              {!submitting && <span aria-hidden="true">↗</span>}
            </button>
          </form>

          <p className="auth-switch">
            {isRegister ? 'すでにアカウントをお持ちですか？' : 'はじめて利用しますか？'}{' '}
            <Link to={isRegister ? '/login' : '/register'}>{isRegister ? 'ログイン' : '新規登録'}</Link>
          </p>
        </section>
      </main>
    </PageLayout>
  )
}

export default AuthPage
