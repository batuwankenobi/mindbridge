import { useState, useEffect } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { supabase } from '../../src/lib/supabase'
import { colors, radius, spacing } from '../../src/lib/theme'

const MOODS = [
  { val: 1, emoji: '😔' }, { val: 2, emoji: '😟' }, { val: 3, emoji: '😐' },
  { val: 4, emoji: '🙂' }, { val: 5, emoji: '😊' }
]

export default function HomeScreen() {
  const { t, i18n } = useTranslation()
  const router = useRouter()
  const lang = i18n.language

  const [user, setUser] = useState(null)
  const [selectedMood, setSelectedMood] = useState(null)
  const [checkinDone, setCheckinDone] = useState(false)
  const [streak, setStreak] = useState(0)

  const hour = new Date().getHours()
  const greetKey = hour < 12 ? 'greeting_morning' : hour < 18 ? 'greeting_afternoon' : 'greeting_evening'

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user))
  }, [])

  const handleMoodSelect = async (val) => {
    setSelectedMood(val)
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('mood_checkins').insert({
        user_id: user.id, mood: val, emotions: [], created_at: new Date().toISOString()
      })
      setCheckinDone(true)
      setStreak(s => s + 1)
    }
  }

  const QUICK = [
    { label: lang === 'tr' ? 'Günlük' : 'Journal', icon: '📓', path: '/journal' },
    { label: lang === 'tr' ? 'Sohbet' : 'Chat', icon: '💬', path: '/chat' },
    { label: lang === 'tr' ? 'Tükenmişlik' : 'Burnout', icon: '🔋', path: '/burnout' },
  ]

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.greeting}>{t(`home.${greetKey}`)}</Text>
        {user?.user_metadata?.full_name && (
          <Text style={styles.name}>{user.user_metadata.full_name.split(' ')[0]}</Text>
        )}
        <Text style={styles.date}>
          {new Date().toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </Text>
      </View>

      {!checkinDone ? (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('home.how_feeling')}</Text>
          <View style={styles.moodRow}>
            {MOODS.map(m => (
              <TouchableOpacity key={m.val} onPress={() => handleMoodSelect(m.val)}
                style={[styles.moodBtn, selectedMood === m.val && styles.moodBtnActive]}>
                <Text style={styles.moodEmoji}>{m.emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ) : (
        <View style={[styles.card, { backgroundColor: colors.purple50 }]}>
          <Text style={{ color: colors.purple800, fontSize: 15, fontWeight: '500' }}>
            ✓ {lang === 'tr' ? 'Bugünkü kontrol tamamlandı' : 'Check-in complete for today'}
          </Text>
        </View>
      )}

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNum}>{streak}</Text>
          <Text style={styles.statLabel}>{t('home.streak')}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNum}>7</Text>
          <Text style={styles.statLabel}>{lang === 'tr' ? 'Günlük giriş' : 'Check-ins'}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNum}>3.8</Text>
          <Text style={styles.statLabel}>{lang === 'tr' ? 'Ort. ruh hali' : 'Avg mood'}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>{lang === 'tr' ? 'Hızlı eylemler' : 'Quick actions'}</Text>
      <View style={styles.quickGrid}>
        {QUICK.map(q => (
          <TouchableOpacity key={q.path} style={styles.quickCard} onPress={() => router.push(q.path)}>
            <Text style={styles.quickIcon}>{q.icon}</Text>
            <Text style={styles.quickLabel}>{q.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.crisisBtn} onPress={() => router.push('/crisis')}>
        <Text style={styles.crisisBtnText}>🆘 {lang === 'tr' ? 'Kriz desteği' : 'Crisis support'}</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.gray50 },
  content: { padding: spacing.lg, paddingTop: 56, paddingBottom: 80 },
  header: { marginBottom: spacing.lg },
  greeting: { fontSize: 28, fontWeight: '600', color: colors.gray900 },
  name: { fontSize: 28, fontWeight: '600', color: colors.purple600 },
  date: { fontSize: 14, color: colors.gray400, marginTop: 4 },
  card: { backgroundColor: colors.white, borderRadius: radius.md, borderWidth: 1, borderColor: colors.gray200, padding: spacing.lg, marginBottom: spacing.md },
  cardTitle: { fontSize: 16, fontWeight: '500', color: colors.gray900, marginBottom: spacing.md },
  moodRow: { flexDirection: 'row', justifyContent: 'space-between' },
  moodBtn: { width: 52, height: 52, borderRadius: 26, borderWidth: 2, borderColor: 'transparent', backgroundColor: colors.gray100, alignItems: 'center', justifyContent: 'center' },
  moodBtnActive: { borderColor: colors.purple400, backgroundColor: colors.purple50 },
  moodEmoji: { fontSize: 24 },
  statsRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
  statCard: { flex: 1, backgroundColor: colors.gray100, borderRadius: radius.sm, padding: spacing.md, alignItems: 'center' },
  statNum: { fontSize: 24, fontWeight: '700', color: colors.gray900 },
  statLabel: { fontSize: 11, color: colors.gray400, marginTop: 2, textAlign: 'center' },
  sectionTitle: { fontSize: 15, fontWeight: '600', color: colors.gray900, marginBottom: spacing.sm },
  quickGrid: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  quickCard: { flex: 1, backgroundColor: colors.white, borderRadius: radius.md, borderWidth: 1, borderColor: colors.gray200, padding: spacing.md, alignItems: 'center' },
  quickIcon: { fontSize: 28, marginBottom: 6 },
  quickLabel: { fontSize: 12, fontWeight: '500', color: colors.gray900, textAlign: 'center' },
  crisisBtn: { backgroundColor: colors.red50, borderRadius: radius.sm, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: '#F09595' },
  crisisBtnText: { color: colors.red400, fontSize: 14, fontWeight: '600' }
})
