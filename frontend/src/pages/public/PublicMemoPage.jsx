import { useEffect, useMemo, useState } from 'react'
import { getPublicMemos, likePublicMemo, unlikePublicMemo } from '../../api/memoApi'
import { useAuth } from '../../contexts/useAuth.js'
import PageLayout from '../../components/PageLayout.jsx'
import { useNavigate } from 'react-router-dom'
import '../Page.css'
import './PublicMemoPage.css'

function formatDate(value) {
  return new Intl.DateTimeFormat('ja-JP', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(value))
}

function PublicMemoPage() {
  const { isAuthenticated, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [memos, setMemos] = useState([])
  const [search, setSearch] = useState('')
  const [selectedTag, setSelectedTag] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [likingIds, setLikingIds] = useState(() => new Set())

  useEffect(() => {
    let active = true
    getPublicMemos()
      .then((publicMemos) => { if (active) setMemos(publicMemos) })
      .catch((loadError) => { if (active) setError(loadError.message) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  const tags = useMemo(
    () => [...new Set(memos.flatMap((memo) => memo.tags || []))].sort((a, b) => a.localeCompare(b, 'ja')),
    [memos],
  )
  const filteredMemos = useMemo(() => {
    const keyword = search.trim().toLocaleLowerCase('ja-JP')
    return memos.filter((memo) => {
      const matchesSearch = !keyword ||
        `${memo.title} ${memo.content} ${(memo.tags || []).join(' ')} ${memo.owner?.name || ''}`
          .toLocaleLowerCase('ja-JP').includes(keyword)
      const matchesTag = !selectedTag || (memo.tags || []).includes(selectedTag)
      return matchesSearch && matchesTag
    })
  }, [memos, search, selectedTag])

  async function handleLike(memo) {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/public-memos' } })
      return
    }

    setLikingIds((current) => new Set(current).add(memo._id))
    setError('')
    try {
      const result = memo.likedByMe
        ? await unlikePublicMemo(memo._id)
        : await likePublicMemo(memo._id)
      setMemos((current) => current.map((item) => item._id === memo._id ? { ...item, ...result } : item))
    } catch (likeError) {
      setError(likeError.message)
    } finally {
      setLikingIds((current) => {
        const next = new Set(current)
        next.delete(memo._id)
        return next
      })
    }
  }

  return (
    <PageLayout>
      <main className="page-content public-page">
        <header className="public-page-heading">
          <p className="page-eyebrow"><span aria-hidden="true">✳</span> OPEN NOTEBOOK</p>
          <h1 className="page-title">みんなのメモ</h1>
          <p className="page-description">公開されたメモをのぞいてみましょう。気になる言葉やアイデアに出会えるかもしれません。</p>
          <div className="public-page-search">
            <span aria-hidden="true">⌕</span>
            <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="タイトル、本文、タグで検索" aria-label="公開メモを検索" />
          </div>
        </header>

        {tags.length > 0 && (
          <div className="public-tag-filters" aria-label="タグで絞り込み">
            <button className={!selectedTag ? 'selected' : ''} type="button" onClick={() => setSelectedTag('')} aria-pressed={!selectedTag}>すべて</button>
            {tags.map((tag) => (
              <button className={selectedTag === tag ? 'selected' : ''} key={tag} type="button" onClick={() => setSelectedTag(selectedTag === tag ? '' : tag)} aria-pressed={selectedTag === tag}>{tag}</button>
            ))}
          </div>
        )}

        {error && <p className="page-error" role="alert">{error}</p>}

        {loading ? (
          <div className="public-empty"><span className="loading-mark" /><p>公開メモを読み込んでいます…</p></div>
        ) : filteredMemos.length === 0 ? (
          <div className="public-empty">
            <span aria-hidden="true">☁</span>
            <h2>{search || selectedTag ? '見つかりませんでした' : 'まだ公開メモはありません'}</h2>
            <p>{search || selectedTag ? '検索条件やタグを変えてみてください。' : '公開されたメモがここに表示されます。'}</p>
          </div>
        ) : (
          <section className="public-memo-grid" aria-label="公開メモ">
            {filteredMemos.map((memo) => (
              <article className="public-memo-card" key={memo._id}>
                <div className="public-memo-topline">
                  <span>{memo.isPinned ? '✦ FEATURED' : 'OPEN NOTE'}</span>
                  <time dateTime={memo.updatedAt}>{formatDate(memo.updatedAt)}</time>
                </div>
                <h2>{memo.title}</h2>
                <p className="public-memo-content">{memo.content || '本文はありません。'}</p>
                {memo.tags?.length > 0 && (
                  <div className="public-memo-tags" aria-label="タグ">
                    {memo.tags.map((tag) => <span key={`${memo._id}-${tag}`}>{tag}</span>)}
                  </div>
                )}
                <div className="public-memo-author">
                  <span className="author-avatar" aria-hidden="true">{memo.owner?.name?.slice(0, 1) || '✳'}</span>
                  <span>{memo.owner?.name || '匿名ユーザー'}</span>
                  <button
                    className={`public-like-button${memo.likedByMe ? ' is-liked' : ''}`}
                    type="button"
                    onClick={() => handleLike(memo)}
                    disabled={authLoading || likingIds.has(memo._id)}
                    aria-pressed={Boolean(memo.likedByMe)}
                    aria-label={memo.likedByMe ? `「${memo.title}」のいいねを取り消す` : `「${memo.title}」にいいねする`}
                    title={isAuthenticated ? (memo.likedByMe ? 'いいねを取り消す' : 'いいね') : 'いいねするにはログインしてください'}
                  >
                    <span aria-hidden="true">{memo.likedByMe ? '♥' : '♡'}</span>
                    <span>{memo.likeCount || 0}</span>
                  </button>
                </div>
              </article>
            ))}
          </section>
        )}
      </main>
    </PageLayout>
  )
}

export default PublicMemoPage
