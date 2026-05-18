import { Outlet, useLocation } from 'react-router-dom'
import { Footer } from './Footer'
import { Header } from './Header'

export function Layout() {
  const { pathname } = useLocation()
  const isPrivateApp = pathname.startsWith('/app')

  if (isPrivateApp) {
    return (
      <div className="min-h-screen bg-slate-950">
        <Outlet />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-950">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
