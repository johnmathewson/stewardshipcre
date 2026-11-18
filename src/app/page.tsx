import { HeroSlideshow } from '@/components/sections/HeroSlideshow'
import { PropertySearch } from '@/components/sections/PropertySearch'
import { LiveStats } from '@/components/sections/LiveStats'
import { FeaturedListingsServer as FeaturedListings } from '@/components/sections/FeaturedListingsServer'
import { ServicesPinned } from '@/components/sections/ServicesPinned'
import { MasterLease } from '@/components/sections/MasterLease'
import { CaseStudies } from '@/components/sections/CaseStudies'
import { TeamPreview } from '@/components/sections/TeamPreview'
import { CTASection } from '@/components/sections/CTASection'
import { LISTINGS_ON_SITE } from '@/lib/site-flags'

export default function HomePage() {
  return (
    <>
      <HeroSlideshow />
      {LISTINGS_ON_SITE && <PropertySearch />}
      <LiveStats />
      {LISTINGS_ON_SITE && <FeaturedListings />}
      <CaseStudies />
      <ServicesPinned />
      <MasterLease />
      <TeamPreview />
      <CTASection />
    </>
  )
}
