import express from 'express'

const app = express()
const port = Number(process.env.PORT || 8081)

const LOKI_URL = process.env.LOKI_INTERNAL_URL || 'http://loki:3100'
const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN
const DISCORD_GUILD_ID = process.env.DISCORD_GUILD_ID
const DISCORD_CATEGORY_ID = process.env.DISCORD_CATEGORY_ID
const DISCORD_CHANNEL_NAME_PREFIX = process.env.DISCORD_CHANNEL_NAME_PREFIX || 'chatbot'
const DISCORD_API_BASE_URL = 'https://discord.com/api/v10'
const processedConversations = new Map()
const PROCESSED_TTL_MS = 1000 * 60 * 60 * 12

app.use(express.json({ limit: '2mb' }))

function cleanupProcessedConversations() {
  const now = Date.now()
  for (const [key, storedAt] of processedConversations.entries()) {
    if (now - storedAt > PROCESSED_TTL_MS) {
      processedConversations.delete(key)
    }
  }
}

function sanitizeChannelName(value) {
  const fallback = `${DISCORD_CHANNEL_NAME_PREFIX}-conversation`
  if (!value) return fallback

  const compact = value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

  if (!compact) return fallback
  return compact.length > 95 ? compact.slice(0, 95) : compact
}

function splitDiscordMessage(content, maxLength = 1900) {
  if (!content) return []
  if (content.length <= maxLength) return [content]

  const chunks = []
  let cursor = 0

  while (cursor < content.length) {
    let next = cursor + maxLength
    if (next < content.length) {
      const breakIndex = content.lastIndexOf('\n', next)
      if (breakIndex > cursor + 200) {
        next = breakIndex
      }
    }

    chunks.push(content.slice(cursor, next).trim())
    cursor = next
  }

  return chunks.filter(Boolean)
}

function formatLocation(payload) {
  const requestContext = payload.request || {}
  const parts = [requestContext.country, requestContext.region, requestContext.city].filter(Boolean)
  return parts.length > 0 ? parts.join(' / ') : 'inconnue'
}

function buildChannelTopic(payload) {
  const parts = [
    `page=${payload.path || '/'}`,
    `messages=${payload.userMessageCount ?? 0}/${payload.assistantMessageCount ?? 0}`,
    `refus=${payload.refusalCount ?? 0}`,
    `duree=${Math.max(Math.round((payload.durationMs || 0) / 1000), 0)}s`,
    `lieu=${formatLocation(payload)}`,
  ]

  if (payload.startedAt) {
    parts.push(`debut=${payload.startedAt}`)
  }

  if (payload.endedAt) {
    parts.push(`fin=${payload.endedAt}`)
  }

  const topic = parts.join(' | ')
  return topic.length > 1000 ? `${topic.slice(0, 999)}...` : topic
}

function formatTranscriptMessages(payload) {
  const transcript = Array.isArray(payload.transcript) ? payload.transcript : []
  if (transcript.length === 0) {
    return ['**Systeme**\nTranscript vide.']
  }

  return transcript.flatMap((entry) => {
    const speaker = entry?.from === 'assistant' ? 'QuentinBot' : 'Utilisateur'
    const text = typeof entry?.text === 'string' ? entry.text.trim() : ''
    return splitDiscordMessage(`**${speaker}**\n${text || '(vide)'}`)
  })
}

async function discordRequest(endpoint, options = {}) {
  if (!DISCORD_BOT_TOKEN) {
    throw new Error('DISCORD_BOT_TOKEN manquant')
  }

  const response = await fetch(`${DISCORD_API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Discord API ${response.status}: ${errorText}`)
  }

  return response.json()
}

