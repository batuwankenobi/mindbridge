import { useState } from 'react'
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, Alert
} from 'react-native'
import { useRouter } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { supabase } from '../../src/lib/supabase'
import { colors, radius, spacing } from '../../src/lib/theme'

export default function AuthScreen() {
  const { t } = useTranslation()
  const router = useRouter()
  const [mode, setMode] = useState('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAuth = async () => {
    if (!email || !password) return
    setLoading(true)
    try {
      if (mode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
      } else {
        const { error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: name } } })
        if (error) throw error
      }
      router.replace('/(tabs)/')
    } catch (err) {
      Alert.alert('Error', err.message || t('common.error'))
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' })
    if (error) Alert.alert('Error', error.message)
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.logo}>MindBridge</Text>
          <Text style={styles.tagline}>{t('tagline')}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{mode === 'signin' ? t('auth.signin') : t('auth.signup')}</Text>

          <TouchableOpacity style={styles.socialBtn} onPress={handleGoogle}>
            <Text style={styles.socialBtnText}>G  {t('auth.google')}</Text>
          </TouchableOpacity>

          <View style={styles.orRow}>
            <View style={styles.divider} />
            <Text style={styles.orText}>{t('auth.or')}</Text>
            <View style={styles.divider} />
          </View>

          {mode === 'signup' && (
            <TextInput style={styles.input} placeholder={t('auth.name')} value={name}
              onChangeText={setName} autoCapitalize="words" placeholderTextColor={colors.gray400} />
          )}
          <TextInput style={styles.input} placeholder={t('auth.email')} value={email}
            onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none"
            placeholderTextColor={colors.gray400} />
          <TextInput style={styles.input} placeholder={t('auth.password')} value={password}
            onChangeText={setPassword} secureTextEntry placeholderTextColor={colors.gray400} />

          <TouchableOpacity style={styles.primaryBtn} onPress={handleAuth} disabled={loading}>
            <Text style={styles.primaryBtnText}>
              {loading ? t('common.loading') : mode === 'signin' ? t('auth.signin') : t('auth.signup')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setMode(mode === 'signin' ? 'signup' : 'signin')}>
            <Text style={styles.switchText}>
              {mode === 'signin' ? t('auth.signup') : t('auth.signin')}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.disclaimer}>
          Crisis? TR: 182 · US: 988
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.purple50 },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: spacing.xl },
  header: { alignItems: 'center', marginBottom: spacing.xl },
  logo: { fontSize: 36, color: colors.purple600, marginBottom: 6, fontWeight: '600' },
  tagline: { fontSize: 15, color: colors.gray400 },
  card: { backgroundColor: colors.white, borderRadius: radius.lg, padding: spacing.xl, marginBottom: spacing.lg },
  cardTitle: { fontSize: 22, fontWeight: '600', color: colors.gray900, textAlign: 'center', marginBottom: spacing.lg },
  socialBtn: { borderWidth: 1.5, borderColor: colors.gray200, borderRadius: radius.sm, padding: 13, alignItems: 'center', marginBottom: spacing.md },
  socialBtnText: { fontSize: 15, color: colors.gray900, fontWeight: '500' },
  orRow: { flexDirection: 'row', alignItems: 'center', marginVertical: spacing.md },
  divider: { flex: 1, height: 1, backgroundColor: colors.gray200 },
  orText: { marginHorizontal: 12, fontSize: 13, color: colors.gray400 },
  input: {
    borderWidth: 1.5, borderColor: colors.gray200, borderRadius: radius.sm,
    padding: 12, fontSize: 15, color: colors.gray900, marginBottom: spacing.md
  },
  primaryBtn: { backgroundColor: colors.purple600, borderRadius: radius.sm, padding: 14, alignItems: 'center', marginBottom: spacing.md },
  primaryBtnText: { color: colors.white, fontSize: 15, fontWeight: '600' },
  switchText: { textAlign: 'center', color: colors.purple600, fontSize: 14, fontWeight: '500' },
  disclaimer: { textAlign: 'center', fontSize: 12, color: colors.gray400 }
})
