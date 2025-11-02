import React from 'react'

const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080'

export default function Register() {
  const [username, setUsername] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [role, setRole] = React.useState('BORROWER')
  const [busy, setBusy] = React.useState(false)
  const [message, setMessage] = React.useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setMessage('')

    // Simple validation
    if (!username || !email || !password) {
      setMessage('All fields are required.')
      setBusy(false)
      return
    }

    try {
      const res = await fetch(`${API_BASE}/api/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username, // matches backend field
          email,
          password,
          role, // matches backend field
        }),
      })

      const raw = await res.text()
      let data = null
      try {
        data = raw ? JSON.parse(raw) : null
      } catch {}

      if (res.ok || res.status === 201) {
        const id = data?._id || '(no id returned)'
        window.alert(`✅ User registered successfully!\nUser ID: ${id}`)
        setMessage(`Registered successfully! User ID: ${id}`)

        // Reset form
        setUsername('')
        setEmail('')
        setPassword('')
        setRole('BORROWER')
      } else {
        const serverMsg =
          (data && (data.message || data.error || data.details)) ||
          raw ||
          `Registration failed (${res.status})`
        setMessage(serverMsg)
        window.alert(`⚠️ ${serverMsg}`)
      }
    } catch (err) {
      console.error(err)
      setMessage('❌ Network or server error while registering.')
      window.alert('Network or server error while registering.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="register-container">
      <form onSubmit={onSubmit} className="card form">
        <h2>Register</h2>

        <input
          className="input"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="off"
        />

        <input
          className="input"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="off"
        />

        <input
          className="input"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <label className="label">
          Role:
          <select
            className="select"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="BORROWER">Borrower</option>
            <option value="SERVICE_PROVIDER">Service Provider</option>
          </select>
        </label>

        <button className="button" type="submit" disabled={busy}>
          {busy ? 'Registering…' : 'Register'}
        </button>

        {message && <div className="result">{message}</div>}
      </form>
    </div>
  )
}