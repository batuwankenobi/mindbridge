const express = require('express')
const router = express.Router()
const { client } = require('../lib/anthropic')

router.post('/assess', async (req, res) => {
  const { answers, language = 'en' } = req.body
  // answers: { energy: 1-5, meaning: 1-5, control: 1-5, connection: 1-5, workload: 1-5 }

  const score = Object.values(answers).reduce((a, b) => a + b, 0)
  const max = Object.keys(answers).length * 5
  const pct = Math.round((score / max) * 100)

  let level, color
  if (pct >= 75) { level = language === 'tr' ? 'İyi' : 'Thriving'; color = 'green' }
  else if (pct >= 55) { level = language === 'tr' ? 'Dikkat' : 'Watch out'; color = 'amber' }
  else if (pct >= 35) { level = language === 'tr' ? 'Risk Altında' : 'At Risk'; color = 'orange' }
  else { level = language === 'tr' ? 'Tükenmişlik' : 'Burnout'; color = 'red' }

  const weakest = Object.entries(answers).sort((a, b) => a[1] - b[1])[0][0]

  const suggestions = {
    energy: { en: 'Protect your sleep — try a consistent bedtime this week.', tr: 'Uyku düzeninizi koruyun — bu hafta tutarlı bir uyku saati deneyin.' },
    meaning: { en: 'Reconnect with why your work matters — journal about a past win.', tr: 'İşinizin neden önemli olduğunu düşünün — geçmiş bir başarıyı günlüğe yazın.' },
    control: { en: 'Identify one thing you CAN control today and act on it.', tr: 'Bugün kontrol edebileceğiniz bir şeyi belirleyin ve harekete geçin.' },
    connection: { en: 'Reach out to one person today — even a short message counts.', tr: 'Bugün birine ulaşın — kısa bir mesaj bile önemlidir.' },
    workload: { en: 'List your tasks, pick the top 3, and consciously drop the rest.', tr: 'Görevlerinizi listeleyin, en önemli 3\'ü seçin, gerisini bilinçli olarak bırakın.' }
  }

  res.json({
    score: pct,
    level,
    color,
    breakdown: answers,
    primary_suggestion: suggestions[weakest]?.[language] || suggestions[weakest]?.en,
    weakest_area: weakest
  })
})

module.exports = router
