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

app.use(express.json())

const distPath = path.join(__dirname, '..', 'dist')
app.use(express.static(distPath))

app.post('/api/chat', async (req, res) => {
  if (!OPENAI_API_KEY) {
    return res.status(500).json({ error: 'OPENAI_API_KEY manquante côté serveur' })
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
        content:
          "Tu es l'assistant du portfolio de Quentin Bouchot. Réponds en français, concis et utile. Profil: apprenti software engineer chez Renault Trucks (Volvo Group), ex-Biosystèmes; études CPE Lyon (2024-2027) et BUT Info. Compétences: React/TypeScript, .NET/Blazor/WPF, Docker, CI/CD (GitHub Actions, Azure DevOps), bases de données, intégration IA (LangChain/OpenAI). Si la question dépasse le profil ou est sensible, réponds que tu ne peux pas fournir cette info.",
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
      return res.status(500).json({ error: 'Le service IA ne répond pas. Réessaie plus tard.' })
    }

    const data = await response.json()
    const content = data?.choices?.[0]?.message?.content
    if (!content) {
      return res.status(500).json({ error: 'Pas de réponse reçue.' })
    }

    res.json({ answer: content.trim() })
  } catch (error) {
    console.error('OpenAI request failed', error)
    res.status(500).json({ error: 'Erreur lors de la requête à OpenAI.' })
  }
})

app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'))
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
