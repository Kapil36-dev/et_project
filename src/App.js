import React, { useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import BrItemsList from './pages/borrower/ItemList'
import BrHistory from './pages/borrower/History'
import BrReturns from './pages/borrower/Returns'
import SpItemsList from './pages/sp/ItemsList'
import SpResourceDetail from './pages/sp/ResourceDetail'
import SpHistory from './pages/sp/History'
import Home from './pages/Home'
import { useSession } from './session'

function destinationForRole(role) {
  if (role === 'SERVICE_PROVIDER') return '/sp/items'
  if (role === 'BORROWER') return '/borrower/items'
  return '/login'
}

function ProtectedRoute({ children, role }) {
  const { user, activeRole } = useSession()

  if (!user) return <Navigate to="/login" replace />
  if (role && activeRole !== role) {
    return <Navigate to={destinationForRole(activeRole)} replace />
  }

  return children
}

function Login() {
  const { login, setActiveRole, user, activeRole } = useSession()
  const [userId, setUserId] = React.useState('')
  const [userName, setUserName] = React.useState('')
  const [role, setRole] = React.useState('BORROWER')

  if (user) {
    return <Navigate to={destinationForRole(activeRole)} replace />
  }

  const onSubmit = (e) => {
    e.preventDefault()
    const u = {
      userId: userId || 'demo-user',
      userName: userName || 'Demo',
      email: 'demo@example.com',
      userRole: role
    }
    login(u)
    localStorage.setItem('authToken', 'fake-token') // ✅ store token
    setActiveRole(role === 'SERVICE_PROVIDER' ? 'SERVICE_PROVIDER' : 'BORROWER')
  }

  return (
    <form onSubmit={onSubmit} style={{ padding: 16, display: 'grid', gap: 8 }}>
      <h2>Login (Mock)</h2>
      <input
        placeholder="User ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />
      <input
        placeholder="User Name"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
      />
      <label>
        Role:
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="BORROWER">Borrower</option>
          <option value="SERVICE_PROVIDER">Service Provider</option>
        </select>
      </label>
      <button type="submit">Continue</button>
    </form>
  )
}

function Register() {
  const { user, activeRole } = useSession()
  const [result, setResult] = React.useState('')
  const [userName, setUserName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [role, setRole] = React.useState('BORROWER')

  if (user) {
    return <Navigate to={destinationForRole(activeRole)} replace />
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(
        (process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080') +
          '/api/users/register',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userName, email, password, userRole: role })
        }
      )
      if (!res.ok) throw new Error('Failed')
      const data = await res.json()
      setResult('Registered: ' + data.userId)
    } catch {
      setResult('Failed to register')
    }
  }

  return (
    <form onSubmit={onSubmit} style={{ padding: 16, display: 'grid', gap: 8 }}>
      <h2>Register</h2>
      <input
        placeholder="User Name"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
      />
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <label>
        Role:
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="BORROWER">Borrower</option>
          <option value="SERVICE_PROVIDER">Service Provider</option>
          <option value="BOTH">Both</option>
        </select>
      </label>
      <button type="submit">Register</button>
      <div>{result}</div>
    </form>
  )
}

export default function App() {
  const { login, setActiveRole } = useSession()
  const navigate = useNavigate()

  // ✅ Check for token in localStorage and restore session automatically
  useEffect(() => {
    const token = localStorage.getItem('authToken')
    const savedUser = localStorage.getItem('user')

    if (token && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser)
        login(parsedUser)
        const normalizedRole =
          parsedUser.userRole === 'SERVICE_PROVIDER' ? 'SERVICE_PROVIDER' : 'BORROWER'
        setActiveRole(normalizedRole)
        navigate(destinationForRole(normalizedRole))
      } catch (err) {
        console.warn('Invalid stored user data, clearing session')
        localStorage.removeItem('authToken')
        localStorage.removeItem('user')
      }
    }
  }, [login, setActiveRole, navigate])

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Service Provider area */}
        <Route
          path="/sp/items"
          element={
            <ProtectedRoute role="SERVICE_PROVIDER">
              <SpItemsList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sp/items/:id"
          element={
            <ProtectedRoute role="SERVICE_PROVIDER">
              <SpResourceDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sp/history"
          element={
            <ProtectedRoute role="SERVICE_PROVIDER">
              <SpHistory />
            </ProtectedRoute>
          }
        />

        {/* Borrower area */}
        <Route
          path="/borrower/items"
          element={
            <ProtectedRoute role="BORROWER">
              <BrItemsList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/borrower/history"
          element={
            <ProtectedRoute role="BORROWER">
              <BrHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/borrower/returns"
          element={
            <ProtectedRoute role="BORROWER">
              <BrReturns />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
