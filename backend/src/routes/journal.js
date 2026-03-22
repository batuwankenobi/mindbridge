const express = require('express')
const router = express.Router()
const { client, SYSTEM_PROMPTS } = require('../lib/anthropic')

router.post('/analyze', async (req, res) => {
  const { entry, mood, language = 'en' } = req.body
  if (!entry) return res.status(400).json({ error: 'Journal entry required' })

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 400,
      system: SYSTEM_PROMPTS.journal[language] || SYSTEM_PROMPTS.journal.en,
      messages: [{
        role: 'user',
        content: `Mood: ${mood}/10\n\nJournal entry: ${entry}`
      }]
    })

    res.json({ response: message.content[0].text })
  } catch (err) {
    console.error('Journal error:', err)
    res.status(500).json({ error: 'AI service error' })
  }
})

router.post('/prompt', async (req, res) => {
  const { mood, language = 'en' } = req.body
  const prompts = {
    en: [
      "What's one thing that felt heavy today, and what might it be telling you?",
      "Describe a moment today when you felt most like yourself.",
      "What thought kept returning today? What does it protect you from?",
      "If your anxiety had a shape, what would it look like right now?",
      "What would you tell a friend who was feeling exactly how you feel?",
      "What did your body try to tell you today that you didn't listen to?",
      "What's one small thing you could let go of today?"
    ],
    tr: [
      "Bugün sizi en çok zorlayan şey neydi ve bu size ne söylüyor?",
      "Bugün en çok kendiniz gibi hissettiğiniz anı anlatın.",
      "Bugün sürekli dönen bir düşünce var mıydı? Bu düşünce sizi neden koruyor?",
      "Kaygınızın bir şekli olsaydı, şu an nasıl görünürdü?",
      "Tam olarak sizin hissettiğiniz gibi hisseden bir arkadaşınıza ne söylerdiniz?",
      "Vücudunuz bugün size ne söylemeye çalıştı ama siz dinlemediniz?",
      "Bugün bırakabileceğiniz küçük bir şey nedir?"
    ]
  }
  const list = prompts[language] || prompts.en
  const idx = mood <= 3 ? Math.floor(Math.random() * 3) + 4 : Math.floor(Math.random() * list.length)
  res.json({ prompt: list[idx % list.length] })
})

module.exports = router
