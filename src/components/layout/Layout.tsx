import { Outlet, useLocation } from 'react-router-dom'
import { Footer } from './Footer'
import { Header } from './Header'

export function Layout() {
  const { pathname } = useLocation()
  const isChromeLessRoute = pathname === '/' || pathname.startsWith('/app')

  if (isChromeLessRoute) {
    return (
      <div className="min-h-screen bg-[#06100d]">
        <Outlet />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#06100d]">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
