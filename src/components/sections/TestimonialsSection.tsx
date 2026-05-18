import { TestimonialCard } from '../cards/TestimonialCard'
import { testimonials } from '../../data/mockData'
import { SectionHeading } from './SectionHeading'

export function TestimonialsSection() {
  return (
    <section className="bg-white py-20">
      <div className="section-shell">
        <SectionHeading
          eyebrow="Historias juveniles"
          title="Voces que muestran el impacto"
          description="La Red crece cuando cada joven encuentra un lugar para aportar, aprender y caminar con otros."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  )
}
