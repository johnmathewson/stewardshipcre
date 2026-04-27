import type { Metadata } from 'next'
import { Container } from '@/components/layout/Container'
import { FadeIn } from '@/components/motion/FadeIn'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { StaggerChildren, StaggerItem } from '@/components/motion/StaggerChildren'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Properties',
  description: 'Browse available commercial real estate listings — office, retail, industrial, multifamily, and land in Northwest Indiana and Chicagoland.',
}

const SAMPLE_PROPERTIES = [
  {
    slug: '53-w-jefferson-joliet',
    title: '53 W Jefferson Street',
    location: 'Joliet, IL',
    type: 'Mixed-Use',
    listingType: 'For Sale',
    price: '$450,000',
    size: '8,500 SF',
    lotSize: '0.25 AC',
    zoning: 'B-2 Commercial',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=500&fit=crop',
  },
  {
    slug: '156-s-flynn-rd-westville',
    title: '156 S Flynn Road',
    location: 'Westville, IN',
    type: 'Industrial',
    listingType: 'For Sale',
    price: '$275,000',
    size: '12,000 SF',
    lotSize: '2.5 AC',
    zoning: 'Industrial',
    image: 'https://images.unsplash.com/photo-1565610222536-ef125c59da2e?w=800&h=500&fit=crop',
  },
  {
    slug: 'downtown-valparaiso-retail',
    title: 'Downtown Retail Space',
    location: 'Valparaiso, IN',
    type: 'Retail',
    listingType: 'For Lease',
    price: '$18/SF/yr NNN',
    size: '3,200 SF',
    lotSize: null,
    zoning: 'C-3 Downtown',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=500&fit=crop',
  },
  {
    slug: 'crown-point-office',
    title: 'Professional Office Building',
    location: 'Crown Point, IN',
    type: 'Office',
    listingType: 'For Lease',
    price: '$22/SF/yr Gross',
    size: '5,800 SF',
    lotSize: '0.75 AC',
    zoning: 'Professional Office',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=500&fit=crop',
  },
  {
    slug: 'portage-development-land',
    title: 'Development Parcel',
    location: 'Portage, IN',
    type: 'Land',
    listingType: 'For Sale',
    price: '$180,000',
    size: null,
    lotSize: '5.0 AC',
    zoning: 'R-3 Residential',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=500&fit=crop',
  },
  {
    slug: 'merrillville-multifamily',
    title: '12-Unit Apartment Complex',
    location: 'Merrillville, IN',
    type: 'Multifamily',
    listingType: 'For Sale',
    price: '$950,000',
    size: '14,400 SF',
    lotSize: '1.2 AC',
    zoning: 'R-4 Multi-Family',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=500&fit=crop',
  },
]

export default function PropertiesPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-charcoal-950 pt-32 pb-12">
        <Container>
          <FadeIn>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-px bg-gold-500" />
              <span className="text-gold-500 text-xs tracking-[0.3em] uppercase font-semibold">Listings</span>
            </div>
            <h1
              className="font-heading text-cream-100 mb-4"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}
            >
              Available <span className="text-gold-500">Properties</span>
            </h1>
            <p className="text-charcoal-400 max-w-xl">
              Browse our current inventory of commercial real estate listings across
              Northwest Indiana and the greater Chicagoland area.
            </p>
          </FadeIn>
        </Container>
      </section>

      {/* Filter Bar */}
      <section className="bg-charcoal-900 border-y border-charcoal-800 py-4 sticky top-[60px] z-30">
        <Container>
          <div className="flex flex-wrap items-center gap-3">
            {['All', 'Office', 'Retail', 'Industrial', 'Multifamily', 'Land'].map((type, i) => (
              <button
                key={type}
                className={`px-4 py-2 text-xs tracking-[0.1em] uppercase font-semibold transition-all duration-300 ${
                  i === 0
                    ? 'bg-gold-500 text-charcoal-950'
                    : 'text-charcoal-400 hover:text-cream-100 border border-charcoal-700 hover:border-charcoal-500'
                }`}
              >
                {type}
              </button>
            ))}
            <div className="ml-auto flex gap-2">
              <button className="p-2 border border-charcoal-700 text-cream-300 hover:border-gold-500 transition-colors" aria-label="Grid view">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button className="p-2 border border-charcoal-700 text-charcoal-500 hover:border-gold-500 hover:text-cream-300 transition-colors" aria-label="Map view">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </button>
            </div>
          </div>
        </Container>
      </section>

      {/* Listings Grid */}
      <section className="py-section-sm bg-cream-100">
        <Container>
          <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SAMPLE_PROPERTIES.map((property) => (
              <StaggerItem key={property.slug}>
                <Link href={`/properties/${property.slug}`} className="block group">
                  <Card hover className="overflow-hidden h-full">
                    <div className="relative h-52 overflow-hidden">
                      <img
                        src={property.image}
                        alt={property.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/60 to-transparent" />
                      <div className="absolute top-3 left-3 flex gap-2">
                        <Badge variant="teal">{property.listingType}</Badge>
                        <Badge>{property.type}</Badge>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-heading text-sm tracking-[0.1em] uppercase text-charcoal-900 mb-1 group-hover:text-gold-600 transition-colors">
                        {property.title}
                      </h3>
                      <p className="text-xs text-charcoal-500 mb-3">{property.location}</p>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-charcoal-500 mb-4">
                        {property.size && <span>{property.size}</span>}
                        {property.lotSize && <span>{property.lotSize}</span>}
                        {property.zoning && <span>{property.zoning}</span>}
                      </div>
                      <div className="pt-3 border-t border-cream-300">
                        <span className="font-mono text-lg text-gold-600 font-semibold">
                          {property.price}
                        </span>
                      </div>
                    </div>
                  </Card>
                </Link>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </Container>
      </section>
    </>
  )
}
