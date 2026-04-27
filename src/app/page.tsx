import { HeroSlideshow } from '@/components/sections/HeroSlideshow'
import { PropertySearch } from '@/components/sections/PropertySearch'
import { LiveStats } from '@/components/sections/LiveStats'
import { FeaturedListings } from '@/components/sections/FeaturedListings'
import { ServicesPinned } from '@/components/sections/ServicesPinned'
import { CaseStudies } from '@/components/sections/CaseStudies'
import { TeamPreview } from '@/components/sections/TeamPreview'
import { CTASection } from '@/components/sections/CTASection'

export default function HomePage() {
  return (
    <>
      <HeroSlideshow />
      <PropertySearch />
      <LiveStats />
      <FeaturedListings />
      <CaseStudies />
      <ServicesPinned />
      <TeamPreview />
      <CTASection />
    </>
  )
}
