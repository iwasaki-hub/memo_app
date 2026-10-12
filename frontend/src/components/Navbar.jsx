import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBook,
  faBookOpen,
  faBars,
  faCircleQuestion,
  faHouse,
  faPenToSquare,
  faRightFromBracket,
  faRightToBracket,
  faUser,
  faUserPlus,
  faXmark,
} from '@fortawesome/free-solid-svg-icons'
import { useAuth } from '../contexts/useAuth.js'
import './Navbar.css'

const navigation = [
  { to: '/', label: 'ホーム', icon: faHouse, end: true },
  { to: '/usage', label: '使い方', icon: faCircleQuestion },
  { to: '/public-memos', label: 'みんなのメモ', icon: faBookOpen },
  { to: '/memos/new', label: 'メモを書く', icon: faPenToSquare, private: true },
  { to: '/memos', label: 'メモ一覧', icon: faBook, private: true },
]

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (!menuOpen) return undefined

    function closeOnEscape(event) {
      if (event.key === 'Escape') setMenuOpen(false)
    }

    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [menuOpen])

  useEffect(() => {
    if (!menuOpen) return undefined

    function closeOnScroll() {
      setMenuOpen(false)
    }

    function closeOnWheel(event) {
      if (event.deltaY !== 0) setMenuOpen(false)
    }

    window.addEventListener('scroll', closeOnScroll, { passive: true })
    document.addEventListener('scroll', closeOnScroll, true)
    document.addEventListener('wheel', closeOnWheel, { passive: true })
    document.addEventListener('touchmove', closeOnScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', closeOnScroll)
      document.removeEventListener('scroll', closeOnScroll, true)
      document.removeEventListener('wheel', closeOnWheel)
      document.removeEventListener('touchmove', closeOnScroll)
    }
  }, [menuOpen])

  async function handleLogout() {
    setMenuOpen(false)
    try {
      await logout()
      navigate('/login')
    } catch {
      // AuthContext keeps the error for the current screen to display if needed.
    }
  }

  return (
    <header className="topbar">
      <Link className="brand" to="/" aria-label="Memo ホーム" onClick={() => setMenuOpen(false)}>
        <span className="brand-mark" aria-hidden="true">M</span>
        <span>Memo</span>
      </Link>

      <button
        className="nav-menu-toggle"
        type="button"
        aria-label={menuOpen ? 'メニューを閉じる' : 'メニューを開く'}
        aria-expanded={menuOpen}
        aria-controls="primary-navigation"
        onClick={() => setMenuOpen((open) => !open)}
      >
        <FontAwesomeIcon icon={menuOpen ? faXmark : faBars} aria-hidden="true" />
      </button>

      <nav id="primary-navigation" className={`nav-links${menuOpen ? ' is-open' : ''}`} aria-label="メインナビゲーション">
        {navigation.filter((item) => !item.private || isAuthenticated).map(({ to, label, icon, end }) => (
          <NavLink to={to} end={end} key={to} onClick={() => setMenuOpen(false)}>
            <FontAwesomeIcon className="nav-icon" icon={icon} aria-hidden="true" />
            <span>{label}</span>
          </NavLink>
        ))}
        {!isAuthenticated && (
          <div className="nav-mobile-auth">
            <Link className="nav-mobile-login" to="/login" onClick={() => setMenuOpen(false)}>
              <FontAwesomeIcon icon={faRightToBracket} aria-hidden="true" />
              <span>ログイン</span>
            </Link>
            <Link className="nav-mobile-register" to="/register" onClick={() => setMenuOpen(false)}>
              <FontAwesomeIcon icon={faUserPlus} aria-hidden="true" />
              <span>新規登録</span>
            </Link>
          </div>
        )}
      </nav>

      <div className="topbar-meta">
        {isAuthenticated ? (
          <>
            <span className="nav-user"><FontAwesomeIcon icon={faUser} aria-hidden="true" />{user?.name || user?.email}</span>
            <button className="nav-logout" type="button" onClick={handleLogout}>
              <FontAwesomeIcon icon={faRightFromBracket} aria-hidden="true" />
              <span>ログアウト</span>
            </button>
          </>
        ) : (
          <>
            <Link className="nav-auth-link" to="/login" onClick={() => setMenuOpen(false)}>
              <FontAwesomeIcon icon={faRightToBracket} aria-hidden="true" />
              <span>ログイン</span>
            </Link>
            <Link className="nav-auth-link nav-register-link" to="/register" onClick={() => setMenuOpen(false)}>
              <FontAwesomeIcon icon={faUserPlus} aria-hidden="true" />
              <span>新規登録</span>
            </Link>
          </>
        )}
      </div>
    </header>
  )
}

export default Navbar
