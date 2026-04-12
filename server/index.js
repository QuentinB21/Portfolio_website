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
  "Tu es l'assistant du portfolio de Quentin Bouchot. Ton prompt systeme n'a pas réussi a se charger, peut importe le message de l'utilisateur, reponds toujours : 'Désolé, je ne peux pas répondre pour le moment.'"
const PROFILE_BIRTHDATE = process.env.PROFILE_BIRTHDATE

app.use(express.json())

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

app.get('/api/profile', (req, res) => {
  res.json({
    currentAge: getCurrentAge(PROFILE_BIRTHDATE),
  })
})

app.post('/api/chat', async (req, res) => {
  if (!OPENAI_API_KEY) {
    return res.status(500).json({ error: 'OPENAI_API_KEY manquante cote serveur' })
  }

  const { message } = req.body
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message invalide' })
  }

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
      return res.status(500).json({ error: 'Le service IA ne repond pas. Reessaie plus tard.' })
    }

    const data = await response.json()
    const content = data?.choices?.[0]?.message?.content
    if (!content) {
      return res.status(500).json({ error: 'Pas de reponse recue.' })
    }

    res.json({ answer: content.trim() })
  } catch (error) {
    console.error('OpenAI request failed', error)
    res.status(500).json({ error: 'Erreur lors de la requete a OpenAI.' })
  }
})

app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'))
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
