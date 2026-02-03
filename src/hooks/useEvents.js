import { useState, useEffect } from 'react'

/**
 * Fetches events from VITE_EVENTS_API and normalizes the response.
 * Supports both { items } and { events } from the API.
 * Returns events with id, title, start (Date), end (Date or null), location, description, htmlLink.
 */
export function useEvents() {
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
        const raw = Array.isArray(data?.items) ? data.items : Array.isArray(data?.events) ? data.events : []
        const normalized = raw
          .filter((e) => e && e.id != null && e.title != null && e.start != null)
          .map((e) => {
            const start = e.start instanceof Date ? e.start : new Date(e.start)
            const end = e.end != null ? (e.end instanceof Date ? e.end : new Date(e.end)) : new Date(start.getTime() + 60 * 60 * 1000)
            const description = e.description ?? e.desc
            return {
              id: e.id,
              title: String(e.title).trim(),
              start,
              end,
              location: e.location != null ? String(e.location).trim() : null,
              description: description != null ? String(description).trim() : null,
              htmlLink: e.htmlLink ?? e.url ?? null,
            }
          })
          .sort((a, b) => a.start - b.start)
        setEvents(normalized)
      })
      .catch((err) => {
        console.error('Failed to load events:', err)
        setError('Unable to load events at this time.')
        setEvents([])
      })
      .finally(() => setLoading(false))
  }, [])

  return { events, loading, error }
}
