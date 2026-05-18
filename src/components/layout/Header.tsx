import { Menu, Network, X } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { cn } from '../../lib/utils'
import { buttonVariants } from '../ui/buttonVariants'

const navigation = [
  { label: 'Inicio', href: '/' },
  { label: 'Sobre la Red', href: '/sobre-la-red' },
  { label: 'Eventos', href: '/eventos' },
  { label: 'Programas', href: '/programas' },
  { label: 'Oportunidades', href: '/oportunidades' },
  { label: 'Contacto', href: '/contacto' },
]

function navClassName({ isActive }: { isActive: boolean }) {
  return cn(
    'rounded-lg px-3 py-2 text-sm font-semibold transition-colors',
    isActive
      ? 'bg-brand-50 text-brand-800'
      : 'text-slate-700 hover:bg-slate-100 hover:text-brand-800',
  )
}

export function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="section-shell flex h-16 items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-3 font-bold text-brand-900"
          onClick={() => setIsOpen(false)}
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-800 text-white">
            <Network className="h-5 w-5" aria-hidden="true" />
          </span>
          <span>Red de Jóvenes</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Principal">
          {navigation.map((item) => (
            <NavLink key={item.href} to={item.href} className={navClassName}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              cn(
                buttonVariants({ variant: isActive ? 'primary' : 'secondary', size: 'sm' }),
              )
            }
          >
            Dashboard
          </NavLink>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 lg:hidden"
          aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((current) => !current)}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {isOpen ? (
        <div className="border-t border-slate-200 bg-white lg:hidden">
          <nav className="section-shell grid gap-1 py-4" aria-label="Principal móvil">
            {navigation.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                className={navClassName}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                cn(
                  buttonVariants({
                    variant: isActive ? 'primary' : 'secondary',
                    size: 'md',
                  }),
                  'mt-2',
                )
              }
              onClick={() => setIsOpen(false)}
            >
              Dashboard
            </NavLink>
          </nav>
        </div>
      ) : null}
    </header>
  )
}
