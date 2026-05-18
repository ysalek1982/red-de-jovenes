import { supabase } from '../../lib/supabase'

export type AppRole = 'admin' | 'moderator' | 'member'

export async function getMyRoles() {
  const { data, error } = await supabase
    .from('user_roles')
    .select('role')
    .order('created_at', { ascending: true })

  if (error) throw error
  return (data ?? []).map((item) => item.role as AppRole)
}

export async function hasRole(role: AppRole) {
  const { data, error } = await supabase.rpc('has_role', {
    required_role: role,
  })

  if (error) throw error
  return Boolean(data)
}
