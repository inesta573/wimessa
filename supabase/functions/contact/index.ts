/**
 * Supabase Edge Function: contact form handler
 * Receives form data, validates, stores in DB, sends email via Resend.
 *
 * Deploy: supabase functions deploy contact --no-verify-jwt
 * Secrets: RESEND_API_KEY, CONTACT_EMAIL, SMTP_FROM (optional)
 */
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const MAX_NAME = 200
const MAX_EMAIL = 254
const MAX_SUBJECT = 300
const MAX_MESSAGE = 5000
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function escapeHtml(s: string): string {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/\n/g, '<br>')
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed. Use POST to submit the contact form.' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  try {
    const body = await req.json()
    let name = typeof body?.name === 'string' ? body.name.trim() : ''
    let email = typeof body?.email === 'string' ? body.email.trim() : ''
    let subject = typeof body?.subject === 'string' ? body.subject.trim() : ''
    let message = typeof body?.message === 'string' ? body.message.trim() : ''

    // Validation
    if (!name) return jsonResponse({ error: 'Name is required.' }, 400)
    if (name.length > MAX_NAME) return jsonResponse({ error: `Name must be at most ${MAX_NAME} characters.` }, 400)
    if (!email) return jsonResponse({ error: 'Email is required.' }, 400)
    if (!EMAIL_REGEX.test(email) || email.length > MAX_EMAIL) return jsonResponse({ error: 'Please provide a valid email address.' }, 400)
    if (subject.length > MAX_SUBJECT) return jsonResponse({ error: `Subject must be at most ${MAX_SUBJECT} characters.` }, 400)
    if (!message) return jsonResponse({ error: 'Message is required.' }, 400)
    if (message.length > MAX_MESSAGE) return jsonResponse({ error: `Message must be at most ${MAX_MESSAGE} characters.` }, 400)

    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase env vars')
      return jsonResponse({ error: 'Contact form is not configured.' }, 503)
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Insert into DB
    const { error: dbError } = await supabase.from('contact_submissions').insert([
      { name, email, subject, message },
    ])

    if (dbError) {
      console.error('DB insert error:', dbError)
      return jsonResponse({ error: 'Failed to save message. Please try again later.' }, 500)
    }

    // Send email via Resend
    const resendKey = Deno.env.get('RESEND_API_KEY')
    const contactEmail = Deno.env.get('CONTACT_EMAIL')
    const smtpFrom = Deno.env.get('SMTP_FROM') || contactEmail

    if (resendKey && contactEmail) {
      const mailSubject = subject ? `[Contact Form] ${subject}` : `[Contact Form] Message from ${name}`
      const html = `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; color: #333;">
  <div style="background: #2d3748; color: #fff; padding: 1rem 1.25rem; border-radius: 8px 8px 0 0; font-weight: 600;">WIMESSA Website — New inquiry</div>
  <div style="border: 1px solid #e2e8f0; border-top: none; padding: 1.25rem; border-radius: 0 0 8px 8px;">
    <table style="width: 100%; font-size: 0.95rem;">
      <tr><td style="padding: 0.35em 0.75em 0 0; color: #64748b; font-weight: 600; width: 80px;">From</td><td>${escapeHtml(name)}</td></tr>
      <tr><td style="padding: 0.35em 0.75em 0 0; color: #64748b; font-weight: 600;">Email</td><td><a href="mailto:${escapeHtml(email)}" style="color: #2563eb;">${escapeHtml(email)}</a></td></tr>
      ${subject ? `<tr><td style="padding: 0.35em 0.75em 0 0; color: #64748b; font-weight: 600;">Subject</td><td>${escapeHtml(subject)}</td></tr>` : ''}
    </table>
    <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #e2e8f0;">
      <div style="color: #64748b; font-weight: 600; font-size: 0.85rem; margin-bottom: 0.5rem;">Message</div>
      <div style="padding: 1rem; background: #f8fafc; border-left: 4px solid #2d3748; border-radius: 4px; white-space: pre-wrap;">${escapeHtml(message)}</div>
    </div>
  </div>
</div>
      `.trim()

      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${resendKey}`,
        },
        body: JSON.stringify({
          from: smtpFrom,
          to: [contactEmail],
          reply_to: email,
          subject: mailSubject,
          html,
        }),
      })

      if (!res.ok) {
        console.error('Resend error:', await res.text())
        // Don't fail the request - message is saved in DB
      }
    }

    return jsonResponse({ message: 'Message sent successfully.' }, 200)
  } catch (err) {
    console.error('Contact function error:', err)
    return jsonResponse({ error: 'Something went wrong. Please try again later.' }, 500)
  }
})

function jsonResponse(data: object, status: number): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}
