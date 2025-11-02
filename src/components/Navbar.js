import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useSession } from '../session'

function RoleSwitcher() {
  const { activeRole, setActiveRole } = useSession()
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <span>Act as:</span>
      <select value={activeRole} onChange={(e) => setActiveRole(e.target.value)}>
        <option value="SERVICE_PROVIDER">Service Provider</option>
        <option value="BORROWER">Borrower</option>
      </select>
    </div>
  )
}

export default function Navbar() {
  const { user, activeRole, logout } = useSession()
  const loc = useLocation()

  return (
    <nav style={{ display: 'flex', gap: 16, padding: 12, borderBottom: '1px solid #eee', background: '#fff' }}>
      <Link to={user ? (activeRole === 'SERVICE_PROVIDER' ? '/sp/items' : '/borrower/items') : '/'}>
        Home
      </Link>

      {user && (
        <>
          <RoleSwitcher />
          {activeRole === 'SERVICE_PROVIDER' && (
            <>
              <Link to="/sp/items" className={loc.pathname.startsWith('/sp/items') ? 'active' : ''}>Items</Link>
              <Link to="/sp/history" className={loc.pathname === '/sp/history' ? 'active' : ''}>History</Link>
            </>
          )}
          {activeRole === 'BORROWER' && (
            <>
              <Link to="/borrower/items" className={loc.pathname.startsWith('/borrower/items') ? 'active' : ''}>Items</Link>
              <Link to="/borrower/history" className={loc.pathname === '/borrower/history' ? 'active' : ''}>History</Link>
              <Link to="/borrower/returns" className={loc.pathname === '/borrower/returns' ? 'active' : ''}>Returns</Link>
            </>
          )}
          <button onClick={logout} style={{ marginLeft: 'auto' }}>Logout</button>
        </>
      )}

      {!user && (
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 12 }}>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>
      )}
    </nav>
  )
}
