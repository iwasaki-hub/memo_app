import './CreateMemo.css'

function CreateMemo({
  editingId,
  title,
  content,
  tagsInput,
  isPublic,
  saving,
  onTitleChange,
  onContentChange,
  onTagsChange,
  onVisibilityChange,
  onSubmit,
  onCancel,
}) {
  return (
    <section className="composer-panel" id="new-memo" aria-labelledby="composer-title">
      <div className="panel-heading">
        <span className="section-index">01</span>
        <h2 id="composer-title">{editingId ? 'メモを編集' : '新しいメモ'}</h2>
      </div>
      <form className="memo-form" onSubmit={onSubmit}>
        <label htmlFor="memo-title">タイトル</label>
        <input
          id="memo-title"
          name="title"
          value={title}
          onChange={(event) => onTitleChange(event.target.value)}
          placeholder="メモのタイトル"
          maxLength={200}
          required
        />

        <label htmlFor="memo-content">本文</label>
        <textarea
          id="memo-content"
          name="content"
          value={content}
          onChange={(event) => onContentChange(event.target.value)}
          placeholder="ここに書き留める…"
          rows={8}
        />

        <label htmlFor="memo-tags">タグ</label>
        <input
          id="memo-tags"
          name="tags"
          value={tagsInput}
          onChange={(event) => onTagsChange(event.target.value)}
          placeholder="例：アイデア, 仕事"
          aria-describedby="memo-tags-help"
        />
        <p className="tag-help" id="memo-tags-help">カンマ区切りで最大10個まで追加できます。</p>

        <label className="visibility-choice" htmlFor="memo-is-public">
          <input
            id="memo-is-public"
            name="isPublic"
            type="checkbox"
            checked={isPublic}
            onChange={(event) => onVisibilityChange(event.target.checked)}
          />
          <span className="visibility-copy">
            <strong>このメモを公開する</strong>
            <small>公開メモ一覧に表示され、誰でも読めるようになります。</small>
          </span>
        </label>

        <div className="form-actions">
          {editingId && (
            <button className="button button-quiet" type="button" onClick={onCancel}>
              キャンセル
            </button>
          )}
          <button className="button button-primary" type="submit" disabled={saving}>
            <span>{saving ? '保存中…' : editingId ? '変更を保存' : 'メモを保存'}</span>
            {!saving && <span aria-hidden="true">↗</span>}
          </button>
        </div>
      </form>
      <p className="form-footnote">保存したメモは MongoDB に記録されます。</p>
    </section>
  )
}

export default CreateMemo
