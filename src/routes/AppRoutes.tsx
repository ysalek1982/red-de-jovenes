import { Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from '../components/layout/Layout'
import { Home } from '../pages/Home'
import { PlaceholderPage } from '../pages/PlaceholderPage'

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route
          path="entrar"
          element={
            <PlaceholderPage
              eyebrow="Entrar"
              title="Vuelve a tu comunidad."
              description="Acceso visual preparado para una futura autenticación de la Red de Jóvenes."
              actionLabel="Crear cuenta"
              actionTo="/crear-cuenta"
            />
          }
        />
        <Route
          path="crear-cuenta"
          element={
            <PlaceholderPage
              eyebrow="Crear cuenta"
              title="Tu generación. Tu Red."
              description="Muy pronto podrás crear tu perfil, unirte a salas de oración y conectar con jóvenes en Cristo."
              actionLabel="Ver demo"
              actionTo="/demo"
            />
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
