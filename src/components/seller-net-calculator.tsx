'use client'

/**
 * SellerNetCalculator — owner-portal offer-analysis tool.
 *
 * What it does:
 *   1. Lets the broker (or seller) plug in a hypothetical offer and see
 *      what the seller would actually net after commission, tax credits/
 *      prorations, concessions, and any custom adjustments.
 *   2. Models a partner equity waterfall: each LP gets capital + a fixed
 *      preferred-return back; the residual splits by ownership %.
 *   3. Saves the scenario with a custom title (e.g. "Smith Group — 4/22"),
 *      so multiple offers can be stored per property and compared.
 *
 * UI patterns:
 *   • All inputs live-update the totals — no "Calculate" button.
 *   • Line items + partners are dynamic add/remove rows.
 *   • Saved offers list at the top (per property), with quick "load"
 *     and "delete" actions.
 *   • Title field is the lifeline — user can title the scenario before
 *     saving. Defaults to a sensible composite if blank.
 */

import { useMemo, useState, useEffect, useRef } from 'react'
import {
  computeSellerNet,
  type SellerNetInputs,
  type SellerNetLineItem,
  type SellerNetPartner,
} from '@/lib/seller-net'
import {
  createOffer,
  updateOffer,
  deleteOffer,
  uploadOfferAttachment,
  deleteOfferAttachment,
  type OwnerProperty,
  type SavedOffer,
  type OfferAttachment,
} from '@/lib/owner-client'

const CRM_BASE =
  process.env.NEXT_PUBLIC_CRM_API_URL ||
  process.env.CRM_API_URL ||
  'https://stewardship-crm.netlify.app'

interface Props {
  token: string
  property: OwnerProperty
  /** All offers for this token (across properties). We filter to this property below. */
  allOffers: SavedOffer[]
  /** Called after any successful create/update/delete so the host can refetch. */
  onChanged: () => void
}

const DEFAULT_LINE_ITEMS: SellerNetLineItem[] = [
  { label: 'Tax prorations', amount: 0, sign: 'credit' },
  { label: 'Tax credits', amount: 0, sign: 'credit' },
  { label: 'Seller concessions', amount: 0, sign: 'debit' },
  { label: 'Mortgage payoff', amount: 0, sign: 'debit' },
]

