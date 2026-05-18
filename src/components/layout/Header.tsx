import { Menu, Plus, X } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../features/auth/useAuth'
import { cn } from '../../lib/utils'

const navigation = [
  { label: 'Misión', href: '/#mision' },
  { label: 'Funciones', href: '/#funciones' },
  { label: 'Testimonios', href: '/#testimonios' },
  { label: 'Comunidad', href: '/#comunidad' },
]

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const { user, isLoading, signOut } = useAuth()
  const navigate = useNavigate()

  async function handleSignOut() {
    setIsSigningOut(true)
    try {
      await signOut()
      setIsOpen(false)
      navigate('/')
    } finally {
      setIsSigningOut(false)
    }
  }

  const sessionActions = user ? (
    <>
      <Link
        to="/app"
        className="rounded-full bg-gradient-to-r from-emerald-300 via-lime-200 to-amber-300 px-5 py-2.5 text-sm font-bold text-slate-950 shadow-lg shadow-amber-500/20 transition hover:scale-[1.02]"
      >
        Mi red
      </Link>
      <button
        type="button"
        className="rounded-full px-4 py-2 text-sm font-semibold text-white/70 transition hover:text-white disabled:opacity-60"
        onClick={handleSignOut}
        disabled={isSigningOut}
      >
        {isSigningOut ? 'Saliendo...' : 'Salir'}
      </button>
    </>
  ) : (
    <>
      <Link
        to="/entrar"
        className="rounded-full px-4 py-2 text-sm font-semibold text-white/70 transition hover:text-white"
      >
        Entrar
      </Link>
      <Link
        to="/crear-cuenta"
        className="rounded-full bg-gradient-to-r from-emerald-300 via-lime-200 to-amber-300 px-5 py-2.5 text-sm font-bold text-slate-950 shadow-lg shadow-amber-500/20 transition hover:scale-[1.02]"
      >
        Crear cuenta
      </Link>
    </>
  )

  return (
    <header className="fixed inset-x-0 top-4 z-50 px-4">
      <div
        className={cn(
          'mx-auto max-w-7xl border border-white/10 bg-slate-950/70 px-4 py-3 shadow-2xl shadow-black/30 backdrop-blur-xl transition-[border-radius]',
          isOpen ? 'rounded-[2rem]' : 'rounded-full',
        )}
      >
        <div className="flex items-center justify-between gap-4">
          <Link
            to="/"
            aria-label="+ Red de Jóvenes"
            className="flex items-center gap-3 text-sm font-bold text-white sm:text-base"
            onClick={() => setIsOpen(false)}
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-emerald-300 via-lime-200 to-amber-300 text-slate-950 shadow-lg shadow-amber-500/20">
              <Plus className="h-5 w-5" aria-hidden="true" />
            </span>
            <span>Red de Jóvenes</span>
          </Link>

          <nav className="hidden items-center gap-8 lg:flex" aria-label="Principal">
            {navigation.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="text-sm font-medium text-white/60 transition hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            {isLoading ? null : sessionActions}
          </div>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white lg:hidden"
            aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={isOpen}
            onClick={() => setIsOpen((current) => !current)}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        <div
          className={cn(
            'grid overflow-hidden transition-all duration-300 lg:hidden',
            isOpen ? 'grid-rows-[1fr] pt-4' : 'grid-rows-[0fr]',
          )}
        >
          <nav className="min-h-0 space-y-2" aria-label="Principal móvil">
            {navigation.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="block rounded-2xl px-4 py-3 text-sm font-semibold text-white/70 hover:bg-white/10 hover:text-white"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {isLoading ? null : (
              <div className="grid gap-2 pt-2 sm:grid-cols-2">
                {user ? (
                  <>
                    <Link
                      to="/app"
                      className="rounded-full bg-gradient-to-r from-emerald-300 via-lime-200 to-amber-300 px-4 py-3 text-center text-sm font-bold text-slate-950"
                      onClick={() => setIsOpen(false)}
                    >
                      Mi red
                    </Link>
                    <button
                      type="button"
                      className="rounded-full border border-white/10 px-4 py-3 text-center text-sm font-semibold text-white/80"
                      onClick={handleSignOut}
                      disabled={isSigningOut}
                    >
                      {isSigningOut ? 'Saliendo...' : 'Salir'}
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/entrar"
                      className="rounded-full border border-white/10 px-4 py-3 text-center text-sm font-semibold text-white/80"
                      onClick={() => setIsOpen(false)}
                    >
                      Entrar
                    </Link>
                    <Link
                      to="/crear-cuenta"
                      className="rounded-full bg-gradient-to-r from-emerald-300 via-lime-200 to-amber-300 px-4 py-3 text-center text-sm font-bold text-slate-950"
                      onClick={() => setIsOpen(false)}
                    >
                      Crear cuenta
                    </Link>
                  </>
                )}
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
