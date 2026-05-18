import { Globe2, Mail, MapPin, MessageCircle, Network, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'

const footerLinks = [
  { label: 'Programas', href: '/programas' },
  { label: 'Eventos', href: '/eventos' },
  { label: 'Oportunidades', href: '/oportunidades' },
  { label: 'Contacto', href: '/contacto' },
]

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-brand-900 text-white">
      <div className="section-shell grid gap-10 py-12 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div className="space-y-4">
          <div className="flex items-center gap-3 font-bold">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-youth-600">
              <Network className="h-5 w-5" aria-hidden="true" />
            </span>
            <span>Red de Jóvenes</span>
          </div>
          <p className="max-w-xl text-sm leading-6 text-brand-100">
            Comunidad juvenil para conectar talentos, activar servicio, formar liderazgo y abrir
            oportunidades con propósito.
          </p>
          <div className="flex gap-2">
            <a
              href="#"
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-white hover:bg-white/20"
              aria-label="Instagram"
            >
              <MessageCircle className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-white hover:bg-white/20"
              aria-label="Facebook"
            >
              <Globe2 className="h-5 w-5" />
            </a>
            <a
              href="mailto:hola@reddejovenes.org"
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-white hover:bg-white/20"
              aria-label="Correo electrónico"
            >
              <Mail className="h-5 w-5" />
            </a>
          </div>
        </div>

        <div>
          <h2 className="text-base font-semibold">Navegación</h2>
          <ul className="mt-4 space-y-3 text-sm text-brand-100">
            {footerLinks.map((item) => (
              <li key={item.href}>
                <Link className="hover:text-white" to={item.href}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-base font-semibold">Contacto institucional</h2>
          <ul className="mt-4 space-y-3 text-sm text-brand-100">
            <li className="flex gap-2">
              <MapPin className="mt-0.5 h-4 w-4" aria-hidden="true" />
              Santa Cruz de la Sierra, Bolivia
            </li>
            <li className="flex gap-2">
              <Mail className="mt-0.5 h-4 w-4" aria-hidden="true" />
              hola@reddejovenes.org
            </li>
            <li className="flex gap-2">
              <Phone className="mt-0.5 h-4 w-4" aria-hidden="true" />
              +591 700 00000
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-sm text-brand-100">
        © 2026 Red de Jóvenes. Plataforma en desarrollo.
      </div>
    </footer>
  )
}
