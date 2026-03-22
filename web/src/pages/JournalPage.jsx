import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDB } from '../hooks/useDB'
import { format } from 'date-fns'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export default function JournalPage() {
  const { t, i18n } = useTranslation()
  const db = useDB()
  const lang = i18n.language

  const [entry, setEntry] = useState('')
  const [mood, setMood] = useState(3)
  const [prompt, setPrompt] = useState('')
  const [aiReflection, setAiReflection] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [entries, setEntries] = useState([])
  const [view, setView] = useState('write') // write | history

  useEffect(() => {
    fetchPrompt()
    loadEntries()
  }, [lang])

  const fetchPrompt = async () => {
    try {
      const res = await fetch(`${API}/api/journal/prompt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood, language: lang })
      })
      const data = await res.json()
      setPrompt(data.prompt)
    } catch { setPrompt('') }
  }

  const loadEntries = async () => {
    const { data } = await db.getJournalEntries(20)
    setEntries(data || [])
  }

  const analyzeEntry = async () => {
    if (!entry.trim()) return
    setAnalyzing(true)
    setAiReflection('')
    try {
      const res = await fetch(`${API}/api/journal/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entry, mood, language: lang })
      })
      const data = await res.json()
      setAiReflection(data.response || '')
    } catch { setAiReflection(t('common.error')) }
    finally { setAnalyzing(false) }
  }

  const saveEntry = async () => {
    if (!entry.trim()) return
    setSaving(true)
    await db.saveJournalEntry(entry, mood, aiReflection, prompt)
    setSaving(false)
    setSaved(true)
    setEntry('')
    setAiReflection('')
    loadEntries()
    setTimeout(() => setSaved(false), 3000)
  }

  const MOOD_EMOJIS = ['', '😔', '😟', '😐', '🙂', '😊']

  return (
    <div className="fade-up">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
        <h1 className="page-title">{t('journal.title')}</h1>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => setView('write')} style={{ padding: '6px 14px', borderRadius: 8, fontSize: 13, fontWeight: 500, background: view === 'write' ? 'var(--purple-600)' : 'var(--gray-100)', color: view === 'write' ? 'white' : 'var(--gray-600)', border: 'none', cursor: 'pointer' }}>
            {lang === 'tr' ? 'Yaz' : 'Write'}
          </button>
          <button onClick={() => setView('history')} style={{ padding: '6px 14px', borderRadius: 8, fontSize: 13, fontWeight: 500, background: view === 'history' ? 'var(--purple-600)' : 'var(--gray-100)', color: view === 'history' ? 'white' : 'var(--gray-600)', border: 'none', cursor: 'pointer' }}>
            {lang === 'tr' ? 'Geçmiş' : 'History'}
          </button>
        </div>
      </div>
      <p className="page-subtitle">{t('journal.subtitle')}</p>

      {view === 'write' ? (
        <>
          {prompt && (
            <div style={{ background: 'var(--purple-50)', border: '1px solid var(--purple-100)', borderRadius: 12, padding: '1rem 1.25rem', marginBottom: '1.25rem' }}>
              <p style={{ fontSize: '12px', fontWeight: 500, color: 'var(--purple-600)', marginBottom: '4px' }}>{t('journal.prompt_label')}</p>
              <p style={{ fontSize: '15px', color: 'var(--purple-800)', fontStyle: 'italic' }}>"{prompt}"</p>
            </div>
          )}

          <div className="card" style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
              <span style={{ fontSize: '13px', color: 'var(--gray-400)', whiteSpace: 'nowrap' }}>{t('journal.mood_label')}</span>
              <input type="range" min="1" max="5" value={mood} onChange={e => setMood(Number(e.target.value))} className="slider-track" style={{ flex: 1 }} />
              <span style={{ fontSize: '24px', minWidth: '32px' }}>{MOOD_EMOJIS[mood]}</span>
            </div>

            <textarea
              value={entry}
              onChange={e => setEntry(e.target.value)}
              placeholder={t('journal.placeholder')}
              style={{ minHeight: '180px', resize: 'vertical', lineHeight: 1.7 }}
            />

            <div style={{ display: 'flex', gap: '8px', marginTop: '1rem', flexWrap: 'wrap' }}>
              <button onClick={analyzeEntry} className="btn-primary" disabled={analyzing || !entry.trim()}>
                {analyzing ? '...' : t('journal.analyze_btn')}
              </button>
              <button onClick={saveEntry} className="btn-secondary" disabled={saving || !entry.trim()}>
                {saving ? t('common.loading') : saved ? `✓ ${t('journal.saved')}` : t('journal.save_btn')}
              </button>
              <button onClick={fetchPrompt} className="btn-secondary" style={{ marginLeft: 'auto' }}>
                {lang === 'tr' ? '↺ Yeni ipucu' : '↺ New prompt'}
              </button>
            </div>
          </div>

          {aiReflection && (
            <div className="card fade-up" style={{ background: 'var(--teal-50)', border: '1px solid #9FE1CB' }}>
              <p style={{ fontSize: '12px', fontWeight: 500, color: 'var(--teal-600)', marginBottom: '8px' }}>{t('journal.ai_reflection')}</p>
              <p style={{ fontSize: '15px', color: 'var(--teal-600)', lineHeight: 1.7, whiteSpace: 'pre-line' }}>{aiReflection}</p>
            </div>
          )}
        </>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {entries.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', color: 'var(--gray-400)', padding: '3rem' }}>
              <p style={{ fontSize: '40px', marginBottom: '1rem' }}>📓</p>
              <p>{lang === 'tr' ? 'Henüz günlük girişi yok.' : 'No journal entries yet.'}</p>
            </div>
          ) : entries.map(e => (
            <div key={e.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', color: 'var(--gray-400)' }}>
                  {format(new Date(e.created_at), 'MMMM d, yyyy · HH:mm')}
                </span>
                <span style={{ fontSize: '20px' }}>{'😔😟😐🙂😊'.split('').filter((_, i) => i === (e.mood - 1) * 2 || i === (e.mood - 1) * 2 + 1).join('') || ['😔','😟','😐','🙂','😊'][e.mood - 1]}</span>
              </div>
              <p style={{ fontSize: '15px', lineHeight: 1.7, color: 'var(--gray-900)', marginBottom: e.ai_reflection ? '12px' : 0 }}>{e.content}</p>
              {e.ai_reflection && (
                <div style={{ borderTop: '1px solid var(--gray-200)', paddingTop: '10px', marginTop: '4px' }}>
                  <p style={{ fontSize: '12px', color: 'var(--teal-600)', fontWeight: 500, marginBottom: '4px' }}>{t('journal.ai_reflection')}</p>
                  <p style={{ fontSize: '13px', color: 'var(--gray-600)', lineHeight: 1.6 }}>{e.ai_reflection}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
