import { useState } from 'react'
import './Contact.css'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const Contact = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState(null)

  const validate = () => {
    if (!name.trim()) return 'Please enter your name.'
    if (!email.trim()) return 'Please enter your email.'
    if (!EMAIL_REGEX.test(email.trim())) return 'Please enter a valid email address.'
    if (!message.trim()) return 'Please enter a message.'
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFeedback(null)
    const error = validate()
    if (error) {
      setFeedback({ type: 'error', text: error })
      return
    }

    setLoading(true)
    const apiBase = import.meta.env.VITE_API_URL || ''
    try {
      const res = await fetch(`${apiBase}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          subject: subject.trim(),
          message: message.trim(),
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setFeedback({
          type: 'error',
          text: data.error || 'Something went wrong. Please try again.',
        })
        return
      }
      setFeedback({ type: 'success', text: data.message || 'Message sent successfully.' })
      setName('')
      setEmail('')
      setSubject('')
      setMessage('')
    } catch {
      setFeedback({
        type: 'error',
        text: 'Unable to send. Please check your connection and try again.',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="page contact-page">
      <div className="contact-page-inner">
        <h1 className="contact-page-title">Contact</h1>
        <p className="contact-page-intro">Send us a message and we’ll get back to you.</p>

        <form className="contact-form" onSubmit={handleSubmit} noValidate>
          <label className="contact-label" htmlFor="contact-name">
            Name <span className="contact-required">*</span>
          </label>
          <input
            id="contact-name"
            className="contact-input"
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            maxLength={200}
            disabled={loading}
            autoComplete="name"
          />

          <label className="contact-label" htmlFor="contact-email">
            Email <span className="contact-required">*</span>
          </label>
          <input
            id="contact-email"
            className="contact-input"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            maxLength={254}
            disabled={loading}
            autoComplete="email"
          />

          <label className="contact-label" htmlFor="contact-subject">
            Subject
          </label>
          <input
            id="contact-subject"
            className="contact-input"
            type="text"
            name="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            maxLength={300}
            disabled={loading}
            autoComplete="off"
          />

          <label className="contact-label" htmlFor="contact-message">
            Message <span className="contact-required">*</span>
          </label>
          <textarea
            id="contact-message"
            className="contact-input contact-textarea"
            name="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            maxLength={5000}
            rows={5}
            disabled={loading}
          />

          {feedback && (
            <p
              className={
                feedback.type === 'success'
                  ? 'contact-feedback contact-feedback-success'
                  : 'contact-feedback contact-feedback-error'
              }
              role="alert"
            >
              {feedback.text}
            </p>
          )}

          <button type="submit" className="contact-submit" disabled={loading}>
            {loading ? 'Sending…' : 'Send message'}
          </button>
        </form>
      </div>
    </main>
  )
}

export default Contact
