import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './upcoming-events.css'

const UpcomingEventsSection = () => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true)
        setError(null)
        const apiUrl = import.meta.env.VITE_API_URL || ''
        const response = await fetch(`${apiUrl}/api/events?limit=3`)
        
        if (!response.ok) {
          throw new Error('Failed to load events')
        }
        
        const data = await response.json()
        setEvents(data.events || [])
      } catch (err) {
        console.error('Error fetching events:', err)
        setError('Unable to load events at this time.')
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  }

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
            {events.map((event) => (
              <li key={event.id} className="upcoming-events-item">
                <div className="upcoming-events-date">
                  <span className="upcoming-events-date-text">
                    {formatDate(event.start)}
                  </span>
                  {event.start && (
                    <span className="upcoming-events-time">
                      {formatTime(event.start)}
                    </span>
                  )}
                </div>
                <div className="upcoming-events-details">
                  <h3 className="upcoming-events-item-title">{event.title}</h3>
                  {event.location && (
                    <p className="upcoming-events-location">
                      📍 {event.location}
                    </p>
                  )}
                  {event.description && (
                    <p className="upcoming-events-description">
                      {event.description.length > 150
                        ? `${event.description.substring(0, 150)}...`
                        : event.description}
                    </p>
                  )}
                </div>
              </li>
            ))}
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
