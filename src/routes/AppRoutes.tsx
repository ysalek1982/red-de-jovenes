import { Navigate, Route, Routes } from 'react-router-dom'
import { lazy, Suspense, type ReactNode } from 'react'
import { Layout } from '../components/layout/Layout'
import { useAuth } from '../features/auth/useAuth'
import { CreateAccountPage } from '../pages/CreateAccountPage'
import { Home } from '../pages/Home'
import { PlaceholderPage } from '../pages/PlaceholderPage'
import { SignInPage } from '../pages/SignInPage'

const AppShell = lazy(() =>
  import('../components/layout/AppShell').then((module) => ({
    default: module.AppShell,
  })),
)
const AppHome = lazy(() =>
  import('../pages/AppHome').then((module) => ({ default: module.AppHome })),
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

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="entrar" element={<SignInPage />} />
        <Route path="crear-cuenta" element={<CreateAccountPage />} />
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
          <Route
            path="comunidad"
            element={withSuspense(<CommunityFeedPage />)}
          />
          <Route path="devocional" element={withSuspense(<DevotionalPage />)} />
        </Route>
        <Route
          path="demo"
          element={
            <PlaceholderPage
              eyebrow="Demo"
              title="Una vista previa de la experiencia."
              description="La demo mantendrá el flujo de comunidad, oración, devocional y mapa mundial en una interfaz instalable."
              actionLabel="Crear mi cuenta gratis"
              actionTo="/crear-cuenta"
            />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
