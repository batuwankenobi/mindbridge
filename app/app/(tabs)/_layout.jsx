import { Tabs } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { colors } from '../../src/lib/theme'

const TAB_ICONS = {
  index: '🏠', journal: '📓', chat: '💬', burnout: '🔋', crisis: '🆘'
}

export default function TabsLayout() {
  const { t } = useTranslation()

  return (
    <Tabs screenOptions={({ route }) => ({
      headerShown: false,
      tabBarActiveTintColor: colors.purple600,
      tabBarInactiveTintColor: colors.gray400,
      tabBarStyle: {
        borderTopColor: colors.gray200,
        borderTopWidth: 1,
        backgroundColor: colors.white,
        paddingBottom: 4,
        height: 60
      },
      tabBarLabelStyle: { fontSize: 10, fontWeight: '500' },
      tabBarIcon: ({ focused }) => {
        const name = route.name
        return null
      }
    })}>
      <Tabs.Screen name="index" options={{ title: t('nav.home'), tabBarLabel: t('nav.home') }} />
      <Tabs.Screen name="journal" options={{ title: t('nav.journal'), tabBarLabel: t('nav.journal') }} />
      <Tabs.Screen name="chat" options={{ title: t('nav.chat'), tabBarLabel: t('nav.chat') }} />
      <Tabs.Screen name="burnout" options={{ title: t('nav.burnout'), tabBarLabel: t('nav.burnout') }} />
      <Tabs.Screen name="crisis" options={{ title: t('nav.crisis'), tabBarLabel: t('nav.crisis') }} />
    </Tabs>
  )
}
