import {
  Compass,
  HeartHandshake,
  Lightbulb,
  ShieldCheck,
  Target,
  Users,
} from 'lucide-react'
import { PageHeader } from '../components/layout/PageHeader'
import { Card } from '../components/ui/card'

const objectives = [
  'Conectar jóvenes con programas, eventos y oportunidades verificadas.',
  'Impulsar liderazgo juvenil desde valores, servicio y participación activa.',
  'Fortalecer alianzas entre organizaciones, iglesias, centros educativos y comunidades.',
]

const principles = [
  'Propósito',
  'Servicio',
  'Comunidad',
  'Confianza',
  'Participación',
  'Aprendizaje continuo',
]

const benefits = [
  'Acceso a programas de formación y mentorías.',
  'Participación en actividades comunitarias y espacios de liderazgo.',
  'Visibilidad de oportunidades de becas, cursos, voluntariados y empleabilidad.',
  'Acompañamiento para convertir ideas juveniles en proyectos concretos.',
]

const focusCards = [
  {
    title: 'Misión',
    text: 'Conectar y acompañar a jóvenes para que descubran su propósito, desarrollen capacidades y sirvan a sus comunidades.',
    icon: Target,
  },
  {
    title: 'Visión',
    text: 'Ser una red juvenil referente por su impacto formativo, social y espiritual en ciudades y comunidades de Bolivia.',
    icon: Compass,
  },
  {
    title: 'Público objetivo',
    text: 'Jóvenes de 15 a 29 años, líderes juveniles, voluntarios, estudiantes, emprendedores y equipos comunitarios.',
    icon: Users,
  },
]

export function About() {
  return (
    <>
      <PageHeader
        eyebrow="Sobre la Red"
        title="Una comunidad preparada para acompañar el crecimiento juvenil"
        description="La Red de Jóvenes organiza formación, actividades, voluntariado y oportunidades en una experiencia clara, confiable y escalable."
      />

      <section className="bg-slate-50 py-16">
        <div className="section-shell grid gap-6 md:grid-cols-3">
          {focusCards.map((item) => {
            const Icon = item.icon
            return (
              <Card key={item.title} className="p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-50 text-brand-800">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h2 className="mt-5 text-xl font-bold text-brand-900">{item.title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">{item.text}</p>
              </Card>
            )
          })}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="section-shell grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-semibold text-youth-700">Objetivos</p>
            <h2 className="mt-3 text-3xl font-bold text-brand-900">
              Activar participación con estructura y seguimiento
            </h2>
          </div>
          <div className="grid gap-4">
            {objectives.map((objective) => (
              <div key={objective} className="flex gap-4 rounded-lg border border-slate-200 bg-slate-50 p-5">
                <Lightbulb className="mt-1 h-5 w-5 flex-none text-youth-600" aria-hidden="true" />
                <p className="text-slate-700">{objective}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="section-shell grid gap-10 lg:grid-cols-2">
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-6 w-6 text-brand-700" aria-hidden="true" />
              <h2 className="text-2xl font-bold text-brand-900">Principios</h2>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {principles.map((principle) => (
                <span
                  key={principle}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700"
                >
                  {principle}
                </span>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3">
              <HeartHandshake className="h-6 w-6 text-youth-600" aria-hidden="true" />
              <h2 className="text-2xl font-bold text-brand-900">Beneficios para jóvenes</h2>
            </div>
            <ul className="mt-6 space-y-4">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex gap-3 text-sm leading-6 text-slate-700">
                  <span className="mt-2 h-2 w-2 flex-none rounded-sm bg-youth-600" />
                  {benefit}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </section>
    </>
  )
}
