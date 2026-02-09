import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import LocaleLink from '../LocaleLink'
import { useLocale } from '../../hooks/useLocale'
import './upcoming-events.css'

function getDateLocale(locale) {
  if (locale === 'ar') return 'ar'
  if (locale === 'fr') return 'fr-CA'
  return 'en-US'
}

function formatEventDate(start, end, locale) {
  const s = new Date(start)
  const e = new Date(end)
  const dateLocale = getDateLocale(locale)
  const date = s.toLocaleDateString(dateLocale, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
  const time = `${s.toLocaleTimeString(dateLocale, { hour: 'numeric', minute: '2-digit' })} – ${e.toLocaleTimeString(dateLocale, { hour: 'numeric', minute: '2-digit' })}`
  return `${date} • ${time}`
}

const UpcomingEventsSection = () => {
  const { t } = useTranslation()
  const { locale } = useLocale()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const url = import.meta.env.VITE_EVENTS_API
    setError(null)
  
    if (!url) {
      setEvents([])
      setLoading(false)
      return
    }
  
    fetch(url)
      .then(async (r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then((data) => {
        const items = Array.isArray(data?.events)
          ? data.events
          : Array.isArray(data?.items)
            ? data.items
            : []
  
        const upcomingTwo = items
          .filter((e) => e && e.id && e.title && e.start)
          .sort((a, b) => new Date(a.start) - new Date(b.start))
          .slice(0, 2)
  
        setEvents(upcomingTwo)
      })
      .catch((e) => {
        console.error('Failed to load events:', e)
        setError(t('events.loadError'))
        setEvents([])
      })
      .finally(() => setLoading(false))
  }, [t])

  return (
    <section className="upcoming-events-section">
      <h2 className="upcoming-events-title">{t('events.upcoming')}</h2>

      {loading && (
        <div className="upcoming-events-loading">
          <p>{t('events.loading')}</p>
        </div>
      )}

      {error && (
        <div className="upcoming-events-error">
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && events.length === 0 && (
        <div className="upcoming-events-empty">
          <p>{t('events.empty')}</p>
        </div>
      )}

      {!loading && !error && events.length > 0 && (
        <>
          <ul className="upcoming-events-list">
            {events.map((ev) => {
              const content = (
                <>
                  <div className="upcoming-events-date">
                    <span className="upcoming-events-date-text">
                      {ev.start && ev.end
                        ? formatEventDate(ev.start, ev.end, locale)
                        : ev.start
                          ? new Date(ev.start).toLocaleDateString(getDateLocale(locale), {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                            })
                          : ''}
                    </span>
                  </div>
                  <div className="upcoming-events-details">
                    <h3 className="upcoming-events-item-title">{ev.title}</h3>
                    {ev.location && (
                      <p className="upcoming-events-location">
                         {ev.location}
                      </p>
                    )}
                    
                  </div>
                </>
              )
              return (
                <li key={ev.id} className="upcoming-events-item">
                  {ev.id ? (
                    <LocaleLink
                      to={`/events/${encodeURIComponent(ev.id)}`}
                      state={{ event: ev }}
                      className="upcoming-events-item-link"
                    >
                      {content}
                    </LocaleLink>
                  ) : (
                    content
                  )}
                </li>
              )
            })}
          </ul>
          <div className="upcoming-events-footer">
            <LocaleLink to="/events" className="upcoming-events-button">
              {t('events.viewAll')}
            </LocaleLink>
          </div>
        </>
      )}
    </section>
  )
}

export default UpcomingEventsSection
