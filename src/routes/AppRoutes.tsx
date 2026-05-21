import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { lazy, Suspense, type ReactNode } from 'react'
import { AppErrorBoundary } from '../components/errors/AppErrorBoundary'
import { Layout } from '../components/layout/Layout'
import { useAuth } from '../features/auth/useAuth'

const AppShell = lazy(() =>
  import('../components/layout/AppShell').then((module) => ({
    default: module.AppShell,
  })),
)
const Home = lazy(() =>
  import('../pages/Home').then((module) => ({ default: module.Home })),
)
const SignInPage = lazy(() =>
  import('../pages/SignInPage').then((module) => ({
    default: module.SignInPage,
  })),
)
const CreateAccountPage = lazy(() =>
  import('../pages/CreateAccountPage').then((module) => ({
    default: module.CreateAccountPage,
  })),
)
const RecoverPasswordPage = lazy(() =>
  import('../pages/RecoverPasswordPage').then((module) => ({
    default: module.RecoverPasswordPage,
  })),
)
const UpdatePasswordPage = lazy(() =>
  import('../pages/UpdatePasswordPage').then((module) => ({
    default: module.UpdatePasswordPage,
  })),
)
const AppHome = lazy(() =>
  import('../pages/AppHome').then((module) => ({ default: module.AppHome })),
)
const AdminHome = lazy(() =>
  import('../pages/AdminHome').then((module) => ({
    default: module.AdminHome,
  })),
)
const AppProfile = lazy(() =>
  import('../pages/AppProfile').then((module) => ({
    default: module.AppProfile,
  })),
)
const BiblePage = lazy(() =>
  import('../pages/BiblePage').then((module) => ({ default: module.BiblePage })),
)
const PrayerRoomPage = lazy(() =>
  import('../pages/PrayerRoomPage').then((module) => ({
    default: module.PrayerRoomPage,
  })),
)
const CommunityFeedPage = lazy(() =>
  import('../pages/CommunityFeedPage').then((module) => ({
    default: module.CommunityFeedPage,
  })),
)
const DevotionalPage = lazy(() =>
  import('../pages/DevotionalPage').then((module) => ({
    default: module.DevotionalPage,
  })),
)
const DemoPage = lazy(() =>
  import('../pages/DemoPage').then((module) => ({
    default: module.DemoPage,
  })),
)
const FaithGamesPage = lazy(() =>
  import('../pages/FaithGamesPage').then((module) => ({
    default: module.FaithGamesPage,
  })),
)
const WorldMapPage = lazy(() =>
  import('../pages/WorldMapPage').then((module) => ({
    default: module.WorldMapPage,
  })),
)
const EventsPage = lazy(() =>
  import('../pages/EventsPage').then((module) => ({ default: module.EventsPage })),
)
const DiscipleshipPage = lazy(() =>
  import('../pages/DiscipleshipPage').then((module) => ({
    default: module.DiscipleshipPage,
  })),
)
const MessagesPage = lazy(() =>
  import('../pages/MessagesPage').then((module) => ({
    default: module.MessagesPage,
  })),
)
const BuildNetworkPage = lazy(() =>
  import('../pages/BuildNetworkPage').then((module) => ({
    default: module.BuildNetworkPage,
  })),
)
const SafetyPage = lazy(() =>
  import('../pages/SafetyPage').then((module) => ({
    default: module.SafetyPage,
  })),
)

function RouteLoading({ moduleName = 'modulo' }: { moduleName?: string }) {
  return (
    <section
      className="flex min-h-screen items-start justify-center bg-slate-950 px-4 pt-36 text-center text-white"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="rounded-2xl border border-white/10 bg-white/[0.06] px-6 py-5 shadow-2xl shadow-black/25 backdrop-blur">
        <span className="mx-auto block h-9 w-9 animate-spin rounded-full border-2 border-white/15 border-t-amber-200" />
        <p className="mt-4 text-sm font-black text-white">
          Cargando {moduleName}...
        </p>
        <p className="mt-1 text-xs font-semibold text-white/50">
          Preparando tu Red de Jovenes.
        </p>
      </div>
    </section>
  )
}

function withSuspense(children: ReactNode, moduleName?: string, resetKey = '') {
  return (
    <AppErrorBoundary moduleName={moduleName} resetKey={resetKey}>
      <Suspense fallback={<RouteLoading moduleName={moduleName} />}>
        {children}
      </Suspense>
    </AppErrorBoundary>
  )
}

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return <RouteLoading moduleName="tu sesion" />
  }

  if (!user) {
    return <Navigate to="/entrar" replace />
  }

  return children
}

function AppEntryRoute() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return <RouteLoading moduleName="tu sesion" />
  }

  return <Navigate to={user ? '/app' : '/entrar'} replace />
}

export function AppRoutes() {
  const location = useLocation()
  const routeResetKey = `${location.pathname}${location.search}`

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<AppEntryRoute />} />
        <Route path="landing" element={withSuspense(<Home />, 'landing', routeResetKey)} />
        <Route path="entrar" element={withSuspense(<SignInPage />, 'entrada', routeResetKey)} />
        <Route path="recuperar" element={withSuspense(<RecoverPasswordPage />, 'recuperacion', routeResetKey)} />
        <Route
          path="actualizar-contrasena"
          element={withSuspense(<UpdatePasswordPage />, 'actualizacion', routeResetKey)}
        />
        <Route
          path="crear-cuenta"
          element={withSuspense(<CreateAccountPage />, 'registro', routeResetKey)}
        />
        <Route
          path="app"
          element={
            <ProtectedRoute>
              {withSuspense(<AppShell />, 'la app', routeResetKey)}
            </ProtectedRoute>
          }
        >
          <Route index element={withSuspense(<AppHome />, 'inicio', routeResetKey)} />
          <Route path="perfil" element={withSuspense(<AppProfile />, 'perfil', routeResetKey)} />
          <Route path="biblia" element={withSuspense(<BiblePage />, 'Biblia', routeResetKey)} />
          <Route path="oracion" element={withSuspense(<PrayerRoomPage />, 'oracion', routeResetKey)} />
          <Route path="orar" element={<Navigate to="/app/oracion" replace />} />
          <Route path="comunidad" element={<Navigate to="/app/mapa" replace />} />
          <Route path="foros" element={withSuspense(<CommunityFeedPage />, 'foros', routeResetKey)} />
          <Route path="devocional" element={withSuspense(<DevotionalPage />, 'devocional', routeResetKey)} />
          <Route path="juegos" element={withSuspense(<FaithGamesPage />, 'juegos', routeResetKey)} />
          <Route path="mapa" element={withSuspense(<WorldMapPage />, 'comunidad', routeResetKey)} />
          <Route path="eventos" element={withSuspense(<EventsPage />, 'eventos', routeResetKey)} />
          <Route path="discipulado" element={withSuspense(<DiscipleshipPage />, 'discipulado', routeResetKey)} />
          <Route path="mensajes" element={withSuspense(<MessagesPage />, 'mensajes', routeResetKey)} />
          <Route path="construir" element={withSuspense(<BuildNetworkPage />, 'Construir la Red', routeResetKey)} />
          <Route path="seguridad" element={withSuspense(<SafetyPage />, 'cuidado comunitario', routeResetKey)} />
          <Route path="admin" element={withSuspense(<AdminHome />, 'administracion', routeResetKey)} />
        </Route>
        <Route path="demo" element={withSuspense(<DemoPage />, 'demo', routeResetKey)} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
