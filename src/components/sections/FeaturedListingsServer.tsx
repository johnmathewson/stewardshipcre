/**
 * FeaturedListingsServer
 *
 * Server component wrapper that fetches live listings from Supabase and
 * passes them to the client-side FeaturedListings component (which uses
 * framer-motion scroll effects and must remain a client component).
 *
 * Falls back to the static PORTFOLIO data if Supabase is not configured
 * or returns no results.
 */
import { fetchFeaturedListings, type Listing } from '@/lib/supabase'
import { PORTFOLIO } from '@/data/portfolio'
import { FeaturedListingsClient } from './FeaturedListingsClient'

// Revalidate every 5 minutes
export const revalidate = 300

function portfolioAsListings(): Listing[] {
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
    year_built: null,
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
    // Use the Unsplash image from the static data as a fallback image URL
    // stored in a non-schema field for display purposes only
    _image: (p as any).image || null,
  } as Listing & { _image?: string })
  )
}

export async function FeaturedListingsServer() {
  let listings: (Listing & { _image?: string })[] = []

  try {
    const live = await fetchFeaturedListings(7)
    if (live.length > 0) {
      // Map first stored image (sorted by `order`) into _image so the client
      // component's existing image-resolution path picks up real CRM photos
      // before falling through to local /hero/* fallbacks.
      listings = live.map((l) => {
        const imgs = (l as Listing & { images?: { url?: string; order?: number }[] | null }).images
        const sorted = Array.isArray(imgs)
          ? [...imgs].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
          : []
        const firstUrl = sorted[0]?.url
        return firstUrl ? { ...l, _image: firstUrl } : { ...l }
      })
    }
  } catch {
    // Supabase not configured — fall through to static data
  }

  if (listings.length === 0) {
    listings = portfolioAsListings()
  }

  return <FeaturedListingsClient listings={listings} />
}
