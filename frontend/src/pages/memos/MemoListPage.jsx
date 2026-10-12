import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { deleteMemo, getMemos, updateMemo } from '../../api/memoApi'
import MemoList from '../../components/memoList.jsx'
import PageLayout from '../../components/PageLayout.jsx'
import '../Page.css'

function MemoListPage() {
  const navigate = useNavigate()
  const [memos, setMemos] = useState([])
  const [search, setSearch] = useState('')
  const [selectedTag, setSelectedTag] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function loadMemos() {
    setLoading(true)
    setError('')
    try {
      setMemos(await getMemos())
    } catch (loadError) {
      setError(loadError.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let active = true
    getMemos()
      .then((items) => { if (active) setMemos(items) })
      .catch((loadError) => { if (active) setError(loadError.message) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  const availableTags = useMemo(
    () => [...new Set(memos.flatMap((memo) => memo.tags || []))].sort((a, b) => a.localeCompare(b, 'ja')),
    [memos],
  )

  const filteredMemos = useMemo(() => {
    const keyword = search.trim().toLocaleLowerCase('ja-JP')
    return memos.filter((memo) => {
      const matchesSearch = !keyword ||
        `${memo.title} ${memo.content} ${(memo.tags || []).join(' ')}`.toLocaleLowerCase('ja-JP').includes(keyword)
      const matchesTag = !selectedTag || (memo.tags || []).includes(selectedTag)
      return matchesSearch && matchesTag
    })
  }, [memos, search, selectedTag])

  async function handleDelete(memo) {
    if (!window.confirm(`「${memo.title}」を削除しますか？`)) return

    setError('')
    try {
      await deleteMemo(memo._id)
      await loadMemos()
    } catch (deleteError) {
      setError(deleteError.message)
    }
  }

  async function handleTogglePin(memo) {
    setError('')
    try {
      const updatedMemo = await updateMemo(memo._id, { isPinned: !memo.isPinned })
      setMemos((current) => current
        .map((item) => item._id === updatedMemo._id ? updatedMemo : item)
        .sort((a, b) => Number(Boolean(b.isPinned)) - Number(Boolean(a.isPinned)) || new Date(b.updatedAt) - new Date(a.updatedAt)))
    } catch (updateError) {
      setError(updateError.message)
    }
  }

  async function handleToggleVisibility(memo) {
    setError('')
    try {
      const updatedMemo = await updateMemo(memo._id, { isPublic: !memo.isPublic })
      setMemos((current) => current.map((item) => item._id === updatedMemo._id ? updatedMemo : item))
    } catch (updateError) {
      setError(updateError.message)
    }
  }

  return (
    <PageLayout>
      <main className="page-content">
        <p className="page-eyebrow">YOUR ARCHIVE · {memos.length} NOTES</p>
        <h1 className="page-title">メモを見返す</h1>
        <p className="page-description">保存した記録を検索、編集、削除できます。</p>

        {error && (
          <div className="page-error" role="alert">
            <span>{error}</span>
            <button type="button" onClick={() => setError('')} aria-label="エラーを閉じる">×</button>
          </div>
        )}

        <MemoList
          memos={filteredMemos}
          search={search}
          availableTags={availableTags}
          selectedTag={selectedTag}
          loading={loading}
          onSearchChange={setSearch}
          onTagChange={setSelectedTag}
          onEdit={(memo) => navigate(`/memos/${memo._id}/edit`)}
          onDelete={handleDelete}
          onTogglePin={handleTogglePin}
          onToggleVisibility={handleToggleVisibility}
        />
      </main>
    </PageLayout>
  )
}

export default MemoListPage
