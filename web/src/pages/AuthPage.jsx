import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../hooks/useAuth'

export default function AuthPage() {
  const { t } = useTranslation()
  const { signInWithEmail, signUpWithEmail, signInWithGoogle, signInWithApple } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState('signin')
  const [form, setForm] = useState({ email: '', password: '', name: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'signin') {
        const { error } = await signInWithEmail(form.email, form.password)
        if (error) throw error
      } else {
        const { error } = await signUpWithEmail(form.email, form.password, form.name)
        if (error) throw error
      }
      navigate('/')
    } catch (err) {
      setError(err.message || t('common.error'))
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    await signInWithGoogle()
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, var(--purple-50) 0%, var(--teal-50) 100%)', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '36px', color: 'var(--purple-600)', marginBottom: '0.5rem' }}>MindBridge</h1>
          <p style={{ color: 'var(--gray-400)', fontSize: '15px' }}>{t('tagline')}</p>
        </div>

        <div className="card" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '22px', marginBottom: '1.5rem', textAlign: 'center' }}>
            {mode === 'signin' ? t('auth.sign_in') : t('auth.sign_up')}
          </h2>

          <button onClick={handleGoogle} className="btn-secondary" style={{ width: '100%', marginBottom: '8px', justifyContent: 'center', display: 'flex', gap: '8px' }}>
            <span>G</span> {t('auth.google')}
          </button>

          <button className="btn-secondary" style={{ width: '100%', marginBottom: '1.5rem', justifyContent: 'center', display: 'flex', gap: '8px' }}>
            <span>🍎</span> {t('auth.apple')}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--gray-200)' }} />
            <span style={{ fontSize: '13px', color: 'var(--gray-400)' }}>{t('auth.or')}</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--gray-200)' }} />
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {mode === 'signup' && (
              <input type="text" placeholder={t('auth.name')} value={form.name} onChange={e => set('name', e.target.value)} required />
            )}
            <input type="email" placeholder={t('auth.email')} value={form.email} onChange={e => set('email', e.target.value)} required />
            <input type="password" placeholder={t('auth.password')} value={form.password} onChange={e => set('password', e.target.value)} required minLength={6} />

            {error && <p style={{ fontSize: '13px', color: 'var(--red-400)', textAlign: 'center' }}>{error}</p>}

            <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', marginTop: '4px' }}>
              {loading ? t('common.loading') : mode === 'signin' ? t('auth.sign_in') : t('auth.sign_up')}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '14px', color: 'var(--gray-400)', marginTop: '1.25rem' }}>
            {mode === 'signin' ? t('auth.no_account') : t('auth.have_account')}{' '}
            <button onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')} style={{ color: 'var(--purple-600)', fontWeight: 500, fontSize: '14px' }}>
              {mode === 'signin' ? t('auth.sign_up') : t('auth.sign_in')}
            </button>
          </p>
        </div>

        <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--gray-400)', marginTop: '1.5rem', lineHeight: 1.6 }}>
          MindBridge is not a substitute for professional mental health care.
          {' '}In crisis? TR: <strong>182</strong> · US: <strong>988</strong>
        </p>
      </div>
    </div>
  )
}
