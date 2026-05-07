/**
 * Seller-net offer-analysis math. Pure — no DB, no fetch — so the owner
 * portal can compute live as the broker types. Identical to the helper in
 * the CRECRM repo (kept in lockstep manually; a few lines, not worth a
 * shared package yet).
 */

export type LineItemSign = 'credit' | 'debit'

export interface SellerNetLineItem {
  label: string
  amount: number
  sign: LineItemSign
}

export interface SellerNetPartner {
  name: string
  capital: number
  pref_pct: number
  hold_years: number
  ownership_pct: number
}

export interface SellerNetInputs {
  offer_price: number
  commission_pct: number | null
  commission_amount: number | null
  line_items: SellerNetLineItem[]
  partners: SellerNetPartner[]
}

export interface SellerNetTotals {
  commission: number
  adjustments: number
  net_proceeds: number
  total_capital: number
  total_preferred: number
  partners_due: number
  net_after_partners: number
  partner_breakdown: Array<{
    name: string
    capital: number
    preferred_return: number
    owed: number
    residual_share: number
    total_distribution: number
    ownership_pct: number
  }>
  sponsor_residual: number
  sponsor_pct: number
}

const num = (v: any): number => {
  const n = typeof v === 'number' ? v : parseFloat(v)
  return Number.isFinite(n) ? n : 0
}

export function computeSellerNet(inputs: SellerNetInputs): SellerNetTotals {
  const offer = num(inputs.offer_price)
  const commission =
    inputs.commission_amount !== null && inputs.commission_amount !== undefined
      ? num(inputs.commission_amount)
      : (offer * num(inputs.commission_pct)) / 100

  const adjustments = (inputs.line_items ?? []).reduce((sum, li) => {
    const v = num(li.amount)
    return sum + (li.sign === 'debit' ? -v : v)
  }, 0)

  const net_proceeds = offer - commission + adjustments

  const partners = inputs.partners ?? []
  const breakdown = partners.map((p) => {
    const capital = num(p.capital)
    const preferred_return = capital * (num(p.pref_pct) / 100) * num(p.hold_years)
    return {
      name: p.name || 'Partner',
      capital,
      preferred_return,
      owed: capital + preferred_return,
      ownership_pct: num(p.ownership_pct),
    }
  })

  const total_capital = breakdown.reduce((s, p) => s + p.capital, 0)
  const total_preferred = breakdown.reduce((s, p) => s + p.preferred_return, 0)
  const partners_due = total_capital + total_preferred
  const net_after_partners = net_proceeds - partners_due
  const totalOwnership = breakdown.reduce((s, p) => s + p.ownership_pct, 0)
  const sponsor_pct = Math.max(0, 100 - totalOwnership)

  const partner_breakdown = breakdown.map((p) => {
    const residual_share = (net_after_partners * p.ownership_pct) / 100
    return {
      name: p.name,
      capital: p.capital,
      preferred_return: p.preferred_return,
      owed: p.owed,
      residual_share,
      total_distribution: p.owed + residual_share,
      ownership_pct: p.ownership_pct,
    }
  })

  const sponsor_residual = (net_after_partners * sponsor_pct) / 100

  return {
    commission,
    adjustments,
    net_proceeds,
    total_capital,
    total_preferred,
    partners_due,
    net_after_partners,
    partner_breakdown,
    sponsor_residual,
    sponsor_pct,
  }
}
