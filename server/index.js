import crypto from 'crypto'
import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const port = process.env.PORT || 80

const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini'
const OPENAI_BASE_URL = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1'
const CHATBOT_SYSTEM_PROMPT =
  process.env.CHATBOT_SYSTEM_PROMPT ||
  "Tu es l'assistant du portfolio de Quentin Bouchot. Reponds en francais, de facon concise et utile."
const PROFILE_BIRTHDATE = process.env.PROFILE_BIRTHDATE
const MONITORING_IP_HASH_SALT = process.env.MONITORING_IP_HASH_SALT || 'portfolio-monitoring'

app.use(express.json({ limit: '1mb' }))

const distPath = path.join(__dirname, '..', 'dist')
app.use(express.static(distPath))

function parseBirthdate(value) {
  if (!value) return null

  const [yearPart, monthPart, dayPart] = value.split('-')
  const year = Number(yearPart)
  const month = Number(monthPart)
  const day = Number(dayPart)

  if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) {
    return null
  }

  return { year, month, day }
}

function getCurrentAge(value) {
  const birthdate = parseBirthdate(value)
  if (!birthdate) return null

  const now = new Date()
  let age = now.getFullYear() - birthdate.year
  const hasHadBirthdayThisYear =
    now.getMonth() + 1 > birthdate.month ||
    (now.getMonth() + 1 === birthdate.month && now.getDate() >= birthdate.day)

  if (!hasHadBirthdayThisYear) {
    age -= 1
  }

  return age
}

function getFirstForwardedIp(value) {
  if (!value || typeof value !== 'string') return null
  return value.split(',')[0]?.trim() || null
}

function hashIp(ip) {
  if (!ip) return null
  return crypto.createHash('sha256').update(`${MONITORING_IP_HASH_SALT}:${ip}`).digest('hex')
}

function getRequestContext(req) {
  const forwardedFor = req.get('x-forwarded-for')
  const ip = getFirstForwardedIp(forwardedFor) || req.socket.remoteAddress || null

  return {
    ipHash: hashIp(ip),
    country:
      req.get('x-vercel-ip-country') ||
      req.get('cf-ipcountry') ||
      req.get('x-country-code') ||
      null,
    region:
      req.get('x-vercel-ip-country-region') ||
      req.get('x-region') ||
      null,
    city: req.get('x-vercel-ip-city') || req.get('x-city') || null,
    userAgent: req.get('user-agent') || null,
  }
}

function logStructuredEvent(type, payload, req) {
  const entry = {
    ts: new Date().toISOString(),
    type,
    payload,
    request: getRequestContext(req),
  }

  console.log(JSON.stringify(entry))
}

app.get('/api/profile', (req, res) => {
  res.json({
    currentAge: getCurrentAge(PROFILE_BIRTHDATE),
  })
})

app.post('/api/chat', async (req, res) => {
  if (!OPENAI_API_KEY) {
    return res.status(500).json({ error: 'OPENAI_API_KEY manquante cote serveur' })
  }

  const { message, analytics } = req.body || {}
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message invalide' })
  }

  const analyticsPayload = analytics && typeof analytics === 'object' ? analytics : {}

  logStructuredEvent(
    'chat_user_message',
    {
      ...analyticsPayload,
      message,
      messageLength: message.length,
    },
    req,
  )

  const body = {
    model: OPENAI_MODEL,
    messages: [
      {
        role: 'system',
        content: CHATBOT_SYSTEM_PROMPT,
      },
      { role: 'user', content: message },
    ],
    max_tokens: 256,
    temperature: 0.5,
  }

  const startedAt = Date.now()

  try {
    const response = await fetch(`${OPENAI_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('OpenAI error', errorText)

      logStructuredEvent(
        'chat_completion_error',
        {
          ...analyticsPayload,
          model: OPENAI_MODEL,
          message,
          error: errorText,
          durationMs: Date.now() - startedAt,
        },
        req,
      )

      return res.status(500).json({ error: 'Le service IA ne repond pas. Reessaie plus tard.' })
    }

    const data = await response.json()
    const content = data?.choices?.[0]?.message?.content
    if (!content) {
      return res.status(500).json({ error: 'Pas de reponse recue.' })
    }

    const usage = data?.usage || {}

    logStructuredEvent(
      'chat_completion',
      {
        ...analyticsPayload,
        model: OPENAI_MODEL,
        message,
        answer: content.trim(),
        promptTokens: typeof usage.prompt_tokens === 'number' ? usage.prompt_tokens : null,
        completionTokens: typeof usage.completion_tokens === 'number' ? usage.completion_tokens : null,
        totalTokens: typeof usage.total_tokens === 'number' ? usage.total_tokens : null,
        durationMs: Date.now() - startedAt,
      },
      req,
    )

    res.json({
      answer: content.trim(),
      usage: {
        promptTokens: typeof usage.prompt_tokens === 'number' ? usage.prompt_tokens : null,
        completionTokens: typeof usage.completion_tokens === 'number' ? usage.completion_tokens : null,
        totalTokens: typeof usage.total_tokens === 'number' ? usage.total_tokens : null,
      },
    })
  } catch (error) {
    console.error('OpenAI request failed', error)

    logStructuredEvent(
      'chat_completion_error',
      {
        ...analyticsPayload,
        model: OPENAI_MODEL,
        message,
        error: error instanceof Error ? error.message : 'Unknown error',
        durationMs: Date.now() - startedAt,
      },
      req,
    )

    res.status(500).json({ error: 'Erreur lors de la requete a OpenAI.' })
  }
})

app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'))
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
