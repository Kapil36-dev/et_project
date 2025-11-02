import React, { useEffect, useState } from 'react'

// TODO: Replace these with your actual API utilities/imports.
const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080'

async function apiGet(url) {
  const res = await fetch(API_BASE + url, {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  })
  if (!res.ok) throw new Error(`GET ${url} failed: ${res.status}`)
  return res.json()
}

async function apiPost(url, body) {
  const res = await fetch(API_BASE + url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`POST ${url} failed: ${res.status}`)
  return res.json()
}

// BookingStatus assumptions; update to match your backend enum strings if different.
const BookingStatus = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
  CONFIRMED: 'CONFIRMED',
  COMPLETED: 'COMPLETED',
}

/**
 * Props:
 * - userId: string (current logged-in user's ID; borrower)
 * - className?: string
 */
export default function ReturnList({ userId, className }) {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [submittingId, setSubmittingId] = useState(null)

  const loadBookings = async () => {
    if (!userId) return
    setLoading(true)
    setError('')
    try {
      const data = await apiGet(`/api/bookings/user/${encodeURIComponent(userId)}`)
      setBookings(Array.isArray(data) ? data : [])
    } catch (e) {
      console.error(e)
      setError('Failed to load bookings.')
      setBookings([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBookings()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  const eligible = bookings.filter(
    (b) => b.status === BookingStatus.ACCEPTED || b.status === BookingStatus.CONFIRMED
  )

  const onInitiateReturn = async (booking) => {
    if (!userId) return
    setSubmittingId(booking.id)
    setError('')
    try {
      await apiPost('/api/returns/initiate', {
        bookingId: booking.id,
        returnerId: userId,
      })
      // Feedback and refresh list
      alert('Return initiated. Waiting for service provider to complete.')
      await loadBookings()
    } catch (e) {
      console.error(e)
      setError('Failed to initiate return.')
    } finally {
      setSubmittingId(null)
    }
  }

  return (
    <div className={className} style={{ padding: 16 }}>
      <h2>Initiate Return</h2>

      {loading && <div>Loading bookings…</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}

      {!loading && eligible.length === 0 && (
        <div>No active bookings eligible for return.</div>
      )}

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {eligible.map((b) => (
          <li
            key={b.id}
            style={{
              border: '1px solid #ddd',
              borderRadius: 8,
              padding: 12,
              marginBottom: 8,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <div style={{ flex: 1 }}>
              <div><strong>Booking:</strong> {b.id}</div>
              <div><strong>Status:</strong> {b.status}</div>
              <div><strong>Item:</strong> {b.itemId}</div>
              <div><strong>Provider:</strong> {b.serviceProviderUserId}</div>
              <div><strong>Start:</strong> {b.startDate}</div>
              <div><strong>End:</strong> {b.endDate}</div>
            </div>
            <button
              onClick={() => onInitiateReturn(b)}
              disabled={submittingId === b.id}
            >
              {submittingId === b.id ? 'Submitting…' : 'Initiate Return'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
\


