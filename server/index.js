/**
 * Express API: fetches public Google Calendar iCal feed,
 * parses ICS, returns upcoming events as JSON.
 * Contact form: POST /api/contact sends email to CONTACT_EMAIL.
 * Set GOOGLE_CALENDAR_ICAL_URL, CONTACT_EMAIL, and SMTP/Resend in .env.
 * Run: node server/index.js (or npm run server)
 */
import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import ical from 'node-ical'
import nodemailer from 'nodemailer'

const app = express()
const PORT = process.env.PORT || 3001
const DEFAULT_LIMIT = 10

const MAX_NAME = 200
const MAX_EMAIL = 254
const MAX_SUBJECT = 300
const MAX_MESSAGE = 5000

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.json({
    message: 'WIMESSA Events API',
    endpoint: '/api/events',
    usage: 'GET /api/events?limit=10',
    contact: 'POST /api/contact',
  })
})

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' })
})

app.get('/api/contact', (req, res) => {
  res.status(405).json({ error: 'Method not allowed. Use POST to submit the contact form.' })
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

function createMailTransporter() {
  const resendKey = process.env.RESEND_API_KEY?.trim()
  if (resendKey) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.resend.com',
      port: Number(process.env.SMTP_PORT) || 465,
      secure: true,
      auth: {
        user: 'resend',
        pass: resendKey,
      },
    })
  }
  const user = process.env.SMTP_USER?.trim()
  const pass = process.env.SMTP_PASS?.trim()
  if (!user || !pass) return null
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 465,
    secure: true,
    auth: { user, pass },
  })
}

