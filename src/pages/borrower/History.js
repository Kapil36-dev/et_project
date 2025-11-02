
import React from 'react'
import { useSession } from '../../session'
import { getUserBookings } from '../../api'
//import PaymentList from '../../PaymentList'

export default function BrHistory() {
  const { user } = useSession()
  const [bookings, setBookings] = React.useState([])

  React.useEffect(() => {
    if (!user) return
    getUserBookings(user.userId).then(setBookings).catch(() => setBookings([]))
  }, [user])

  return (
    <div style={{ padding: 16 }}>
      <h2>Borrower History</h2>

      <h3>Bookings</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {bookings.map(b => (
          <li key={b.id} style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12, marginBottom: 8 }}>
            <div><strong>Booking:</strong> {b.id}</div>
            <div><strong>Status:</strong> {b.status}</div>
            <div><strong>Item:</strong> {b.itemId}</div>
            <div><strong>Provider:</strong> {b.serviceProviderUserId}</div>
            <div><strong>Start:</strong> {b.startDate}</div>
            <div><strong>End:</strong> {b.endDate}</div>
          </li>
        ))}
      </ul>

      {/* Payments list for this borrower */}
    
    </div>
  )
}
