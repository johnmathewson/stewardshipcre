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

export interface OwnerDashboardData {
  label: string | null
  expires_at: string
  properties: OwnerProperty[]
  week_starting: string
}

export async function fetchOwnerDashboard(token: string): Promise<{ ok: true; data: OwnerDashboardData } | { ok: false; error: string; status: number }> {
  try {
    const res = await fetch(`${CRM_API_URL}/api/public/owner/${encodeURIComponent(token)}`, {
      cache: 'no-store',
    })
    const body = await res.json().catch(() => ({}))
    if (!res.ok) return { ok: false, error: body?.error || `HTTP ${res.status}`, status: res.status }
    return { ok: true, data: body as OwnerDashboardData }
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
