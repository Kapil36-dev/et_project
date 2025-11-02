
import React from 'react'
import { useSession } from '../../session'
//import { getUserBookings, approveBooking, rejectBooking, confirmReturn } from '../../api/bookings'

const BookingStatus = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
  CONFIRMED: 'CONFIRMED',
  COMPLETED: 'COMPLETED',
}

export default function SpHistory() {
  const { user } = useSession()
  const [bookings, setBookings] = React.useState([])
  const [busyId, setBusyId] = React.useState(null)
  const [error, setError] = React.useState('')

  const load = async () => {
    if (!user) return
    try {
      const data = null;
      setBookings(Array.isArray(data) ? data : [])
    } catch (e) {
      console.error(e)
      setBookings([])
    }
  }

  React.useEffect(() => {
    load()
  }, [user]) // eslint-disable-line react-hooks/exhaustive-deps

  const onApprove = async (b) => {
    setBusyId(b.id); setError('')
    try {
      //await approveBooking(b.id)
      await load()
    } catch {
      setError('Failed to approve booking.')
    } finally {
      setBusyId(null)
    }
  }
  const onReject = async (b) => {
    setBusyId(b.id); setError('')
    try {
      //await rejectBooking(b.id)
      await load()
    } catch {
      setError('Failed to reject booking.')
    } finally {
      setBusyId(null)
    }
  }
  const onConfirmReturn = async (b) => {
    setBusyId(b.id); setError('')
    try {
      //await confirmReturn(b.id)
      await load()
    } catch {
      setError('Failed to confirm return.')
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div style={{ padding: 16 }}>
      <h2>Service Provider History</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {bookings.map(b => (
          <li key={b.id} style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12, marginBottom: 8 }}>
            <div><strong>Booking:</strong> {b.id}</div>
            <div><strong>Status:</strong> {b.status}</div>
            <div><strong>Item:</strong> {b.itemId}</div>
            <div><strong>Borrower:</strong> {b.borrowerId}</div>
            <div><strong>Start:</strong> {b.startDate}</div>
            <div><strong>End:</strong> {b.endDate}</div>

            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              {b.status === BookingStatus.PENDING && (
                <>
                  <button onClick={() => onApprove(b)} disabled={busyId === b.id}>
                    {busyId === b.id ? 'Approving…' : 'Approve'}
                  </button>
                  <button onClick={() => onReject(b)} disabled={busyId === b.id}>
                    {busyId === b.id ? 'Rejecting…' : 'Reject'}
                  </button>
                </>
              )}
              {(b.status === BookingStatus.ACCEPTED || b.status === BookingStatus.CONFIRMED) && (
                <button onClick={() => onConfirmReturn(b)} disabled={busyId === b.id}>
                  {busyId === b.id ? 'Confirming…' : 'Confirm Return'}
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
