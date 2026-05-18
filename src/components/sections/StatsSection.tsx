import { Activity, Handshake, Layers, Users } from 'lucide-react'
import { stats } from '../../data/mockData'
import { Card } from '../ui/card'

const icons = [Users, Activity, Handshake, Layers]

export function StatsSection() {
  return (
    <section className="bg-white py-16">
      <div className="section-shell grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = icons[index]
          return (
            <Card key={stat.label} className="p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-youth-50 text-youth-700">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <p className="mt-5 text-3xl font-bold text-brand-900">{stat.value}</p>
              <h3 className="mt-2 font-semibold text-slate-900">{stat.label}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{stat.description}</p>
            </Card>
          )
        })}
      </div>
    </section>
  )
}
