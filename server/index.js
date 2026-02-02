/**
 * Express API: fetches public Google Calendar iCal feed,
 * parses ICS, returns upcoming events as JSON.
 * Set GOOGLE_CALENDAR_ICAL_URL in .env or environment.
 * Run: node server/index.js (or npm run server)
 */
import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import ical from 'node-ical'

const app = express()
const PORT = process.env.PORT || 3001
const DEFAULT_LIMIT = 10

app.use(cors())

app.get('/', (req, res) => {
  res.json({
    message: 'WIMESSA Events API',
    endpoint: '/api/events',
    usage: 'GET /api/events?limit=10',
  })
})

app.get('/api/events', async (req, res) => {
  res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=300')

  const icalUrl = process.env.GOOGLE_CALENDAR_ICAL_URL?.trim()
  if (!icalUrl) {
    return res.status(500).json({
      error: 'GOOGLE_CALENDAR_ICAL_URL is not configured',
      events: [],
    })
  }

  const limit = Math.min(
    parseInt(req.query.limit, 10) || DEFAULT_LIMIT,
    50
  )

  try {
    const response = await fetch(icalUrl, {
      headers: { 'User-Agent': 'WIMESSA-Website/1.0' },
    })
    if (!response.ok) {
      throw new Error(`Calendar fetch failed: ${response.status}`)
    }
    const icsText = await response.text()
    const parsed = ical.sync.parseICS(icsText)

    const now = new Date()
    const events = []

    for (const key of Object.keys(parsed)) {
      const comp = parsed[key]
      if (comp.type !== 'VEVENT') continue
      const start = comp.start ? new Date(comp.start) : null
      if (!start || start < now) continue

      const end = comp.end ? new Date(comp.end) : null
      const title =
        comp.summary != null ? String(comp.summary).trim() : 'Untitled'
      const location =
        comp.location != null ? String(comp.location).trim() : null
      const description =
        comp.description != null ? String(comp.description).trim() : null
      const url = comp.url != null ? String(comp.url).trim() : null

      events.push({
        id: comp.uid || key,
        title,
        start: start.toISOString(),
        end: end ? end.toISOString() : null,
        location: location || null,
        description: description || null,
        url: url || null,
      })
    }

    events.sort((a, b) => new Date(a.start) - new Date(b.start))
    const limited = events.slice(0, limit)

    return res.status(200).json({ events: limited })
  } catch (err) {
    console.error('Events API error:', err.message)
    return res.status(500).json({
      error: 'Failed to load calendar',
      events: [],
    })
  }
})

app.listen(PORT, () => {
  console.log(`Events API running at http://localhost:${PORT}`)
})
