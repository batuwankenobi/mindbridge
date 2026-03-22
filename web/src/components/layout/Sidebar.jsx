import { NavLink, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../hooks/useAuth'

const NAV = [
  { key: 'home', path: '/', icon: '🏠' },
  { key: 'journal', path: '/journal', icon: '📓' },
  { key: 'chat', path: '/chat', icon: '💬' },
  { key: 'burnout', path: '/burnout', icon: '🔋' },
  { key: 'crisis', path: '/crisis', icon: '🆘' },
  { key: 'profile', path: '/profile', icon: '👤' }
]

export default function Sidebar() {
  const { t, i18n } = useTranslation()
  const { signOut } = useAuth()
  const navigate = useNavigate()

  const toggleLang = () => {
    const next = i18n.language === 'en' ? 'tr' : 'en'
    i18n.changeLanguage(next)
    localStorage.setItem('mb_lang', next)
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/auth')
  }

  return (
    <nav className="sidebar">
      <div className="nav-logo">MindBridge</div>

      <div style={{ flex: 1 }}>
        {NAV.map(item => (
          <NavLink
            key={item.key}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            {t(`nav.${item.key}`)}
          </NavLink>
        ))}
      </div>

      <div style={{ borderTop: '1px solid var(--gray-200)', paddingTop: '1rem' }}>
        <button onClick={toggleLang} className="nav-item" style={{ width: '100%', justifyContent: 'flex-start' }}>
          <span className="nav-icon">🌐</span>
          {i18n.language === 'en' ? 'Türkçe' : 'English'}
        </button>
        <button onClick={handleSignOut} className="nav-item" style={{ width: '100%', justifyContent: 'flex-start', color: 'var(--red-400)' }}>
          <span className="nav-icon">🚪</span>
          {i18n.language === 'en' ? 'Sign out' : 'Çıkış yap'}
        </button>
      </div>
    </nav>
  )
}
