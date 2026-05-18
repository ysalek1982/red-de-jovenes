import { useEffect, useState } from 'react'
import {
  BookOpen,
  FileText,
  Heart,
  Loader2,
  MessageCircle,
  ShieldCheck,
  Users,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { hasRole } from '../features/auth/roleService'

const adminCards = [
  {
    title: 'Usuarios',
    text: 'Revisión inicial de perfiles y participación.',
    icon: Users,
  },
  {
    title: 'Oraciones',
    text: 'Moderación futura de peticiones públicas.',
    icon: Heart,
  },
  {
    title: 'Publicaciones',
    text: 'Supervisión de posts y conversaciones.',
    icon: MessageCircle,
  },
  {
    title: 'Devocionales',
    text: 'Gestión futura de contenido devocional.',
    icon: BookOpen,
  },
  {
    title: 'Testimonios',
    text: 'Aprobación futura de historias compartidas.',
    icon: FileText,
  },
]

export function AdminHome() {
  const [isLoading, setIsLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      hasRole('admin')
        .then(setIsAdmin)
        .catch(() => setIsAdmin(false))
        .finally(() => setIsLoading(false))
    }, 0)

    return () => window.clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 px-4 pb-16 pt-32 text-white">
        <div className="section-shell flex items-center gap-3 text-white/70">
          <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
          Verificando permisos...
        </div>
      </section>
    )
  }

  if (!isAdmin) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 px-4 pb-16 pt-32 text-white">
        <div className="section-shell">
          <div className="rounded-[2rem] border border-amber-300/20 bg-amber-300/10 p-8 shadow-2xl shadow-black/25 backdrop-blur">
            <ShieldCheck className="h-10 w-10 text-amber-200" aria-hidden="true" />
            <h1 className="mt-5 text-4xl font-black">No autorizado</h1>
            <p className="mt-4 max-w-xl text-white/70">
              Este módulo está reservado para administradores de Red de Jóvenes.
            </p>
            <Link
              to="/app"
              className="mt-7 inline-flex h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-bold text-slate-950 transition hover:bg-amber-100"
            >
              Volver a mi red
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 px-4 pb-16 pt-32 text-white">
      <div className="pointer-events-none fixed right-0 top-24 h-96 w-96 rounded-full bg-amber-300/10 blur-3xl" />
      <div className="section-shell relative">
        <div className="max-w-3xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-amber-200 backdrop-blur">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            Administración
          </p>
          <h1 className="mt-5 text-4xl font-black tracking-tight md:text-6xl">
            Panel de administración
          </h1>
          <p className="mt-4 text-lg leading-8 text-white/70">
            Gestión inicial de Red de Jóvenes.
          </p>
        </div>

        <div className="mt-10 rounded-[2rem] border border-white/10 bg-white/[0.07] p-6 shadow-2xl shadow-black/25 backdrop-blur">
          <p className="text-lg font-semibold text-white">
            Módulo administrativo en preparación.
          </p>
          <p className="mt-2 text-sm text-white/60">
            Esta pantalla solo habilita la base visual y de permisos para crecer
            el módulo administrativo más adelante.
          </p>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {adminCards.map((card) => {
            const Icon = card.icon
            return (
              <article
                key={card.title}
                className="rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-black/20 backdrop-blur"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-300/20 to-amber-300/20 text-amber-200 ring-1 ring-white/10">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h2 className="mt-5 text-lg font-bold">{card.title}</h2>
                <p className="mt-2 text-sm leading-6 text-white/60">
                  {card.text}
                </p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
