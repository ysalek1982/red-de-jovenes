import { ArrowRight, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'
import { buttonVariants } from '../ui/buttonVariants'

export function CTASection() {
  return (
    <section className="bg-brand-900 py-20 text-white">
      <div className="section-shell grid items-center gap-8 md:grid-cols-[1.4fr_0.6fr]">
        <div>
          <p className="text-sm font-semibold text-youth-100">Tu generación. Tu Red.</p>
          <h2 className="mt-3 text-3xl font-bold md:text-5xl">
            Sumate a una comunidad lista para construir futuro con propósito.
          </h2>
          <p className="mt-5 max-w-3xl text-base leading-8 text-brand-100">
            Dejamos la base preparada para integrar registro, autenticación y gestión de
            participantes en la siguiente fase.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
          <Link to="/contacto" className={buttonVariants({ variant: 'accent', size: 'lg' })}>
            <Mail className="h-5 w-5" aria-hidden="true" />
            Unirme a la Red
          </Link>
          <Link to="/dashboard" className={buttonVariants({ variant: 'outline', size: 'lg' })}>
            Ver dashboard
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}