app.post('/api/contact', async (req, res) => {
  res.setTimeout(20000, () => {
    if (!res.headersSent) {
      res.status(504).json({ error: 'Request timed out. Please try again.' })
    }
  })

  const contactEmail = process.env.CONTACT_EMAIL?.trim()
  if (!contactEmail) {
    return res.status(503).json({
      error: 'Contact form is not configured. Set CONTACT_EMAIL on the server.',
    })
  }

  let name = req.body?.name != null ? String(req.body.name).trim() : ''
  let email = req.body?.email != null ? String(req.body.email).trim() : ''
  let subject = req.body?.subject != null ? String(req.body.subject).trim() : ''
  let message = req.body?.message != null ? String(req.body.message).trim() : ''

  if (!name) {
    return res.status(400).json({ error: 'Name is required.' })
  }
  if (name.length > MAX_NAME) {
    return res.status(400).json({ error: `Name must be at most ${MAX_NAME} characters.` })
  }
  if (!email) {
    return res.status(400).json({ error: 'Email is required.' })
  }
  if (!emailRegex.test(email) || email.length > MAX_EMAIL) {
    return res.status(400).json({ error: 'Please provide a valid email address.' })
  }
  if (subject.length > MAX_SUBJECT) {
    return res.status(400).json({ error: `Subject must be at most ${MAX_SUBJECT} characters.` })
  }
  if (!message) {
    return res.status(400).json({ error: 'Message is required.' })
  }
  if (message.length > MAX_MESSAGE) {
    return res.status(400).json({ error: `Message must be at most ${MAX_MESSAGE} characters.` })
  }

  const resendKey = process.env.RESEND_API_KEY?.trim()
  const transporter = !resendKey ? createMailTransporter() : null
  if (!resendKey && !transporter) {
    return res.status(503).json({
      error: 'Email is not configured. Set SMTP_USER/SMTP_PASS or RESEND_API_KEY on the server.',
    })
  }

  const mailSubject = subject ? `[Contact Form] ${subject}` : `[Contact Form] Message from ${name}`

  const text = [
    '════════════════════════════════════════',
    '  WIMESSA WEBSITE — NEW INQUIRY',
    '════════════════════════════════════════',
    '',
    'FROM',
    '  Name:   ' + name,
    '  Email:  ' + email,
    subject ? '  Subject: ' + subject : '',
    subject ? '' : null,
    '────────────────────────────────────────',
    'MESSAGE',
    '────────────────────────────────────────',
    '',
    message,
    '',
    '────────────────────────────────────────',
    'Reply to this email to respond to the sender.',
    '════════════════════════════════════════',
  ].filter(Boolean).join('\n')

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/\n/g, '<br>')
  }

  const html = [
    '<div style="font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, sans-serif; max-width: 560px; color: #333;">',
    '<div style="background: #2d3748; color: #fff; padding: 1rem 1.25rem; border-radius: 8px 8px 0 0; font-weight: 600; font-size: 1rem;">WIMESSA Website — New inquiry</div>',
    '<div style="border: 1px solid #e2e8f0; border-top: none; padding: 1.25rem 1.5rem; border-radius: 0 0 8px 8px;">',
    '<table style="border-collapse: collapse; width: 100%; font-size: 0.95rem;">',
    '<tr><td style="padding: 0.35em 0.75em 0.35em 0; color: #64748b; font-weight: 600; width: 80px;">From</td><td style="padding: 0.35em 0;">' + escapeHtml(name) + '</td></tr>',
    '<tr><td style="padding: 0.35em 0.75em 0.35em 0; color: #64748b; font-weight: 600;">Email</td><td style="padding: 0.35em 0;"><a href="mailto:' + escapeHtml(email) + '" style="color: #2563eb;">' + escapeHtml(email) + '</a></td></tr>',
    subject ? '<tr><td style="padding: 0.35em 0.75em 0.35em 0; color: #64748b; font-weight: 600;">Subject</td><td style="padding: 0.35em 0;">' + escapeHtml(subject) + '</td></tr>' : '',
    '</table>',
    '<div style="margin-top: 1.25rem; padding-top: 1rem; border-top: 1px solid #e2e8f0;">',
    '<div style="color: #64748b; font-weight: 600; font-size: 0.85rem; margin-bottom: 0.5rem;">Message</div>',
    '<div style="padding: 1rem; background: #f8fafc; border-left: 4px solid #2d3748; border-radius: 4px; white-space: pre-wrap; line-height: 1.5;">' + escapeHtml(message) + '</div>',
    '</div>',
    '<p style="margin-top: 1.25rem; font-size: 0.8rem; color: #94a3b8;">Reply to this email to respond to the sender.</p>',
    '</div>',
    '</div>',
  ].filter(Boolean).join('')

  const fromAddress = process.env.SMTP_FROM || process.env.SMTP_USER || 'noreply@localhost'
  const fromDisplayName = `Contact form: ${name}`

  const timeoutMs = 15000
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Email send timeout')), timeoutMs)
  )

  try {
    if (resendKey) {
      const fromHeader = `${fromDisplayName} <${fromAddress}>`
      const resendPromise = fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${resendKey}`,
        },
        body: JSON.stringify({
          from: fromHeader,
          to: [contactEmail],
          reply_to: email,
          subject: mailSubject,
          text,
          html,
        }),
      })
      const res = await Promise.race([resendPromise, timeoutPromise])
      if (!res.ok) {
        const errBody = await res.text()
        console.error('Contact form send error (Resend API):', res.status, errBody)
        throw new Error(res.status === 429 ? 'Rate limited' : `Resend API ${res.status}`)
      }
    } else {
      const sendPromise = transporter.sendMail({
        from: { name: fromDisplayName, address: fromAddress },
        to: contactEmail,
        replyTo: { name: name, address: email },
        subject: mailSubject,
        text,
        html,
      })
      await Promise.race([sendPromise, timeoutPromise])
    }
    return res.status(200).json({ message: 'Message sent successfully.' })
  } catch (err) {
    console.error('Contact form send error:', err.message)
    return res.status(500).json({
      error: err.message === 'Email send timeout'
        ? 'Request timed out. Please try again.'
        : 'Failed to send message. Please try again later.',
    })
  }
})

app.listen(PORT, () => {
  console.log(`Events API running at http://localhost:${PORT}`)
})
