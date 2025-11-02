import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useSession } from '../context/SessionContext' // adjust path as needed
import { API_BASE } from '../api/config' // adjust if your api base is defined elsewhere

export default function Login() {
  const { login, setActiveRole } = useSession()
  const [userId, setUserId] = React.useState('')
  const [userName, setUserName] = React.useState('')
  const [busy, setBusy] = React.useState(false)
  const [error, setError] = React.useState('')
  const navigate = useNavigate()

  // ✅ Auto-login if user data is already in localStorage
  React.useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser)
        login(parsed)
        const normalizedRole =
          parsed.userRole === 'SERVICE_PROVIDER' ? 'SERVICE_PROVIDER' : 'BORROWER'
        setActiveRole(normalizedRole)
        navigate(normalizedRole === 'SERVICE_PROVIDER' ? '/sp/items' : '/borrower/items')
      } catch {
        console.warn('Invalid user in localStorage, clearing...')
        localStorage.removeItem('user')
      }
    }
  }, []) // run once on load

  // ✅ Handle login form submit
  const onSubmit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError('')

    const trimmedId = userId.trim()
    if (!trimmedId) {
      setError('Please enter a User ID.')
      setBusy(false)
      return
    }

    try {
      const res = await fetch(`${API_BASE}/api/users/${encodeURIComponent(trimmedId)}`, {
        method: 'GET',
        headers: { Accept: 'application/json' }
      })

      const raw = await res.text()
      let data = null
      try {
        data = raw ? JSON.parse(raw) : null
      } catch {
        /* ignore non-JSON */
      }

      if (res.ok) {
        const user = data
        const normalizedUser = {
          userId: user.userId,
          userName: user.userName || user.username || '',
          userRole: user.userRole || 'BORROWER',
          email: user.email || ''
        }

        if (!normalizedUser.userId) {
          setError('Login succeeded but user data is incomplete.')
          return
        }

        // ✅ Save user to session + localStorage
        login(normalizedUser)
        if(res.token){
          localStorage.setItem('authToken',data.token);
        }

        const normalizedRole =
          normalizedUser.userRole === 'SERVICE_PROVIDER' ? 'SERVICE_PROVIDER' : 'BORROWER'
        setActiveRole(normalizedRole)

        navigate(normalizedRole === 'SERVICE_PROVIDER' ? '/sp/items' : '/borrower/items')
      } else if (res.status === 404) {
        setError('User ID not found.')
      } else {
        const msg =
          (data && (data.message || data.error || data.details)) ||
          raw ||
          `Login failed: ${res.status}`
        setError(msg)
      }
    } catch (err) {
      console.error(err)
      setError('Network or server error while logging in.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="login-container">
      <form onSubmit={onSubmit} className="card form">
        <h2>Login</h2>
        <input
          className="input"
          placeholder="User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          autoComplete="off"
        />
        <input
          className="input"
          placeholder="User Name (optional)"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          autoComplete="off"
        />
        <button className="button" type="submit" disabled={busy}>
          {busy ? 'Signing in…' : 'Sign In'}
        </button>
        {error && <div className="error">{error}</div>}
      </form>
    </div>
  )
}
