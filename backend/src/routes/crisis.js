const express = require('express')
const router = express.Router()
const { client, SYSTEM_PROMPTS } = require('../lib/anthropic')

const CRISIS_RESOURCES = {
  en: { line: '988', name: 'Suicide & Crisis Lifeline', url: 'https://988lifeline.org' },
  tr: { line: '182', name: 'ALO 182 Psikolojik Destek Hattı', url: 'https://www.saglik.gov.tr' }
}

router.post('/analyze', async (req, res) => {
  const { text, language = 'en' } = req.body
  if (!text) return res.status(400).json({ error: 'Text required' })

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 200,
      system: SYSTEM_PROMPTS.crisis[language] || SYSTEM_PROMPTS.crisis.en,
      messages: [{ role: 'user', content: text }]
    })

    let result
    try {
      result = JSON.parse(message.content[0].text)
    } catch {
      result = { risk_level: 'low', signals: [], recommend_escalation: false }
    }

    result.resources = CRISIS_RESOURCES[language] || CRISIS_RESOURCES.en
    res.json(result)
  } catch (err) {
    console.error('Crisis analysis error:', err)
    res.status(500).json({ error: 'Analysis failed' })
  }
})

router.get('/resources', (req, res) => {
  const { language = 'en' } = req.query
  res.json(CRISIS_RESOURCES[language] || CRISIS_RESOURCES.en)
})

module.exports = router
