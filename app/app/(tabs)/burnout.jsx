import { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native'
import { useTranslation } from 'react-i18next'
import { supabase } from '../../src/lib/supabase'
import { colors, radius, spacing } from '../../src/lib/theme'

const API = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001'
const QUESTIONS = ['energy', 'meaning', 'control', 'connection', 'workload']

export default function BurnoutScreen() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const [step, setStep] = useState('intro')
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState({})
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const reset = () => { setStep('intro'); setCurrentQ(0); setAnswers({}); setResult(null) }

  const handleAnswer = async (val) => {
    const key = QUESTIONS[currentQ]
    const newAnswers = { ...answers, [key]: val }
    setAnswers(newAnswers)
    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ(currentQ + 1)
    } else {
      setStep('result')
      setLoading(true)
      try {
        const res = await fetch(`${API}/api/burnout/assess`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ answers: newAnswers, language: lang })
        })
        const data = await res.json()
        setResult(data)
        const { data: { user } } = await supabase.auth.getUser()
        if (user) await supabase.from('burnout_assessments').insert({ user_id: user.id, answers: newAnswers, score: data.score, level: data.level, created_at: new Date().toISOString() })
      } catch { setResult({ score: 50, level: 'Unknown', color: 'gray', primary_suggestion: t('common.error') }) }
      finally { setLoading(false) }
    }
  }

  const COLOR_MAP = { green: colors.green400, amber: colors.amber400, orange: '#C65D00', red: colors.red400, gray: colors.gray400 }

  if (step === 'intro') return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{t('burnout.title')}</Text>
        <View style={styles.card}>
          <Text style={styles.bigIcon}>🔋</Text>
          <Text style={styles.cardTitle}>{lang === 'tr' ? 'Tükenmişlik riski taşıyor musunuz?' : 'Are you at risk of burnout?'}</Text>
          <Text style={styles.cardDesc}>{lang === 'tr' ? '5 soruluk değerlendirme, 2 dakika.' : '5 questions, under 2 minutes.'}</Text>
          <TouchableOpacity style={styles.primaryBtn} onPress={() => setStep('questions')}>
            <Text style={styles.primaryBtnText}>{t('burnout.start')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )

  if (step === 'questions') {
    const q = QUESTIONS[currentQ]
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>{t('burnout.title')}</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${(currentQ / QUESTIONS.length) * 100}%` }]} />
          </View>
          <Text style={styles.qNum}>{currentQ + 1} / {QUESTIONS.length}</Text>
          <Text style={styles.question}>{t(`burnout.questions.${q}`)}</Text>
          <View style={styles.scaleRow}>
            {[1,2,3,4,5].map(v => (
              <TouchableOpacity key={v} style={styles.scaleBtn} onPress={() => handleAnswer(v)}>
                <Text style={styles.scaleBtnText}>{v}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.scaleLabels}>
            <Text style={styles.scaleLabel}>{t('burnout.scale.low')}</Text>
            <Text style={styles.scaleLabel}>{t('burnout.scale.high')}</Text>
          </View>
        </ScrollView>
      </View>
    )
  }

  if (step === 'result') return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{t('burnout.result')}</Text>
        {loading || !result ? <ActivityIndicator color={colors.purple600} size="large" style={{ marginTop: 40 }} /> : (
          <>
            <View style={[styles.scoreCard, { borderColor: COLOR_MAP[result.color] || colors.gray400 }]}>
              <Text style={[styles.scoreNum, { color: COLOR_MAP[result.color] }]}>{result.score}</Text>
              <Text style={styles.scoreMax}>/100</Text>
              <Text style={[styles.scoreLevel, { color: COLOR_MAP[result.color] }]}>{result.level}</Text>
            </View>
            {result.primary_suggestion && (
              <View style={[styles.suggCard, { borderLeftColor: COLOR_MAP[result.color] || colors.purple600 }]}>
                <Text style={styles.suggLabel}>{lang === 'tr' ? 'Odaklanılacak alan' : 'Focus area'}</Text>
                <Text style={styles.suggText}>{result.primary_suggestion}</Text>
              </View>
            )}
            <TouchableOpacity style={styles.secondaryBtn} onPress={reset}>
              <Text style={styles.secondaryBtnText}>{t('burnout.retake')}</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.gray50 },
  content: { padding: spacing.lg, paddingTop: 56, paddingBottom: 80 },
  title: { fontSize: 28, fontWeight: '600', color: colors.gray900, marginBottom: spacing.lg },
  card: { backgroundColor: colors.white, borderRadius: radius.md, borderWidth: 1, borderColor: colors.gray200, padding: spacing.xl, alignItems: 'center' },
  bigIcon: { fontSize: 52, marginBottom: spacing.md },
  cardTitle: { fontSize: 20, fontWeight: '600', color: colors.gray900, textAlign: 'center', marginBottom: spacing.sm },
  cardDesc: { fontSize: 14, color: colors.gray400, textAlign: 'center', marginBottom: spacing.xl },
  primaryBtn: { backgroundColor: colors.purple600, borderRadius: radius.sm, paddingVertical: 13, paddingHorizontal: 32, alignItems: 'center', width: '100%' },
  primaryBtnText: { color: colors.white, fontSize: 15, fontWeight: '600' },
  secondaryBtn: { backgroundColor: colors.white, borderRadius: radius.sm, paddingVertical: 12, paddingHorizontal: 32, alignItems: 'center', borderWidth: 1.5, borderColor: colors.gray200, marginTop: spacing.md },
  secondaryBtnText: { color: colors.gray900, fontSize: 14, fontWeight: '500' },
  progressBar: { height: 4, backgroundColor: colors.gray200, borderRadius: 2, marginBottom: spacing.md },
  progressFill: { height: '100%', backgroundColor: colors.purple400, borderRadius: 2 },
  qNum: { fontSize: 13, color: colors.gray400, marginBottom: 8 },
  question: { fontSize: 20, fontWeight: '600', color: colors.gray900, lineHeight: 28, marginBottom: spacing.xl },
  scaleRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
  scaleBtn: { width: 52, height: 52, borderRadius: 26, borderWidth: 2, borderColor: colors.gray200, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  scaleBtnText: { fontSize: 18, fontWeight: '600', color: colors.gray900 },
  scaleLabels: { flexDirection: 'row', justifyContent: 'space-between' },
  scaleLabel: { fontSize: 11, color: colors.gray400 },
  scoreCard: { backgroundColor: colors.white, borderRadius: radius.md, borderWidth: 2, padding: spacing.xl, alignItems: 'center', marginBottom: spacing.md },
  scoreNum: { fontSize: 64, fontWeight: '700' },
  scoreMax: { fontSize: 20, color: colors.gray400 },
  scoreLevel: { fontSize: 20, fontWeight: '600', marginTop: 4 },
  suggCard: { backgroundColor: colors.white, borderRadius: radius.sm, borderWidth: 1, borderColor: colors.gray200, borderLeftWidth: 4, padding: spacing.lg, marginBottom: spacing.md },
  suggLabel: { fontSize: 12, fontWeight: '600', color: colors.gray400, marginBottom: 4 },
  suggText: { fontSize: 15, color: colors.gray900, lineHeight: 22 }
})
