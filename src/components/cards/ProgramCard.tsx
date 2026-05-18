import { ArrowRight, Clock, Monitor, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Program } from '../../data/mockData'
import { Badge } from '../ui/badge'
import { buttonVariants } from '../ui/buttonVariants'
import { Card } from '../ui/card'

interface ProgramCardProps {
  program: Program
}

export function ProgramCard({ program }: ProgramCardProps) {
  return (
    <Card className="overflow-hidden">
      <img
        src={program.image}
        alt=""
        className="h-44 w-full object-cover"
        loading="lazy"
      />
      <div className="space-y-4 p-6">
        <Badge variant="brand">{program.category}</Badge>
        <div>
          <h3 className="text-xl font-bold text-brand-900">{program.title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{program.summary}</p>
        </div>
        <div className="grid gap-2 text-sm text-slate-600">
          <span className="flex items-center gap-2">
            <Users className="h-4 w-4 text-youth-600" aria-hidden="true" />
            {program.participants} participantes
          </span>
          <span className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-youth-600" aria-hidden="true" />
            {program.duration}
          </span>
          <span className="flex items-center gap-2">
            <Monitor className="h-4 w-4 text-youth-600" aria-hidden="true" />
            Modalidad {program.modality.toLowerCase()}
          </span>
        </div>
        <Link
          to="/programas"
          className={buttonVariants({ variant: 'secondary', size: 'sm' })}
        >
          Ver programa
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </Card>
  )
}
