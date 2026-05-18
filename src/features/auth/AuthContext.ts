import { createContext } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import type { SignUpMetadata } from './authService'

export interface AuthContextValue {
  session: Session | null
  user: User | null
  isLoading: boolean
  signInWithPassword: (email: string, password: string) => Promise<void>
  signUpWithPassword: (
    email: string,
    password: string,
    metadata: SignUpMetadata,
  ) => Promise<void>
  signOut: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
)