function fmtMoney(n: number): string {
  if (!Number.isFinite(n)) return '—'
  const sign = n < 0 ? '-' : ''
  const abs = Math.abs(n)
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(2)}M`
  if (abs >= 1_000) return `${sign}$${(abs / 1_000).toFixed(0)}k`
  return `${sign}$${abs.toFixed(0)}`
}
function fmtMoneyExact(n: number): string {
  if (!Number.isFinite(n)) return '$0'
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
}

export default function SellerNetCalculator({ token, property, allOffers, onChanged }: Props) {
  // ── Form state ────────────────────────────────────────────────────────────
  const [editingId, setEditingId] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [buyerName, setBuyerName] = useState('')
  const [offerDate, setOfferDate] = useState<string>(() => new Date().toISOString().slice(0, 10))
  const [offerPrice, setOfferPrice] = useState<string>(
    property.asking_price ? String(property.asking_price) : ''
  )
  const [commissionMode, setCommissionMode] = useState<'pct' | 'amount'>('pct')
  const [commissionPct, setCommissionPct] = useState<string>('5')
  const [commissionAmount, setCommissionAmount] = useState<string>('')
  const [lineItems, setLineItems] = useState<SellerNetLineItem[]>(DEFAULT_LINE_ITEMS)
  const [partners, setPartners] = useState<SellerNetPartner[]>([])
  const [notes, setNotes] = useState('')

  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [collapsed, setCollapsed] = useState(true) // start collapsed so the dashboard isn't dominated

  const offersForProperty = useMemo(
    () => allOffers.filter((o) => o.property_id === property.id),
    [allOffers, property.id]
  )

  // ── Live computation ──────────────────────────────────────────────────────
  const inputs: SellerNetInputs = useMemo(
    () => ({
      offer_price: parseFloat(offerPrice.replace(/[$,]/g, '')) || 0,
      commission_pct: commissionMode === 'pct' ? (parseFloat(commissionPct) || 0) : null,
      commission_amount:
        commissionMode === 'amount' ? (parseFloat(commissionAmount.replace(/[$,]/g, '')) || 0) : null,
      line_items: lineItems,
      partners,
    }),
    [offerPrice, commissionMode, commissionPct, commissionAmount, lineItems, partners]
  )
  const totals = useMemo(() => computeSellerNet(inputs), [inputs])

  // ── Form helpers ──────────────────────────────────────────────────────────
  function resetForm() {
    setEditingId(null)
    setTitle('')
    setBuyerName('')
    setOfferDate(new Date().toISOString().slice(0, 10))
    setOfferPrice(property.asking_price ? String(property.asking_price) : '')
    setCommissionMode('pct')
    setCommissionPct('5')
    setCommissionAmount('')
    setLineItems(DEFAULT_LINE_ITEMS)
    setPartners([])
    setNotes('')
    setError(null)
  }

  function loadOffer(o: SavedOffer) {
    setCollapsed(false)
    setEditingId(o.id)
    setTitle(o.title)
    setBuyerName(o.buyer_name ?? '')
    setOfferDate(o.offer_date ?? new Date().toISOString().slice(0, 10))
    setOfferPrice(String(o.offer_price))
    if (o.commission_amount !== null && o.commission_amount !== undefined) {
      setCommissionMode('amount')
      setCommissionAmount(String(o.commission_amount))
      setCommissionPct('5')
    } else {
      setCommissionMode('pct')
      setCommissionPct(o.commission_pct !== null ? String(o.commission_pct) : '5')
      setCommissionAmount('')
    }
    setLineItems(o.line_items.length > 0 ? o.line_items : DEFAULT_LINE_ITEMS)
    setPartners(o.partners)
    setNotes(o.notes ?? '')
    setError(null)
  }

  // Default title falls back to "{Buyer} — {price}" if user leaves it empty.
  const effectiveTitle = title.trim() ||
    (buyerName.trim()
      ? `${buyerName.trim()} — ${fmtMoney(inputs.offer_price)}`
      : `Offer — ${fmtMoney(inputs.offer_price)}`)

  async function save() {
    setError(null)
    if (!inputs.offer_price || inputs.offer_price <= 0) {
      setError('Offer price is required.')
      return
    }
    setBusy(true)
    try {
      const payload = {
        property_id: property.id,
        title: effectiveTitle,
        buyer_name: buyerName.trim() || null,
        offer_date: offerDate || null,
        offer_price: inputs.offer_price,
        commission_pct: inputs.commission_pct,
        commission_amount: inputs.commission_amount,
        line_items: lineItems,
        partners,
        notes: notes.trim() || null,
      }
      if (editingId) {
        await updateOffer(token, editingId, payload)
      } else {
        await createOffer(token, payload)
      }
      resetForm()
      onChanged()
    } catch (err: any) {
      setError(err?.message || String(err))
    } finally {
      setBusy(false)
    }
  }

  async function remove(id: string) {
    setBusy(true)
    setError(null)
    try {
      await deleteOffer(token, id)
      if (editingId === id) resetForm()
      setConfirmDelete(null)
      onChanged()
    } catch (err: any) {
      setError(err?.message || String(err))
    } finally {
      setBusy(false)
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="px-6 py-6" style={{ background: 'rgba(0,0,0,0.18)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="flex items-baseline justify-between gap-3 flex-wrap mb-4">
        <div>
          <div className="text-[9.5px] tracking-[0.18em] uppercase text-coral-400 font-mono">Seller Net Analysis</div>
          <h3 className="font-heading text-base text-cream-100 mt-0.5">What would I actually net?</h3>
          <p className="text-[11.5px] text-charcoal-400 mt-1 max-w-[640px]">
            Run a quick scenario on any offer. Adjust commission, prorations, concessions, and partner waterfall —
            then save the result with a name so you can stack offers side-by-side.
          </p>
        </div>
        <button
          onClick={() => setCollapsed((v) => !v)}
          className="text-[10px] font-mono uppercase tracking-[0.18em] text-coral-400 hover:text-coral-300 transition-colors"
        >
          {collapsed ? 'Open ↓' : 'Close ↑'}
        </button>
      </div>

      {/* Saved-offer comparison row — always visible if there are any saved */}
      {offersForProperty.length > 0 && (
        <SavedOffersStrip
          offers={offersForProperty}
          editingId={editingId}
          onLoad={loadOffer}
          onDelete={(id) => setConfirmDelete(id)}
          confirmDelete={confirmDelete}
          onConfirmDelete={remove}
          onCancelDelete={() => setConfirmDelete(null)}
          busy={busy}
          token={token}
          property={property}
          onChanged={onChanged}
        />
      )}

      {!collapsed && (
        <div className="mt-5 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
          {/* ── Inputs ── */}
          <div className="space-y-5">
            {/* Offer header */}
            <Section label="Offer">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Title">
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={effectiveTitle}
                    className={inputCls}
                  />
                </Field>
                <Field label="Buyer">
                  <input
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    placeholder="Smith Group LLC"
                    className={inputCls}
                  />
                </Field>
                <Field label="Offer date">
                  <input
                    type="date"
                    value={offerDate}
                    onChange={(e) => setOfferDate(e.target.value)}
                    className={inputCls}
                  />
                </Field>
                <Field label="Offer price">
                  <input
                    inputMode="decimal"
                    value={offerPrice}
                    onChange={(e) => setOfferPrice(e.target.value)}
                    placeholder="$2,400,000"
                    className={inputCls}
                  />
                </Field>
              </div>
            </Section>

            {/* Commission */}
            <Section label="Commission">
              <div className="flex flex-wrap items-end gap-3">
                <div className="flex items-center gap-1 rounded-sm border border-white/10 bg-white/[0.02] p-0.5">
                  <ModeChip active={commissionMode === 'pct'} onClick={() => setCommissionMode('pct')}>%</ModeChip>
                  <ModeChip active={commissionMode === 'amount'} onClick={() => setCommissionMode('amount')}>$</ModeChip>
                </div>
                {commissionMode === 'pct' ? (
                  <Field label="Rate (%)">
                    <input
                      inputMode="decimal"
                      value={commissionPct}
                      onChange={(e) => setCommissionPct(e.target.value)}
                      placeholder="5"
                      className={inputCls}
                    />
                  </Field>
                ) : (
                  <Field label="Amount">
                    <input
                      inputMode="decimal"
                      value={commissionAmount}
                      onChange={(e) => setCommissionAmount(e.target.value)}
                      placeholder="$120,000"
                      className={inputCls}
                    />
                  </Field>
                )}
                <div className="text-right text-[11px] text-charcoal-400 ml-auto">
                  Computed:{' '}
                  <span className="font-mono text-cream-200">{fmtMoneyExact(totals.commission)}</span>
                </div>
              </div>
            </Section>

            {/* Line items */}
            <Section
              label="Closing-cost adjustments"
              hint="Credits add to seller proceeds, debits reduce them."
              right={
                <button
                  onClick={() =>
                    setLineItems((cur) => [...cur, { label: '', amount: 0, sign: 'credit' }])
                  }
                  className="text-[10px] font-mono uppercase tracking-[0.18em] text-coral-400 hover:text-coral-300 transition-colors"
                >
                  + Add line
                </button>
              }
            >
              <div className="space-y-2">
                {lineItems.map((li, i) => (
                  <LineItemRow
                    key={i}
                    item={li}
                    onChange={(next) =>
                      setLineItems((cur) => cur.map((c, j) => (j === i ? next : c)))
                    }
                    onDelete={() => setLineItems((cur) => cur.filter((_, j) => j !== i))}
                  />
                ))}
                {lineItems.length === 0 && (
                  <p className="text-[11px] text-charcoal-500 italic">No adjustments. Add one if relevant.</p>
                )}
              </div>
            </Section>

            {/* Partners */}
            <Section
              label="Partner equity waterfall"
              hint="Each partner's capital is returned 1:1, plus a preferred return at their pref% × hold years. The residual (after all partners are paid) splits by ownership %."
              right={
                <button
                  onClick={() =>
                    setPartners((cur) => [
                      ...cur,
                      { name: '', capital: 0, pref_pct: 10, hold_years: 1, ownership_pct: 0 },
                    ])
                  }
                  className="text-[10px] font-mono uppercase tracking-[0.18em] text-coral-400 hover:text-coral-300 transition-colors"
                >
                  + Add partner
                </button>
              }
            >
              {partners.length === 0 ? (
                <p className="text-[11px] text-charcoal-500 italic">
                  No partners. Add one to model a capital + preferred-return waterfall.
                </p>
              ) : (
                <div className="space-y-2">
                  {partners.map((p, i) => (
                    <PartnerRow
                      key={i}
                      partner={p}
                      computed={totals.partner_breakdown[i]}
                      onChange={(next) =>
                        setPartners((cur) => cur.map((c, j) => (j === i ? next : c)))
                      }
                      onDelete={() => setPartners((cur) => cur.filter((_, j) => j !== i))}
                    />
                  ))}
                </div>
              )}
            </Section>

            <Section label="Notes">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="Anything you want captured — counter-strategy, timing, deal-specific quirks…"
                className={`${inputCls} resize-y`}
              />
            </Section>

            {error && (
              <div className="rounded-sm border border-coral-400/30 bg-coral-400/[0.08] px-3 py-2 text-[11px] text-coral-300">
                {error}
              </div>
            )}

            <div className="flex items-center gap-2 pt-3 border-t border-white/[0.05]">
              <button
                onClick={save}
                disabled={busy}
                className="px-4 py-2 rounded-sm border border-coral-400/40 bg-coral-400/[0.10] hover:bg-coral-400/[0.20] text-coral-200 hover:text-coral-100 text-[11px] font-mono uppercase tracking-[0.18em] disabled:opacity-50 transition-colors"
              >
                {busy ? 'Saving…' : editingId ? 'Save changes' : 'Save offer'}
              </button>
              {editingId && (
                <button
                  onClick={resetForm}
                  className="px-3 py-2 rounded-sm border border-white/10 bg-white/[0.02] hover:bg-white/[0.06] text-charcoal-300 hover:text-cream-100 text-[11px] font-mono uppercase tracking-[0.18em] transition-colors"
                >
                  Start fresh
                </button>
              )}
              <span className="ml-auto text-[10px] text-charcoal-500">
                {editingId ? 'Editing existing offer' : 'New offer'}
              </span>
            </div>
          </div>

          {/* ── Live totals panel ── */}
          <SellerNetTotals inputs={inputs} totals={totals} />
        </div>
      )}
    </div>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────
const inputCls =
  'w-full px-3 py-2 rounded-sm bg-white/[0.03] border border-white/10 focus:border-coral-400/40 focus:outline-none text-[13px] text-cream-100 placeholder:text-charcoal-500'

function Section({
  label,
  hint,
  right,
  children,
}: {
  label: string
  hint?: string
  right?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 mb-2">
        <div>
          <div className="text-[9.5px] tracking-[0.18em] uppercase text-charcoal-400 font-mono">{label}</div>
          {hint && <div className="text-[10.5px] text-charcoal-500 mt-0.5 max-w-[480px]">{hint}</div>}
        </div>
        {right}
      </div>
      {children}
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[9.5px] tracking-[0.16em] uppercase text-charcoal-500 font-mono">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  )
}

function ModeChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-2 py-1 rounded-sm text-[11px] font-mono uppercase transition-colors ${
        active ? 'bg-coral-400/[0.15] text-coral-200' : 'text-charcoal-400 hover:text-cream-100'
      }`}
    >
      {children}
    </button>
  )
}

