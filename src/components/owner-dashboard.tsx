'use client'

import { useMemo } from 'react'
import type { OwnerDashboardData, OwnerProperty, WeeklyBucket } from '@/lib/owner-client'

interface Props {
  data: OwnerDashboardData
}

function fmtNum(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, '')}k`
  return String(n)
}

function fmtDelta(d: number | null): { label: string; positive: boolean | null } {
  if (d === null) return { label: '—', positive: null }
  if (d === 0) return { label: 'flat', positive: null }
  const arrow = d > 0 ? '↑' : '↓'
  return { label: `${arrow} ${Math.abs(d)}%`, positive: d > 0 }
}

function fmtTimeAgo(iso: string | null): string {
  if (!iso) return 'never'
  const diffMs = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diffMs / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  return `${d}d ago`
}

export default function OwnerDashboard({ data }: Props) {
  return (
    <div>
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-[10px] tracking-[0.3em] uppercase text-coral-400 font-mono">
            Performance Dashboard
          </span>
          <span className="text-[10px] text-charcoal-500">
            Week of {new Date(data.week_starting).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        </div>
        <h1
          className="font-heading text-cream-100 mb-2"
          style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)' }}
        >
          {data.label || 'Your Listings'}
        </h1>
        <p className="text-charcoal-400 text-sm">
          Live engagement across CREXi, LoopNet, and stewardshipcre.com.
          Updates automatically each week.
        </p>
      </header>

      <div className="space-y-10">
        {data.properties.map((p) => (
          <PropertyCard key={p.id} property={p} />
        ))}
      </div>

      <footer className="mt-16 pt-8 border-t border-charcoal-800 text-center">
        <p className="text-xs text-charcoal-500 mb-3">
          Questions or need more detail? Reach out directly.
        </p>
        <a
          href="mailto:inquiries@stewardshipcre.com"
          className="text-coral-400 hover:underline text-sm"
        >
          inquiries@stewardshipcre.com
        </a>
        <p className="text-[10px] text-charcoal-600 mt-6">
          Dashboard expires {new Date(data.expires_at).toLocaleDateString()}.
          Stewardship CRE — confidential, do not share.
        </p>
      </footer>
    </div>
  )
}

function PropertyCard({ property }: { property: OwnerProperty }) {
  const tw = property.this_week
  // Prefer the new specific page_views; fall back to legacy crexi_views if
  // older data hasn't been re-scraped yet.
  const crexiViewsForTotal = tw.crexi_page_views || tw.crexi_views
  const totalViews = crexiViewsForTotal + tw.loopnet_views + tw.site_views
  const totalDelta = useMemo(() => {
    const lastWeek = property.trend[property.trend.length - 2]
    if (!lastWeek) return null
    const prevCrexi = lastWeek.crexi_page_views || lastWeek.crexi_views
    const prev = prevCrexi + lastWeek.loopnet_views + lastWeek.site_views
    if (prev === 0) return null
    return Math.round(((totalViews - prev) / prev) * 100)
  }, [property.trend, totalViews])

  return (
    <div
      className="rounded-sm overflow-hidden"
      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      {/* Header */}
      <div className="p-6 pb-4 flex flex-col md:flex-row gap-5 items-start" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
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
          <div className="text-xs text-charcoal-400 mb-2">
            {[property.address, property.city, property.state].filter(Boolean).join(' · ')}
          </div>
          <div className="flex flex-wrap gap-2">
            {property.asset_type && <Pill>{property.asset_type}</Pill>}
            {property.status && <Pill>{property.status.replace(/_/g, ' ')}</Pill>}
          </div>
        </div>
        <div className="text-right">
          <div className="text-[9.5px] tracking-[0.18em] uppercase text-charcoal-500 mb-1">Total views this week</div>
          <div className="font-mono text-3xl text-coral-400 font-semibold leading-none">
            {fmtNum(totalViews)}
          </div>
          {totalDelta !== null && totalDelta !== 0 && (
            <div className="text-[10px] mt-1" style={{ color: totalDelta > 0 ? '#6BCB77' : '#E07A5F' }}>
              {totalDelta > 0 ? '↑' : '↓'} {Math.abs(totalDelta)}% vs last week
            </div>
          )}
        </div>
      </div>

      {/* CREXi reach funnel — Impressions → Page Views → Visitors. The CREXi
          seller dashboard exposes all three distinctly; we show them so an
          owner can see WHERE the funnel is leaking (lots of impressions, few
          clicks = bad photos / pricing; lots of clicks, few visitors = bots). */}
      <div className="px-6 pt-6">
        <div className="text-[9.5px] tracking-[0.18em] uppercase text-charcoal-500 mb-3">
          CREXi reach
        </div>
        <div className="grid grid-cols-3 gap-4">
          <StatTile
            label="Impressions"
            value={tw.crexi_impressions}
            delta={property.deltas?.crexi_impressions ?? null}
          />
          <StatTile
            label="Page views"
            value={tw.crexi_page_views || tw.crexi_views}
            delta={property.deltas?.crexi_page_views ?? property.deltas?.crexi_views ?? null}
          />
          <StatTile
            label="Visitors"
            value={tw.crexi_unique_visitors}
            delta={property.deltas?.crexi_unique_visitors ?? null}
          />
        </div>
      </div>

      {/* Other channels */}
      <div className="px-6 pt-6">
        <div className="text-[9.5px] tracking-[0.18em] uppercase text-charcoal-500 mb-3">
          Other channels
        </div>
        <div className="grid grid-cols-2 gap-4">
          <StatTile label="LoopNet views" value={tw.loopnet_views} delta={property.deltas?.loopnet_views ?? null} />
          <StatTile label="Website views" value={tw.site_views} delta={property.deltas?.site_views ?? null} />
        </div>
      </div>

      {/* Second row: deep-funnel engagement signals.
          CREXi seller dashboard surfaces Leads / Opened OMs / Executed CAs / Offers —
          these merge with own-site vault-flow numbers where they're the same thing. */}
      <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatTile
          label="Inquiries"
          value={tw.inquiries + tw.crexi_leads}
          delta={property.deltas?.crexi_leads ?? property.deltas?.inquiries ?? null}
          accent="coral"
        />
        <StatTile
          label="OMs opened"
          value={tw.om_downloads + tw.crexi_opened_oms}
          delta={property.deltas?.crexi_opened_oms ?? property.deltas?.om_downloads ?? null}
          accent="coral"
        />
        <StatTile
          label="NDAs executed"
          value={tw.nda_signatures + tw.crexi_executed_cas}
          delta={property.deltas?.crexi_executed_cas ?? null}
          accent="coral"
        />
        <StatTile
          label="Offers"
          value={tw.crexi_offers}
          delta={property.deltas?.crexi_offers ?? null}
          accent="coral"
        />
      </div>

      {/* Trend chart */}
      <div className="px-6 pb-6">
        <div className="text-[9.5px] tracking-[0.18em] uppercase text-charcoal-500 mb-3">8-week trend</div>
        <TrendChart trend={property.trend} />
      </div>

      {/* Recent inquiries */}
      {property.recent_inquiries.length > 0 && (
        <div
          className="px-6 py-5"
          style={{ background: 'rgba(0,0,0,0.18)', borderTop: '1px solid rgba(255,255,255,0.05)' }}
        >
          <div className="text-[9.5px] tracking-[0.18em] uppercase text-charcoal-500 mb-3">
            Recent inquiry activity (anonymized)
          </div>
          <ul className="space-y-2">
            {property.recent_inquiries.map((q, i) => (
              <li key={i} className="flex gap-2.5 items-start">
                <span className="text-coral-400 mt-1 flex-shrink-0 text-xs">▸</span>
                <span className="text-charcoal-300 text-[12.5px] leading-relaxed">{q}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Footer */}
      <div className="px-6 py-3 flex items-center text-[10.5px] text-charcoal-600" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <span>CREXi/LoopNet last synced {fmtTimeAgo(property.latest_metric_scrape)}</span>
        <div className="ml-auto flex gap-3">
          {property.crexi_url && (
            <a href={property.crexi_url} target="_blank" rel="noopener" className="hover:text-coral-400">
              CREXi listing →
            </a>
          )}
          {property.loopnet_url && (
            <a href={property.loopnet_url} target="_blank" rel="noopener" className="hover:text-coral-400">
              LoopNet listing →
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

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

function StatTile({
  label,
  value,
  delta,
  accent,
}: {
  label: string
  value: number
  delta: number | null
  accent?: 'coral' | undefined
}) {
  const d = fmtDelta(delta)
  const valueColor = accent === 'coral' ? '#E07A5F' : '#F0EDE4'
  return (
    <div>
      <div className="text-[9.5px] tracking-[0.16em] uppercase text-charcoal-500 mb-1.5">{label}</div>
      <div className="font-mono text-2xl font-semibold leading-none" style={{ color: valueColor }}>
        {fmtNum(value)}
      </div>
      {d.label !== '—' && d.label !== 'flat' && (
        <div className="text-[10px] mt-1" style={{ color: d.positive ? '#6BCB77' : '#E07A5F' }}>
          {d.label}
        </div>
      )}
    </div>
  )
}

function TrendChart({ trend }: { trend: WeeklyBucket[] }) {
  // Use page_views (new) with crexi_views (legacy) fallback so historical
  // weeks before the May 2026 schema change still chart correctly.
  const totalFor = (b: WeeklyBucket) =>
    (b.crexi_page_views || b.crexi_views) + b.loopnet_views + b.site_views
  const max = Math.max(1, ...trend.map(totalFor))

  return (
    <div className="flex items-end gap-1.5" style={{ height: 80 }}>
      {trend.map((b, i) => {
        const total = totalFor(b)
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
