import { useEffect, useState } from 'react'
import {
  BookOpen,
  Heart,
  Home,
  LogOut,
  MessageCircle,
  ShieldCheck,
  UserRound,
} from 'lucide-react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../features/auth/useAuth'
import { hasRole } from '../../features/auth/roleService'
import { cn } from '../../lib/utils'

const privateNavigation = [
  { label: 'Inicio', to: '/app', icon: Home, end: true },
  { label: 'Oración', to: '/app/oracion', icon: Heart },
  { label: 'Comunidad', to: '/app/comunidad', icon: MessageCircle },
  { label: 'Devocional', to: '/app/devocional', icon: BookOpen },
  { label: 'Perfil', to: '/app/perfil', icon: UserRound },
]

export function AppShell() {
  const navigate = useNavigate()
  const { signOut } = useAuth()
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      hasRole('admin')
        .then(setIsAdmin)
        .catch(() => setIsAdmin(false))
    }, 0)

    return () => window.clearTimeout(timer)
  }, [])

  const navigation = isAdmin
    ? [
        ...privateNavigation,
        { label: 'Administración', to: '/app/admin', icon: ShieldCheck },
      ]
    : privateNavigation

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  return (
    <div className="relative min-h-screen bg-slate-950 pb-24">
      <Outlet />
      <nav
        className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-4xl rounded-[1.5rem] border border-white/10 bg-slate-950/85 p-2 shadow-2xl shadow-black/40 backdrop-blur-xl"
        aria-label="Navegación privada"
      >
        <div
          className="grid gap-1"
          style={{
            gridTemplateColumns: `repeat(${navigation.length + 1}, minmax(0, 1fr))`,
          }}
        >
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                aria-label={item.label}
                className={({ isActive }) =>
                  cn(
                    'flex min-h-14 min-w-0 flex-col items-center justify-center gap-1 overflow-hidden rounded-2xl px-1 text-[0.62rem] font-semibold text-white/55 transition hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200 sm:px-2 sm:text-xs',
                    isActive &&
                      'bg-gradient-to-br from-emerald-300/20 to-amber-300/20 text-white ring-1 ring-white/10',
                  )
                }
              >
                <Icon className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                <span className="max-w-full truncate">{item.label}</span>
              </NavLink>
            )
          })}
          <button
            type="button"
            onClick={() => void handleSignOut()}
            className="flex min-h-14 min-w-0 flex-col items-center justify-center gap-1 overflow-hidden rounded-2xl px-1 text-[0.62rem] font-semibold text-white/55 transition hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200 sm:px-2 sm:text-xs"
          >
            <LogOut className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
            <span className="max-w-full truncate">Salir</span>
          </button>
        </div>
      </nav>
    </div>
  )
}
