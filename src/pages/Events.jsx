import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import enUS from 'date-fns/locale/en-US'
import { useEvents } from '../hooks/useEvents'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import './Events.css'

const locales = { 'en-US': enUS }
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

const Events = () => {
  const navigate = useNavigate()
  const { events, loading, error } = useEvents()
  const [date, setDate] = useState(() => new Date())

  const handleNavigate = (newDate) => {
    setDate(newDate)
  }

  const handleSelectEvent = (event) => {
    navigate(`/events/${encodeURIComponent(event.id)}`, { state: { event } })
  }

  return (
    <main className="page events-page">
      <div className="events-page-inner">
        <h1 className="events-page-title">Events</h1>

        {loading && (
          <div className="events-page-loading">
            <p>Loading events...</p>
          </div>
        )}

        {error && (
          <div className="events-page-error">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="events-calendar-wrapper">
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              titleAccessor="title"
              tooltipAccessor={(event) => {
                const parts = [event.title]
                if (event.description) parts.push(event.description)
                if (event.location) parts.push(`Location: ${event.location}`)
                return parts.join('\n\n')
              }}
              date={date}
              onNavigate={handleNavigate}
              defaultView="month"
              views={['month']}
              onSelectEvent={handleSelectEvent}
              className="events-calendar"
              style={{ height: '100%' }}
            />
          </div>
        )}
      </div>
    </main>
  )
}

export default Events
