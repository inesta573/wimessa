import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './upcoming-events.css'

function formatEventDate(start, end) {
  const s = new Date(start)
  const e = new Date(end)
  const date = s.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
  const time = `${s.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })} – ${e.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}`
  return `${date} • ${time}`
}

const UpcomingEventsSection = () => {
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
        setError('Unable to load events at this time.')
        setEvents([])
      })
      .finally(() => setLoading(false))
  }, [])
  

  return (
    <section className="upcoming-events-section">
      <h2 className="upcoming-events-title">Upcoming Events</h2>

      {loading && (
        <div className="upcoming-events-loading">
          <p>Loading events...</p>
        </div>
      )}

      {error && (
        <div className="upcoming-events-error">
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && events.length === 0 && (
        <div className="upcoming-events-empty">
          <p>No upcoming events scheduled.</p>
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
                        ? formatEventDate(ev.start, ev.end)
                        : ev.start
                          ? new Date(ev.start).toLocaleDateString(undefined, {
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
                    <Link
                      to={`/events/${encodeURIComponent(ev.id)}`}
                      state={{ event: ev }}
                      className="upcoming-events-item-link"
                    >
                      {content}
                    </Link>
                  ) : (
                    content
                  )}
                </li>
              )
            })}
          </ul>
          <div className="upcoming-events-footer">
            <Link to="/events" className="upcoming-events-button">
              View all events
            </Link>
          </div>
        </>
      )}
    </section>
  )
}

export default UpcomingEventsSection
