import { ArrowRight, Building2, CalendarClock, MapPin } from 'lucide-react'
import type { Opportunity } from '../../data/mockData'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Card } from '../ui/card'

interface OpportunityCardProps {
  opportunity: Opportunity
}

export function OpportunityCard({ opportunity }: OpportunityCardProps) {
  return (
    <Card className="flex h-full flex-col p-6">
      <div className="flex-1 space-y-4">
        <Badge variant="youth">{opportunity.type}</Badge>
        <div>
          <h3 className="text-xl font-bold text-brand-900">{opportunity.title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {opportunity.summary}
          </p>
        </div>
        <div className="grid gap-2 text-sm text-slate-600">
          <span className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-brand-700" aria-hidden="true" />
            {opportunity.organization}
          </span>
          <span className="flex items-center gap-2">
            <CalendarClock className="h-4 w-4 text-brand-700" aria-hidden="true" />
            Cierre: {opportunity.deadline}
          </span>
          <span className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-brand-700" aria-hidden="true" />
            {opportunity.location}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {opportunity.tags.map((tag) => (
            <Badge key={tag} variant="default">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
      <Button type="button" variant="secondary" className="mt-6">
        Ver requisitos
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Button>
    </Card>
  )
}
