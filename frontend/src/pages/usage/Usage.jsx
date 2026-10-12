import { Link } from 'react-router-dom'
import PageLayout from '../../components/PageLayout.jsx'
import '../Page.css'
import './Usage.css'

const guides = [
  { number: '01', title: 'アカウントを作る', description: '新規登録すると、自分専用のメモを保存できます。次回からはログインして続きを利用できます。', link: { to: '/register', label: '新規登録へ' } },
  { number: '02', title: 'メモを書く・整理する', description: 'タイトルと本文を書いて保存します。タグを付けて検索したり、ピン留めして一覧の上に固定したりできます。', link: { to: '/memos/new', label: 'メモを書く' }, requiresAuth: true },
  { number: '03', title: '公開範囲を選ぶ', description: 'メモごとに公開・非公開を切り替えられます。公開すると「みんなのメモ」に表示され、誰でも読めます。', link: { to: '/public-memos', label: '公開メモを見る' } },
  { number: '04', title: 'いいねをする', description: '公開メモのハートボタンでいいねできます。利用にはログインが必要で、もう一度押すと取り消せます。', link: { to: '/public-memos', label: 'みんなのメモへ' } },
]

function Usage() {
  return (
    <PageLayout>
      <main className="page-content usage-page">
        <header className="usage-heading">
          <p className="page-eyebrow">A LITTLE GUIDE</p>
          <h1 className="page-title">Memo の使い方</h1>
          <p className="page-description">書き留めて、見返して。必要なときは、みんなと分かち合えます。</p>
        </header>
        <ol className="usage-guide-list">
          {guides.map((guide) => (
            <li className="usage-guide-card" key={guide.number}>
              <span className="usage-guide-number" aria-hidden="true">{guide.number}</span>
              <div className="usage-guide-copy">
                <h2>{guide.title}</h2>
                <p>{guide.description}</p>
                <Link to={guide.link.to}>{guide.link.label}<span aria-hidden="true"> ↗</span></Link>
              </div>
            </li>
          ))}
        </ol>
        <aside className="usage-privacy-note">
          <span aria-hidden="true">☁</span>
          <p><strong>メモは最初は非公開です。</strong><br />公開設定を変えない限り、ほかの人の公開メモ一覧には表示されません。</p>
        </aside>
      </main>
    </PageLayout>
  )
}

export default Usage
