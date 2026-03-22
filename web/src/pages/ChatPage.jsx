import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const CRISIS_KEYWORDS = ['suicide', 'kill myself', 'end my life', 'intihar', 'kendimi öldür', 'hayatıma son', 'yaşamak istemiyorum']

export default function ChatPage() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language

  const [messages, setMessages] = useState([
    { role: 'assistant', content: t('chat.welcome') }
  ])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [crisisAlert, setCrisisAlert] = useState(false)
  const bottomRef = useRef(null)
  const textareaRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const checkCrisis = (text) => {
    return CRISIS_KEYWORDS.some(k => text.toLowerCase().includes(k))
  }

  const sendMessage = async () => {
    const text = input.trim()
    if (!text || streaming) return

    const hasCrisis = checkCrisis(text)
    if (hasCrisis) setCrisisAlert(true)

    const newMessages = [...messages, { role: 'user', content: text }]
    setMessages(newMessages)
    setInput('')
    setStreaming(true)

    const aiMsg = { role: 'assistant', content: '' }
    setMessages([...newMessages, aiMsg])

    try {
      const res = await fetch(`${API}/api/chat/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          language: lang
        })
      })

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let fullContent = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')
        for (const line of lines) {
          if (line.startsWith('data: ') && line !== 'data: [DONE]') {
            try {
              const { text } = JSON.parse(line.slice(6))
              fullContent += text
              setMessages(prev => {
                const updated = [...prev]
                updated[updated.length - 1] = { role: 'assistant', content: fullContent }
                return updated
              })
            } catch { /* skip malformed */ }
          }
        }
      }
    } catch {
      setMessages(prev => {
        const updated = [...prev]
        updated[updated.length - 1] = { role: 'assistant', content: t('common.error') }
        return updated
      })
    } finally {
      setStreaming(false)
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const clearChat = () => {
    setMessages([{ role: 'assistant', content: t('chat.welcome') }])
    setCrisisAlert(false)
  }

  return (
    <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 48px)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div>
          <h1 className="page-title">{t('chat.title')}</h1>
          <p className="page-subtitle" style={{ marginBottom: 0 }}>{t('chat.subtitle')}</p>
        </div>
        <button onClick={clearChat} className="btn-secondary" style={{ padding: '6px 14px', fontSize: 13 }}>
          {lang === 'tr' ? 'Temizle' : 'Clear'}
        </button>
      </div>

      {crisisAlert && (
        <div className="crisis-banner fade-up">
          <span style={{ fontSize: '24px' }}>🆘</span>
          <div>
            <p style={{ fontWeight: 500, color: 'var(--red-400)', marginBottom: '4px' }}>
              {lang === 'tr' ? 'Zor bir dönemden geçiyor olabilirsiniz.' : 'It sounds like you may be going through something very difficult.'}
            </p>
            <p style={{ fontSize: '14px', color: 'var(--red-400)' }}>
              {lang === 'tr'
                ? 'Lütfen ALO 182 Psikolojik Destek Hattı\'nı arayın — 7/24 ücretsiz, Türkçe destek.'
                : 'Please reach out: TR: 182 · US: 988 Suicide & Crisis Lifeline. You are not alone.'}
            </p>
          </div>
        </div>
      )}

      <div className="chat-messages" style={{ flex: 1, overflowY: 'auto' }}>
        {messages.map((msg, i) => (
          <div key={i} className="fade-up" style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
            {msg.role === 'assistant' && (
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--purple-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, marginRight: 8, flexShrink: 0, marginTop: 4 }}>🧠</div>
            )}
            <div className={`chat-bubble ${msg.role}`}>
              {msg.content || (streaming && i === messages.length - 1 ? (
                <span>
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </span>
              ) : '')}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div style={{ borderTop: '1px solid var(--gray-200)', paddingTop: '1rem' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder={t('chat.placeholder')}
            style={{ flex: 1, resize: 'none', height: '52px', lineHeight: 1.5, padding: '12px 14px' }}
            disabled={streaming}
          />
          <button onClick={sendMessage} className="btn-primary" disabled={streaming || !input.trim()} style={{ padding: '0 20px', whiteSpace: 'nowrap' }}>
            {streaming ? '...' : t('chat.send')}
          </button>
        </div>
        <p style={{ fontSize: '12px', color: 'var(--gray-400)', marginTop: '8px', textAlign: 'center' }}>
          {t('chat.disclaimer')} {lang === 'tr' ? '182' : '988'}
        </p>
      </div>
    </div>
  )
}
