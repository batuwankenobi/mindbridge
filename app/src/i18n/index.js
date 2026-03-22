import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  en: {
    translation: {
      app_name: 'MindBridge',
      tagline: 'Your mental health companion',
      nav: { home: 'Home', journal: 'Journal', chat: 'Chat', burnout: 'Burnout', crisis: 'Crisis' },
      home: {
        greeting_morning: 'Good morning', greeting_afternoon: 'Good afternoon', greeting_evening: 'Good evening',
        how_feeling: 'How are you feeling today?', checkin_btn: 'Log mood', streak: 'day streak'
      },
      journal: { title: 'Journal', placeholder: "What's on your mind?", save: 'Save', analyze: 'Get reflection', prompt: 'Writing prompt' },
      chat: { title: 'Companion', placeholder: 'Share what\'s on your mind...', send: 'Send', welcome: 'Hi, I\'m here to listen. What\'s on your mind today?', disclaimer: 'Not a therapist. Crisis? Call' },
      burnout: { title: 'Burnout Check', start: 'Begin assessment', result: 'Your score', retake: 'Retake' },
      crisis: { title: 'Crisis Support', subtitle: 'You are not alone.', call: 'Call now' },
      auth: { signin: 'Sign in', signup: 'Create account', email: 'Email', password: 'Password', name: 'Your name', google: 'Continue with Google', apple: 'Continue with Apple', or: 'or' },
      common: { save: 'Save', loading: 'Loading...', error: 'Something went wrong.', language: 'Language' }
    }
  },
  tr: {
    translation: {
      app_name: 'MindBridge',
      tagline: 'Ruh sağlığı yoldaşınız',
      nav: { home: 'Ana Sayfa', journal: 'Günlük', chat: 'Sohbet', burnout: 'Tükenmişlik', crisis: 'Kriz' },
      home: {
        greeting_morning: 'Günaydın', greeting_afternoon: 'İyi öğleden sonralar', greeting_evening: 'İyi akşamlar',
        how_feeling: 'Bugün kendinizi nasıl hissediyorsunuz?', checkin_btn: 'Ruh halini kaydet', streak: 'günlük seri'
      },
      journal: { title: 'Günlük', placeholder: 'Aklınızda ne var?', save: 'Kaydet', analyze: 'Yansıma al', prompt: 'Yazma ipucu' },
      chat: { title: 'Yoldaş', placeholder: 'Aklınızdakileri paylaşın...', send: 'Gönder', welcome: 'Merhaba, dinlemek için buradayım.', disclaimer: 'Terapist değil. Kriz? Arayın:' },
      burnout: { title: 'Tükenmişlik Testi', start: 'Başla', result: 'Puanınız', retake: 'Tekrar yap' },
      crisis: { title: 'Kriz Desteği', subtitle: 'Yalnız değilsiniz.', call: 'Şimdi ara' },
      auth: { signin: 'Giriş yap', signup: 'Hesap oluştur', email: 'E-posta', password: 'Şifre', name: 'Adınız', google: 'Google ile devam et', apple: 'Apple ile devam et', or: 'veya' },
      common: { save: 'Kaydet', loading: 'Yükleniyor...', error: 'Bir hata oluştu.', language: 'Dil' }
    }
  }
}

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false }
})

export default i18n
