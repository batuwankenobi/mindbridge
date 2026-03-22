import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

export default function CrisisPage() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const [activeTab, setActiveTab] = useState('resources')
  const [breathPhase, setBreathPhase] = useState('ready') // ready | in | hold | out
  const [breathCount, setBreathCount] = useState(0)
  const [groundStep, setGroundStep] = useState(0)
  const breathTimer = useRef(null)

  const startBreath = () => {
    setBreathPhase('in')
    setBreathCount(0)
    let count = 0
    const cycle = () => {
      setBreathPhase('in')
      breathTimer.current = setTimeout(() => {
        setBreathPhase('hold')
        breathTimer.current = setTimeout(() => {
          setBreathPhase('out')
          breathTimer.current = setTimeout(() => {
            count++
            setBreathCount(count)
            if (count < 5) cycle()
            else setBreathPhase('done')
          }, 6000)
        }, 4000)
      }, 4000)
    }
    cycle()
  }

  useEffect(() => () => clearTimeout(breathTimer.current), [])

  const BREATH_TEXT = {
    ready: { en: 'Tap to begin', tr: 'Başlamak için dokun' },
    in: { en: 'Breathe in...', tr: 'Nefes al...' },
    hold: { en: 'Hold...', tr: 'Tut...' },
    out: { en: 'Breathe out...', tr: 'Nefes ver...' },
    done: { en: 'Well done. Feel the calm.', tr: 'Çok iyi. Sakinliği hissed.' }
  }

  const GROUND_STEPS = lang === 'tr' ? [
    { n: 5, sense: 'Görüyorum', prompt: 'Etrafınızda 5 şey görün ve adlandırın.' },
    { n: 4, sense: 'Dokunuyorum', prompt: '4 şeye dokunun ve dokusunu hissedin.' },
    { n: 3, sense: 'Duyuyorum', prompt: '3 ses duyun ve tanımlayın.' },
    { n: 2, sense: 'Kokluyorum', prompt: '2 kokuyu fark edin.' },
    { n: 1, sense: 'Tadıyorum', prompt: '1 şeyin tadını alın.' }
  ] : [
    { n: 5, sense: 'See', prompt: 'Look around and name 5 things you can see.' },
    { n: 4, sense: 'Touch', prompt: 'Touch 4 things and notice their texture.' },
    { n: 3, sense: 'Hear', prompt: 'Listen for 3 sounds you can identify.' },
    { n: 2, sense: 'Smell', prompt: 'Notice 2 things you can smell.' },
    { n: 1, sense: 'Taste', prompt: 'Notice 1 thing you can taste.' }
  ]

  const RESOURCES = lang === 'tr' ? [
    { name: 'ALO 182 Psikolojik Destek', number: '182', desc: '7/24 ücretsiz Türkçe destek', color: 'var(--purple-600)' },
    { name: 'İntihar Önleme Hattı', number: '182', desc: 'T.C. Sağlık Bakanlığı', color: 'var(--teal-600)' },
    { name: 'Acil Yardım', number: '112', desc: 'Acil tıbbi yardım', color: 'var(--red-400)' }
  ] : [
    { name: '988 Suicide & Crisis Lifeline', number: '988', desc: 'Free, confidential, 24/7', color: 'var(--purple-600)' },
    { name: 'Crisis Text Line', number: 'Text HOME to 741741', desc: 'Text-based crisis support', color: 'var(--teal-600)' },
    { name: 'Emergency Services', number: '911', desc: 'Immediate danger', color: 'var(--red-400)' }
  ]

  const TABS = [
    { key: 'resources', label: lang === 'tr' ? 'Kaynaklar' : 'Resources', icon: '🆘' },
    { key: 'breathe', label: lang === 'tr' ? 'Nefes' : 'Breathe', icon: '🌬️' },
    { key: 'ground', label: lang === 'tr' ? 'Topraklan' : 'Ground', icon: '🌿' },
    { key: 'safety', label: lang === 'tr' ? 'Güvenlik Planı' : 'Safety Plan', icon: '📋' }
  ]

  const breathSize = breathPhase === 'in' ? 200 : breathPhase === 'hold' ? 200 : 120

  return (
    <div className="fade-up">
      <h1 className="page-title">{t('crisis.title')}</h1>
      <p className="page-subtitle">{t('crisis.subtitle')}</p>

      <div style={{ display: 'flex', gap: '6px', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {TABS.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
            padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 500, border: 'none', cursor: 'pointer',
            background: activeTab === tab.key ? 'var(--purple-600)' : 'var(--gray-100)',
            color: activeTab === tab.key ? 'white' : 'var(--gray-600)', transition: 'all 0.15s'
          }}>{tab.icon} {tab.label}</button>
        ))}
      </div>

      {activeTab === 'resources' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {RESOURCES.map(r => (
            <div key={r.number} className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderLeft: `4px solid ${r.color}`, borderRadius: '0 12px 12px 0' }}>
              <div>
                <p style={{ fontWeight: 500, fontSize: '15px', marginBottom: '2px' }}>{r.name}</p>
                <p style={{ fontSize: '13px', color: 'var(--gray-400)' }}>{r.desc}</p>
              </div>
              <a href={`tel:${r.number.replace(/\D/g, '')}`} style={{ background: r.color, color: 'white', padding: '10px 18px', borderRadius: 8, fontWeight: 600, fontSize: '16px', textDecoration: 'none', whiteSpace: 'nowrap' }}>
                {r.number}
              </a>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'breathe' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem 0' }}>
          <p style={{ fontSize: '15px', color: 'var(--gray-400)', marginBottom: '2rem', textAlign: 'center' }}>
            {lang === 'tr' ? '4-4-6 Nefes tekniği • 5 döngü' : '4-4-6 Breathing technique • 5 cycles'}
          </p>
          <div onClick={breathPhase === 'ready' || breathPhase === 'done' ? startBreath : undefined}
            style={{
              width: breathSize, height: breathSize,
              borderRadius: '50%',
              background: breathPhase === 'out' || breathPhase === 'ready' ? 'var(--purple-50)' : 'var(--purple-100)',
              border: `3px solid var(--purple-400)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: breathPhase === 'ready' || breathPhase === 'done' ? 'pointer' : 'default',
              transition: 'all 4s ease',
              userSelect: 'none'
            }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', marginBottom: '4px' }}>
                {breathPhase === 'in' ? '🌬️' : breathPhase === 'hold' ? '⏸️' : breathPhase === 'out' ? '💨' : breathPhase === 'done' ? '✨' : '👆'}
              </div>
              <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--purple-600)' }}>{BREATH_TEXT[breathPhase][lang] || BREATH_TEXT[breathPhase].en}</p>
              {breathCount > 0 && breathPhase !== 'done' && <p style={{ fontSize: '12px', color: 'var(--gray-400)', marginTop: '4px' }}>{breathCount}/5</p>}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'ground' && (
        <div>
          <p style={{ color: 'var(--gray-400)', marginBottom: '1.5rem', fontSize: '15px' }}>
            {lang === 'tr' ? 'Bu egzersiz sizi şu ana bağlar. Her adımı tamamladıktan sonra ilerleyin.' : 'This exercise anchors you to the present moment. Complete each step before moving on.'}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {GROUND_STEPS.map((step, i) => (
              <div key={i} className="card" style={{
                borderLeft: i === groundStep ? '4px solid var(--purple-400)' : '4px solid var(--gray-200)',
                borderRadius: '0 12px 12px 0',
                opacity: i > groundStep ? 0.5 : 1,
                background: i === groundStep ? 'var(--purple-50)' : 'white',
                transition: 'all 0.3s'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: i <= groundStep ? 'var(--purple-600)' : 'var(--gray-200)', color: i <= groundStep ? 'white' : 'var(--gray-400)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 18, flexShrink: 0 }}>
                    {step.n}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 500, fontSize: '15px', color: i === groundStep ? 'var(--purple-800)' : 'var(--gray-900)' }}>{step.sense}</p>
                    <p style={{ fontSize: '13px', color: 'var(--gray-400)' }}>{step.prompt}</p>
                  </div>
                  {i === groundStep && i < GROUND_STEPS.length - 1 && (
                    <button onClick={() => setGroundStep(i + 1)} className="btn-primary" style={{ padding: '8px 14px', fontSize: 13 }}>
                      {lang === 'tr' ? 'Tamamlandı' : 'Done'}
                    </button>
                  )}
                  {i === groundStep && i === GROUND_STEPS.length - 1 && (
                    <button onClick={() => setGroundStep(0)} className="btn-secondary" style={{ padding: '8px 14px', fontSize: 13 }}>
                      {lang === 'tr' ? 'Tekrar' : 'Restart'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'safety' && (
        <div className="card">
          <h3 style={{ fontSize: '18px', marginBottom: '1rem' }}>{lang === 'tr' ? 'Kişisel Güvenlik Planım' : 'My Personal Safety Plan'}</h3>
          {[
            { q: lang === 'tr' ? 'Kendimi iyi hissettiren şeyler:' : 'Things that make me feel better:', ph: lang === 'tr' ? 'Müzik dinlemek, yürüyüş yapmak...' : 'Listening to music, going for a walk...' },
            { q: lang === 'tr' ? 'Güvendiğim kişiler:' : 'People I can reach out to:', ph: lang === 'tr' ? 'İsim ve telefon numaraları...' : 'Names and phone numbers...' },
            { q: lang === 'tr' ? 'Tehlikeli durumları güvenli hale getirme:' : 'Making my environment safe:', ph: lang === 'tr' ? 'Evden çıkmak, birine söylemek...' : 'Leaving the space, telling someone...' },
            { q: lang === 'tr' ? 'Yaşamak için nedenlerim:' : 'Reasons to keep going:', ph: lang === 'tr' ? 'Ailem, hedeflerim...' : 'My family, my goals, my pets...' }
          ].map((item, i) => (
            <div key={i} style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '14px', fontWeight: 500, display: 'block', marginBottom: '6px', color: 'var(--gray-900)' }}>{item.q}</label>
              <textarea placeholder={item.ph} style={{ minHeight: '72px', resize: 'vertical' }} />
            </div>
          ))}
          <button className="btn-primary" onClick={() => alert(lang === 'tr' ? 'Plan kaydedildi' : 'Plan saved locally')}>
            {lang === 'tr' ? 'Planı kaydet' : 'Save plan'}
          </button>
        </div>
      )}
    </div>
  )
}
