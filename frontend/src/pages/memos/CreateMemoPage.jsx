import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createMemo, getMemo, updateMemo } from '../../api/memoApi'
import CreateMemo from '../../components/createMemo.jsx'
import PageLayout from '../../components/PageLayout.jsx'
import '../Page.css'

function CreateMemoPage() {
  const { memoId } = useParams()
  const navigate = useNavigate()
  const editing = Boolean(memoId)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tagsInput, setTagsInput] = useState('')
  const [isPublic, setIsPublic] = useState(false)
  const [loadedMemoId, setLoadedMemoId] = useState(null)
  const loading = editing && loadedMemoId !== memoId
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!memoId) return undefined

    let active = true
    getMemo(memoId)
      .then((memo) => {
        if (!active) return
        setTitle(memo.title)
        setContent(memo.content || '')
        setTagsInput((memo.tags || []).join(', '))
        setIsPublic(Boolean(memo.isPublic))
      })
      .catch((loadError) => {
        if (active) setError(loadError.message)
      })
      .finally(() => {
        if (active) setLoadedMemoId(memoId)
      })

    return () => {
      active = false
    }
  }, [memoId])

  async function handleSubmit(event) {
    event.preventDefault()
    setSaving(true)
    setError('')

    try {
      const tags = [...new Set(tagsInput.split(/[,、]/).map((tag) => tag.trim()).filter(Boolean))]
      const memo = { title: title.trim(), content, tags, isPublic }
      if (editing) {
        await updateMemo(memoId, memo)
      } else {
        await createMemo(memo)
      }
      navigate('/memos')
    } catch (saveError) {
      setError(saveError.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <PageLayout>
      <main className="page-content">
        <p className="page-eyebrow">{editing ? 'EDIT NOTE' : 'NEW NOTE'}</p>
        <h1 className="page-title">{editing ? 'メモを編集' : '新しいメモを書く'}</h1>
        <p className="page-description">
          {editing ? '内容を更新して保存できます。' : '思いついたことを、ここに書き留めましょう。'}
        </p>

        {error && (
          <div className="page-error" role="alert">
            <span>{error}</span>
            <button type="button" onClick={() => setError('')} aria-label="エラーを閉じる">×</button>
          </div>
        )}

        {loading ? (
          <p className="page-loading">メモを読み込んでいます…</p>
        ) : (
          <CreateMemo
            editingId={editing ? memoId : null}
            title={title}
            content={content}
            tagsInput={tagsInput}
            isPublic={isPublic}
            saving={saving}
            onTitleChange={setTitle}
            onContentChange={setContent}
            onTagsChange={setTagsInput}
            onVisibilityChange={setIsPublic}
            onSubmit={handleSubmit}
            onCancel={() => navigate('/memos')}
          />
        )}
      </main>
    </PageLayout>
  )
}

export default CreateMemoPage
