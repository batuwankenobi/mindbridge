import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  en: {
    translation: {
      app_name: 'MindBridge',
      tagline: 'Your mental health companion',
      nav: {
        home: 'Home',
        journal: 'Journal',
        chat: 'Companion',
        burnout: 'Burnout Check',
        crisis: 'Crisis Support',
        profile: 'Profile'
      },
      home: {
        greeting_morning: 'Good morning',
        greeting_afternoon: 'Good afternoon',
        greeting_evening: 'Good evening',
        how_feeling: 'How are you feeling today?',
        checkin_btn: 'Daily Check-in',
        streak: 'day streak',
        quick_actions: 'Quick actions',
        recent_mood: 'Recent mood',
        your_stats: 'Your stats'
      },
      journal: {
        title: 'Journal',
        subtitle: 'Write freely. Be honest.',
        placeholder: 'What\'s on your mind today?',
        mood_label: 'How\'s your mood?',
        analyze_btn: 'Get reflection',
        save_btn: 'Save entry',
        prompt_label: 'Writing prompt',
        saved: 'Entry saved',
        ai_reflection: 'AI Reflection'
      },
      chat: {
        title: 'Companion',
        subtitle: 'A safe space to talk',
        placeholder: 'Share what\'s on your mind...',
        send: 'Send',
        disclaimer: 'MindBridge is not a therapist. In crisis? Call',
        thinking: 'Thinking...',
        welcome: 'Hi, I\'m here to listen. What\'s on your mind today?'
      },
      burnout: {
        title: 'Burnout Check',
        subtitle: 'A 5-minute wellbeing assessment',
        start_btn: 'Start assessment',
        next: 'Next',
        finish: 'See results',
        your_score: 'Your wellbeing score',
        suggestion: 'What to focus on',
        retake: 'Retake',
        questions: {
          energy: 'How is your energy level right now?',
          meaning: 'How meaningful does your work feel?',
          control: 'How much control do you feel over your situation?',
          connection: 'How connected do you feel to others?',
          workload: 'How manageable is your workload?'
        },
        scale: { low: 'Very low', high: 'Very high' }
      },
      crisis: {
        title: 'Crisis Support',
        subtitle: 'You are not alone. Help is available.',
        call_now: 'Call now',
        resources: 'Resources',
        safety_plan: 'My safety plan',
        breathe: 'Breathing exercise',
        grounding: '5-4-3-2-1 Grounding'
      },
      auth: {
        sign_in: 'Sign in',
        sign_up: 'Create account',
        email: 'Email address',
        password: 'Password',
        name: 'Your name',
        google: 'Continue with Google',
        apple: 'Continue with Apple',
        or: 'or',
        have_account: 'Already have an account?',
        no_account: 'Don\'t have an account?',
        forgot: 'Forgot password?'
      },
      common: {
        save: 'Save',
        cancel: 'Cancel',
        loading: 'Loading...',
        error: 'Something went wrong. Please try again.',
        language: 'Language'
      }
    }
  },
  tr: {
    translation: {
      app_name: 'MindBridge',
      tagline: 'Ruh sağlığı yoldaşınız',
      nav: {
        home: 'Ana Sayfa',
        journal: 'Günlük',
        chat: 'Yoldaş',
        burnout: 'Tükenmişlik Testi',
        crisis: 'Kriz Desteği',
        profile: 'Profil'
      },
      home: {
        greeting_morning: 'Günaydın',
        greeting_afternoon: 'İyi öğleden sonralar',
        greeting_evening: 'İyi akşamlar',
        how_feeling: 'Bugün kendinizi nasıl hissediyorsunuz?',
        checkin_btn: 'Günlük Kontrol',
        streak: 'günlük seri',
        quick_actions: 'Hızlı eylemler',
        recent_mood: 'Son ruh hali',
        your_stats: 'İstatistikleriniz'
      },
      journal: {
        title: 'Günlük',
        subtitle: 'Özgürce yazın. Dürüst olun.',
        placeholder: 'Bugün aklınızda ne var?',
        mood_label: 'Ruh haliniz nasıl?',
        analyze_btn: 'Yansıma al',
        save_btn: 'Girişi kaydet',
        prompt_label: 'Yazma ipucu',
        saved: 'Giriş kaydedildi',
        ai_reflection: 'Yapay Zeka Yansıması'
      },
      chat: {
        title: 'Yoldaş',
        subtitle: 'Konuşmak için güvenli bir alan',
        placeholder: 'Aklınızdakileri paylaşın...',
        send: 'Gönder',
        disclaimer: 'MindBridge bir terapist değildir. Kriz mi yaşıyorsunuz? Arayın:',
        thinking: 'Düşünüyor...',
        welcome: 'Merhaba, dinlemek için buradayım. Bugün aklınızda ne var?'
      },
      burnout: {
        title: 'Tükenmişlik Testi',
        subtitle: '5 dakikalık bir iyilik hali değerlendirmesi',
        start_btn: 'Değerlendirmeyi başlat',
        next: 'Sonraki',
        finish: 'Sonuçları gör',
        your_score: 'İyilik hali puanınız',
        suggestion: 'Odaklanılacak alan',
        retake: 'Tekrar yap',
        questions: {
          energy: 'Şu an enerji seviyeniz nasıl?',
          meaning: 'İşiniz size ne kadar anlamlı geliyor?',
          control: 'Durumunuz üzerinde ne kadar kontrol hissediyorsunuz?',
          connection: 'Diğer insanlarla ne kadar bağlı hissediyorsunuz?',
          workload: 'İş yükünüz ne kadar yönetilebilir?'
        },
        scale: { low: 'Çok düşük', high: 'Çok yüksek' }
      },
      crisis: {
        title: 'Kriz Desteği',
        subtitle: 'Yalnız değilsiniz. Yardım mevcut.',
        call_now: 'Şimdi ara',
        resources: 'Kaynaklar',
        safety_plan: 'Güvenlik planım',
        breathe: 'Nefes egzersizi',
        grounding: '5-4-3-2-1 Topraklama'
      },
      auth: {
        sign_in: 'Giriş yap',
        sign_up: 'Hesap oluştur',
        email: 'E-posta adresi',
        password: 'Şifre',
        name: 'Adınız',
        google: 'Google ile devam et',
        apple: 'Apple ile devam et',
        or: 'veya',
        have_account: 'Zaten hesabınız var mı?',
        no_account: 'Hesabınız yok mu?',
        forgot: 'Şifremi unuttum?'
      },
      common: {
        save: 'Kaydet',
        cancel: 'İptal',
        loading: 'Yükleniyor...',
        error: 'Bir şeyler ters gitti. Lütfen tekrar deneyin.',
        language: 'Dil'
      }
    }
  }
}

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem('mb_lang') || 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false }
})

export default i18n
