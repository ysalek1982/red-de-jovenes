import { Navigate, Route, Routes } from 'react-router-dom'
import { lazy, Suspense, type ReactNode } from 'react'
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
const SafetyPage = lazy(() =>
  import('../pages/SafetyPage').then((module) => ({
    default: module.SafetyPage,
  })),
)

function RouteLoading() {
  return (
    <section className="min-h-screen bg-slate-950 px-4 pt-36 text-center text-white">
      Preparando tu red...
    </section>
  )
}

function withSuspense(children: ReactNode) {
  return <Suspense fallback={<RouteLoading />}>{children}</Suspense>
}

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return <RouteLoading />
  }

  if (!user) {
    return <Navigate to="/entrar" replace />
  }

  return children
}

function AppEntryRoute() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return <RouteLoading />
  }

  return <Navigate to={user ? '/app' : '/entrar'} replace />
}

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<AppEntryRoute />} />
        <Route path="landing" element={withSuspense(<Home />)} />
        <Route path="entrar" element={withSuspense(<SignInPage />)} />
        <Route path="recuperar" element={withSuspense(<RecoverPasswordPage />)} />
        <Route
          path="crear-cuenta"
          element={withSuspense(<CreateAccountPage />)}
        />
        <Route
          path="app"
          element={
            <ProtectedRoute>
              {withSuspense(<AppShell />)}
            </ProtectedRoute>
          }
        >
          <Route index element={withSuspense(<AppHome />)} />
          <Route path="perfil" element={withSuspense(<AppProfile />)} />
          <Route path="oracion" element={withSuspense(<PrayerRoomPage />)} />
          <Route path="orar" element={<Navigate to="/app/oracion" replace />} />
          <Route
            path="comunidad"
            element={withSuspense(<CommunityFeedPage />)}
          />
          <Route path="foros" element={withSuspense(<CommunityFeedPage />)} />
          <Route path="devocional" element={withSuspense(<DevotionalPage />)} />
          <Route path="juegos" element={withSuspense(<FaithGamesPage />)} />
          <Route path="mapa" element={withSuspense(<WorldMapPage />)} />
          <Route path="seguridad" element={withSuspense(<SafetyPage />)} />
          <Route path="admin" element={withSuspense(<AdminHome />)} />
        </Route>
        <Route path="demo" element={withSuspense(<DemoPage />)} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
