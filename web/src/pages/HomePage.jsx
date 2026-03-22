import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../hooks/useAuth'
import { useDB } from '../hooks/useDB'
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { format } from 'date-fns'

const MOODS = [
  { val: 1, emoji: '😔', label: 'Very low' },
  { val: 2, emoji: '😟', label: 'Low' },
  { val: 3, emoji: '😐', label: 'Neutral' },
  { val: 4, emoji: '🙂', label: 'Good' },
  { val: 5, emoji: '😊', label: 'Great' },
]

const EMOTIONS = ['Anxious', 'Sad', 'Tired', 'Calm', 'Happy', 'Stressed', 'Hopeful', 'Angry', 'Grateful', 'Overwhelmed']
const EMOTIONS_TR = ['Endişeli', 'Üzgün', 'Yorgun', 'Sakin', 'Mutlu', 'Stresli', 'Umutlu', 'Kızgın', 'Minnettar', 'Bunalmış']

export default function HomePage() {
  const { t, i18n } = useTranslation()
  const { user } = useAuth()
  const db = useDB()
  const navigate = useNavigate()

  const [selectedMood, setSelectedMood] = useState(null)
  const [selectedEmotions, setSelectedEmotions] = useState([])
  const [checkinDone, setCheckinDone] = useState(false)
  const [streak, setStreak] = useState(0)
  const [moodHistory, setMoodHistory] = useState([])
  const [saving, setSaving] = useState(false)

  const hour = new Date().getHours()
  const greetKey = hour < 12 ? 'greeting_morning' : hour < 18 ? 'greeting_afternoon' : 'greeting_evening'
  const name = user?.user_metadata?.full_name?.split(' ')[0] || ''

  const emotions = i18n.language === 'tr' ? EMOTIONS_TR : EMOTIONS

  useEffect(() => {
    db.getStreak().then(setStreak)
    db.getMoodHistory(14).then(({ data }) => {
      if (!data) return
      const grouped = {}
      data.forEach(d => {
        const day = format(new Date(d.created_at), 'MMM d')
        if (!grouped[day]) grouped[day] = []
        grouped[day].push(d.mood)
      })
      const chart = Object.entries(grouped).map(([day, moods]) => ({
        day,
        mood: Math.round(moods.reduce((a, b) => a + b, 0) / moods.length * 10) / 10
      })).reverse()
      setMoodHistory(chart)
    })
  }, [checkinDone])

  const toggleEmotion = (e) => {
    setSelectedEmotions(prev => prev.includes(e) ? prev.filter(x => x !== e) : [...prev, e].slice(0, 4))
  }

  const handleCheckin = async () => {
    if (!selectedMood) return
    setSaving(true)
    await db.saveMoodCheckin(selectedMood, selectedEmotions, '')
    setSaving(false)
    setCheckinDone(true)
  }

  const QUICK = [
    { label: i18n.language === 'tr' ? 'Günlük yaz' : 'Write in journal', icon: '📓', path: '/journal' },
    { label: i18n.language === 'tr' ? 'Yoldaşla konuş' : 'Talk to companion', icon: '💬', path: '/chat' },
    { label: i18n.language === 'tr' ? 'Tükenmişlik testi' : 'Burnout check', icon: '🔋', path: '/burnout' },
  ]

  return (
    <div className="fade-up">
      <h1 className="page-title">{t(`home.${greetKey}`)}{name ? `, ${name}` : ''}</h1>
      <p className="page-subtitle">{new Date().toLocaleDateString(i18n.language === 'tr' ? 'tr-TR' : 'en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>

      {!checkinDone ? (
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '18px', fontFamily: 'var(--font-display)', marginBottom: '1.25rem' }}>{t('home.how_feeling')}</h3>
          <div className="mood-ring" style={{ marginBottom: '1.25rem' }}>
            {MOODS.map(m => (
              <button key={m.val} className={`mood-btn${selectedMood === m.val ? ' selected' : ''}`} onClick={() => setSelectedMood(m.val)} title={m.label}>
                {m.emoji}
              </button>
            ))}
          </div>
          {selectedMood && (
            <div className="fade-up">
              <p style={{ fontSize: '13px', color: 'var(--gray-400)', marginBottom: '0.75rem' }}>
                {i18n.language === 'tr' ? 'Nasıl hissediyorsunuz? (isteğe bağlı)' : 'How are you feeling? (optional)'}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '1rem' }}>
                {emotions.map(e => (
                  <button key={e} onClick={() => toggleEmotion(e)} style={{
                    padding: '5px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: 500,
                    background: selectedEmotions.includes(e) ? 'var(--purple-600)' : 'var(--gray-100)',
                    color: selectedEmotions.includes(e) ? 'white' : 'var(--gray-600)',
                    border: 'none', cursor: 'pointer', transition: 'all 0.15s'
                  }}>{e}</button>
                ))}
              </div>
              <button className="btn-primary" onClick={handleCheckin} disabled={saving}>
                {saving ? t('common.loading') : t('home.checkin_btn')}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="card" style={{ marginBottom: '1.5rem', background: 'var(--purple-50)', border: '1px solid var(--purple-100)' }}>
          <p style={{ fontSize: '16px', color: 'var(--purple-800)' }}>
            {i18n.language === 'tr' ? '✓ Bugünkü kontrol tamamlandı' : '✓ Check-in complete for today'}
          </p>
        </div>
      )}

      <div className="grid-3" style={{ marginBottom: '1.5rem' }}>
        <div className="stat-card">
          <div className="stat-num">{streak}</div>
          <div className="stat-label">{t('home.streak')}</div>
        </div>
        <div className="stat-card">
          <div className="stat-num">{moodHistory.length > 0 ? (moodHistory.reduce((a,b) => a + b.mood, 0) / moodHistory.length).toFixed(1) : '–'}</div>
          <div className="stat-label">{i18n.language === 'tr' ? 'Ortalama ruh hali' : 'Avg mood (14d)'}</div>
        </div>
        <div className="stat-card">
          <div className="stat-num">{moodHistory.length}</div>
          <div className="stat-label">{i18n.language === 'tr' ? 'Günlük giriş' : 'Check-ins'}</div>
        </div>
      </div>

      {moodHistory.length > 1 && (
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 500, marginBottom: '1rem' }}>{t('home.recent_mood')}</h3>
          <ResponsiveContainer width="100%" height={140}>
            <LineChart data={moodHistory}>
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'var(--gray-400)' }} axisLine={false} tickLine={false} />
              <YAxis domain={[1, 5]} hide />
              <Tooltip formatter={(v) => [v, 'Mood']} contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid var(--gray-200)' }} />
              <Line type="monotone" dataKey="mood" stroke="var(--purple-400)" strokeWidth={2.5} dot={{ fill: 'var(--purple-400)', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <h3 style={{ fontSize: '16px', fontWeight: 500, marginBottom: '0.75rem' }}>{t('home.quick_actions')}</h3>
      <div className="grid-3">
        {QUICK.map(q => (
          <button key={q.path} onClick={() => navigate(q.path)} className="card" style={{ textAlign: 'left', cursor: 'pointer', transition: 'border-color 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--purple-400)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--gray-200)'}>
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>{q.icon}</div>
            <div style={{ fontSize: '14px', fontWeight: 500 }}>{q.label}</div>
          </button>
        ))}
      </div>
    </div>
  )
}