function LineItemRow({
  item,
  onChange,
  onDelete,
}: {
  item: SellerNetLineItem
  onChange: (next: SellerNetLineItem) => void
  onDelete: () => void
}) {
  return (
    <div className="grid grid-cols-[1fr_120px_80px_28px] gap-2 items-center">
      <input
        value={item.label}
        onChange={(e) => onChange({ ...item, label: e.target.value })}
        placeholder="Line description"
        className={inputCls}
      />
      <input
        inputMode="decimal"
        value={item.amount === 0 ? '' : String(item.amount)}
        onChange={(e) => onChange({ ...item, amount: parseFloat(e.target.value.replace(/[$,]/g, '')) || 0 })}
        placeholder="$0"
        className={inputCls}
      />
      <select
        value={item.sign}
        onChange={(e) => onChange({ ...item, sign: e.target.value as 'credit' | 'debit' })}
        className={inputCls}
      >
        <option value="credit">+ Credit</option>
        <option value="debit">− Debit</option>
      </select>
      <button
        onClick={onDelete}
        className="text-charcoal-500 hover:text-coral-400 transition-colors text-lg leading-none"
        title="Remove"
      >
        ×
      </button>
    </div>
  )
}

function PartnerRow({
  partner,
  computed,
  onChange,
  onDelete,
}: {
  partner: SellerNetPartner
  computed?: { capital: number; preferred_return: number; owed: number; residual_share: number; total_distribution: number }
  onChange: (next: SellerNetPartner) => void
  onDelete: () => void
}) {
  return (
    <div className="rounded-sm border border-white/[0.06] bg-white/[0.02] p-3">
      <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr_70px_70px_70px_28px] gap-2 items-end">
        <Field label="Partner name">
          <input
            value={partner.name}
            onChange={(e) => onChange({ ...partner, name: e.target.value })}
            placeholder="Mike — Anchor LP"
            className={inputCls}
          />
        </Field>
        <Field label="Capital invested">
          <input
            inputMode="decimal"
            value={partner.capital === 0 ? '' : String(partner.capital)}
            onChange={(e) =>
              onChange({ ...partner, capital: parseFloat(e.target.value.replace(/[$,]/g, '')) || 0 })
            }
            placeholder="$100,000"
            className={inputCls}
          />
        </Field>
        <Field label="Pref %">
          <input
            inputMode="decimal"
            value={String(partner.pref_pct)}
            onChange={(e) => onChange({ ...partner, pref_pct: parseFloat(e.target.value) || 0 })}
            className={inputCls}
          />
        </Field>
        <Field label="Hold (yr)">
          <input
            inputMode="decimal"
            value={String(partner.hold_years)}
            onChange={(e) => onChange({ ...partner, hold_years: parseFloat(e.target.value) || 0 })}
            className={inputCls}
          />
        </Field>
        <Field label="Owns %">
          <input
            inputMode="decimal"
            value={String(partner.ownership_pct)}
            onChange={(e) => onChange({ ...partner, ownership_pct: parseFloat(e.target.value) || 0 })}
            className={inputCls}
          />
        </Field>
        <button
          onClick={onDelete}
          className="text-charcoal-500 hover:text-coral-400 transition-colors text-lg leading-none mb-1"
          title="Remove"
        >
          ×
        </button>
      </div>
      {computed && (computed.capital > 0 || computed.preferred_return > 0 || partner.ownership_pct > 0) && (
        <div className="mt-2 pt-2 border-t border-white/[0.05] text-[10.5px] text-charcoal-400 grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-1">
          <span>
            Capital back:{' '}
            <span className="font-mono text-cream-200">{fmtMoneyExact(computed.capital)}</span>
          </span>
          <span>
            Preferred:{' '}
            <span className="font-mono text-cream-200">{fmtMoneyExact(computed.preferred_return)}</span>
          </span>
          <span>
            Residual share:{' '}
            <span className="font-mono text-cream-200">{fmtMoneyExact(computed.residual_share)}</span>
          </span>
          <span>
            Total dist:{' '}
            <span className="font-mono text-coral-400 font-semibold">
              {fmtMoneyExact(computed.total_distribution)}
            </span>
          </span>
        </div>
      )}
    </div>
  )
}

