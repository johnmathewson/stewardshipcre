import type { Metadata } from 'next'
import { Container } from '@/components/layout/Container'
import { FadeIn } from '@/components/motion/FadeIn'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { StaggerChildren, StaggerItem } from '@/components/motion/StaggerChildren'
import Link from 'next/link'
import { fetchPublishedListings, type Listing } from '@/lib/supabase'
import { PORTFOLIO } from '@/data/portfolio'

export const metadata: Metadata = {
  title: 'Properties | Stewardship CRE',
  description:
    'Browse available commercial real estate listings — office, retail, industrial, multifamily, and land in Northwest Indiana and Chicagoland.',
}

// Revalidate every 5 minutes so new listings appear quickly without a full deploy
export const revalidate = 300

// ─── Fallback: convert static portfolio data to the Listing shape ─────────────
function portfolioToListings(): Listing[] {
  return PORTFOLIO.map((p, i) => ({
    id: `static-${i}`,
    name: p.address,
    address: p.address,
    city: p.city,
    state: p.state,
    zip: null,
    asset_type: p.type.toLowerCase().replace('-', '_'),
    transaction_type: p.status === 'For Lease' ? 'lease' : 'sale',
    status: p.status === 'Sold' ? 'sold' : p.status === 'Leased' ? 'leased' : 'listed',
    asking_price: null,
    lease_rate: null,
    sqft: p.size ? parseInt(p.size.replace(/[^0-9]/g, '')) || null : null,
    acreage: null,
    year_built: p.year ? parseInt(p.year) || null : null,
    parking_spaces: null,
    parking_ratio: null,
    zoning: null,
    noi: null,
    cap_rate: null,
    price_per_sf: null,
    occupancy_pct: null,
    description: p.outcome || null,
    highlights: null,
    notes: null,
    crexi_url: null,
    publish_to_website: true,
    your_role: 'listing_broker',
    slug: p.slug,
    priceLabel: p.priceLabel,
    sizeLabel: p.size,
    locationLabel: `${p.city}, ${p.state}`,
    statusLabel: p.status,
    typeLabel: p.type,
  }))
}

const FILTER_TABS = ['All', 'Office', 'Retail', 'Industrial', 'Multifamily', 'Land', 'Mixed-Use']

