import { useEffect, useState } from 'react'
import {
  BookOpen,
  Gamepad2,
  Globe2,
  Heart,
  Home,
  LogOut,
  Menu,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
  UserRound,
  X,
} from 'lucide-react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { hasRole } from '../../features/auth/roleService'
import { useAuth } from '../../features/auth/useAuth'
import { cn } from '../../lib/utils'
import { InstallPrompt } from '../pwa/InstallPrompt'

interface NavigationItem {
  label: string
  to: string
  icon: LucideIcon
  end?: boolean
}

const primaryMobileNavigation: NavigationItem[] = [
  { label: 'Inicio', to: '/app', icon: Home, end: true },
  { label: 'Oracion', to: '/app/oracion', icon: Heart },
  { label: 'Foros', to: '/app/foros', icon: MessageCircle },
  { label: 'Juegos', to: '/app/juegos', icon: Gamepad2 },
  { label: 'Mapa', to: '/app/mapa', icon: Globe2 },
]

const secondaryNavigation: NavigationItem[] = [
  { label: 'Devocional', to: '/app/devocional', icon: BookOpen },
  { label: 'Perfil', to: '/app/perfil', icon: UserRound },
]

function navigationItemClass(isActive: boolean) {
  return cn(
    'flex min-h-14 flex-col items-center justify-center gap-1 overflow-hidden rounded-2xl px-2 text-[0.62rem] font-semibold text-white/55 transition hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200 sm:text-xs',
    isActive &&
      'bg-gradient-to-br from-emerald-300/20 to-amber-300/20 text-white ring-1 ring-white/10',
  )
}

export function AppShell() {
  const navigate = useNavigate()
  const location = useLocation()
  const { signOut } = useAuth()
  const [isAdmin, setIsAdmin] = useState(false)
  const [isMoreOpen, setIsMoreOpen] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      hasRole('admin')
        .then(setIsAdmin)
        .catch(() => setIsAdmin(false))
    }, 0)

    return () => window.clearTimeout(timer)
  }, [])

  const adminNavigation: NavigationItem[] = isAdmin
    ? [{ label: 'Administracion', to: '/app/admin', icon: ShieldCheck }]
    : []
  const desktopNavigation: NavigationItem[] = [
    ...primaryMobileNavigation,
    ...secondaryNavigation,
    ...adminNavigation,
  ]
  const moreNavigation = [...secondaryNavigation, ...adminNavigation]
  const isMoreActive = moreNavigation.some((item) =>
    location.pathname.startsWith(item.to),
  )

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  return (
    <div className="relative min-h-screen bg-slate-950 pb-28 lg:pb-24">
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
            <span className="min-w-0">
              <span className="block truncate text-sm font-black">
                Red de Jovenes
              </span>
              <span className="hidden truncate text-xs text-white/45 sm:block">
                Conectando jovenes en Cristo
              </span>
            </span>
          </button>

          <div className="ml-auto hidden min-h-11 w-full max-w-md items-center rounded-full border border-white/10 bg-white/[0.06] px-4 text-sm font-semibold text-white/45 lg:flex">
            Todo lo puedo en Cristo - Fil 4:13
          </div>

          <div className="ml-auto flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-2 text-xs font-semibold text-amber-200 lg:ml-0">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Mi red</span>
          </div>
          <InstallPrompt />
        </div>
      </header>

      <Outlet />

      {isMoreOpen ? (
        <div className="fixed inset-x-3 bottom-[5.8rem] z-50 rounded-[1.5rem] border border-white/10 bg-slate-950/95 p-3 text-white shadow-2xl shadow-black/40 backdrop-blur-xl lg:hidden">
          <div className="mb-3 flex items-center justify-between px-2">
            <p className="text-sm font-black text-white">Mas de tu Red</p>
            <button
              type="button"
              onClick={() => setIsMoreOpen(false)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-white/70"
              aria-label="Cerrar menu"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
          <div className="grid gap-2">
            {moreNavigation.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/app'}
                  onClick={() => setIsMoreOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'flex min-h-12 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.05] px-4 text-sm font-bold text-white/70 transition hover:bg-white/10 hover:text-white',
                      isActive &&
                        'border-amber-300/25 bg-amber-300/10 text-amber-100',
                    )
                  }
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {item.label}
                </NavLink>
              )
            })}
            <button
              type="button"
              onClick={() => void handleSignOut()}
              className="flex min-h-12 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.05] px-4 text-sm font-bold text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Cerrar sesion
            </button>
          </div>
        </div>
      ) : null}

      <nav
        className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-6xl overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-950/90 p-2 shadow-2xl shadow-black/40 backdrop-blur-xl lg:hidden"
        style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}
        aria-label="Navegacion movil privada"
      >
        <div className="grid grid-cols-6 gap-1">
          {primaryMobileNavigation.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                aria-label={item.label}
                className={({ isActive }) => navigationItemClass(isActive)}
              >
                <Icon className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                <span className="max-w-full truncate">{item.label}</span>
              </NavLink>
            )
          })}
          <button
            type="button"
            onClick={() => setIsMoreOpen((current) => !current)}
            aria-label="Abrir mas opciones"
            aria-expanded={isMoreOpen}
            className={navigationItemClass(isMoreActive || isMoreOpen)}
          >
            <Menu className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
            <span className="max-w-full truncate">Mas</span>
          </button>
        </div>
      </nav>

      <nav
        className="fixed inset-x-3 bottom-3 z-50 mx-auto hidden max-w-6xl overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-950/85 p-2 shadow-2xl shadow-black/40 backdrop-blur-xl lg:block"
        aria-label="Navegacion privada"
      >
        <div className="flex gap-1 overflow-x-auto">
          {desktopNavigation.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                aria-label={item.label}
                className={({ isActive }) =>
                  cn(navigationItemClass(isActive), 'min-w-[5.6rem] flex-1')
                }
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
                <span className="max-w-full truncate">{item.label}</span>
              </NavLink>
            )
          })}
          <button
            type="button"
            onClick={() => void handleSignOut()}
            className={cn(navigationItemClass(false), 'min-w-[5.6rem] flex-1')}
          >
            <LogOut className="h-5 w-5" aria-hidden="true" />
            <span className="max-w-full truncate">Salir</span>
          </button>
        </div>
      </nav>
    </div>
  )
}
