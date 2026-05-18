import { useEffect, useState } from 'react'
import {
  BookOpen,
  Gamepad2,
  Globe2,
  Heart,
  Home,
  LogOut,
  MessageCircle,
  Search,
  ShieldCheck,
  Sparkles,
  UserRound,
} from 'lucide-react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../features/auth/useAuth'
import { hasRole } from '../../features/auth/roleService'
import { cn } from '../../lib/utils'

const privateNavigation = [
  { label: 'Inicio', to: '/app', icon: Home, end: true },
  { label: 'Oración', to: '/app/oracion', icon: Heart },
  { label: 'Foros', to: '/app/comunidad', icon: MessageCircle },
  { label: 'Devocional', to: '/app/devocional', icon: BookOpen },
  { label: 'Juegos', to: '/app/juegos', icon: Gamepad2 },
  { label: 'Mapa', to: '/app/mapa', icon: Globe2 },
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
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-slate-950/85 px-4 py-3 text-white shadow-2xl shadow-black/30 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/app')}
            className="flex min-w-0 items-center gap-3 rounded-full text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-200"
            aria-label="Ir al inicio de mi red"
          >
            <span className="flex h-10 w-10 flex-none items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-300 via-lime-200 to-amber-300 font-black text-slate-950 shadow-lg shadow-amber-500/20">
              +
            </span>
            <span className="hidden min-w-0 sm:block">
              <span className="block truncate text-sm font-black">
                Red de Jóvenes en Cristo
              </span>
              <span className="block truncate text-xs text-white/45">
                “Todo lo puedo en Cristo...” · Fil 4:13
              </span>
            </span>
          </button>

          <div className="ml-auto hidden min-h-11 w-full max-w-md items-center gap-3 rounded-full border border-white/10 bg-white/[0.06] px-4 text-sm text-white/45 lg:flex">
            <Search className="h-4 w-4" aria-hidden="true" />
            Buscar amigos, versículos, secciones...
          </div>

          <div className="ml-auto flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-2 text-xs font-semibold text-amber-200 lg:ml-0">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Mi red</span>
          </div>
        </div>
      </header>
      <Outlet />
      <nav
        className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-6xl overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-950/85 p-2 shadow-2xl shadow-black/40 backdrop-blur-xl"
        aria-label="Navegación privada"
      >
        <div className="flex gap-1 overflow-x-auto">
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
                    'flex min-h-14 min-w-[4.65rem] flex-1 flex-col items-center justify-center gap-1 overflow-hidden rounded-2xl px-2 text-[0.62rem] font-semibold text-white/55 transition hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200 sm:min-w-[5.6rem] sm:text-xs',
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
            className="flex min-h-14 min-w-[4.65rem] flex-1 flex-col items-center justify-center gap-1 overflow-hidden rounded-2xl px-2 text-[0.62rem] font-semibold text-white/55 transition hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200 sm:min-w-[5.6rem] sm:text-xs"
          >
            <LogOut className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
            <span className="max-w-full truncate">Salir</span>
          </button>
        </div>
      </nav>
    </div>
  )
}
