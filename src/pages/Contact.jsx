import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import './Contact.css'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const Contact = () => {
  const { t } = useTranslation()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState(null)

  const validate = () => {
    if (!name.trim()) return t('contact.validateName')
    if (!email.trim()) return t('contact.validateEmail')
    if (!EMAIL_REGEX.test(email.trim())) return t('contact.validateEmailValid')
    if (!message.trim()) return t('contact.validateMessage')
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
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
    const contactUrl = supabaseUrl && supabaseAnonKey
      ? `${supabaseUrl}/functions/v1/contact`
      : (import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/contact` : null)
    if (!contactUrl) {
      setFeedback({ type: 'error', text: t('contact.errorNotConfigured') })
      setLoading(false)
      return
    }
    try {
      const headers = { 'Content-Type': 'application/json' }
      if (supabaseAnonKey) headers['Authorization'] = `Bearer ${supabaseAnonKey}`
      const res = await fetch(contactUrl, {
        method: 'POST',
        headers,
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
          text: data.error || t('contact.errorGeneric'),
        })
        return
      }
      setFeedback({ type: 'success', text: data.message || t('contact.success') })
      setName('')
      setEmail('')
      setSubject('')
      setMessage('')
    } catch {
      setFeedback({
        type: 'error',
        text: t('contact.errorConnection'),
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="page contact-page">
      <div className="contact-page-inner">
        <h1 className="contact-page-title">{t('contact.title')}</h1>
        <p className="contact-page-intro">{t('contact.intro')}</p>

        <form className="contact-form" onSubmit={handleSubmit} noValidate>
          <label className="contact-label" htmlFor="contact-name">
            {t('contact.name')} <span className="contact-required">{t('contact.required')}</span>
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
            {t('contact.email')} <span className="contact-required">{t('contact.required')}</span>
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
            {t('contact.subject')}
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
            {t('contact.message')} <span className="contact-required">{t('contact.required')}</span>
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
            {loading ? t('contact.sending') : t('contact.submit')}
          </button>
        </form>
      </div>
    </main>
  )
}

export default Contact
