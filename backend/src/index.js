require('dotenv').config()
const express = require('express')
const cors = require('cors')
const rateLimit = require('express-rate-limit')

const chatRoutes = require('./routes/chat')
const journalRoutes = require('./routes/journal')
const burnoutRoutes = require('./routes/burnout')
const crisisRoutes = require('./routes/crisis')

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:19006',
    /\.vercel\.app$/,
    /\.railway\.app$/,
    process.env.FRONTEND_URL
  ].filter(Boolean)
}))

app.use(express.json())

const limiter = rateLimit({ windowMs: 60 * 1000, max: 30 })
app.use('/api/', limiter)

app.use('/api/chat', chatRoutes)
app.use('/api/journal', journalRoutes)
app.use('/api/burnout', burnoutRoutes)
app.use('/api/crisis', crisisRoutes)

app.get('/api/health', (req, res) => res.json({ status: 'ok', app: 'MindBridge', version: '1.0.0' }))
app.get('/', (req, res) => res.json({ status: 'ok', app: 'MindBridge API' }))

app.listen(PORT, () => console.log(`MindBridge backend running on port ${PORT}`))
