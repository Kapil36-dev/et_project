import React, { useEffect, useMemo, useState } from 'react'

// Simple fetch helpers. Replace with your axios/http client if you have one.
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

/**
 * PaymentList
 * Props:
 * - borrowerId: string (required) -> current logged-in borrower userId
 * - defaultPaymentMethod?: string (optional; defaults to 'CARD')
 * - className?: string
 */
export default function PaymentList({ borrowerId, defaultPaymentMethod = 'CARD', className }) {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Form state for simulating a payment
  const [bookingId, setBookingId] = useState('')
  const [amount, setAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState(defaultPaymentMethod)
  const [simulationStatus, setSimulationStatus] = useState('SUCCESS') // 'SUCCESS' or 'FAIL'
  const [submitting, setSubmitting] = useState(false)

  const canSubmit = useMemo(() => {
    return borrowerId && bookingId && amount && !submitting
  }, [borrowerId, bookingId, amount, submitting])

  const loadPayments = async () => {
    if (!borrowerId) return
    setLoading(true)
    setError('')
    try {
      const data = await apiGet(`/api/payments/user/${encodeURIComponent(borrowerId)}`)
      setPayments(Array.isArray(data) ? data : [])
    } catch (e) {
      console.error(e)
      setError('Failed to load payments.')
      setPayments([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPayments()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [borrowerId])

  const onSimulatePayment = async (e) => {
    e.preventDefault()
    if (!canSubmit) return
    setSubmitting(true)
    setError('')
    try {
      const payload = {
        bookingId,
        borrowerId,
        amount: Number(amount),
        paymentMethod,
        simulationStatus, // 'SUCCESS' sets status=COMPLETED, else FAILED
      }
      await apiPost('/api/payments/process', payload)
      alert('Payment processed. Status depends on simulationStatus.')
      // refresh history
      await loadPayments()
      // reset form
      setBookingId('')
      setAmount('')
      setPaymentMethod(defaultPaymentMethod)
      setSimulationStatus('SUCCESS')
    } catch (e) {
      console.error(e)
      setError('Payment processing failed.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={className} style={{ padding: 16 }}>
      <h2>Payments</h2>

      {/* Simulate a payment */}
      <form onSubmit={onSimulatePayment} style={{ display: 'grid', gap: 8, maxWidth: 480, marginBottom: 16 }}>
        <h3>Simulate Payment</h3>
        <input
          placeholder="Booking ID"
          value={bookingId}
          onChange={(e) => setBookingId(e.target.value)}
        />
        <input
          placeholder="Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <label>
          Payment Method:
          <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
            <option value="CARD">CARD</option>
            <option value="UPI">UPI</option>
            <option value="NETBANKING">NETBANKING</option>
            <option value="WALLET">WALLET</option>
            <option value="CASH">CASH</option>
          </select>
        </label>
        <label>
          Simulation Result:
          <select value={simulationStatus} onChange={(e) => setSimulationStatus(e.target.value)}>
            <option value="SUCCESS">SUCCESS (status: COMPLETED)</option>
            <option value="FAIL">FAIL (status: FAILED)</option>
          </select>
        </label>
        <button type="submit" disabled={!canSubmit}>
          {submitting ? 'Processing…' : 'Process Payment'}
        </button>
      </form>

      {/* Existing payments list */}
      {loading && <div>Loading payments…</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}

      {!loading && payments.length === 0 && (
        <div>No payments found.</div>
      )}

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {payments.map((p) => (
          <li
            key={p.id}
            style={{
              border: '1px solid #ddd',
              borderRadius: 8,
              padding: 12,
              marginBottom: 8,
              display: 'grid',
              gap: 4,
            }}
          >
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
    </div>
  )
}
