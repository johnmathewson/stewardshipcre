'use client'

import { useMemo } from 'react'
import type { OwnerDashboardData, OwnerProperty, WeeklyBucket } from '@/lib/owner-client'

/**
 * InvestorDashboard — buyer/LP-facing view of the same magic-link data
 * the owner sees. Different framing:
 *   - "Properties you're tracking" instead of "Your listings"
 *   - "Market activity" instead of "Your performance"
 *   - "Schedule a tour / Indicate interest" CTA instead of inquiry recap
 *   - No CREXi seller-funnel breakdown — investor doesn't care about that
 *
 * Shows availability, asking price, key facts, market interest trend, and
 * a clear path to act on properties they're considering.
 */
interface Props {
  data: OwnerDashboardData
}

function fmtNum(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, '')}k`
  return String(n)
}

function fmtMoney(n: number | null): string {
  if (n === null || n === undefined) return '—'
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2).replace(/\.?0+$/, '')}M`
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}k`
  return `$${n.toFixed(0)}`
}

function fmtDelta(d: number | null): { label: string; positive: boolean | null } {
  if (d === null) return { label: '—', positive: null }
  if (d === 0) return { label: 'flat', positive: null }
  const arrow = d > 0 ? '↑' : '↓'
  return { label: `${arrow} ${Math.abs(d)}%`, positive: d > 0 }
}

/** Total interest-signal across channels — what an investor cares about
 *  is "are other people circling this asset?" not the source breakdown. */
function totalInterest(b: WeeklyBucket): number {
  const crexi = b.crexi_page_views || b.crexi_views
  return crexi + b.loopnet_views + b.site_views
}

function totalQualifiedInterest(b: WeeklyBucket): number {
  // Inquiries + NDAs executed + OMs opened — high-intent signals only.
  return (
    (b.inquiries || 0) +
    (b.crexi_leads || 0) +
    (b.nda_signatures || 0) +
    (b.crexi_executed_cas || 0) +
    (b.om_downloads || 0) +
    (b.crexi_opened_oms || 0)
  )
}

export default function InvestorDashboard({ data }: Props) {
  return (
    <div>
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-3 flex-wrap">
          <span className="text-[10px] tracking-[0.3em] uppercase text-coral-400 font-mono">
            Investor Watchlist
          </span>
          <span className="text-[10px] text-charcoal-500">
            Week of {new Date(data.week_starting).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        </div>
        <h1
          className="font-heading text-cream-100 mb-2"
          style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)' }}
        >
          {data.label || "Properties You're Tracking"}
        </h1>
        <p className="text-charcoal-400 text-sm max-w-[640px]">
          Live status and market activity for the listings you're watching. The
          interest signals below are how much other capital is circling each
          deal — useful context for timing your move.
        </p>
      </header>

      <div className="space-y-10">
        {data.properties.map((p) => (
          <PropertyCard key={p.id} property={p} />
        ))}
      </div>

      <footer className="mt-16 pt-8 border-t border-charcoal-800 text-center">
        <p className="text-xs text-charcoal-500 mb-3">
          Want to schedule a tour, request the OM, or submit an indication of interest?
        </p>
        <a
          href="mailto:inquiries@stewardshipcre.com?subject=Investor%20Inquiry"
          className="inline-block px-5 py-2.5 rounded-sm border border-coral-400/40 bg-coral-400/[0.08] hover:bg-coral-400/[0.18] text-coral-300 hover:text-coral-200 text-sm font-mono uppercase tracking-[0.18em] transition-colors"
        >
          Reach the deal team →
        </a>
        <p className="text-[10px] text-charcoal-600 mt-6">
          Watchlist expires {new Date(data.expires_at).toLocaleDateString()}.
          Stewardship CRE — confidential, do not share.
        </p>
      </footer>
    </div>
  )
}

function PropertyCard({ property }: { property: OwnerProperty }) {
  const tw = property.this_week
  const interestNow = totalInterest(tw)
  const qualifiedNow = totalQualifiedInterest(tw)

  const interestDelta = useMemo(() => {
    const lastWeek = property.trend[property.trend.length - 2]
    if (!lastWeek) return null
    const prev = totalInterest(lastWeek)
    if (prev === 0) return null
    return Math.round(((interestNow - prev) / prev) * 100)
  }, [property.trend, interestNow])

  const status = (property.status || '').toLowerCase()
  const isUnderContract = status === 'under_contract' || status === 'pending'
  const isClosed = status === 'closed' || status === 'sold'
  const isAvailable = !isUnderContract && !isClosed

  // Subject line for the CTA — pre-fill the property they were looking at.
  const ctaSubject = encodeURIComponent(
    `Interest in ${property.headline || property.name}`
  )
  const ctaBody = encodeURIComponent(
    `Hi John,\n\nI'd like to learn more about ${property.headline || property.name}` +
    (property.address ? ` at ${[property.address, property.city, property.state].filter(Boolean).join(', ')}` : '') +
    `.\n\nThanks,`
  )

  return (
    <div
      className="rounded-sm overflow-hidden"
      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      {/* Header */}
      <div
        className="p-6 pb-4 flex flex-col md:flex-row gap-5 items-start"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
      >
        {property.hero_image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={property.hero_image_url}
            alt={property.headline || property.name}
            className="w-full md:w-[200px] h-[120px] object-cover rounded-sm flex-shrink-0"
          />
        ) : (
          <div
            className="w-full md:w-[200px] h-[120px] flex-shrink-0 rounded-sm flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.04)' }}
          >
            <span className="text-[10px] tracking-wider uppercase text-charcoal-600">No photo</span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h2 className="font-heading text-lg text-cream-100 mb-1 leading-tight">
            {property.headline || property.name}
          </h2>
          <div className="text-xs text-charcoal-400 mb-3">
            {[property.address, property.city, property.state].filter(Boolean).join(' · ')}
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            <StatusPill
              label={
                isClosed ? 'Closed' :
                isUnderContract ? 'Under contract' :
                'Available'
              }
              tone={isClosed ? 'muted' : isUnderContract ? 'warn' : 'good'}
            />
            {property.asset_type && <Pill>{property.asset_type}</Pill>}
            {property.transaction_type && (
              <Pill>{property.transaction_type.replace(/_/g, ' ')}</Pill>
            )}
          </div>
          {/* Hard facts row — what an investor reaches for first */}
          <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-[11.5px] font-mono text-charcoal-400">
            {property.asking_price !== null && property.transaction_type !== 'lease' && (
              <span>
                <span className="text-charcoal-500">Ask</span>{' '}
                <span className="text-cream-100">{fmtMoney(property.asking_price)}</span>
              </span>
            )}
            {property.lease_rate !== null && (
              <span>
                <span className="text-charcoal-500">Rate</span>{' '}
                <span className="text-cream-100">${property.lease_rate.toFixed(2)}/SF</span>
              </span>
            )}
            {property.sqft && (
              <span>
                <span className="text-charcoal-500">SF</span>{' '}
                <span className="text-cream-100">{property.sqft.toLocaleString()}</span>
              </span>
            )}
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-[9.5px] tracking-[0.18em] uppercase text-charcoal-500 mb-1">
            Buyer interest · 7 days
          </div>
          <div className="font-mono text-3xl text-coral-400 font-semibold leading-none">
            {fmtNum(interestNow)}
          </div>
          {interestDelta !== null && interestDelta !== 0 && (
            <div className="text-[10px] mt-1" style={{ color: interestDelta > 0 ? '#6BCB77' : '#818181' }}>
              {interestDelta > 0 ? '↑' : '↓'} {Math.abs(interestDelta)}% vs last week
            </div>
          )}
        </div>
      </div>

      {/* Market signals — investor-relevant rollups, not seller-funnel breakdown */}
      <div className="px-6 pt-6">
        <div className="text-[9.5px] tracking-[0.18em] uppercase text-charcoal-500 mb-3">
          Market signals
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <SignalTile
            label="Listing impressions"
            value={tw.crexi_impressions + tw.loopnet_views + tw.site_views}
            hint="Eyes on the listing this week"
          />
          <SignalTile
            label="Detailed views"
            value={(tw.crexi_page_views || tw.crexi_views) + tw.site_views}
            hint="Clicked into the listing"
          />
          <SignalTile
            label="High-intent buyers"
            value={qualifiedNow}
            hint="Inquiries · OMs · NDAs"
            accent
          />
        </div>
      </div>

      {/* Trend chart — same look as owner, framed differently */}
      <div className="px-6 py-6">
        <div className="text-[9.5px] tracking-[0.18em] uppercase text-charcoal-500 mb-3">
          8-week interest trend
        </div>
        <TrendChart trend={property.trend} />
        <p className="mt-2 text-[10.5px] text-charcoal-500">
          Rising trend = competitive bidding likely · falling trend = window may be opening for a sharper offer.
        </p>
      </div>

      {/* CTA strip — move this from "review past activity" to "act now" */}
      <div
        className="px-6 py-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5"
        style={{ background: 'rgba(0,0,0,0.18)', borderTop: '1px solid rgba(255,255,255,0.05)' }}
      >
        <div className="flex-1 min-w-0">
          <div className="text-[9.5px] tracking-[0.18em] uppercase text-charcoal-500 mb-1">
            Next step
          </div>
          <div className="text-cream-100 text-sm leading-snug">
            {isClosed
              ? 'This deal closed. Browse other listings or talk to John about similar inventory.'
              : isUnderContract
                ? 'Backup offers welcome. Indicate interest and we’ll let you know if the deal falls out.'
                : qualifiedNow >= 3
                  ? 'Multiple buyers circling this week. Schedule a tour or submit an LOI to stay competitive.'
                  : 'Available and quiet enough to engage at your pace. Schedule a tour or request the OM.'}
          </div>
        </div>
        <div className="flex flex-wrap gap-2 shrink-0">
          <a
            href={`mailto:inquiries@stewardshipcre.com?subject=${ctaSubject}&body=${ctaBody}`}
            className="px-3.5 py-2 rounded-sm border border-coral-400/40 bg-coral-400/[0.10] hover:bg-coral-400/[0.20] text-coral-200 text-[11px] font-mono uppercase tracking-[0.18em] transition-colors"
          >
            Indicate interest
          </a>
          {property.slug && (
            <a
              href={`/properties/${property.slug}`}
              className="px-3.5 py-2 rounded-sm border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] text-charcoal-200 text-[11px] font-mono uppercase tracking-[0.18em] transition-colors"
            >
              View listing →
            </a>
          )}
        </div>
      </div>

      {/* External links footer */}
      {(property.crexi_url || property.loopnet_url) && (
        <div
          className="px-6 py-3 flex items-center text-[10.5px] text-charcoal-600"
          style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
        >
          <span>Also listed on</span>
          <div className="ml-auto flex gap-3">
            {property.crexi_url && (
              <a href={property.crexi_url} target="_blank" rel="noopener" className="hover:text-coral-400">
                CREXi →
              </a>
            )}
            {property.loopnet_url && (
              <a href={property.loopnet_url} target="_blank" rel="noopener" className="hover:text-coral-400">
                LoopNet →
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Sub-components ─────────────────────────────────────────────────────────
function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="text-[9.5px] tracking-wider uppercase font-bold py-[2px] px-2 rounded"
      style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(240,237,228,0.8)' }}
    >
      {children}
    </span>
  )
}

function StatusPill({ label, tone }: { label: string; tone: 'good' | 'warn' | 'muted' }) {
  const style =
    tone === 'good'
      ? { background: 'rgba(107,203,119,0.12)', color: '#6BCB77', border: '1px solid rgba(107,203,119,0.30)' }
      : tone === 'warn'
        ? { background: 'rgba(242,201,76,0.12)', color: '#F2C94C', border: '1px solid rgba(242,201,76,0.30)' }
        : { background: 'rgba(255,255,255,0.04)', color: '#818181', border: '1px solid rgba(255,255,255,0.06)' }
  return (
    <span
      className="text-[9.5px] tracking-wider uppercase font-bold py-[2px] px-2 rounded"
      style={style}
    >
      {label}
    </span>
  )
}

function SignalTile({
  label,
  value,
  hint,
  accent,
}: {
  label: string
  value: number
  hint: string
  accent?: boolean
}) {
  return (
    <div>
      <div className="text-[9.5px] tracking-[0.16em] uppercase text-charcoal-500 mb-1.5">{label}</div>
      <div
        className="font-mono text-2xl font-semibold leading-none"
        style={{ color: accent ? '#E07A5F' : '#F0EDE4' }}
      >
        {fmtNum(value)}
      </div>
      <div className="text-[10px] text-charcoal-500 mt-1">{hint}</div>
    </div>
  )
}

function TrendChart({ trend }: { trend: WeeklyBucket[] }) {
  const max = Math.max(1, ...trend.map(totalInterest))

  return (
    <div className="flex items-end gap-1.5" style={{ height: 80 }}>
      {trend.map((b, i) => {
        const total = totalInterest(b)
        const height = total === 0 ? 2 : Math.max(4, (total / max) * 70)
        const isLatest = i === trend.length - 1
        return (
          <div key={b.week_start} className="flex-1 flex flex-col items-center gap-1">
            <div
              className="w-full"
              style={{
                height,
                background: isLatest ? '#E07A5F' : 'rgba(224,122,95,0.5)',
                borderRadius: 1,
                transition: 'height 0.4s',
              }}
              title={`${b.week_start}: ${total} views`}
            />
            <div className="text-[8.5px] text-charcoal-600 tracking-wider uppercase font-mono">
              {new Date(b.week_start).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).replace(/, /g, ' ')}
            </div>
          </div>
        )
      })}
    </div>
  )
}
