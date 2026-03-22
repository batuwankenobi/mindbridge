import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native'
import { useTranslation } from 'react-i18next'
import { supabase } from '../../src/lib/supabase'
import { colors, radius, spacing } from '../../src/lib/theme'

const API = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001'

export default function JournalScreen() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const [entry, setEntry] = useState('')
  const [mood, setMood] = useState(3)
  const [aiReflection, setAiReflection] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [saving, setSaving] = useState(false)

  const MOOD_EMOJIS = ['', '😔', '😟', '😐', '🙂', '😊']

  const analyzeEntry = async () => {
    if (!entry.trim()) return
    setAnalyzing(true)
    try {
      const res = await fetch(`${API}/api/journal/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entry, mood, language: lang })
      })
      const data = await res.json()
      setAiReflection(data.response || '')
    } catch {
      Alert.alert('Error', t('common.error'))
    } finally {
      setAnalyzing(false)
    }
  }

  const saveEntry = async () => {
    if (!entry.trim()) return
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('journal_entries').insert({
      user_id: user.id, content: entry, mood, ai_reflection: aiReflection, created_at: new Date().toISOString()
    })
    setSaving(false)
    setEntry('')
    setAiReflection('')
    Alert.alert('✓', lang === 'tr' ? 'Günlük kaydedildi' : 'Entry saved')
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>{t('journal.title')}</Text>

      <View style={styles.moodRow}>
        {[1,2,3,4,5].map(v => (
          <TouchableOpacity key={v} onPress={() => setMood(v)}
            style={[styles.moodBtn, mood === v && styles.moodBtnActive]}>
            <Text style={styles.moodEmoji}>{MOOD_EMOJIS[v]}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
        style={styles.textArea}
        placeholder={t('journal.placeholder')}
        placeholderTextColor={colors.gray400}
        value={entry}
        onChangeText={setEntry}
        multiline
        textAlignVertical="top"
      />

      <View style={styles.btnRow}>
        <TouchableOpacity style={[styles.primaryBtn, { flex: 1 }]} onPress={analyzeEntry} disabled={analyzing || !entry.trim()}>
          {analyzing
            ? <ActivityIndicator color={colors.white} size="small" />
            : <Text style={styles.primaryBtnText}>{t('journal.analyze')}</Text>}
        </TouchableOpacity>
        <TouchableOpacity style={[styles.secondaryBtn, { flex: 1 }]} onPress={saveEntry} disabled={saving || !entry.trim()}>
          <Text style={styles.secondaryBtnText}>{saving ? t('common.loading') : t('journal.save')}</Text>
        </TouchableOpacity>
      </View>

      {aiReflection ? (
        <View style={styles.reflectionCard}>
          <Text style={styles.reflectionLabel}>{lang === 'tr' ? 'Yapay Zeka Yansıması' : 'AI Reflection'}</Text>
          <Text style={styles.reflectionText}>{aiReflection}</Text>
        </View>
      ) : null}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.gray50 },
  content: { padding: spacing.lg, paddingTop: 56, paddingBottom: 80 },
  title: { fontSize: 28, fontWeight: '600', color: colors.gray900, marginBottom: spacing.lg },
  moodRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: spacing.md },
  moodBtn: { width: 48, height: 48, borderRadius: 24, borderWidth: 2, borderColor: 'transparent', backgroundColor: colors.gray100, alignItems: 'center', justifyContent: 'center' },
  moodBtnActive: { borderColor: colors.purple400, backgroundColor: colors.purple50 },
  moodEmoji: { fontSize: 22 },
  textArea: { backgroundColor: colors.white, borderWidth: 1.5, borderColor: colors.gray200, borderRadius: radius.md, padding: spacing.md, fontSize: 15, color: colors.gray900, minHeight: 160, marginBottom: spacing.md },
  btnRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  primaryBtn: { backgroundColor: colors.purple600, borderRadius: radius.sm, padding: 13, alignItems: 'center' },
  primaryBtnText: { color: colors.white, fontSize: 14, fontWeight: '600' },
  secondaryBtn: { backgroundColor: colors.white, borderRadius: radius.sm, padding: 12, alignItems: 'center', borderWidth: 1.5, borderColor: colors.gray200 },
  secondaryBtnText: { color: colors.gray900, fontSize: 14, fontWeight: '500' },
  reflectionCard: { backgroundColor: colors.teal50, borderRadius: radius.md, padding: spacing.lg, borderWidth: 1, borderColor: '#9FE1CB' },
  reflectionLabel: { fontSize: 12, fontWeight: '600', color: colors.teal600, marginBottom: 6 },
  reflectionText: { fontSize: 15, color: colors.teal600, lineHeight: 22 }
})
