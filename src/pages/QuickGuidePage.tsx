import {
  BookOpen,
  Gamepad2,
  Globe2,
  Heart,
  MessageCircle,
  PlusCircle,
  ShieldCheck,
  Smartphone,
  Sparkles,
  UserRound,
} from 'lucide-react'
import { Link } from 'react-router-dom'

const guideSections = [
  {
    title: 'Lee la Biblia',
    text: 'Busca un versiculo, lee un capitulo o guarda una Palabra para volver a ella despues.',
    to: '/app/biblia',
    action: 'Abrir Biblia',
    icon: BookOpen,
  },
  {
    title: 'Ora con la Red',
    text: 'Pide oracion por algo concreto o acompana a otro joven marcando "Estoy orando".',
    to: '/app/oracion',
    action: 'Ir a oracion',
    icon: Heart,
  },
  {
    title: 'Comparte en Foros',
    text: 'Publica una reflexion, una pregunta, un testimonio o una palabra de animo.',
    to: '/app/foros',
    action: 'Abrir Foros',
    icon: MessageCircle,
  },
  {
    title: 'Juega y aprende',
    text: 'Elige un juego de fe. Al terminar, tu puntaje queda guardado en tu progreso.',
    to: '/app/juegos',
    action: 'Jugar',
    icon: Gamepad2,
  },
  {
    title: 'Encuentra comunidad',
    text: 'Busca tu ciudad, unete a una comunidad o sugiere una si todavia no aparece.',
    to: '/app/mapa',
    action: 'Ver mapa',
    icon: Globe2,
  },
  {
    title: 'Completa tu perfil',
    text: 'Agrega ciudad, pais, iglesia, bio y avatar para que otros jovenes sepan como conectar contigo.',
    to: '/app/perfil',
    action: 'Editar perfil',
    icon: UserRound,
  },
]

export function QuickGuidePage() {
  return (
    <section className="app-page">
      <div className="section-shell">
        <div className="grid gap-6 lg:grid-cols-[0.86fr_1.14fr] lg:items-end">
          <div>
            <p className="app-kicker">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Guia rapida
            </p>
            <h1 data-page-title className="mt-5 text-4xl font-black tracking-tight md:text-6xl">
              Primeros pasos en Red de Jóvenes
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-white/68">
              Esta guia te ayuda a empezar sin perderte. Haz un paso sencillo:
              lee, ora, comparte, juega o encuentra comunidad.
            </p>
          </div>

          <article className="app-card-accent">
            <p className="text-sm font-semibold text-amber-100">
              Para el piloto cerrado
            </p>
            <h2 className="mt-2 text-2xl font-black">
              Tu feedback nos ayuda a cuidar mejor esta Red.
            </h2>
            <p className="mt-3 text-sm leading-6 text-white/65">
              Si algo no funciona o no se entiende, usa "Ayudanos a mejorar"
              desde Perfil o el menu Mas.
            </p>
          </article>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {guideSections.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.to}
                to={item.to}
                className="app-card transition hover:-translate-y-1 hover:bg-white/[0.1]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-300/20 to-amber-300/20 text-amber-200 ring-1 ring-white/10">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h2 className="mt-5 text-xl font-black">{item.title}</h2>
                <p className="mt-2 text-sm leading-6 text-white/62">
                  {item.text}
                </p>
                <span className="mt-5 inline-flex text-sm font-bold text-amber-200">
                  {item.action}
                </span>
              </Link>
            )
          })}
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          <article className="app-card-soft">
            <ShieldCheck className="h-6 w-6 text-emerald-200" aria-hidden="true" />
            <h2 className="mt-4 text-xl font-black">Reportar con respeto</h2>
            <p className="mt-2 text-sm leading-6 text-white/62">
              Si ves algo inapropiado, usa los botones de reportar o avisar a
              un lider. No es para acusar; es para cuidar la comunidad.
            </p>
          </article>
          <article className="app-card-soft">
            <Smartphone className="h-6 w-6 text-amber-200" aria-hidden="true" />
            <h2 className="mt-4 text-xl font-black">Instalar como app</h2>
            <p className="mt-2 text-sm leading-6 text-white/62">
              Si tu navegador lo permite, usa el boton de instalar. Si no
              aparece, abre el menu del navegador y busca "Agregar a pantalla de
              inicio".
            </p>
          </article>
          <article className="app-card-soft">
            <PlusCircle className="h-6 w-6 text-sky-200" aria-hidden="true" />
            <h2 className="mt-4 text-xl font-black">Construir la Red</h2>
            <p className="mt-2 text-sm leading-6 text-white/62">
              Puedes invitar a un amigo, sugerir una comunidad, proponer un
              evento o enviar una mejora para el piloto.
            </p>
            <Link to="/app/construir" className="mt-4 inline-flex text-sm font-bold text-amber-200">
              Ir a Construir
            </Link>
          </article>
        </div>
      </div>
    </section>
  )
}
