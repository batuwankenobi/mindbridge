import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth'

export function useDB() {
  const { user } = useAuth()

  // MOOD CHECK-INS
  const saveMoodCheckin = async (mood, emotions, note) => {
    return supabase.from('mood_checkins').insert({
      user_id: user.id, mood, emotions, note, created_at: new Date().toISOString()
    })
  }

  const getMoodHistory = async (days = 14) => {
    const since = new Date()
    since.setDate(since.getDate() - days)
    return supabase.from('mood_checkins')
      .select('*')
      .eq('user_id', user.id)
      .gte('created_at', since.toISOString())
      .order('created_at', { ascending: false })
  }

  // JOURNAL ENTRIES
  const saveJournalEntry = async (content, mood, aiReflection, prompt) => {
    return supabase.from('journal_entries').insert({
      user_id: user.id, content, mood, ai_reflection: aiReflection, prompt, created_at: new Date().toISOString()
    })
  }

  const getJournalEntries = async (limit = 20) => {
    return supabase.from('journal_entries')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit)
  }

  // CHAT MESSAGES
  const saveChatSession = async (messages, summary) => {
    return supabase.from('chat_sessions').insert({
      user_id: user.id, messages, summary, created_at: new Date().toISOString()
    })
  }

  // BURNOUT ASSESSMENTS
  const saveBurnoutResult = async (answers, score, level) => {
    return supabase.from('burnout_assessments').insert({
      user_id: user.id, answers, score, level, created_at: new Date().toISOString()
    })
  }

  const getBurnoutHistory = async () => {
    return supabase.from('burnout_assessments')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10)
  }

  // USER PROFILE
  const getProfile = async () => {
    return supabase.from('profiles').select('*').eq('id', user.id).single()
  }

  const updateProfile = async (data) => {
    return supabase.from('profiles').upsert({ id: user.id, ...data, updated_at: new Date().toISOString() })
  }

  // STREAK
  const getStreak = async () => {
    const { data } = await getMoodHistory(60)
    if (!data || data.length === 0) return 0
    let streak = 0
    let current = new Date()
    current.setHours(0,0,0,0)
    const dates = [...new Set(data.map(d => new Date(d.created_at).toDateString()))]
    for (let i = 0; i < dates.length; i++) {
      const d = new Date(dates[i])
      d.setHours(0,0,0,0)
      const diff = Math.round((current - d) / 86400000)
      if (diff === i) streak++
      else break
    }
    return streak
  }

  return { saveMoodCheckin, getMoodHistory, saveJournalEntry, getJournalEntries, saveChatSession, saveBurnoutResult, getBurnoutHistory, getProfile, updateProfile, getStreak }
}
