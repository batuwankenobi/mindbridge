import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../hooks/useAuth'
import { useDB } from '../hooks/useDB'

export default function ProfilePage() {
  const { t, i18n } = useTranslation()
  const { user } = useAuth()
  const db = useDB()
  const lang = i18n.language

  const [name, setName] = useState(user?.user_metadata?.full_name || '')
  const [saved, setSaved] = useState(false)
  const [burnoutHistory, setBurnoutHistory] = useState([])

  useEffect(() => {
    db.getBurnoutHistory().then(({ data }) => setBurnoutHistory(data || []))
  }, [])

  const handleSave = async () => {
    await db.updateProfile({ full_name: name })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const toggleLang = () => {
    const next = lang === 'en' ? 'tr' : 'en'
    i18n.changeLanguage(next)
    localStorage.setItem('mb_lang', next)
  }

  return (
    <div className="fade-up">
      <h1 className="page-title">{t('nav.profile')}</h1>
      <p className="page-subtitle">{user?.email}</p>

      <div className="card" style={{ marginBottom: '1rem', maxWidth: 480 }}>
        <h3 style={{ fontSize: '16px', fontWeight: 500, marginBottom: '1rem' }}>{lang === 'tr' ? 'Hesap bilgileri' : 'Account details'}</h3>
        <div style={{ marginBottom: '12px' }}>
          <label style={{ fontSize: '13px', color: 'var(--gray-400)', display: 'block', marginBottom: '4px' }}>{t('auth.name')}</label>
          <input value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div style={{ marginBottom: '12px' }}>
          <label style={{ fontSize: '13px', color: 'var(--gray-400)', display: 'block', marginBottom: '4px' }}>{t('auth.email')}</label>
          <input value={user?.email || ''} disabled style={{ background: 'var(--gray-100)', color: 'var(--gray-400)' }} />
        </div>
        <button onClick={handleSave} className="btn-primary">
          {saved ? '✓' : t('common.save')}
        </button>
      </div>

      <div className="card" style={{ marginBottom: '1rem', maxWidth: 480 }}>
        <h3 style={{ fontSize: '16px', fontWeight: 500, marginBottom: '1rem' }}>{t('common.language')}</h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['en', 'tr'].map(l => (
            <button key={l} onClick={() => { i18n.changeLanguage(l); localStorage.setItem('mb_lang', l) }} style={{
              padding: '8px 20px', borderRadius: 8, fontSize: 14, fontWeight: 500,
              background: lang === l ? 'var(--purple-600)' : 'var(--gray-100)',
              color: lang === l ? 'white' : 'var(--gray-600)',
              border: 'none', cursor: 'pointer'
            }}>
              {l === 'en' ? '🇬🇧 English' : '🇹🇷 Türkçe'}
            </button>
          ))}
        </div>
      </div>

      {burnoutHistory.length > 0 && (
        <div className="card" style={{ maxWidth: 480 }}>
          <h3 style={{ fontSize: '16px', fontWeight: 500, marginBottom: '1rem' }}>
            {lang === 'tr' ? 'Tükenmişlik geçmişi' : 'Burnout history'}
          </h3>
          {burnoutHistory.slice(0, 5).map(b => (
            <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--gray-100)' }}>
              <span style={{ fontSize: '13px', color: 'var(--gray-400)' }}>{new Date(b.created_at).toLocaleDateString()}</span>
              <span style={{ fontWeight: 500 }}>{b.score}/100 — {b.level}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
