
import React from 'react'
import { useSession } from '../../session'
//import { getUserBookings } from '../../api/bookings'
//import { initiateReturn } from '../../api/returns'

const BookingStatus = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
  CONFIRMED: 'CONFIRMED',
  COMPLETED: 'COMPLETED',
}

export default function BrReturns() {
  const { user } = useSession()
  const [bookings, setBookings] = React.useState([])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState('')
  const [submittingId, setSubmittingId] = React.useState(null)

  const load = async () => {
    if (!user) return
    setLoading(true)
    setError('')
    try {
      const data = null;
      setBookings(Array.isArray(data) ? data : [])
    } catch (e) {
      console.error(e)
      setError('Failed to load bookings.')
      setBookings([])
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const eligible = bookings.filter(
    (b) => b.status === BookingStatus.ACCEPTED || b.status === BookingStatus.CONFIRMED
  )

  const onInitiateReturn = async (b) => {
    if (!user) return
    setSubmittingId(b.id)
    setError('')
    try {
      
      alert('Return initiated. Waiting for service provider to complete.')
      await load()
    } catch (e) {
      console.error(e)
      setError('Failed to initiate return.')
    } finally {
      setSubmittingId(null)
    }
  }

  return (
    <div style={{ padding: 16 }}>
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
