const express = require('express')
const router = express.Router()
const { client, SYSTEM_PROMPTS } = require('../lib/anthropic')

router.post('/message', async (req, res) => {
  const { messages, language = 'en', userId } = req.body
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Messages array required' })
  }

  try {
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')

    const stream = await client.messages.stream({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: SYSTEM_PROMPTS.companion[language] || SYSTEM_PROMPTS.companion.en,
      messages: messages.slice(-20)
    })

    for await (const chunk of stream) {
      if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
        res.write(`data: ${JSON.stringify({ text: chunk.delta.text })}\n\n`)
      }
    }

    res.write('data: [DONE]\n\n')
    res.end()
  } catch (err) {
    console.error('Chat error:', err)
    res.status(500).json({ error: 'AI service error' })
  }
})

module.exports = router
