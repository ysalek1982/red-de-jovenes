import { Quote } from 'lucide-react'
import type { Testimonial } from '../../data/mockData'
import { Card } from '../ui/card'

interface TestimonialCardProps {
  testimonial: Testimonial
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  const initials = testimonial.name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)

  return (
    <Card className="p-6">
      <Quote className="h-8 w-8 text-youth-600" aria-hidden="true" />
      <blockquote className="mt-4 text-base leading-7 text-slate-700">
        “{testimonial.quote}”
      </blockquote>
      <div className="mt-6 flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-50 font-bold text-brand-800">
          {initials}
        </span>
        <div>
          <p className="font-semibold text-brand-900">{testimonial.name}</p>
          <p className="text-sm text-slate-500">
            {testimonial.age} años · {testimonial.city} · {testimonial.role}
          </p>
        </div>
      </div>
    </Card>
  )
}
