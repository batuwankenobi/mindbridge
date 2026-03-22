import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const NAV = [
  { key: 'home', path: '/', icon: '🏠' },
  { key: 'journal', path: '/journal', icon: '📓' },
  { key: 'chat', path: '/chat', icon: '💬' },
  { key: 'burnout', path: '/burnout', icon: '🔋' },
  { key: 'crisis', path: '/crisis', icon: '🆘' },
]

export default function MobileNav() {
  const { t } = useTranslation()
  return (
    <nav style={{
      display: 'none',
      position: 'fixed', bottom: 0, left: 0, right: 0,
      background: 'white', borderTop: '1px solid var(--gray-200)',
      padding: '8px 0 20px',
      zIndex: 100
    }} className="mobile-nav">
      {NAV.map(item => (
        <NavLink key={item.key} to={item.path} end={item.path === '/'}
          style={({ isActive }) => ({
            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: '2px', textDecoration: 'none', padding: '4px 0',
            color: isActive ? 'var(--purple-600)' : 'var(--gray-400)'
          })}>
          <span style={{ fontSize: 20 }}>{item.icon}</span>
          <span style={{ fontSize: 10, fontWeight: 500 }}>{t(`nav.${item.key}`)}</span>
        </NavLink>
      ))}
    </nav>
  )
}
