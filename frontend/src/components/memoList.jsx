import './MemoList.css'

function formatDate(value) {
  return new Intl.DateTimeFormat('ja-JP', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

function MemoList({ memos, search, availableTags, selectedTag, loading, onSearchChange, onTagChange, onEdit, onDelete, onTogglePin, onToggleVisibility }) {
  return (
    <section className="notes-section" id="memo-list" aria-labelledby="notes-title">
      <div className="notes-toolbar">
        <div className="panel-heading">
          <span className="section-index">02</span>
          <h2 id="notes-title">すべてのメモ</h2>
        </div>
        <label className="search-box">
          <span className="search-icon" aria-hidden="true">⌕</span>
          <input
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="メモを検索"
            aria-label="メモを検索"
          />
        </label>
      </div>

      {availableTags.length > 0 && (
        <div className="tag-filters" aria-label="タグで絞り込み">
          <button className={!selectedTag ? 'selected' : ''} type="button" onClick={() => onTagChange('')} aria-pressed={!selectedTag}>すべて</button>
          {availableTags.map((tag) => (
            <button className={selectedTag === tag ? 'selected' : ''} key={tag} type="button" onClick={() => onTagChange(selectedTag === tag ? '' : tag)} aria-pressed={selectedTag === tag}>{tag}</button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="empty-state">
          <span className="loading-mark" />
          <p>メモを読み込んでいます…</p>
        </div>
      ) : memos.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon" aria-hidden="true">✳</span>
          <h3>{search || selectedTag ? '一致するメモがありません' : 'まだメモはありません'}</h3>
          <p>{search || selectedTag ? '検索条件やタグを変えてみてください。' : '新しいメモを書いてみましょう。'}</p>
        </div>
      ) : (
        <div className="memo-list">
          {memos.map((memo, index) => (
            <article className={`memo-card${memo.isPinned ? ' memo-card-pinned' : ''}`} key={memo._id}>
              <div className="memo-card-topline">
                <span className="memo-number">{memo.isPinned ? 'PINNED' : `NOTE / ${String(index + 1).padStart(2, '0')}`}</span>
                <time dateTime={memo.updatedAt}>{formatDate(memo.updatedAt)}</time>
              </div>
              {memo.owner && <p className="memo-owner">記録者：{memo.owner.name || memo.owner.email}</p>}
              <span className={`visibility-badge${memo.isPublic ? ' is-public' : ''}`}>
                {memo.isPublic ? '公開中' : '非公開'}
              </span>
              <h3>{memo.title}</h3>
              {memo.tags?.length > 0 && (
                <div className="memo-tags" aria-label="タグ">
                  {memo.tags.map((tag) => <span key={`${memo._id}-${tag}`}>{tag}</span>)}
                </div>
              )}
              <p className="memo-content">{memo.content || '本文はありません。'}</p>
              <div className="memo-card-actions">
                <button className={`pin-button${memo.isPinned ? ' is-pinned' : ''}`} type="button" onClick={() => onTogglePin(memo)} aria-pressed={Boolean(memo.isPinned)}>
                  {memo.isPinned ? '★ 固定中' : '☆ ピン留め'}
                </button>
                <button className="visibility-button" type="button" onClick={() => onToggleVisibility(memo)} aria-label={memo.isPublic ? 'メモを非公開にする' : 'メモを公開する'}>
                  {memo.isPublic ? '非公開にする' : '公開する'}
                </button>
                <button type="button" onClick={() => onEdit(memo)}>
                  編集 <span aria-hidden="true">↗</span>
                </button>
                <button className="delete-button" type="button" onClick={() => onDelete(memo)}>
                  削除
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default MemoList
