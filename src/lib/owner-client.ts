/**
 * Helpers for the prospect-facing owner dashboard. Calls CRECRM public APIs.
 */

const CRM_API_URL =
  process.env.NEXT_PUBLIC_CRM_API_URL ||
  process.env.CRM_API_URL ||
  'https://stewardship-crm.netlify.app'

export interface WeeklyBucket {
  week_start: string
  // Legacy single-number "views" for CREXi — kept for back-compat + as a
  // fallback when the new specific fields aren't populated yet. The API
  // backfills this from page_views > unique_visitors > impressions.
  crexi_views: number
  // CREXi-native funnel signals (May 2026 dashboard surfaces these distinctly)
  crexi_impressions: number      // search-result eyeballs
  crexi_page_views: number       // clicked-into the listing
  crexi_unique_visitors: number  // deduped page-view audience
  loopnet_views: number
  site_views: number
  // own-site (vault flow) signals
  inquiries: number
  nda_signatures: number
  om_downloads: number
  // CREXi-platform deep-funnel signals (scraped from seller dashboard)
  crexi_leads: number
  crexi_opened_oms: number
  crexi_executed_cas: number
  crexi_offers: number
}

export interface OwnerProperty {
  id: string
  name: string
  headline: string | null
  slug: string | null
  address: string | null
  city: string | null
  state: string | null
  asset_type: string | null
  transaction_type: string | null
  status: string | null
  asking_price: number | null
  lease_rate: number | null
  sqft: number | null
  hero_image_url: string | null
  crexi_url: string | null
  loopnet_url: string | null
  this_week: WeeklyBucket
  deltas: {
    crexi_views: number | null
    crexi_impressions: number | null
    crexi_page_views: number | null
    crexi_unique_visitors: number | null
    loopnet_views: number | null
    site_views: number | null
    inquiries: number | null
    om_downloads: number | null
    crexi_leads: number | null
    crexi_opened_oms: number | null
    crexi_executed_cas: number | null
    crexi_offers: number | null
  } | null
  trend: WeeklyBucket[]
  recent_inquiries: string[]
  latest_metric_scrape: string | null
}

export type PortalAudience = 'owner' | 'investor'

export interface SavedOffer {
  id: string
  property_id: string
  title: string
  buyer_name: string | null
  offer_date: string | null
  offer_price: number
  commission_pct: number | null
  commission_amount: number | null
  line_items: Array<{ label: string; amount: number; sign: 'credit' | 'debit' }>
  partners: Array<{
    name: string
    capital: number
    pref_pct: number
    hold_years: number
    ownership_pct: number
  }>
  computed_commission: number | null
  computed_adjustments: number | null
  computed_net_proceeds: number | null
  computed_partners_due: number | null
  computed_net_after_partners: number | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface OwnerDashboardData {
  label: string | null
  /** 'owner' (seller) or 'investor' (buyer/LP). Pre-May-2026 tokens predate
   *  the field and are treated as 'owner'. */
  audience: PortalAudience
  expires_at: string
  properties: OwnerProperty[]
  week_starting: string
  /** Seller-net offer scenarios saved for any of these properties. */
  offers: SavedOffer[]
}

/**
 * Fetches the magic-link dashboard payload from the CRM. Same endpoint
 * regardless of audience — the response carries `audience` so the page
 * can redirect to the correct route (/owner/* vs /investor/*).
 */
export async function fetchOwnerDashboard(token: string): Promise<{ ok: true; data: OwnerDashboardData } | { ok: false; error: string; status: number }> {
  try {
    const res = await fetch(`${CRM_API_URL}/api/public/owner/${encodeURIComponent(token)}`, {
      cache: 'no-store',
    })
    const body = await res.json().catch(() => ({}))
    if (!res.ok) return { ok: false, error: body?.error || `HTTP ${res.status}`, status: res.status }
    // Default to 'owner' for tokens issued before audience was tracked.
    // Default offers to [] for backwards-compat with older API responses.
    const raw = body as Partial<OwnerDashboardData>
    const data: OwnerDashboardData = {
      ...(raw as OwnerDashboardData),
      audience: raw.audience === 'investor' ? 'investor' : 'owner',
      offers: Array.isArray(raw.offers) ? raw.offers : [],
    }
    return { ok: true, data }
  } catch (err: any) {
    return { ok: false, error: err?.message || String(err), status: 0 }
  }
}

export async function logPageView(slug: string) {
  try {
    await fetch(`${CRM_API_URL}/api/public/page-view`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        slug,
        path: typeof window !== 'undefined' ? window.location.pathname : null,
        referer: typeof document !== 'undefined' ? document.referrer || null : null,
      }),
    })
  } catch {
    // Silent — analytics shouldn't break the page
  }
}

// ── Seller-net offer CRUD ─────────────────────────────────────────────────
// Owner-portal callers pass the same magic-link token they used to fetch
// the dashboard. The CRM enforces that the token has access to the
// property_id on the offer.

export interface OfferDraft {
  property_id: string
  title: string
  buyer_name?: string | null
  offer_date?: string | null
  offer_price: number
  commission_pct?: number | null
  commission_amount?: number | null
  line_items?: SavedOffer['line_items']
  partners?: SavedOffer['partners']
  notes?: string | null
}

export async function createOffer(token: string, draft: OfferDraft): Promise<SavedOffer> {
  const res = await fetch(`${CRM_API_URL}/api/public/owner/${encodeURIComponent(token)}/offers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(draft),
  })
  const body = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(body?.error || `HTTP ${res.status}`)
  return body.offer as SavedOffer
}

export async function updateOffer(
  token: string,
  offerId: string,
  patch: Partial<OfferDraft>
): Promise<SavedOffer> {
  const res = await fetch(
    `${CRM_API_URL}/api/public/owner/${encodeURIComponent(token)}/offers/${encodeURIComponent(offerId)}`,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    }
  )
  const body = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(body?.error || `HTTP ${res.status}`)
  return body.offer as SavedOffer
}

export async function deleteOffer(token: string, offerId: string): Promise<void> {
  const res = await fetch(
    `${CRM_API_URL}/api/public/owner/${encodeURIComponent(token)}/offers/${encodeURIComponent(offerId)}`,
    { method: 'DELETE' }
  )
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body?.error || `HTTP ${res.status}`)
  }
}
