import type { Session, User } from '@supabase/supabase-js'
import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  getCurrentSession,
  onAuthStateChange,
  signInWithPassword,
  signOut,
  signUpWithPassword,
} from './authService'
import { AuthContext, type AuthContextValue } from './AuthContext'

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    getCurrentSession()
      .then((currentSession) => {
        if (!isMounted) return
        setSession(currentSession)
        setUser(currentSession?.user ?? null)
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })

    const {
      data: { subscription },
    } = onAuthStateChange((nextSession, nextUser) => {
      setSession(nextSession)
      setUser(nextUser)
      setIsLoading(false)
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user,
      isLoading,
      signInWithPassword: async (email, password) => {
        await signInWithPassword(email, password)
      },
      signUpWithPassword: async (email, password, metadata) => {
        return signUpWithPassword(email, password, metadata)
      },
      signOut,
    }),
    [isLoading, session, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
