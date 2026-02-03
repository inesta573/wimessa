import { Link, useParams, useLocation } from 'react-router-dom'
import { useEvents } from '../hooks/useEvents'
import './EventDetail.css'

function formatEventDateTime(start, end) {
  const s = new Date(start)
  const e = end ? new Date(end) : null
  const dateStr = s.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const timeStr = e
    ? `${s.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })} – ${e.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}`
    : s.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
  return { dateStr, timeStr }
}

const EventDetail = () => {
  const { id } = useParams()
  const location = useLocation()
  const eventFromState = location.state?.event
  const { events, loading, error } = useEvents()

  const decodedId = id != null ? decodeURIComponent(id) : null
  const event = eventFromState ?? (decodedId && !loading ? events.find((e) => e.id === decodedId) : null)

  if (loading && !eventFromState) {
    return (
      <main className="page event-detail-page">
        <div className="event-detail-inner">
          <p className="event-detail-loading">Loading event...</p>
        </div>
      </main>
    )
  }

  if (error && !eventFromState) {
    return (
      <main className="page event-detail-page">
        <div className="event-detail-inner">
          <p className="event-detail-error">{error}</p>
          <Link to="/events" className="event-detail-back">Back to events</Link>
        </div>
      </main>
    )
  }

  if (!event) {
    return (
      <main className="page event-detail-page">
        <div className="event-detail-inner">
          <p className="event-detail-not-found">Event not found.</p>
          <Link to="/events" className="event-detail-back">Back to events</Link>
        </div>
      </main>
    )
  }

  const { dateStr, timeStr } = formatEventDateTime(event.start, event.end)

  return (
    <main className="page event-detail-page">
      <div className="event-detail-inner">
        <Link to="/events" className="event-detail-back">Back to events</Link>
        <article className="event-detail-card">
          <h1 className="event-detail-title">{event.title}</h1>
          <dl className="event-detail-meta">
            <dt>Date</dt>
            <dd>{dateStr}</dd>
            <dt>Time</dt>
            <dd>{timeStr}</dd>
            {event.location && (
              <>
                <dt>Location</dt>
                <dd>{event.location}</dd>
              </>
            )}
          </dl>
          {event.description && (
            <div className="event-detail-description">
              <h2>Description</h2>
              <p>{event.description}</p>
            </div>
          )}
        </article>
      </div>
    </main>
  )
}

export default EventDetail
