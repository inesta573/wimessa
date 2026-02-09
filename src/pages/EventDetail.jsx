import { useParams, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LocaleLink from '../components/LocaleLink'
import { useEvents } from '../hooks/useEvents'
import { useLocale } from '../hooks/useLocale'
import './EventDetail.css'

function formatEventDateTime(start, end, locale) {
  const s = new Date(start)
  const e = end ? new Date(end) : null
  const localeStr = locale === 'ar' ? 'ar' : locale === 'fr' ? 'fr-CA' : 'en-US'
  const dateStr = s.toLocaleDateString(localeStr, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const timeStr = e
    ? `${s.toLocaleTimeString(localeStr, { hour: 'numeric', minute: '2-digit' })} – ${e.toLocaleTimeString(localeStr, { hour: 'numeric', minute: '2-digit' })}`
    : s.toLocaleTimeString(localeStr, { hour: 'numeric', minute: '2-digit' })
  return { dateStr, timeStr }
}

const EventDetail = () => {
  const { id } = useParams()
  const location = useLocation()
  const { t } = useTranslation()
  const { locale } = useLocale()
  const eventFromState = location.state?.event
  const { events, loading, error } = useEvents()

  const decodedId = id != null ? decodeURIComponent(id) : null
  const event = eventFromState ?? (decodedId && !loading ? events.find((e) => e.id === decodedId) : null)

  if (loading && !eventFromState) {
    return (
      <main className="page event-detail-page">
        <div className="event-detail-inner">
          <p className="event-detail-loading">{t('events.loadingEvent')}</p>
        </div>
      </main>
    )
  }

  if (error && !eventFromState) {
    return (
      <main className="page event-detail-page">
        <div className="event-detail-inner">
          <p className="event-detail-error">{error}</p>
          <LocaleLink to="/events" className="event-detail-back">{t('events.backToEvents')}</LocaleLink>
        </div>
      </main>
    )
  }

  if (!event) {
    return (
      <main className="page event-detail-page">
        <div className="event-detail-inner">
          <p className="event-detail-not-found">{t('events.notFound')}</p>
          <LocaleLink to="/events" className="event-detail-back">{t('events.backToEvents')}</LocaleLink>
        </div>
      </main>
    )
  }

  const { dateStr, timeStr } = formatEventDateTime(event.start, event.end, locale)

  return (
    <main className="page event-detail-page">
      <div className="event-detail-inner">
        <LocaleLink to="/events" className="event-detail-back">{t('events.backToEvents')}</LocaleLink>
        <article className="event-detail-card">
          <h1 className="event-detail-title">{event.title}</h1>
          <dl className="event-detail-meta">
            <dt>{t('events.date')}</dt>
            <dd>{dateStr}</dd>
            <dt>{t('events.time')}</dt>
            <dd>{timeStr}</dd>
            {event.location && (
              <>
                <dt>{t('events.location')}</dt>
                <dd>{event.location}</dd>
              </>
            )}
          </dl>
          {event.description && (
            <div className="event-detail-description">
              <h2>{t('events.description')}</h2>
              <p>{event.description}</p>
            </div>
          )}
        </article>
      </div>
    </main>
  )
}

export default EventDetail