/**
 * Live waterfall panel — same layout as the CRE OS Offers tab. Each line
 * item is shown individually; partner capital + preferred return are
 * separate deduction lines; the final coral "Net proceeds" is the residual
 * that gets distributed by ownership %, with a per-recipient list below.
 */
function SellerNetTotals({
  inputs,
  totals,
}: {
  inputs: SellerNetInputs
  totals: ReturnType<typeof computeSellerNet>
}) {
  const offerPrice = inputs.offer_price
  const commissionLabel =
    inputs.commission_pct !== null && inputs.commission_pct !== undefined && inputs.commission_pct !== 0
      ? `Commission (${inputs.commission_pct}%)`
      : 'Commission'
  const hasPartners = inputs.partners.length > 0
  const distributionPartners = totals.partner_breakdown.filter((p) => p.ownership_pct > 0)
  const showDistribution =
    hasPartners && (distributionPartners.length > 0 || totals.sponsor_pct > 0) && totals.net_after_partners !== 0

  return (
    <div className="rounded-sm border border-coral-400/25 bg-coral-400/[0.04] p-5 self-start">
      <div className="text-[9.5px] tracking-[0.18em] uppercase text-coral-400 font-mono mb-4">Live result</div>

      <Row label="Offer price" value={fmtMoneyExact(offerPrice)} />
      <Row label={commissionLabel} value={'-' + fmtMoneyExact(totals.commission)} muted />

      {inputs.line_items.map((li, i) => (
        <Row
          key={i}
          label={li.label || (li.sign === 'credit' ? 'Credit' : 'Debit')}
          value={(li.sign === 'credit' ? '+' : '-') + fmtMoneyExact(li.amount)}
          muted
        />
      ))}

      {(totals.total_capital > 0 || totals.total_preferred > 0) && (
        <>
          <div className="my-2 border-t border-white/[0.06]" />
          {totals.total_capital > 0 && (
            <Row label="Initial investment" value={'-' + fmtMoneyExact(totals.total_capital)} muted />
          )}
          {totals.total_preferred > 0 && (
            <Row label="Preferred return" value={'-' + fmtMoneyExact(totals.total_preferred)} muted />
          )}
        </>
      )}

      <div className="my-3 border-t border-white/[0.08]" />
      <Row label="Net proceeds" value={fmtMoneyExact(totals.net_after_partners)} emphasize />

      {showDistribution && (
        <div className="mt-4 pt-3 border-t border-white/[0.08]">
          <div className="text-[9.5px] tracking-[0.18em] uppercase text-charcoal-400 font-mono mb-2">
            Distribution
          </div>
          {distributionPartners.map((p, i) => (
            <Row key={i} label={`${p.name} (${p.ownership_pct}%)`} value={fmtMoneyExact(p.residual_share)} partner />
          ))}
          {totals.sponsor_pct > 0 && (
            <Row
              label={`Sponsor / Common (${totals.sponsor_pct}%)`}
              value={fmtMoneyExact(totals.sponsor_residual)}
              partner
            />
          )}
        </div>
      )}

      {hasPartners && totals.partner_breakdown.some((p) => p.ownership_pct === 0 && p.owed > 0) && (
        <p className="mt-3 text-[10px] text-charcoal-400 italic">
          Capital-only partners (0% ownership) are paid in the deductions above; they don't also appear in the
          distribution.
        </p>
      )}
    </div>
  )
}

