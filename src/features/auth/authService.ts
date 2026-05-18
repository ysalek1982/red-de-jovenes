import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '../../lib/supabase'

export interface SignUpMetadata {
  full_name: string
  city: string
  country: string
  church_name?: string
}

export async function getCurrentSession() {
  const { data, error } = await supabase.auth.getSession()
  if (error) throw error
  return data.session
}

export function onAuthStateChange(
  callback: (session: Session | null, user: User | null) => void,
) {
  return supabase.auth.onAuthStateChange((_event, session) => {
    callback(session, session?.user ?? null)
  })
}

export async function signInWithPassword(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  if (error) throw error
  return data
}

export async function signUpWithPassword(
  email: string,
  password: string,
  metadata: SignUpMetadata,
) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
    },
  })
  if (error) throw error
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}
