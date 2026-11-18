/**
 * Real-feel portfolio data. Replace these with real Stewardship transactions
 * when available. The structure stays the same.
 *
 * Closed deals only (Sold / Leased) — active For Sale / For Lease items were
 * removed when listings came off the public site (Nov 2026, see
 * src/lib/site-flags.ts).
 */

export interface PortfolioItem {
  slug: string
  address: string
  city: string
  state: string
  type: 'Office' | 'Retail' | 'Industrial' | 'Multifamily' | 'Land' | 'Mixed-Use'
  status: 'For Sale' | 'For Lease' | 'Sold' | 'Leased'
  priceLabel: string
  size: string
  year: string
  image: string
  outcome?: string
}

export const PORTFOLIO: PortfolioItem[] = [
  {
    slug: '53-w-jefferson-joliet',
    address: '53 W Jefferson St',
    city: 'Joliet',
    state: 'IL',
    type: 'Mixed-Use',
    status: 'Sold',
    priceLabel: '$450,000',
    size: '8,500 SF',
    year: '2024',
    image: '/hero/01-aerial.jpg',
    outcome: 'Closed at full ask · 3 buyers in 14 days',
  },
  {
    slug: 'crown-point-medical',
    address: '420 N Main St',
    city: 'Crown Point',
    state: 'IN',
    type: 'Office',
    status: 'Sold',
    priceLabel: '$2.4M',
    size: '14,000 SF',
    year: '2024',
    image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=1920&h=1280&fit=crop',
    outcome: '9% above appraisal · Off-market deal',
  },
  {
    slug: 'merrillville-industrial-park',
    address: '8500 Industrial Pkwy',
    city: 'Merrillville',
    state: 'IN',
    type: 'Industrial',
    status: 'Leased',
    priceLabel: '$8.50 / SF NNN',
    size: '42,000 SF',
    year: '2024',
    image: 'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=1920&h=1280&fit=crop',
    outcome: 'Full-building lease · 7-year term',
  },
]

export const HERO_SLIDES = PORTFOLIO.slice(0, 4)
