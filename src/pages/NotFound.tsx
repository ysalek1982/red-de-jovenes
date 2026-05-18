import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { buttonVariants } from '../components/ui/buttonVariants'

export function NotFound() {
  return (
    <section className="bg-white py-24">
      <div className="section-shell max-w-2xl text-center">
        <p className="text-sm font-semibold text-youth-700">Página no encontrada</p>
        <h1 className="mt-4 text-5xl font-bold text-brand-900">404</h1>
        <p className="mt-5 text-lg leading-8 text-slate-600">
          La ruta solicitada no existe o todavía no fue habilitada en la Red de Jóvenes.
        </p>
        <Link to="/" className={buttonVariants({ variant: 'primary', size: 'lg' }) + ' mt-8'}>
          <ArrowLeft className="h-5 w-5" aria-hidden="true" />
          Volver al inicio
        </Link>
      </div>
    </section>
  )
}