async function createDiscordChannel(payload) {
  if (!DISCORD_GUILD_ID) {
    throw new Error('DISCORD_GUILD_ID manquant')
  }

  if (!DISCORD_CATEGORY_ID) {
    throw new Error('DISCORD_CATEGORY_ID manquant')
  }

  const startedAt = payload.startedAt ? new Date(payload.startedAt) : new Date()
  const channelName = sanitizeChannelName(
    `${DISCORD_CHANNEL_NAME_PREFIX} ${startedAt.toLocaleString('fr-FR', {
      dateStyle: 'short',
      timeStyle: 'short',
    })} ${payload.firstUserMessage || ''}`,
  )

  const channel = await discordRequest(`/guilds/${DISCORD_GUILD_ID}/channels`, {
    method: 'POST',
    body: JSON.stringify({
      name: channelName,
      type: 0,
      parent_id: DISCORD_CATEGORY_ID,
      topic: buildChannelTopic(payload),
    }),
  })

  for (const message of formatTranscriptMessages(payload)) {
    await discordRequest(`/channels/${channel.id}/messages`, {
      method: 'POST',
      body: JSON.stringify({ content: message }),
    })
  }

  return { channelId: channel.id, channelName: channel.name }
}

async function fetchConversationPayload(sessionId, visitorId) {
  const filters = ['type="chat_conversation_closed"']
  if (sessionId) {
    filters.push(`payload_sessionId="${sessionId}"`)
  } else if (visitorId) {
    filters.push(`payload_visitorId="${visitorId}"`)
  } else {
    return null
  }

  const query = `{stack="portfolio",compose_service="portfolio"} | json | ${filters.join(' | ')}`
  const searchParams = new URLSearchParams({
    query,
    limit: '1',
    direction: 'backward',
    start: String(Date.now() * 1_000_000 - 1000 * 60 * 60 * 24 * 1_000_000),
    end: String(Date.now() * 1_000_000),
  })

  const response = await fetch(`${LOKI_URL}/loki/api/v1/query_range?${searchParams.toString()}`)
  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Loki query failed (${response.status}): ${errorText}`)
  }

  const data = await response.json()
  const streams = data?.data?.result
  if (!Array.isArray(streams) || streams.length === 0) return null

  const values = streams[0]?.values
  if (!Array.isArray(values) || values.length === 0) return null

  const rawLine = values[0]?.[1]
  if (typeof rawLine !== 'string') return null

  const parsed = JSON.parse(rawLine)
  if (!parsed?.payload) return null

  return {
    ...parsed.payload,
    request: parsed.request || null,
  }
}

function extractConversationTargets(body) {
  const alerts = Array.isArray(body?.alerts) ? body.alerts : []

  return alerts
    .filter((alert) => alert?.status === 'firing')
    .map((alert) => ({
      sessionId: alert?.labels?.payload_sessionId || null,
      visitorId: alert?.labels?.payload_visitorId || null,
    }))
    .filter((target) => target.sessionId || target.visitorId)
}

app.get('/health', (req, res) => {
  res.json({ ok: true })
})

app.post('/webhooks/grafana/discord', async (req, res) => {
  cleanupProcessedConversations()

  try {
    const targets = extractConversationTargets(req.body)
    if (targets.length === 0) {
      return res.status(202).json({ ok: true, ignored: true, reason: 'no firing conversation alert' })
    }

    const created = []

    for (const target of targets) {
      const payload = await fetchConversationPayload(target.sessionId, target.visitorId)
      if (!payload) {
        continue
      }

      const processedKey =
        payload.conversationKey ||
        [payload.sessionId, payload.startedAt, payload.endedAt, payload.firstUserMessage].filter(Boolean).join(':')

      if (!processedKey || processedConversations.has(processedKey)) {
        continue
      }

      const discordResult = await createDiscordChannel(payload)
      processedConversations.set(processedKey, Date.now())
      created.push({
        conversationKey: processedKey,
        channelId: discordResult.channelId,
        channelName: discordResult.channelName,
      })
    }

    return res.status(202).json({ ok: true, createdCount: created.length, created })
  } catch (error) {
    console.error('Discord webhook relay failed', error)
    return res.status(500).json({
      ok: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    })
  }
})

app.listen(port, () => {
  console.log(`Notifications service listening on port ${port}`)
})
