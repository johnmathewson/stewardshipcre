'use client'

import { useEffect, useState, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { fetchVault, downloadUrl, type VaultListResponse } from '@/lib/vault-client'

const CATEGORY_META: Record<string, { label: string; description: string }> = {
  public: { label: 'Public Materials', description: 'Property flyer and overview — share freely.' },
  tenant: { label: 'Tenant Package', description: 'Lease comps, availability, TI options.' },
  buyer: { label: 'Buyer / Investor Package', description: 'Rent roll, financials, due diligence.' },
}

function formatSize(bytes: number | null): string {
  if (!bytes) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

function fileIcon(type: string | null): string {
  if (!type) return '📄'
  if (type.includes('pdf')) return '📄'
  if (type.includes('image')) return '🖼️'
  if (type.includes('sheet') || type.includes('excel')) return '📊'
  if (type.includes('word')) return '📝'
  if (type.includes('zip')) return '🗜️'
  return '📄'
}

export default function VaultView({ slug }: { slug: string }) {
  return (
    <Suspense fallback={null}>
      <VaultViewInner slug={slug} />
    </Suspense>
  )
}

function VaultViewInner({ slug }: { slug: string }) {
  const sp = useSearchParams()
  const token = sp.get('token') || ''
  const [data, setData] = useState<VaultListResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!token) {
      setError('Missing access token. Please complete the questionnaire + NDA first.')
      setLoading(false)
      return
    }
    try {
      const res = await fetchVault(slug, token)
      setData(res)
    } catch (e: any) {
      setError(e.message || 'Could not load vault')
    } finally {
      setLoading(false)
    }
  }, [slug, token])

  useEffect(() => { load() }, [load])

  if (loading) {
    return <div className="text-charcoal-400 text-center py-20 text-sm">Unlocking vault…</div>
  }

  if (error || !data) {
    return (
      <div className="text-cream-100">
        <Link href={`/properties/${slug}`} className="text-coral-400 text-xs tracking-[0.18em] uppercase no-underline">
          ← Back to listing
        </Link>
        <h1 className="font-heading text-2xl mt-4 mb-3">Access expired</h1>
        <p className="text-charcoal-400 text-sm leading-relaxed mb-6">
          {error || 'Vault not found.'}
        </p>
        <Link
          href={`/properties/${slug}/inquire`}
          className="inline-block bg-coral-400 hover:bg-coral-300 text-charcoal-950 font-semibold tracking-[0.15em] uppercase text-xs py-3 px-6 transition-all"
        >
          Request Access Again
        </Link>
      </div>
    )
  }

  const docsByCategory: Record<string, typeof data.documents> = { public: [], tenant: [], buyer: [] }
  for (const doc of data.documents) {
    docsByCategory[doc.doc_category]?.push(doc)
  }

  const visibleCategories = data.allowed_categories.filter(cat => docsByCategory[cat]?.length > 0)

  return (
    <div className="text-cream-100">
      <Link href={`/properties/${slug}`} className="text-coral-400 text-xs tracking-[0.18em] uppercase no-underline">
        ← Back to listing
      </Link>

      <div className="mt-4 mb-2 inline-block px-3 py-1 rounded-sm text-[10px] tracking-[0.18em] uppercase font-semibold"
           style={{ background: data.access_level === 'buyer' ? 'rgba(224,122,95,0.18)' : 'rgba(78,205,196,0.18)',
                    color: data.access_level === 'buyer' ? '#E07A5F' : '#4ECDC4' }}>
        {data.access_level === 'buyer' ? 'Buyer / Investor Access' : 'Tenant Access'}
      </div>

      <h1 className="font-heading text-2xl md:text-3xl mb-2">
        {data.property.headline || data.property.name}
      </h1>
      <p className="text-charcoal-400 text-sm mb-2">
        {[data.property.address, data.property.city, data.property.state].filter(Boolean).join(', ')}
      </p>
      <p className="text-charcoal-500 text-xs mb-10">
        Click any document to download. Your link is good for 7 days from when you signed.
        Each download is logged for the property record.
      </p>

      {visibleCategories.length === 0 ? (
        <div className="bg-charcoal-900/60 border border-charcoal-800 rounded-sm p-8 text-center">
          <div className="text-4xl mb-3 opacity-40">📂</div>
          <div className="text-cream-200 text-sm mb-1">Documents are being prepared</div>
          <p className="text-charcoal-500 text-xs">
            John will email you the package directly within a few hours.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {visibleCategories.map(cat => {
            const meta = CATEGORY_META[cat]
            const docs = docsByCategory[cat] || []
            return (
              <div key={cat}>
                <div className="flex items-baseline justify-between mb-3 pb-2 border-b border-charcoal-800">
                  <div>
                    <h2 className="font-heading text-base text-cream-100 m-0">{meta.label}</h2>
                    <p className="text-xs text-charcoal-500 mt-0.5">{meta.description}</p>
                  </div>
                  <span className="text-xs text-charcoal-600 font-mono">{docs.length}</span>
                </div>
                <div className="space-y-2">
                  {docs.map(doc => (
                    <a
                      key={doc.id}
                      href={downloadUrl(slug, doc.id, token)}
                      className="flex items-center gap-3 px-4 py-3 bg-charcoal-900/40 border border-charcoal-800 hover:border-coral-400/40 hover:bg-charcoal-900/60 transition-all rounded-sm no-underline"
                    >
                      <span className="text-2xl flex-shrink-0">{fileIcon(doc.file_type)}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-cream-100 truncate">{doc.name}</div>
                        {doc.description && (
                          <div className="text-xs text-charcoal-500 mt-0.5 truncate">{doc.description}</div>
                        )}
                        <div className="text-[10px] text-charcoal-600 mt-0.5">
                          {formatSize(doc.file_size_bytes)}
                        </div>
                      </div>
                      <span className="text-xs text-coral-400 tracking-[0.18em] uppercase font-semibold">
                        Download →
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div className="mt-12 pt-8 border-t border-charcoal-800 text-center">
        <p className="text-xs text-charcoal-500 mb-4">
          Questions about this property?
        </p>
        <a
          href="mailto:inquiries@stewardshipcre.com?subject=Re: Vault access"
          className="text-coral-400 hover:underline text-sm"
        >
          inquiries@stewardshipcre.com
        </a>
      </div>
    </div>
  )
}
