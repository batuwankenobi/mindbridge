import { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Switch, Alert } from 'react-native'
import { useTranslation } from 'react-i18next'
import { supabase } from '../../src/lib/supabase'
import { colors, radius, spacing } from '../../src/lib/theme'
import { useRouter } from 'expo-router'

export default function ProfileScreen() {
  const { i18n } = useTranslation()
  const lang = i18n.language
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [notifications, setNotifications] = useState(true)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user))
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    router.replace('/(auth)/')
  }

  const toggleLang = () => {
    const next = lang === 'en' ? 'tr' : 'en'
    i18n.changeLanguage(next)
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{lang === 'tr' ? 'Profil' : 'Profile'}</Text>

      <View style={styles.avatarWrap}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{(user?.user_metadata?.full_name || user?.email || 'U').charAt(0).toUpperCase()}</Text>
        </View>
        <Text style={styles.userName}>{user?.user_metadata?.full_name || lang === 'tr' ? 'Kullanıcı' : 'User'}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{lang === 'tr' ? 'Tercihler' : 'Preferences'}</Text>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>{lang === 'tr' ? 'Günlük hatırlatıcı' : 'Daily reminder'}</Text>
          <Switch value={notifications} onValueChange={setNotifications} trackColor={{ true: colors.purple600 }} />
        </View>
        <TouchableOpacity style={styles.settingRow} onPress={toggleLang}>
          <Text style={styles.settingLabel}>{lang === 'tr' ? 'Dil' : 'Language'}</Text>
          <Text style={styles.settingValue}>{lang === 'en' ? '🇬🇧 English' : '🇹🇷 Türkçe'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{lang === 'tr' ? 'Hakkında' : 'About'}</Text>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>{lang === 'tr' ? 'Versiyon' : 'Version'}</Text>
          <Text style={styles.settingValue}>1.0.0</Text>
        </View>
        <TouchableOpacity style={styles.settingRow}>
          <Text style={styles.settingLabel}>{lang === 'tr' ? 'Gizlilik politikası' : 'Privacy policy'}</Text>
          <Text style={styles.settingValue}>→</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.section, { background: colors.red50 }]}>
        <TouchableOpacity style={[styles.settingRow, { borderBottomWidth: 0 }]} onPress={() => Alert.alert(lang === 'tr' ? 'Çıkış yap' : 'Sign out', lang === 'tr' ? 'Emin misiniz?' : 'Are you sure?', [{ text: lang === 'tr' ? 'İptal' : 'Cancel' }, { text: lang === 'tr' ? 'Çıkış yap' : 'Sign out', style: 'destructive', onPress: signOut }])}>
          <Text style={[styles.settingLabel, { color: colors.red400 }]}>{lang === 'tr' ? 'Çıkış yap' : 'Sign out'}</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.disclaimer}>
        {lang === 'tr'
          ? 'MindBridge bir terapistin yerini almaz. Kriz durumunda: 182'
          : 'MindBridge is not a substitute for professional care. Crisis: 182 (TR) · 988 (US)'}
      </Text>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.gray50 },
  content: { padding: spacing.lg, paddingTop: 56, paddingBottom: 80 },
  title: { fontSize: 28, fontWeight: '600', color: colors.gray900, marginBottom: spacing.xl },
  avatarWrap: { alignItems: 'center', marginBottom: spacing.xl },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: colors.purple100, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm },
  avatarText: { fontSize: 28, fontWeight: '700', color: colors.purple800 },
  userName: { fontSize: 18, fontWeight: '600', color: colors.gray900 },
  userEmail: { fontSize: 13, color: colors.gray400, marginTop: 2 },
  section: { backgroundColor: colors.white, borderRadius: radius.md, borderWidth: 1, borderColor: colors.gray200, marginBottom: spacing.md, overflow: 'hidden' },
  sectionTitle: { fontSize: 11, fontWeight: '600', color: colors.gray400, textTransform: 'uppercase', letterSpacing: 0.5, padding: spacing.md, paddingBottom: 4 },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.gray100 },
  settingLabel: { fontSize: 14, color: colors.gray900 },
  settingValue: { fontSize: 13, color: colors.gray400 },
  disclaimer: { textAlign: 'center', fontSize: 11, color: colors.gray400, lineHeight: 17, marginTop: spacing.sm }
})
