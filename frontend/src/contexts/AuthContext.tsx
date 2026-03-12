import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import * as api from '@/lib/api'

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  username: string | null
  isAuthenticated: boolean
  isInitialized: boolean
}

interface AuthContextValue extends AuthState {
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  setTokens: (data: api.TokenResponse) => void
  getAccessToken: () => string | null
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [refreshToken, setRefreshToken] = useState<string | null>(null)
  const [username, setUsername] = useState<string | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  const setTokens = useCallback((data: api.TokenResponse) => {
    setAccessToken(data.accessToken)
    setRefreshToken(data.refreshToken)
    setUsername(data.username)
    api.setStoredRefreshToken(data.refreshToken)
  }, [])

  const logout = useCallback(() => {
    setAccessToken(null)
    setRefreshToken(null)
    setUsername(null)
    api.setStoredRefreshToken(null)
  }, [])

  const login = useCallback(async (user: string, pass: string) => {
    const data = await api.login(user, pass)
    setTokens(data)
  }, [setTokens])

  useEffect(() => {
    const stored = api.getStoredRefreshToken()
    if (!stored) {
      setIsInitialized(true)
      return
    }
    api.refresh(stored)
      .then((data) => {
        setTokens(data)
      })
      .catch(() => {
        api.setStoredRefreshToken(null)
      })
      .finally(() => setIsInitialized(true))
  }, [setTokens])

  const value = useMemo<AuthContextValue>(() => ({
    accessToken,
    refreshToken,
    username,
    isAuthenticated: !!accessToken,
    isInitialized,
    login,
    logout,
    setTokens,
    getAccessToken: () => accessToken,
  }), [accessToken, refreshToken, username, isInitialized, login, logout, setTokens])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
