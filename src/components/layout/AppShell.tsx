import { useEffect, useRef, useState } from 'react'
import {
  BookOpen,
  BookOpenCheck,
  CalendarDays,
  Gamepad2,
  GraduationCap,
  Globe2,
  Hammer,
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
import { scrollToPageTop } from '../../lib/scroll'
import { cn } from '../../lib/utils'
import { NotificationBell } from '../notifications/NotificationBell'
import { PilotFeedbackDialog } from '../pilot/PilotFeedbackDialog'
import { InstallPrompt } from '../pwa/InstallPrompt'
import { GlobalSearch } from '../search/GlobalSearch'

interface NavigationItem {
  label: string
  to: string
  icon: LucideIcon
  end?: boolean
}

const primaryMobileNavigation: NavigationItem[] = [
  { label: 'Inicio', to: '/app', icon: Home, end: true },
  { label: 'Biblia', to: '/app/biblia', icon: BookOpen },
  { label: 'Orar', to: '/app/oracion', icon: Heart },
  { label: 'Foros', to: '/app/foros', icon: MessageCircle },
  { label: 'Juegos', to: '/app/juegos', icon: Gamepad2 },
]

const secondaryNavigation: NavigationItem[] = [
  { label: 'Devocional', to: '/app/devocional', icon: BookOpenCheck },
  { label: 'Comunidad', to: '/app/mapa', icon: Globe2 },
  { label: 'Eventos', to: '/app/eventos', icon: CalendarDays },
  { label: 'Discipulado', to: '/app/discipulado', icon: GraduationCap },
  { label: 'Mensajes', to: '/app/mensajes', icon: MessageCircle },
  { label: 'Guia rapida', to: '/app/guia', icon: Sparkles },
  { label: 'Perfil', to: '/app/perfil', icon: UserRound },
  { label: 'Construir', to: '/app/construir', icon: Hammer },
]

function navigationItemClass(isActive: boolean) {
  return cn(
    'flex min-h-[3.65rem] flex-col items-center justify-center gap-1 overflow-hidden rounded-2xl px-2 text-[0.62rem] font-semibold text-white/55 transition hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200 sm:text-xs',
    isActive &&
      'bg-white text-slate-950 shadow-lg shadow-amber-500/10 ring-1 ring-amber-100/70 hover:bg-amber-100 hover:text-slate-950',
  )
}

export function AppShell() {
  const navigate = useNavigate()
  const location = useLocation()
  const { signOut } = useAuth()
  const morePanelRef = useRef<HTMLDivElement>(null)
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

  function resetPrivateNavigation() {
    setIsMoreOpen(false)
    morePanelRef.current?.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    scrollToPageTop({ behavior: 'auto', focus: false })
  }

  async function handleSignOut() {
    resetPrivateNavigation()
    await signOut()
    navigate('/')
  }

  return (
    <div className="relative min-h-screen bg-slate-950 pb-28 lg:pb-24">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-slate-950/85 px-4 py-3 text-white shadow-2xl shadow-black/30 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center gap-3">
          <button
            type="button"
            onClick={() => {
              resetPrivateNavigation()
              navigate('/app')
            }}
            className="flex min-w-0 items-center gap-3 rounded-full text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-200"
            aria-label="Ir al inicio de mi red"
          >
            <span className="flex h-10 w-10 flex-none items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-300 via-lime-200 to-amber-300 font-black text-slate-950 shadow-lg shadow-amber-500/20">
              +
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-black">
                Red de Jóvenes
              </span>
              <span className="hidden truncate text-xs text-white/45 sm:block">
                Conectando jóvenes en Cristo
              </span>
            </span>
          </button>

          <div className="ml-auto hidden min-h-11 w-full max-w-md items-center rounded-full border border-white/10 bg-white/[0.06] px-4 text-sm font-semibold text-white/45 lg:flex">
            <GlobalSearch />
          </div>

          <div className="ml-auto flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-2 text-xs font-semibold text-amber-200 lg:ml-0">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Mi red</span>
          </div>
          <div className="lg:hidden">
            <GlobalSearch />
          </div>
          <NotificationBell />
          <InstallPrompt />
        </div>
      </header>

      <Outlet />

      {isMoreOpen ? (
        <>
          <button
            type="button"
            aria-label="Cerrar mas opciones"
            className="fixed inset-0 z-40 bg-black/45 backdrop-blur-[2px] lg:hidden"
            onClick={() => setIsMoreOpen(false)}
          />
          <div
            ref={morePanelRef}
            data-scroll-root
            className="fixed inset-x-3 z-50 max-h-[68dvh] overflow-y-auto rounded-2xl border border-white/10 bg-slate-950/95 p-3 text-white shadow-2xl shadow-black/45 backdrop-blur-xl lg:hidden"
            style={{
              bottom:
                'calc(max(0.75rem, env(safe-area-inset-bottom)) + 5.6rem)',
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Mas opciones de navegacion"
          >
          <div className="mx-auto mb-3 h-1 w-12 rounded-full bg-white/20" />
          <div className="mb-3 flex items-center justify-between px-2">
            <div>
              <p className="text-sm font-black text-white">Mas de tu Red</p>
              <p className="mt-1 text-xs font-semibold text-white/45">
                Devocional, comunidad y herramientas personales.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsMoreOpen(false)}
              className="flex h-10 w-10 flex-none items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-white/70 transition hover:bg-white/10 hover:text-white"
              aria-label="Cerrar menu"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {moreNavigation.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/app'}
                  onClick={resetPrivateNavigation}
                  className={({ isActive }) =>
                    cn(
                      'flex min-h-14 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.05] px-3 text-sm font-bold text-white/70 transition hover:bg-white/10 hover:text-white',
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
            <PilotFeedbackDialog
              triggerClassName="flex min-h-14 items-center gap-3 rounded-2xl border border-emerald-300/20 bg-emerald-300/10 px-3 text-sm font-bold text-emerald-100 transition hover:bg-emerald-300/15"
            />
            <button
              type="button"
              onClick={() => void handleSignOut()}
              className="flex min-h-14 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.05] px-3 text-sm font-bold text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Cerrar sesion
            </button>
          </div>
          </div>
        </>
      ) : null}

      <nav
        className="fixed inset-x-3 z-50 mx-auto max-w-6xl overflow-hidden rounded-2xl border border-white/10 bg-slate-950/92 p-2 shadow-2xl shadow-black/45 backdrop-blur-xl lg:hidden"
        style={{
          bottom: 'max(0.75rem, env(safe-area-inset-bottom))',
          paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))',
        }}
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
                onClick={resetPrivateNavigation}
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
                onClick={resetPrivateNavigation}
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
