import React, { useEffect, useMemo, useState } from 'react'

// Toggle this to true if you don't have the api helpers set up yet.
const USE_INLINE_FETCH = false

let getUserBookings, approveBooking, rejectBooking, confirmReturn

if (!USE_INLINE_FETCH) {
  try {
    const api = require('./api/bookings')
    getUserBookings = api.getUserBookings
    approveBooking = api.approveBooking
    rejectBooking = api.rejectBooking
    confirmReturn = api.confirmReturn
  } catch (e) {
    console.warn('api/bookings not found. Falling back to inline fetch. Set USE_INLINE_FETCH=true if needed.')
    getUserBookings = undefined
  }
}

const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080'

async function apiGet(url) {
  const res = await fetch(API_BASE + url, {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  })
  if (!res.ok) throw new Error(`GET ${url} failed: ${res.status}`)
  return res.json()
}
async function apiPut(url) {
  const res = await fetch(API_BASE + url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  })
  if (!res.ok) throw new Error(`PUT ${url} failed: ${res.status}`)
  return res.json()
}

if (USE_INLINE_FETCH || !getUserBookings) {
  getUserBookings = async (userId) => apiGet(`/api/bookings/user/${encodeURIComponent(userId)}`)
  approveBooking = async (bookingId) => apiPut(`/api/bookings/${encodeURIComponent(bookingId)}/approve`)
  rejectBooking = async (bookingId) => apiPut(`/api/bookings/${encodeURIComponent(bookingId)}/reject`)
  confirmReturn = async (bookingId) => apiPut(`/api/bookings/${encodeURIComponent(bookingId)}/return`)
}

// Booking statuses per your backend
const BookingStatus = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
  CONFIRMED: 'CONFIRMED',
  COMPLETED: 'COMPLETED',
}

/**
 * BookingList
 * Props:
 * - userId: string (required) -> current user's id
 * - role: 'SERVICE_PROVIDER' | 'BORROWER' (required) -> acting role to render proper actions
 * - className?: string
 */
export default function BookingList({ userId, role, className }) {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState(null)

  const load = async () => {
    if (!userId) return
    setLoading(true)
    setError('')
    try {
      const data = await getUserBookings(userId)
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
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  const canApproveReject = useMemo(
    () => role === 'SERVICE_PROVIDER',
    [role]
  )

  const canConfirmReturn = useMemo(
    () => role === 'SERVICE_PROVIDER',
    [role]
  )

  const onApprove = async (b) => {
    setBusyId(b.id)
    setError('')
    try {
      await approveBooking(b.id)
      await load()
    } catch (e) {
      console.error(e)
      setError('Failed to approve booking.')
    } finally {
      setBusyId(null)
    }
  }

  const onReject = async (b) => {
    setBusyId(b.id)
    setError('')
    try {
      await rejectBooking(b.id)
      await load()
    } catch (e) {
      console.error(e)
      setError('Failed to reject booking.')
    } finally {
      setBusyId(null)
    }
  }

  const onConfirmReturn = async (b) => {
    setBusyId(b.id)
    setError('')
    try {
      await confirmReturn(b.id)
      await load()
    } catch (e) {
      console.error(e)
      setError('Failed to confirm return.')
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className={className} style={{ padding: 16 }}>
      <h2>Bookings</h2>
      {loading && <div>Loading…</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}

      {!loading && bookings.length === 0 && <div>No bookings found.</div>}

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {bookings.map((b) => (
          <li
            key={b.id}
            style={{
              border: '1px solid #ddd',
              borderRadius: 8,
              padding: 12,
              marginBottom: 8,
              display: 'grid',
              gap: 6,
            }}
          >
            <div><strong>Booking:</strong> {b.id}</div>
            <div><strong>Status:</strong> {b.status}</div>
            <div><strong>Item:</strong> {b.itemId}</div>
            <div><strong>Borrower:</strong> {b.borrowerId}</div>
            <div><strong>Provider:</strong> {b.serviceProviderUserId}</div>
            <div><strong>Start:</strong> {b.startDate}</div>
            <div><strong>End:</strong> {b.endDate}</div>

            {role === 'SERVICE_PROVIDER' && (
              <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                {b.status === BookingStatus.PENDING && (
                  <>
                    <button
                      onClick={() => onApprove(b)}
                      disabled={busyId === b.id}
                    >
                      {busyId === b.id ? 'Approving…' : 'Approve'}
                    </button>
                    <button
                      onClick={() => onReject(b)}
                      disabled={busyId === b.id}
                    >
                      {busyId === b.id ? 'Rejecting…' : 'Reject'}
                    </button>
                  </>
                )}

                {(b.status === BookingStatus.ACCEPTED ||
                  b.status === BookingStatus.CONFIRMED) && (
                  <button
                    onClick={() => onConfirmReturn(b)}
                    disabled={busyId === b.id}
                  >
                    {busyId === b.id ? 'Confirming…' : 'Confirm Return'}
                  </button>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
