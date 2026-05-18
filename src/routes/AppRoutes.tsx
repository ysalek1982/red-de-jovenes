import { Navigate, Route, Routes } from 'react-router-dom'
import type { ReactNode } from 'react'
import { Layout } from '../components/layout/Layout'
import { useAuth } from '../features/auth/useAuth'
import { AppHome } from '../pages/AppHome'
import { AppProfile } from '../pages/AppProfile'
import { CommunityFeedPage } from '../pages/CommunityFeedPage'
import { CreateAccountPage } from '../pages/CreateAccountPage'
import { Home } from '../pages/Home'
import { PlaceholderPage } from '../pages/PlaceholderPage'
import { PrayerRoomPage } from '../pages/PrayerRoomPage'
import { SignInPage } from '../pages/SignInPage'

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <section className="min-h-screen bg-slate-950 px-4 pt-36 text-center text-white">
        Preparando tu red...
      </section>
    )
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
              <AppHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="app/perfil"
          element={
            <ProtectedRoute>
              <AppProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="app/oracion"
          element={
            <ProtectedRoute>
              <PrayerRoomPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="app/comunidad"
          element={
            <ProtectedRoute>
              <CommunityFeedPage />
            </ProtectedRoute>
          }
        />
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
