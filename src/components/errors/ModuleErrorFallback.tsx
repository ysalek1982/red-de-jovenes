import { Link } from 'react-router-dom'

interface ModuleErrorFallbackProps {
  moduleName?: string
  onRetry: () => void
}

export function ModuleErrorFallback({
  moduleName = 'este modulo',
  onRetry,
}: ModuleErrorFallbackProps) {
  return (
    <section className="app-page">
      <div className="section-shell">
        <div className="mx-auto max-w-2xl rounded-2xl border border-amber-300/20 bg-amber-300/10 p-6 text-center shadow-2xl shadow-black/25 backdrop-blur">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-amber-200">
            Necesita recargarse
          </p>
          <h1 data-page-title className="mt-3 text-3xl font-black text-white">
            Algo fallo al cargar {moduleName}.
          </h1>
          <p className="mt-4 text-sm leading-6 text-white/65">
            Intenta nuevamente. Si el problema continua, avisa a un lider desde
            Ayudanos a mejorar.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onRetry}
              className="app-button-primary"
            >
              Reintentar
            </button>
            <Link to="/app" className="app-button-secondary">
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
