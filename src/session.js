
import React from 'react'

const SessionContext = React.createContext(null)

export function SessionProvider({ children }) {
  const [user, setUser] = React.useState(null)
  const [activeRole, setActiveRole] = React.useState('BORROWER')

  const login = (u) => {
    setUser(u)
    setActiveRole(u.userRole === 'SERVICE_PROVIDER' ? 'SERVICE_PROVIDER' : 'BORROWER')
  }

  const logout = () => {
    setUser(null)
    setActiveRole('BORROWER')
  }

  const value = { user, activeRole, setActiveRole, login, logout }
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}

export function useSession() {
  const ctx = React.useContext(SessionContext)
  if (!ctx) throw new Error('useSession must be used within SessionProvider')
  return ctx
}