function Row({
  label,
  value,
  emphasize,
  muted,
  partner,
}: {
  label: string
  value: string
  emphasize?: boolean
  muted?: boolean
  partner?: boolean
}) {
  if (partner) {
    return (
      <div className="flex items-baseline justify-between py-1">
        <span className="text-[11px] text-cream-200 truncate pr-2">{label}</span>
        <span className="font-mono text-[12px] text-cream-100 font-medium shrink-0">{value}</span>
      </div>
    )
  }
  return (
    <div className="flex items-baseline justify-between py-1.5">
      <span
        className={`text-[11.5px] ${
          emphasize ? 'text-coral-200 font-medium' : muted ? 'text-charcoal-400' : 'text-cream-200'
        }`}
      >
        {label}
      </span>
      <span
        className={`font-mono ${
          emphasize ? 'text-coral-400 text-lg font-semibold' : 'text-[12px] text-cream-100'
        }`}
      >
        {value}
      </span>
    </div>
  )
}

function SavedOffersStrip({
  offers,
  editingId,
  onLoad,
  onDelete,
  confirmDelete,
  onConfirmDelete,
  onCancelDelete,
  busy,
  token,
  property,
  onChanged,
}: {
  offers: SavedOffer[]
  editingId: string | null
  onLoad: (o: SavedOffer) => void
  onDelete: (id: string) => void
  confirmDelete: string | null
  onConfirmDelete: (id: string) => void
  onCancelDelete: () => void
  busy: boolean
  token: string
  property: OwnerProperty
  onChanged: () => void
}) {
  return (
    <div className="space-y-2">
      <div className="overflow-x-auto">
        <div className="flex gap-2 min-w-max pb-1">
          {offers.map((o) => {
            const isEditing = o.id === editingId
            const isConfirming = o.id === confirmDelete
            // Print/PDF route lives on the CRM. We deep-link in a new tab; the
            // page auto-fires the print dialog so the recipient can save as PDF.
            const pdfUrl = property.slug
              ? `${CRM_BASE}/cre-os/properties/${property.slug}/offers/${o.id}/print`
              : null
            return (
              <div
                key={o.id}
                className={`min-w-[240px] rounded-sm border p-3 transition-colors ${
                  isEditing
                    ? 'border-coral-400/40 bg-coral-400/[0.06]'
                    : 'border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04]'
                }`}
              >
                <div className="text-[10px] font-mono tracking-[0.16em] uppercase text-charcoal-500 mb-1">
                  {new Date(o.offer_date || o.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
                <div className="text-[12.5px] text-cream-100 font-medium leading-snug truncate">{o.title}</div>
                {o.buyer_name && (
                  <div className="text-[10.5px] text-charcoal-400 truncate">{o.buyer_name}</div>
                )}
                {/* "Net" here matches the coral headline in the editor —
                    the residual after commission, line items, AND partner
                    capital + preferred have all been deducted. */}
                <div className="mt-2 grid grid-cols-2 gap-x-2 text-[10.5px]">
                  <span className="text-charcoal-400">Offer</span>
                  <span className="font-mono text-cream-100 text-right">{fmtMoney(o.offer_price)}</span>
                  <span className="text-charcoal-400">Net proceeds</span>
                  <span className="font-mono text-coral-400 text-right font-semibold">
                    {fmtMoney(
                      o.computed_net_after_partners !== null && o.computed_net_after_partners !== undefined
                        ? o.computed_net_after_partners
                        : o.computed_net_proceeds ?? 0
                    )}
                  </span>
                </div>

                {/* Attachments inline — owners often want to grab the LOI fast */}
                {(o.attachments?.length ?? 0) > 0 && (
                  <div className="mt-2 pt-2 border-t border-white/[0.06] space-y-1">
                    {o.attachments!.slice(0, 3).map((a) => (
                      <a
                        key={a.id}
                        href={a.signed_url ?? '#'}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 text-[10.5px] hover:text-coral-300"
                        title={a.file_name}
                      >
                        <span className="text-coral-400 font-mono text-[9px] uppercase tracking-[0.16em] shrink-0">
                          {a.doc_type === 'loi' ? 'LOI' : a.doc_type === 'addendum' ? 'ADD' : a.doc_type === 'financing' ? 'FIN' : 'DOC'}
                        </span>
                        <span className="truncate text-charcoal-200">{a.file_name}</span>
                      </a>
                    ))}
                    {(o.attachments?.length ?? 0) > 3 && (
                      <span className="text-[9.5px] text-charcoal-500">+ {o.attachments!.length - 3} more</span>
                    )}
                  </div>
                )}

                <AttachmentUploader offerId={o.id} token={token} onUploaded={onChanged} />

                <div className="mt-2 flex items-center gap-1 justify-end flex-wrap">
                  {isConfirming ? (
                    <>
                      <button
                        onClick={() => onConfirmDelete(o.id)}
                        disabled={busy}
                        className="text-[9.5px] font-mono uppercase tracking-[0.18em] text-coral-400 hover:text-coral-300 disabled:opacity-50"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={onCancelDelete}
                        className="text-[9.5px] font-mono uppercase tracking-[0.18em] text-charcoal-400 hover:text-cream-100"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      {pdfUrl && (
                        <a
                          href={pdfUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[9.5px] font-mono uppercase tracking-[0.18em] text-coral-400 hover:text-coral-300"
                          title="Branded PDF summary — opens in a new tab and auto-prints."
                        >
                          PDF
                        </a>
                      )}
                      <button
                        onClick={() => onLoad(o)}
                        className="text-[9.5px] font-mono uppercase tracking-[0.18em] text-coral-400 hover:text-coral-300"
                      >
                        {isEditing ? 'Editing' : 'Open'}
                      </button>
                      <button
                        onClick={() => onDelete(o.id)}
                        className="text-[9.5px] font-mono uppercase tracking-[0.18em] text-charcoal-500 hover:text-coral-400"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

/** Inline file picker inside each offer card. Tiny so it fits the card width. */
function AttachmentUploader({
  offerId,
  token,
  onUploaded,
}: {
  offerId: string
  token: string
  onUploaded: () => void
}) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  async function pick(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    setBusy(true)
    setError(null)
    try {
      await uploadOfferAttachment(token, offerId, f, 'loi')
      onUploaded()
    } catch (err: any) {
      setError(err?.message || String(err))
    } finally {
      setBusy(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div className="mt-2">
      <button
        onClick={() => inputRef.current?.click()}
        disabled={busy}
        className="text-[9.5px] font-mono uppercase tracking-[0.18em] text-coral-400 hover:text-coral-300 disabled:opacity-50"
      >
        {busy ? 'Uploading…' : '+ Upload LOI / file'}
      </button>
      <input ref={inputRef} type="file" accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" onChange={pick} className="hidden" />
      {error && <div className="mt-1 text-[9.5px] text-coral-400">{error}</div>}
    </div>
  )
}
