import React from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useSession } from '../session'

export default function Home() {
  const { user, activeRole } = useSession()

  if (user) {
    return <Navigate to={activeRole === 'SERVICE_PROVIDER' ? '/sp/items' : '/borrower/items'} />
  }

  return (
    <div style={{ padding: 16 }}>
      <h2>Welcome to Resource Sharing Platform</h2>
      <p>Rent or share any resource. Act as a Service Provider or Borrower.</p>
      <div style={{ display: 'flex', gap: 12 }}>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
      </div>
    </div>
  )
}
