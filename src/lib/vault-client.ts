/**
 * Client-side helpers for talking to the CRM's public vault API.
 * The marketing site lives at stewardshipcre.com; the CRM lives at
 * stewardship-crm.netlify.app. CORS is allowed on /api/public/* there.
 */

const CRM_API_URL =
  process.env.NEXT_PUBLIC_CRM_API_URL ||
  process.env.CRM_API_URL ||
  'https://stewardship-crm.netlify.app'

export const CRM_BASE_URL = CRM_API_URL

export interface QuestionnairePayload {
  property_slug: string
  full_name: string
  email: string
  phone?: string
  company?: string
  title?: string
  lead_type: 'buyer' | 'seller' | 'tenant' | 'operator' | 'investor'
  asset_class_pref?: string
  budget_range?: string
  timeline?: string
  geographic_focus?: string
}

export interface QuestionnaireResponse {
  submission_id: string
  property: { id: string; slug: string; name: string }
  next_step: 'sign_nda' | 'direct_contact'
  message?: string
  nda?: {
    version_id: string
    version: number
    title: string
    body_md: string
    lead_type: 'tenant' | 'buyer'
  }
}

export interface SignNdaPayload {
  submission_id: string
  nda_version_id: string
  typed_name: string
  typed_email: string
}

export interface SignNdaResponse {
  consent_token: string
  expires_at: string
  vault_path: string
  lead_type: 'tenant' | 'buyer'
}

export interface VaultDocument {
  id: string
  name: string
  doc_category: 'public' | 'tenant' | 'buyer'
  file_type: string | null
  file_size_bytes: number | null
  description: string | null
  sort_order: number
  created_at: string
}

export interface VaultListResponse {
  property: {
    id: string
    slug: string
    name: string
    headline: string | null
    address: string | null
    city: string | null
    state: string | null
  }
  documents: VaultDocument[]
  access_level: 'tenant' | 'buyer'
  allowed_categories: string[]
}

export async function submitQuestionnaire(payload: QuestionnairePayload): Promise<QuestionnaireResponse> {
  const res = await fetch(`${CRM_API_URL}/api/public/questionnaire`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const body = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(body?.error || `Submit failed (${res.status})`)
  return body as QuestionnaireResponse
}

export async function signNda(payload: SignNdaPayload): Promise<SignNdaResponse> {
  const res = await fetch(`${CRM_API_URL}/api/public/nda/sign`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const body = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(body?.error || `Sign failed (${res.status})`)
  return body as SignNdaResponse
}

export async function fetchVault(slug: string, token: string): Promise<VaultListResponse> {
  const res = await fetch(`${CRM_API_URL}/api/public/vault/${encodeURIComponent(slug)}?token=${encodeURIComponent(token)}`, {
    cache: 'no-store',
  })
  const body = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(body?.error || `Vault fetch failed (${res.status})`)
  return body as VaultListResponse
}

export function downloadUrl(slug: string, docId: string, token: string): string {
  return `${CRM_API_URL}/api/public/vault/${encodeURIComponent(slug)}/${encodeURIComponent(docId)}?token=${encodeURIComponent(token)}`
}
