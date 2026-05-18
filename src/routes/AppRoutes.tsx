import { Route, Routes } from 'react-router-dom'
import { Layout } from '../components/layout/Layout'
import { About } from '../pages/About'
import { Contact } from '../pages/Contact'
import { Dashboard } from '../pages/Dashboard'
import { Events } from '../pages/Events'
import { Home } from '../pages/Home'
import { NotFound } from '../pages/NotFound'
import { Opportunities } from '../pages/Opportunities'
import { Programs } from '../pages/Programs'

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="sobre-la-red" element={<About />} />
        <Route path="eventos" element={<Events />} />
        <Route path="programas" element={<Programs />} />
        <Route path="oportunidades" element={<Opportunities />} />
        <Route path="contacto" element={<Contact />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
