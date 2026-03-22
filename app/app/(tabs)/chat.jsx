import { useState, useRef, useEffect } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native'
import { useTranslation } from 'react-i18next'
import { colors, radius, spacing } from '../../src/lib/theme'

const API = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001'
const CRISIS_KEYWORDS = ['suicide', 'kill myself', 'end my life', 'intihar', 'kendimi öldür']

export default function ChatScreen() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const listRef = useRef(null)

  const [messages, setMessages] = useState([
    { id: '0', role: 'assistant', content: t('chat.welcome') }
  ])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [crisisAlert, setCrisisAlert] = useState(false)

  useEffect(() => {
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100)
  }, [messages])

  const sendMessage = async () => {
    const text = input.trim()
    if (!text || streaming) return

    if (CRISIS_KEYWORDS.some(k => text.toLowerCase().includes(k))) setCrisisAlert(true)

    const userMsg = { id: Date.now().toString(), role: 'user', content: text }
    const aiMsg = { id: (Date.now() + 1).toString(), role: 'assistant', content: '' }

    setMessages(prev => [...prev, userMsg, aiMsg])
    setInput('')
    setStreaming(true)

    try {
      const res = await fetch(`${API}/api/chat/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content })),
          language: lang
        })
      })

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let full = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value)
        for (const line of chunk.split('\n')) {
          if (line.startsWith('data: ') && line !== 'data: [DONE]') {
            try {
              const { text } = JSON.parse(line.slice(6))
              full += text
              setMessages(prev => {
                const updated = [...prev]
                updated[updated.length - 1] = { ...aiMsg, content: full }
                return updated
              })
            } catch { }
          }
        }
      }
    } catch {
      setMessages(prev => {
        const updated = [...prev]
        updated[updated.length - 1] = { ...updated[updated.length - 1], content: t('common.error') }
        return updated
      })
    } finally {
      setStreaming(false)
    }
  }

  const renderMessage = ({ item }) => (
    <View style={[styles.bubbleWrap, item.role === 'user' ? styles.bubbleRight : styles.bubbleLeft]}>
      {item.role === 'assistant' && <Text style={styles.aiAvatar}>🧠</Text>}
      <View style={[styles.bubble, item.role === 'user' ? styles.bubbleUser : styles.bubbleAI]}>
        {item.content
          ? <Text style={item.role === 'user' ? styles.bubbleUserText : styles.bubbleAIText}>{item.content}</Text>
          : <ActivityIndicator size="small" color={colors.gray400} />
        }
      </View>
    </View>
  )

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={88}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('chat.title')}</Text>
      </View>

      {crisisAlert && (
        <View style={styles.crisisBanner}>
          <Text style={styles.crisisText}>
            🆘 {lang === 'tr' ? 'Kriz hattı: 182' : 'Crisis line: 988 (US) · 182 (TR)'}
          </Text>
        </View>
      )}

      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.messageList}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
      />

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder={t('chat.placeholder')}
          placeholderTextColor={colors.gray400}
          value={input}
          onChangeText={setInput}
          multiline
          maxHeight={100}
          editable={!streaming}
        />
        <TouchableOpacity style={[styles.sendBtn, (!input.trim() || streaming) && styles.sendBtnDisabled]} onPress={sendMessage} disabled={!input.trim() || streaming}>
          <Text style={styles.sendBtnText}>↑</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.disclaimer}>{t('chat.disclaimer')} {lang === 'tr' ? '182' : '988'}</Text>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.gray50 },
  header: { paddingTop: 56, paddingHorizontal: spacing.lg, paddingBottom: spacing.md, backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.gray200 },
  title: { fontSize: 20, fontWeight: '600', color: colors.gray900 },
  crisisBanner: { backgroundColor: colors.red50, padding: spacing.md, borderBottomWidth: 1, borderBottomColor: '#F09595' },
  crisisText: { color: colors.red400, fontSize: 14, fontWeight: '600', textAlign: 'center' },
  messageList: { padding: spacing.lg, paddingBottom: 20 },
  bubbleWrap: { flexDirection: 'row', marginBottom: 12, alignItems: 'flex-end' },
  bubbleLeft: { justifyContent: 'flex-start' },
  bubbleRight: { justifyContent: 'flex-end' },
  aiAvatar: { fontSize: 18, marginRight: 6, marginBottom: 2 },
  bubble: { maxWidth: '75%', padding: 12, borderRadius: 18, minWidth: 48, minHeight: 40, justifyContent: 'center' },
  bubbleUser: { backgroundColor: colors.purple600, borderBottomRightRadius: 4 },
  bubbleAI: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.gray200, borderBottomLeftRadius: 4 },
  bubbleUserText: { color: colors.white, fontSize: 15, lineHeight: 22 },
  bubbleAIText: { color: colors.gray900, fontSize: 15, lineHeight: 22 },
  inputRow: { flexDirection: 'row', gap: spacing.sm, padding: spacing.md, paddingBottom: spacing.sm, backgroundColor: colors.white, borderTopWidth: 1, borderTopColor: colors.gray200, alignItems: 'flex-end' },
  input: { flex: 1, borderWidth: 1.5, borderColor: colors.gray200, borderRadius: radius.md, paddingHorizontal: 14, paddingVertical: 10, fontSize: 15, color: colors.gray900 },
  sendBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.purple600, alignItems: 'center', justifyContent: 'center' },
  sendBtnDisabled: { backgroundColor: colors.gray200 },
  sendBtnText: { color: colors.white, fontSize: 20, fontWeight: '700' },
  disclaimer: { textAlign: 'center', fontSize: 11, color: colors.gray400, paddingBottom: spacing.md, backgroundColor: colors.white }
})
