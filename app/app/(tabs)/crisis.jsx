import { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Linking } from 'react-native'
import { useTranslation } from 'react-i18next'
import { colors, radius, spacing } from '../../src/lib/theme'

export default function CrisisScreen() {
  const { i18n } = useTranslation()
  const lang = i18n.language
  const [activeTab, setActiveTab] = useState('resources')

  const RESOURCES = lang === 'tr' ? [
    { name: 'ALO 182 Psikolojik Destek', number: '182', desc: '7/24 Türkçe destek', color: colors.purple600 },
    { name: 'Acil Yardım', number: '112', desc: 'Acil tıbbi yardım', color: colors.red400 }
  ] : [
    { name: '988 Suicide & Crisis Lifeline', number: '988', desc: 'Free, confidential, 24/7', color: colors.purple600 },
    { name: 'Crisis Text Line', number: '741741', desc: 'Text HOME', color: colors.teal600 },
    { name: 'Emergency Services', number: '911', desc: 'Immediate danger', color: colors.red400 }
  ]

  const TABS = [
    { key: 'resources', label: lang === 'tr' ? 'Kaynaklar' : 'Resources' },
    { key: 'breathe', label: lang === 'tr' ? 'Nefes' : 'Breathe' },
    { key: 'ground', label: lang === 'tr' ? 'Topraklan' : 'Ground' }
  ]

  const [breathPhase, setBreathPhase] = useState('ready')
  const [groundStep, setGroundStep] = useState(0)

  const startBreath = () => {
    if (breathPhase !== 'ready' && breathPhase !== 'done') return
    setBreathPhase('in')
    setTimeout(() => setBreathPhase('hold'), 4000)
    setTimeout(() => setBreathPhase('out'), 8000)
    setTimeout(() => setBreathPhase('done'), 14000)
  }

  const BREATH_LABELS = {
    ready: lang === 'tr' ? 'Başlamak için dokun' : 'Tap to begin',
    in: lang === 'tr' ? 'Nefes al...' : 'Breathe in...',
    hold: lang === 'tr' ? 'Tut...' : 'Hold...',
    out: lang === 'tr' ? 'Nefes ver...' : 'Breathe out...',
    done: lang === 'tr' ? 'Harika! Tekrar dene.' : 'Well done! Tap to repeat.'
  }

  const GROUND = lang === 'tr'
    ? [{ n: 5, label: 'Gördüğün 5 şey' }, { n: 4, label: 'Dokunduğun 4 şey' }, { n: 3, label: 'Duyduğun 3 ses' }, { n: 2, label: 'Kokladığın 2 şey' }, { n: 1, label: 'Tattığın 1 şey' }]
    : [{ n: 5, label: '5 things you see' }, { n: 4, label: '4 things you touch' }, { n: 3, label: '3 things you hear' }, { n: 2, label: '2 things you smell' }, { n: 1, label: '1 thing you taste' }]

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{lang === 'tr' ? 'Kriz Desteği' : 'Crisis Support'}</Text>
        <Text style={styles.subtitle}>{lang === 'tr' ? 'Yalnız değilsiniz. Yardım mevcut.' : 'You are not alone. Help is available.'}</Text>

        <View style={styles.tabRow}>
          {TABS.map(tab => (
            <TouchableOpacity key={tab.key} onPress={() => setActiveTab(tab.key)}
              style={[styles.tab, activeTab === tab.key && styles.tabActive]}>
              <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>{tab.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {activeTab === 'resources' && RESOURCES.map(r => (
          <View key={r.name} style={[styles.resourceCard, { borderLeftColor: r.color }]}>
            <View style={{ flex: 1 }}>
              <Text style={styles.resourceName}>{r.name}</Text>
              <Text style={styles.resourceDesc}>{r.desc}</Text>
            </View>
            <TouchableOpacity style={[styles.callBtn, { backgroundColor: r.color }]} onPress={() => Linking.openURL(`tel:${r.number}`)}>
              <Text style={styles.callBtnText}>{r.number}</Text>
            </TouchableOpacity>
          </View>
        ))}

        {activeTab === 'breathe' && (
          <View style={styles.breathWrap}>
            <TouchableOpacity onPress={startBreath} style={[styles.breathCircle, breathPhase === 'in' && styles.breathCircleLarge]}>
              <Text style={styles.breathEmoji}>{breathPhase === 'in' ? '🌬️' : breathPhase === 'hold' ? '⏸️' : breathPhase === 'out' ? '💨' : breathPhase === 'done' ? '✨' : '👆'}</Text>
              <Text style={styles.breathLabel}>{BREATH_LABELS[breathPhase]}</Text>
            </TouchableOpacity>
          </View>
        )}

        {activeTab === 'ground' && (
          <View>
            {GROUND.map((step, i) => (
              <View key={i} style={[styles.groundStep, i === groundStep && styles.groundStepActive]}>
                <View style={[styles.groundNum, i <= groundStep && styles.groundNumDone]}>
                  <Text style={[styles.groundNumText, i <= groundStep && styles.groundNumTextDone]}>{step.n}</Text>
                </View>
                <Text style={styles.groundLabel}>{step.label}</Text>
                {i === groundStep && i < GROUND.length - 1 && (
                  <TouchableOpacity onPress={() => setGroundStep(i + 1)} style={styles.doneBtn}>
                    <Text style={styles.doneBtnText}>✓</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
            {groundStep === GROUND.length - 1 && (
              <TouchableOpacity onPress={() => setGroundStep(0)} style={styles.resetBtn}>
                <Text style={styles.resetBtnText}>{lang === 'tr' ? 'Başa dön' : 'Start over'}</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.gray50 },
  content: { padding: spacing.lg, paddingTop: 56, paddingBottom: 80 },
  title: { fontSize: 28, fontWeight: '600', color: colors.gray900, marginBottom: 4 },
  subtitle: { fontSize: 15, color: colors.gray400, marginBottom: spacing.lg },
  tabRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
  tab: { flex: 1, padding: 10, borderRadius: radius.sm, backgroundColor: colors.gray100, alignItems: 'center' },
  tabActive: { backgroundColor: colors.purple600 },
  tabText: { fontSize: 13, fontWeight: '500', color: colors.gray600 },
  tabTextActive: { color: colors.white },
  resourceCard: { backgroundColor: colors.white, borderRadius: radius.sm, borderWidth: 1, borderColor: colors.gray200, borderLeftWidth: 4, padding: spacing.lg, marginBottom: spacing.sm, flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  resourceName: { fontSize: 14, fontWeight: '600', color: colors.gray900, marginBottom: 2 },
  resourceDesc: { fontSize: 12, color: colors.gray400 },
  callBtn: { borderRadius: radius.sm, paddingVertical: 10, paddingHorizontal: 14, alignItems: 'center' },
  callBtnText: { color: colors.white, fontSize: 14, fontWeight: '700' },
  breathWrap: { alignItems: 'center', paddingVertical: spacing.xxl },
  breathCircle: { width: 160, height: 160, borderRadius: 80, backgroundColor: colors.purple50, borderWidth: 3, borderColor: colors.purple400, alignItems: 'center', justifyContent: 'center' },
  breathCircleLarge: { width: 200, height: 200, borderRadius: 100 },
  breathEmoji: { fontSize: 36, marginBottom: 8 },
  breathLabel: { fontSize: 14, fontWeight: '500', color: colors.purple600, textAlign: 'center', paddingHorizontal: 16 },
  groundStep: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.md, borderRadius: radius.sm, marginBottom: spacing.sm, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.gray200 },
  groundStepActive: { backgroundColor: colors.purple50, borderColor: colors.purple100 },
  groundNum: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.gray200, alignItems: 'center', justifyContent: 'center' },
  groundNumDone: { backgroundColor: colors.purple600 },
  groundNumText: { fontSize: 16, fontWeight: '700', color: colors.gray600 },
  groundNumTextDone: { color: colors.white },
  groundLabel: { flex: 1, fontSize: 14, color: colors.gray900 },
  doneBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.teal400, alignItems: 'center', justifyContent: 'center' },
  doneBtnText: { color: colors.white, fontWeight: '700' },
  resetBtn: { backgroundColor: colors.gray100, borderRadius: radius.sm, padding: 12, alignItems: 'center', marginTop: spacing.sm },
  resetBtnText: { color: colors.gray600, fontSize: 14 }
})
