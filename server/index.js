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
        content:
          "Tu es l'assistant du portfolio de Quentin Bouchot. Reponds en francais, de facon concise et utile. Profil: eleve ingenieur en informatique et reseaux a CPE Lyon, specialise en developpement logiciel, data et IA. Actuellement Software Engineer Apprentice chez Renault Trucks (Volvo Group), apres une alternance chez Biosystemes. Positionnement: ingenierie logicielle orientee produit et qualite, avec attention a la maintenabilite, la robustesse, l'experience utilisateur et l'industrialisation. Competences: C#, .NET, WPF, Blazor, Vue.js, TypeScript, JavaScript, Azure DevOps, CI/CD, Docker, Git, tests unitaires et fonctionnels. Outils secondaires: App Insight, Power BI, SonarQube. Si la question depasse le profil ou est sensible, dis que tu ne peux pas fournir cette information.",
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
