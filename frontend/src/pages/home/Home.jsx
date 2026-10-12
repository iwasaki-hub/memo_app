import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getMemos } from '../../api/memoApi'
import { useAuth } from '../../contexts/useAuth.js'
import PageLayout from '../../components/PageLayout.jsx'
import '../Page.css'
import './Home.css'

function Home() {
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const [memoCount, setMemoCount] = useState(null)

  useEffect(() => {
    if (authLoading || !isAuthenticated) return undefined

    let active = true
    getMemos()
      .then((memos) => {
        if (active) setMemoCount(memos.length)
      })
      .catch(() => {
        if (active) setMemoCount(null)
      })

    return () => {
      active = false
    }
  }, [authLoading, isAuthenticated])

  return (
    <PageLayout>
      <main className="page-content home-page">
        <section className="home-hero">
          <div className="home-copy">
            <p className="home-kicker"><span className="kicker-sun" aria-hidden="true">✳</span> こころに、すこし余白を。</p>
            <h1 className="home-title">考えごとは、<br /><span>ここに置いて。</span></h1>
            <p className="home-description">思いつきも、忘れたくないことも。書き留めるだけで、気持ちがふっと軽くなる。</p>
            <div className="home-actions">
              <Link className="home-cta" to={isAuthenticated ? '/memos/new' : '/register'}>
                {isAuthenticated ? 'メモを書いてみる' : '無料ではじめる'} <span aria-hidden="true">→</span>
              </Link>
              <Link className="home-secondary" to={isAuthenticated ? '/memos' : '/login'}>
                {isAuthenticated ? 'メモを見返す' : 'ログイン'}
              </Link>
            </div>
            <div className="home-trust"><span className="trust-dots" aria-hidden="true"><i /><i /><i /></span> あなただけの、プライベートな記録帳</div>
          </div>
          <div className="home-art" aria-label="太陽と雲のイラスト" role="img">
            <div className="art-sun" />
            <div className="art-orbit orbit-one" />
            <div className="art-orbit orbit-two" />
            <div className="art-cloud"><span /><span /><span /></div>
            <div className="art-note note-one"><span>今日の気づき</span><i>✳</i></div>
            <div className="art-note note-two"><span>深呼吸して、ひとつずつ。</span><i>↗</i></div>
            <span className="art-spark spark-one">✦</span>
            <span className="art-spark spark-two">✳</span>
            <span className="art-spark spark-three">·</span>
          </div>
        </section>

        <section className="home-welcome-strip" aria-label="メモの状況">
          <div className="welcome-icon" aria-hidden="true">☼</div>
          <div className="welcome-message">
            <strong>{isAuthenticated ? `おかえりなさい${user?.name ? `、${user.name}さん` : ''}。` : '自分のペースで、書いてみよう。'}</strong>
            <span>{isAuthenticated ? 'あなたの記録は、あなただけのものです。' : 'アカウントを作ると、メモを安全に保存できます。'}</span>
          </div>
          <div className="welcome-count">
            <strong>{!isAuthenticated || memoCount === null ? '—' : memoCount}</strong>
            <span>保存したメモ</span>
          </div>
        </section>

        <section className="home-shortcuts" aria-label="メモの使い方">
          <Link className="shortcut-card shortcut-create" to={isAuthenticated ? '/memos/new' : '/register'}>
            <span className="shortcut-icon" aria-hidden="true">＋</span>
            <span className="shortcut-title">書き留める</span>
            <span className="shortcut-description">浮かんだアイデアを、気軽にメモ。</span>
            <span className="shortcut-arrow" aria-hidden="true">↗</span>
          </Link>
          <Link className="shortcut-card shortcut-browse" to={isAuthenticated ? '/memos' : '/login'}>
            <span className="shortcut-icon" aria-hidden="true">☁</span>
            <span className="shortcut-title">振り返る</span>
            <span className="shortcut-description">これまでの自分の言葉を見つけよう。</span>
            <span className="shortcut-arrow" aria-hidden="true">↗</span>
          </Link>
          <Link className="shortcut-card shortcut-breathe" to="/public-memos">
            <span className="shortcut-icon" aria-hidden="true">☼</span>
            <span className="shortcut-title">みんなのメモ</span>
            <span className="shortcut-description">公開されたメモから、新しい発見を。</span>
            <span className="shortcut-decoration" aria-hidden="true">☺</span>
          </Link>
        </section>
      </main>
    </PageLayout>
  )
}

export default Home
