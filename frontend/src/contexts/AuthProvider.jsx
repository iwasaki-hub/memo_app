import { useCallback, useEffect, useMemo, useState } from 'react'
import * as authApi from '../api/authApi'
import { AuthContext } from './AuthContext.js'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const refreshUser = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const currentUser = await authApi.getCurrentUser()
      setUser(currentUser)
      return currentUser
    } catch (requestError) {
      setUser(null)
      if (requestError.status !== 401) setError(requestError.message)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let active = true
    authApi.getCurrentUser()
      .then((currentUser) => {
        if (active) setUser(currentUser)
      })
      .catch((requestError) => {
        if (!active) return
        setUser(null)
        if (requestError.status !== 401) setError(requestError.message)
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => { active = false }
  }, [])

  const login = useCallback(async (credentials) => {
    setError('')
    try {
      const authenticatedUser = await authApi.login(credentials)
      setUser(authenticatedUser)
      return authenticatedUser
    } catch (requestError) {
      setError(requestError.message)
      throw requestError
    }
  }, [])

  const register = useCallback(async (credentials) => {
    setError('')
    try {
      const authenticatedUser = await authApi.register(credentials)
      setUser(authenticatedUser)
      return authenticatedUser
    } catch (requestError) {
      setError(requestError.message)
      throw requestError
    }
  }, [])

  const logout = useCallback(async () => {
    setError('')
    try {
      await authApi.logout()
      setUser(null)
    } catch (requestError) {
      setError(requestError.message)
      throw requestError
    }
  }, [])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      loading,
      error,
      login,
      register,
      logout,
      refreshUser,
    }),
    [user, loading, error, login, register, logout, refreshUser],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
