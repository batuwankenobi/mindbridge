import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDB } from '../hooks/useDB'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const QUESTIONS = ['energy', 'meaning', 'control', 'connection', 'workload']

export default function BurnoutPage() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const db = useDB()

  const [step, setStep] = useState('intro') // intro | questions | result
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState({})
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const reset = () => {
    setStep('intro')
    setCurrentQ(0)
    setAnswers({})
    setResult(null)
  }

  const handleAnswer = (val) => {
    const key = QUESTIONS[currentQ]
    const newAnswers = { ...answers, [key]: val }
    setAnswers(newAnswers)

    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ(currentQ + 1)
    } else {
      submitAssessment(newAnswers)
    }
  }

  const submitAssessment = async (finalAnswers) => {
    setLoading(true)
    setStep('result')
    try {
      const res = await fetch(`${API}/api/burnout/assess`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: finalAnswers, language: lang })
      })
      const data = await res.json()
      setResult(data)
      await db.saveBurnoutResult(finalAnswers, data.score, data.level)
    } catch {
      setResult({ score: 0, level: 'Error', color: 'gray', primary_suggestion: t('common.error') })
    } finally {
      setLoading(false)
    }
  }

  const COLOR_MAP = {
    green: { bg: 'var(--green-50)', text: 'var(--green-400)', border: '#C0DD97' },
    amber: { bg: 'var(--amber-50)', text: 'var(--amber-400)', border: '#FAC775' },
    orange: { bg: '#FFF3E6', text: '#C65D00', border: '#FFBA72' },
    red: { bg: 'var(--red-50)', text: 'var(--red-400)', border: '#F09595' }
  }

  const AREA_LABELS = {
    energy: lang === 'tr' ? 'Enerji' : 'Energy',
    meaning: lang === 'tr' ? 'Anlam' : 'Meaning',
    control: lang === 'tr' ? 'Kontrol' : 'Control',
    connection: lang === 'tr' ? 'Bağlantı' : 'Connection',
    workload: lang === 'tr' ? 'İş yükü' : 'Workload'
  }

  if (step === 'intro') return (
    <div className="fade-up">
      <h1 className="page-title">{t('burnout.title')}</h1>
      <p className="page-subtitle">{t('burnout.subtitle')}</p>
      <div className="card" style={{ maxWidth: 480 }}>
        <div style={{ fontSize: '48px', marginBottom: '1rem' }}>🔋</div>
        <h2 style={{ fontSize: '22px', marginBottom: '1rem' }}>
          {lang === 'tr' ? 'Tükenmişlik riski taşıyor musunuz?' : 'Are you at risk of burnout?'}
        </h2>
        <p style={{ color: 'var(--gray-400)', fontSize: '15px', lineHeight: 1.7, marginBottom: '1.5rem' }}>
          {lang === 'tr'
            ? '5 basit soruyla enerji, anlam, kontrol, bağlantı ve iş yükünüzü değerlendirin.'
            : 'Answer 5 questions covering energy, meaning, control, connection, and workload. Takes under 2 minutes.'}
        </p>
        <button className="btn-primary" onClick={() => setStep('questions')}>{t('burnout.start_btn')}</button>
      </div>
    </div>
  )

  if (step === 'questions') {
    const q = QUESTIONS[currentQ]
    const progress = ((currentQ) / QUESTIONS.length) * 100
    return (
      <div className="fade-up">
        <h1 className="page-title">{t('burnout.title')}</h1>
        <div style={{ height: 4, background: 'var(--gray-200)', borderRadius: 2, marginBottom: '2rem' }}>
          <div style={{ height: '100%', width: `${progress}%`, background: 'var(--purple-400)', borderRadius: 2, transition: 'width 0.3s' }} />
        </div>
        <div className="card" style={{ maxWidth: 520 }}>
          <p style={{ fontSize: '13px', color: 'var(--gray-400)', marginBottom: '0.5rem' }}>{currentQ + 1} / {QUESTIONS.length}</p>
          <h2 style={{ fontSize: '22px', marginBottom: '2rem', lineHeight: 1.4 }}>{t(`burnout.questions.${q}`)}</h2>
          <p style={{ fontSize: '12px', color: 'var(--gray-400)', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between' }}>
            <span>{t('burnout.scale.low')}</span>
            <span>{t('burnout.scale.high')}</span>
          </p>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
            {[1, 2, 3, 4, 5].map(v => (
              <button key={v} onClick={() => handleAnswer(v)} style={{
                width: 56, height: 56, borderRadius: '50%', fontSize: 18, fontWeight: 500,
                border: '2px solid var(--gray-200)', background: 'white', color: 'var(--gray-600)',
                cursor: 'pointer', transition: 'all 0.15s'
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--purple-400)'; e.currentTarget.style.background = 'var(--purple-50)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--gray-200)'; e.currentTarget.style.background = 'white' }}>
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (step === 'result') {
    if (loading || !result) return (
      <div className="fade-up" style={{ textAlign: 'center', padding: '4rem' }}>
        <p style={{ color: 'var(--gray-400)' }}>{t('common.loading')}</p>
      </div>
    )

    const c = COLOR_MAP[result.color] || COLOR_MAP.amber
    return (
      <div className="fade-up">
        <h1 className="page-title">{t('burnout.title')}</h1>
        <div className="card" style={{ marginBottom: '1rem', background: c.bg, border: `1px solid ${c.border}` }}>
          <p style={{ fontSize: '13px', fontWeight: 500, color: c.text, marginBottom: '0.5rem' }}>{t('burnout.your_score')}</p>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '52px', fontFamily: 'var(--font-display)', color: c.text }}>{result.score}</span>
            <span style={{ fontSize: '18px', color: c.text, marginBottom: '10px' }}>/ 100</span>
            <span style={{ fontSize: '20px', fontWeight: 500, color: c.text, marginBottom: '10px' }}>— {result.level}</span>
          </div>
          <div style={{ height: 8, background: 'rgba(255,255,255,0.5)', borderRadius: 4, marginBottom: '1rem' }}>
            <div style={{ height: '100%', width: `${result.score}%`, background: c.text, borderRadius: 4, transition: 'width 0.8s ease' }} />
          </div>
        </div>

        <div className="grid-3" style={{ marginBottom: '1rem' }}>
          {Object.entries(result.breakdown || {}).map(([area, val]) => (
            <div key={area} className="stat-card">
              <div className="stat-num">{val}<span style={{ fontSize: 14 }}>/5</span></div>
              <div className="stat-label">{AREA_LABELS[area]}</div>
            </div>
          ))}
        </div>

        {result.primary_suggestion && (
          <div className="card" style={{ marginBottom: '1rem', borderLeft: `4px solid ${c.text}`, borderRadius: '0 12px 12px 0' }}>
            <p style={{ fontSize: '13px', fontWeight: 500, color: 'var(--gray-400)', marginBottom: '4px' }}>{t('burnout.suggestion')}</p>
            <p style={{ fontSize: '15px', color: 'var(--gray-900)', lineHeight: 1.6 }}>{result.primary_suggestion}</p>
          </div>
        )}

        <button onClick={reset} className="btn-secondary">{t('burnout.retake')}</button>
      </div>
    )
  }
}