function statusVariant(status: string | null | undefined): 'teal' | 'navy' | 'default' {
  if (!status) return 'default'
  const s = status.toLowerCase()
  if (s.includes('lease') || s.includes('coming')) return 'teal'
  if (s.includes('contract') || s.includes('pending')) return 'navy'
  return 'default'
}

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: { type?: string; intent?: string; location?: string }
}) {
  let listings: Listing[] = []
  let isLive = false

  try {
    const live = await fetchPublishedListings()
    if (live.length > 0) {
      listings = live
      isLive = true
    }
  } catch {
    // Supabase not configured — fall through to static data
  }

  if (!isLive) {
    listings = portfolioToListings()
  }

  const typeFilter = searchParams.type?.toLowerCase() || 'all'
  const filteredListings =
    typeFilter === 'all'
      ? listings
      : listings.filter(
          (l) =>
            l.asset_type?.toLowerCase().includes(typeFilter) ||
            l.typeLabel?.toLowerCase().includes(typeFilter)
        )

  const activeListings = filteredListings.filter(
    (l) => !['sold', 'leased'].includes(l.status || '')
  )
  const closedListings = filteredListings.filter((l) =>
    ['sold', 'leased'].includes(l.status || '')
  )

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-charcoal-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(224,122,95,0.06),transparent_60%)]" />
        <Container className="relative z-10">
          <FadeIn>
            <div className="flex items-center gap-4 mb-5">
              <div className="w-10 h-px bg-coral-400" />
              <span className="text-coral-400 text-xs tracking-[0.3em] uppercase font-semibold font-mono">
                Northwest Indiana · Chicagoland
              </span>
            </div>
            <h1
              className="font-heading text-cream-100 mb-4"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}
            >
              Available <span className="text-coral-400">Properties</span>
            </h1>
            <p className="text-charcoal-400 max-w-xl text-sm leading-relaxed">
              Browse our current inventory of commercial real estate listings across
              Northwest Indiana and the greater Chicagoland area.{' '}
              {isLive && (
                <span className="text-coral-400/70">
                  {activeListings.length} active listing{activeListings.length !== 1 ? 's' : ''}.
                </span>
              )}
            </p>
          </FadeIn>
        </Container>
      </section>

      {/* Filter Bar */}
      <section className="bg-charcoal-900 border-y border-charcoal-800 py-4 sticky top-[60px] z-30">
        <Container>
          <div className="flex flex-wrap items-center gap-3">
            {FILTER_TABS.map((tab) => {
              const isActive =
                tab === 'All' ? typeFilter === 'all' : typeFilter === tab.toLowerCase()
              const href =
                tab === 'All' ? '/properties' : `/properties?type=${tab.toLowerCase()}`
              return (
                <Link
                  key={tab}
                  href={href}
                  className={`px-4 py-2 text-xs tracking-[0.1em] uppercase font-semibold transition-all duration-300 ${
                    isActive
                      ? 'bg-coral-400 text-white'
                      : 'text-charcoal-400 hover:text-cream-100 border border-charcoal-700 hover:border-charcoal-500'
                  }`}
                >
                  {tab}
                </Link>
              )
            })}
            <div className="ml-auto text-xs text-charcoal-500 font-mono">
              {activeListings.length} listing{activeListings.length !== 1 ? 's' : ''}
            </div>
          </div>
        </Container>
      </section>

      {/* Active Listings Grid */}
      {activeListings.length > 0 && (
        <section className="py-section-sm bg-cream-100">
          <Container>
            <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeListings.map((listing) => (
                <StaggerItem key={listing.id}>
                  <Link href={`/properties/${listing.slug}`} className="block group">
                    <Card hover className="overflow-hidden h-full">
                      <div className="relative h-52 overflow-hidden bg-charcoal-900">
                        <div className="w-full h-full flex items-center justify-center text-charcoal-700">
                          <svg className="w-12 h-12 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/60 to-transparent" />
                        <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
                          <Badge variant={statusVariant(listing.statusLabel)}>
                            {listing.statusLabel}
                          </Badge>
                          {listing.typeLabel && <Badge>{listing.typeLabel}</Badge>}
                        </div>
                      </div>
                      <div className="p-5">
                        <h3 className="font-heading text-sm tracking-[0.1em] uppercase text-charcoal-900 mb-1 group-hover:text-coral-500 transition-colors line-clamp-2">
                          {listing.name || listing.address || 'Commercial Property'}
                        </h3>
                        <p className="text-xs text-charcoal-500 mb-3">
                          {listing.locationLabel || '—'}
                        </p>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-charcoal-500 mb-4">
                          {listing.sizeLabel && <span>{listing.sizeLabel}</span>}
                          {listing.zoning && <span>{listing.zoning}</span>}
                          {listing.year_built && <span>Built {listing.year_built}</span>}
                          {listing.cap_rate && (
                            <span className="text-coral-500 font-semibold">
                              {listing.cap_rate}% Cap
                            </span>
                          )}
                        </div>
                        {listing.highlights && listing.highlights.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-4">
                            {listing.highlights.slice(0, 2).map((h, i) => (
                              <span key={i} className="text-[10px] px-2 py-0.5 bg-charcoal-100 text-charcoal-600 rounded">
                                {h}
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="pt-3 border-t border-cream-300">
                          <span className="font-mono text-lg text-coral-500 font-semibold">
                            {listing.priceLabel}
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
      )}

      {activeListings.length === 0 && (
        <section className="py-section bg-cream-100">
          <Container>
            <div className="text-center py-20">
              <div className="text-6xl mb-6 opacity-30">🏢</div>
              <h3 className="font-heading text-charcoal-700 text-xl mb-3">No listings found</h3>
              <p className="text-charcoal-500 text-sm mb-8">
                {typeFilter !== 'all'
                  ? `No ${typeFilter} properties available right now.`
                  : 'New listings are added regularly. Check back soon or contact us directly.'}
              </p>
              <Link href="/contact" className="inline-block px-6 py-3 bg-coral-400 text-white text-sm font-semibold tracking-wide hover:bg-coral-500 transition-colors">
                Contact Us About Available Properties
              </Link>
            </div>
          </Container>
        </section>
      )}

      {closedListings.length > 0 && (
        <section className="py-section-sm bg-charcoal-950">
          <Container>
            <div className="flex items-center gap-4 mb-10">
              <div className="w-10 h-px bg-coral-400" />
              <span className="text-coral-400 text-xs tracking-[0.3em] uppercase font-semibold font-mono">
                Track Record
              </span>
            </div>
            <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {closedListings.map((listing) => (
                <StaggerItem key={listing.id}>
                  <div className="border border-charcoal-800 bg-charcoal-900 p-5 opacity-80">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <h3 className="font-heading text-xs tracking-[0.1em] uppercase text-cream-300">
                        {listing.name || listing.address}
                      </h3>
                      <Badge variant="default">{listing.statusLabel}</Badge>
                    </div>
                    <p className="text-xs text-charcoal-500 mb-2">{listing.locationLabel}</p>
                    {listing.typeLabel && <p className="text-xs text-charcoal-600">{listing.typeLabel}</p>}
                    {listing.priceLabel && listing.priceLabel !== 'Price Upon Request' && (
                      <p className="font-mono text-sm text-coral-400 font-semibold mt-3">{listing.priceLabel}</p>
                    )}
                    {listing.description && (
                      <p className="text-xs text-charcoal-500 mt-2 italic line-clamp-2">{listing.description}</p>
                    )}
                  </div>
                </StaggerItem>
              ))}
            </StaggerChildren>
          </Container>
        </section>
      )}

      <section className="py-16 bg-charcoal-950 border-t border-charcoal-800">
        <Container>
          <div className="text-center">
            <p className="text-charcoal-400 text-sm mb-2">Don&apos;t see what you&apos;re looking for?</p>
            <h3 className="font-heading text-cream-100 text-2xl mb-6">We have off-market opportunities.</h3>
            <Link href="/contact" className="inline-block px-8 py-3 bg-coral-400 text-white text-sm font-semibold tracking-wide hover:bg-coral-500 transition-colors">
              Tell Us What You Need
            </Link>
          </div>
        </Container>
      </section>
    </>
  )
}
