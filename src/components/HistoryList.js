import React, { useEffect, useMemo, useState } from 'react'

// If you already have API helpers, we'll try to use them.
// Otherwise we fall back to inline fetch helpers below.
let getUserBookings, getPaymentsByBorrower
try {
  const bookingsApi = require('./api/bookings')
  const paymentsApi = require('./api/payments')
  getUserBookings = bookingsApi.getUserBookings
  getPaymentsByBorrower = paymentsApi.getPaymentsByBorrower
} catch (e) {
  // Fallback to inline fetch
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

/**
 * HistoryList
 * Props:
 * - userId: string (required)
 * - show: 'all' | 'bookings' | 'payments' (default: 'all')
 * - className?: string
 */
export default function HistoryList({ userId, show = 'all', className }) {
  const [bookings, setBookings] = useState([])
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('') // simple text filter by id/status

  const useBookings = show === 'all' || show === 'bookings'
  const usePayments = show === 'all' || show === 'payments'

  const load = async () => {
    if (!userId) return
    setLoading(true)
    setError('')
    try {
      if (useBookings) {
        if (getUserBookings) {
          const b = await getUserBookings(userId)
          setBookings(Array.isArray(b) ? b : [])
        } else {
          const b = await apiGet(`/api/bookings/user/${encodeURIComponent(userId)}`)
          setBookings(Array.isArray(b) ? b : [])
        }
      } else {
        setBookings([])
      }

      if (usePayments) {
        if (getPaymentsByBorrower) {
          const p = await getPaymentsByBorrower(userId)
          setPayments(Array.isArray(p) ? p : [])
        } else {
          const p = await apiGet(`/api/payments/user/${encodeURIComponent(userId)}`)
          setPayments(Array.isArray(p) ? p : [])
        }
      } else {
        setPayments([])
      }
    } catch (e) {
      console.error(e)
      setError('Failed to load history.')
      if (useBookings) setBookings([])
      if (usePayments) setPayments([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, show])

  const filteredBookings = useMemo(() => {
    if (!filter) return bookings
    const f = filter.toLowerCase()
    return bookings.filter(b =>
      (b.id || '').toLowerCase().includes(f) ||
      (b.status || '').toLowerCase().includes(f) ||
      (b.itemId || '').toLowerCase().includes(f) ||
      (b.borrowerId || '').toLowerCase().includes(f) ||
      (b.serviceProviderUserId || '').toLowerCase().includes(f)
    )
  }, [bookings, filter])

  const filteredPayments = useMemo(() => {
    if (!filter) return payments
    const f = filter.toLowerCase()
    return payments.filter(p =>
      (p.id || '').toLowerCase().includes(f) ||
      (p.status || '').toLowerCase().includes(f) ||
      (p.bookingId || '').toLowerCase().includes(f) ||
      String(p.amount || '').toLowerCase().includes(f) ||
      (p.paymentMethod || '').toLowerCase().includes(f)
    )
  }, [payments, filter])

  return (
    <div className={className} style={{ padding: 16 }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
        <h2 style={{ margin: 0 }}>History</h2>
        <input
          placeholder="Filter by id, status, item, amount..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ flex: 1, padding: '8px 10px', borderRadius: 6, border: '1px solid #e5e7eb' }}
        />
        <button onClick={load} disabled={loading}>
          {loading ? 'Refreshing…' : 'Refresh'}
        </button>
      </div>

      {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}

      {useBookings && (
        <>
          <h3>Bookings</h3>
          {filteredBookings.length === 0 ? (
            <div style={{ marginBottom: 12 }}>No bookings found.</div>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {filteredBookings.map(b => (
                <li key={b.id} style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12, marginBottom: 8, display: 'grid', gap: 4 }}>
                  <div><strong>Booking:</strong> {b.id}</div>
                  <div><strong>Status:</strong> {b.status}</div>
                  <div><strong>Item:</strong> {b.itemId}</div>
                  <div><strong>Borrower:</strong> {b.borrowerId}</div>
                  <div><strong>Provider:</strong> {b.serviceProviderUserId}</div>
                  <div><strong>Start:</strong> {b.startDate}</div>
                  <div><strong>End:</strong> {b.endDate}</div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {usePayments && (
        <>
          <h3>Payments</h3>
          {filteredPayments.length === 0 ? (
            <div>No payments found.</div>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {filteredPayments.map(p => (
                <li key={p.id} style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12, marginBottom: 8, display: 'grid', gap: 4 }}>
                  <div><strong>Payment:</strong> {p.id}</div>
                  <div><strong>Booking:</strong> {p.bookingId}</div>
                  <div><strong>Status:</strong> {p.status}</div>
                  <div><strong>Amount:</strong> {p.amount}</div>
                  <div><strong>Method:</strong> {p.paymentMethod}</div>
                  <div><strong>Transaction:</strong> {p.transactionId}</div>
                  <div><strong>Date:</strong> {p.creationDate}</div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  )
}
