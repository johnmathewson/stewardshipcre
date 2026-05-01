import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Guard: only create a real client if env vars are present
// (prevents build-time crashes when Supabase is not configured)
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null as any

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ListingImage {
  url: string
  alt?: string
  order: number
}

export interface Listing {
  id: string
  // CRM-managed slug (from migration 0004). Always present on real rows.
  slug?: string | null
  name: string
  // Marketing-friendly title shown on the public listing page (separate from internal name).
  headline?: string | null
  address: string | null
  city: string | null
  state: string | null
  zip: string | null
  asset_type: string | null
  transaction_type: string | null
  status: string | null
  asking_price: number | null
  lease_rate: number | null
  sqft: number | null
  acreage: number | null
  year_built: number | null
  parking_spaces: number | null
  parking_ratio: string | null
  zoning: string | null
  noi: number | null
  cap_rate: number | null
  price_per_sf: number | null
  occupancy_pct: number | null
  description: string | null
  highlights: string[] | null
  images?: ListingImage[] | null
  notes: string | null
  crexi_url: string | null
  publish_to_website: boolean | null
  your_role: string | null
  // Display helpers (computed by enrichListing)
  priceLabel?: string
  sizeLabel?: string
  locationLabel?: string
  statusLabel?: string
  typeLabel?: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function formatListingPrice(listing: Listing): string {
  if (listing.transaction_type === 'lease' || listing.transaction_type === 'sale_or_lease') {
    if (listing.lease_rate) return `$${listing.lease_rate.toFixed(2)} / SF / yr`
  }
  if (listing.asking_price) {
    const p = listing.asking_price
    if (p >= 1_000_000) return `$${(p / 1_000_000).toFixed(2).replace(/\.?0+$/, '')}M`
    if (p >= 1_000) return `$${(p / 1_000).toFixed(0)}K`
    return `$${p.toLocaleString()}`
  }
  return 'Price Upon Request'
}

export function formatListingStatus(listing: Listing): string {
  const map: Record<string, string> = {
    listed: 'For Sale',
    for_lease: 'For Lease',
    pre_listing: 'Coming Soon',
    under_contract: 'Under Contract',
    sold: 'Sold',
    leased: 'Leased',
    off_market: 'Off Market',
  }
  if (listing.transaction_type === 'lease' && listing.status === 'listed') return 'For Lease'
  if (listing.transaction_type === 'sale_or_lease' && listing.status === 'listed') return 'For Sale or Lease'
  return map[listing.status || ''] || listing.status || 'Active'
}

export function formatAssetType(type: string | null): string {
  if (!type) return 'Commercial'
  const map: Record<string, string> = {
    retail: 'Retail',
    office: 'Office',
    industrial: 'Industrial',
    multifamily: 'Multifamily',
    hotel: 'Hotel / Hospitality',
    land: 'Land',
    mixed_use: 'Mixed-Use',
    restaurant: 'Restaurant',
    medical: 'Medical / Healthcare',
    flex: 'Flex / R&D',
  }
  return map[type] || type.replace(/_/g, ' ')
}

// Fallback slug generator for rows that somehow have no DB slug (shouldn't happen
// after migration 0004 but defensive).
export function listingToSlug(listing: Listing): string {
  if (listing.slug) return listing.slug
  const parts = [
    listing.address || listing.name || 'property',
    listing.city,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
  return `${parts}-${listing.id.slice(0, 8)}`
}

export function primaryImageUrl(listing: Listing): string | null {
  // Defensive: jsonb column may come back as null OR a non-array if a
  // malformed write happened. Treat anything that isn't an array as empty.
  if (!Array.isArray(listing.images) || listing.images.length === 0) return null
  const sorted = [...listing.images].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  return sorted[0]?.url || null
}

export function enrichListing(listing: Listing): Listing {
  return {
    ...listing,
    slug: listingToSlug(listing),
    priceLabel: formatListingPrice(listing),
    sizeLabel: listing.sqft ? `${listing.sqft.toLocaleString()} SF` : listing.acreage ? `${listing.acreage} AC` : null,
    locationLabel: [listing.city, listing.state].filter(Boolean).join(', '),
    statusLabel: formatListingStatus(listing),
    typeLabel: formatAssetType(listing.asset_type),
  } as Listing
}

// ─── Data Fetching ────────────────────────────────────────────────────────────

/**
 * Fetch all active, website-published listings from the CRM.
 * Used by the /properties page (server component).
 */
export async function fetchPublishedListings(filters?: {
  assetType?: string
  transactionType?: string
  status?: string
}): Promise<Listing[]> {
  if (!supabase) return []
  let query = supabase
    .from('properties')
    .select(`
      id, slug, name, headline, address, city, state, zip,
      asset_type, transaction_type, status,
      asking_price, lease_rate, sqft, acreage,
      year_built, parking_spaces, parking_ratio, zoning,
      noi, cap_rate, price_per_sf, occupancy_pct,
      description, highlights, images, notes, crexi_url,
      publish_to_website, your_role
    `)
    .eq('publish_to_website', true)
    .not('status', 'in', '("sold","leased","off_market")')
    .order('status', { ascending: true })
    .order('asking_price', { ascending: false })

  if (filters?.assetType && filters.assetType !== 'all') {
    query = query.eq('asset_type', filters.assetType)
  }
  if (filters?.transactionType && filters.transactionType !== 'all') {
    query = query.eq('transaction_type', filters.transactionType)
  }

  const { data, error } = await query

  if (error) {
    console.error('fetchPublishedListings error:', error)
    return []
  }

  return (data || []).map((d: Record<string, unknown>) => enrichListing(d as unknown as Listing))
}

/**
 * Fetch all sold/leased transactions for the portfolio/track record section.
 */
export async function fetchClosedTransactions(): Promise<Listing[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('properties')
    .select(`
      id, slug, name, headline, address, city, state, zip,
      asset_type, transaction_type, status,
      asking_price, lease_rate, sqft, acreage,
      year_built, description, highlights, images,
      publish_to_website, your_role
    `)
    .in('status', ['sold', 'leased'])
    .eq('publish_to_website', true)
    .order('asking_price', { ascending: false })
    .limit(20)

  if (error) {
    console.error('fetchClosedTransactions error:', error)
    return []
  }

  return (data || []).map((d: Record<string, unknown>) => enrichListing(d as unknown as Listing))
}

/**
 * Fetch a single listing by its DB slug column (migration 0004).
 * Falls back to legacy id-prefix matching for any pre-migration links.
 */
export async function fetchListingBySlug(slug: string): Promise<Listing | null> {
  if (!supabase) return null

  // Primary: query by slug column.
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('slug', slug)
    .eq('publish_to_website', true)
    .maybeSingle()

  if (!error && data) return enrichListing(data as Listing)

  // Legacy fallback: support old slug format ending in 8-char id prefix.
  const tail = slug.split('-').pop()
  if (tail && /^[0-9a-f]{8}$/.test(tail)) {
    const { data: legacy } = await supabase
      .from('properties')
      .select('*')
      .ilike('id', `${tail}%`)
      .eq('publish_to_website', true)
      .maybeSingle()
    if (legacy) return enrichListing(legacy as Listing)
  }

  return null
}

/**
 * Fetch featured listings for the homepage (active, website-published, highest price first).
 */
export async function fetchFeaturedListings(limit = 7): Promise<Listing[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('properties')
    .select(`
      id, slug, name, headline, address, city, state, zip,
      asset_type, transaction_type, status,
      asking_price, lease_rate, sqft, acreage,
      year_built, description, highlights, images,
      publish_to_website, your_role
    `)
    .eq('publish_to_website', true)
    .in('status', ['listed', 'for_lease', 'pre_listing'])
    .order('asking_price', { ascending: false, nullsFirst: false })
    .limit(limit)

  if (error) {
    console.error('fetchFeaturedListings error:', error)
    return []
  }

  return (data || []).map((d: Record<string, unknown>) => enrichListing(d as unknown as Listing))
}
