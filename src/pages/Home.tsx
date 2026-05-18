import { CTASection } from '../components/sections/CTASection'
import { FeaturedProgramsSection } from '../components/sections/FeaturedProgramsSection'
import { HeroSection } from '../components/sections/HeroSection'
import { OpportunitiesSection } from '../components/sections/OpportunitiesSection'
import { StatsSection } from '../components/sections/StatsSection'
import { TestimonialsSection } from '../components/sections/TestimonialsSection'
import { UpcomingEventsSection } from '../components/sections/UpcomingEventsSection'

export function Home() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <FeaturedProgramsSection />
      <UpcomingEventsSection />
      <OpportunitiesSection />
      <TestimonialsSection />
      <CTASection />
    </>
  )
}
