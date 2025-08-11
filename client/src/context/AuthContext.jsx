import { createContext, useContext, useEffect, useState } from 'react'
import { api, setAuthToken } from '../lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [user, setUser] = useState(null)

  useEffect(() => {
    setAuthToken(token)
  }, [token])

  async function login(username, password) {
    const { data } = await api.post('/auth/login', { username, password })
    setToken(data.token)
    setUser({ username })
  }

  function logout() {
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}


