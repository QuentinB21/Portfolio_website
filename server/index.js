import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import { buildDeterministicChatResponse, buildRefusalResponse, REFUSAL_MESSAGE } from './chatDomain.js'
import { buildKnowledgeContext, retrieveKnowledge } from './siteKnowledge.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const port = process.env.PORT || 80

const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini'
const OPENAI_BASE_URL = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1'
const CHATBOT_SYSTEM_PROMPT =
  process.env.CHATBOT_SYSTEM_PROMPT ||
  "Tu es l'assistant du portfolio de Quentin Bouchot. Réponds en français, de façon concise et utile."
const PROFILE_BIRTHDATE = process.env.PROFILE_BIRTHDATE

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

function parseJsonResponse(value) {
  if (!value || typeof value !== 'string') return null

  try {
    return JSON.parse(value)
  } catch {
    const match = value.match(/\{[\s\S]*\}/)
    if (!match) return null

    try {
      return JSON.parse(match[0])
    } catch {
      return null
    }
  }
}

function extractJsonStringField(source, fieldName) {
  if (!source || typeof source !== 'string') return null

  const fieldIndex = source.indexOf(`"${fieldName}"`)
  if (fieldIndex === -1) return null

  const colonIndex = source.indexOf(':', fieldIndex)
  if (colonIndex === -1) return null

  const firstQuoteIndex = source.indexOf('"', colonIndex)
  if (firstQuoteIndex === -1) return null

  let escaped = false
  let result = ''
  for (let index = firstQuoteIndex + 1; index < source.length; index += 1) {
    const char = source[index]

    if (escaped) {
      result += `\\${char}`
      escaped = false
      continue
    }

    if (char === '\\') {
      escaped = true
      continue
    }

    if (char === '"') {
      try {
        return JSON.parse(`"${result}"`)
      } catch {
        return result
      }
    }

    result += char
  }

  return null
}

function sanitizeCitations(citations) {
  if (!Array.isArray(citations)) return []

  return citations
    .filter((citation) => citation && typeof citation === 'object')
    .map((citation) => ({
      title: typeof citation.title === 'string' ? citation.title.trim() : '',
      path: typeof citation.path === 'string' ? citation.path.trim() : '',
      section: typeof citation.section === 'string' ? citation.section.trim() : '',
      excerpt: typeof citation.excerpt === 'string' ? citation.excerpt.trim() : '',
    }))
    .filter((citation) => citation.title && citation.path)
    .slice(0, 3)
}

function sanitizeSuggestedPaths(suggestedPaths) {
  if (!Array.isArray(suggestedPaths)) return []

  return suggestedPaths
    .filter((item) => item && typeof item === 'object')
    .map((item) => ({
      label: typeof item.label === 'string' ? item.label.trim() : '',
      path: typeof item.path === 'string' ? item.path.trim() : '',
      reason: typeof item.reason === 'string' ? item.reason.trim() : '',
    }))
    .filter((item) => item.label && item.path.startsWith('/'))
    .slice(0, 3)
}

app.get('/api/profile', (req, res) => {
  res.json({
    currentAge: getCurrentAge(PROFILE_BIRTHDATE),
  })
})

app.post('/api/chat', async (req, res) => {
  const { message } = req.body || {}
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message invalide.' })
  }

  const deterministicResponse = buildDeterministicChatResponse(message)
  if (deterministicResponse) {
    return res.json({
      ...deterministicResponse,
      usage: {
        promptTokens: null,
        completionTokens: null,
        totalTokens: null,
      },
    })
  }

  if (!OPENAI_API_KEY) {
    return res.json({
      ...buildRefusalResponse(),
      usage: {
        promptTokens: null,
        completionTokens: null,
        totalTokens: null,
      },
    })
  }

  const knowledgeEntries = retrieveKnowledge(message, 6)
  const knowledgeContext = buildKnowledgeContext(knowledgeEntries)

  const body = {
    model: OPENAI_MODEL,
    messages: [
      {
        role: 'system',
        content: `${CHATBOT_SYSTEM_PROMPT}

Tu aides les visiteurs à comprendre le profil de Quentin Bouchot et à se repérer dans le site.
Tu dois répondre en français, de façon concrète, concise et fiable.
Tu dois t'appuyer uniquement sur les informations fournies dans le contexte du site. Si une information n'est pas présente, dis-le clairement.
Quand c'est utile, propose une redirection vers une page du site.
Quand tu affirmes un fait, cite la page ou la section d'où il provient.
Si la question sort du périmètre du site, si l'information n'existe pas dans le contexte, ou si tu n'es pas certain de la réponse, tu dois répondre exactement : "${REFUSAL_MESSAGE}".
Réponds STRICTEMENT en JSON valide avec cette structure :
{
  "answer": "réponse pour l'utilisateur",
  "citations": [
    {
      "title": "titre de la source",
      "path": "/work",
      "section": "Expérience",
      "excerpt": "court extrait ou reformulation très proche"
    }
  ],
  "suggestedPaths": [
    {
      "label": "Voir la page Carrière",
      "path": "/work",
      "reason": "pour voir la chronologie et les expériences détaillées"
    }
  ]
}`,
      },
      {
        role: 'system',
        content: `Contexte du site:\n${knowledgeContext}`,
      },
      { role: 'user', content: message },
    ],
    max_tokens: 420,
    temperature: 0.2,
    response_format: { type: 'json_object' },
  }

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
      return res.json({
        ...buildRefusalResponse(),
        usage: {
          promptTokens: null,
          completionTokens: null,
          totalTokens: null,
        },
      })
    }

    const data = await response.json()
    const content = data?.choices?.[0]?.message?.content
    if (!content) {
      return res.json({
        ...buildRefusalResponse(),
        usage: {
          promptTokens: null,
          completionTokens: null,
          totalTokens: null,
        },
      })
    }

    const parsed = parseJsonResponse(content)
    const extractedAnswer = extractJsonStringField(content, 'answer')
    const answer =
      parsed && typeof parsed.answer === 'string' && parsed.answer.trim()
        ? parsed.answer.trim()
        : typeof extractedAnswer === 'string' && extractedAnswer.trim()
          ? extractedAnswer.trim()
          : content.trim()
    const citations = sanitizeCitations(parsed?.citations)
    const suggestedPaths = sanitizeSuggestedPaths(parsed?.suggestedPaths)
    const usage = data?.usage || {}

    res.json({
      answer,
      citations,
      suggestedPaths,
      usage: {
        promptTokens: typeof usage.prompt_tokens === 'number' ? usage.prompt_tokens : null,
        completionTokens: typeof usage.completion_tokens === 'number' ? usage.completion_tokens : null,
        totalTokens: typeof usage.total_tokens === 'number' ? usage.total_tokens : null,
      },
    })
  } catch (error) {
    console.error('OpenAI request failed', error)
    res.json({
      ...buildRefusalResponse(),
      usage: {
        promptTokens: null,
        completionTokens: null,
        totalTokens: null,
      },
    })
  }
})

app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'))
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
