import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub, faInstagram, faXTwitter, faYoutube } from '@fortawesome/free-brands-svg-icons'
import './Footer.css'

const currentYear = new Date().getFullYear()

const socialLinks = [
  { label: 'X', href: 'https://x.com/', icon: faXTwitter },
  { label: 'Instagram', href: 'https://www.instagram.com/', icon: faInstagram },
  { label: 'YouTube', href: 'https://www.youtube.com/', icon: faYoutube },
  { label: 'GitHub', href: 'https://github.com/', icon: faGithub },
]

function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-main">
        <div className="footer-brand">
          <Link className="footer-wordmark" to="/">
            <span className="footer-brand-mark" aria-hidden="true">M</span>
            <span>Memo</span>
          </Link>
          <p>あなたのための小さな記録帳。<br />思いつきを、ここに書き留めて。</p>
        </div>

        <nav className="footer-links" aria-label="フッターナビゲーション">
          <h2>EXPLORE</h2>
          <Link to="/usage">使い方</Link>
          <Link to="/public-memos">みんなのメモ</Link>
        </nav>

        <div className="footer-social">
          <h2>FIND US AROUND</h2>
          <p>SNS・プロジェクトのリンク</p>
          <div className="footer-social-links">
            {socialLinks.map(({ label, href, icon }) => (
              <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={`${label}を開く`} title={label}>
                <FontAwesomeIcon icon={icon} aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {currentYear} Memo</span>
        <span>MADE FOR YOUR MOMENTS</span>
      </div>
    </footer>
  )
}

export default Footer
