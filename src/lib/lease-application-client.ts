import { supabase } from '@/lib/supabase'

/**
 * Browser-side flow for the commercial lease application. Files never pass
 * through a serverless function (those cap request bodies at ~6 MB):
 *
 *   1. POST the form to the CRM → it returns one signed upload URL per file
 *   2. upload each file straight to the CRM's private storage bucket
 *   3. POST finalize → the CRM records the files that landed and creates the lead
 */

const CRM_API_URL =
  process.env.NEXT_PUBLIC_CRM_API_URL ||
  process.env.CRM_API_URL ||
  'https://stewardship-crm.netlify.app'

const BUCKET = 'lease-applications'

export const MAX_FILE_BYTES = 25 * 1024 * 1024
export const MAX_FILES = 20

export const ACCEPTED_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/heic',
  'image/heif',
  'image/webp',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
  'text/csv',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
]

export const ACCEPT_ATTR = '.pdf,.jpg,.jpeg,.png,.heic,.heif,.webp,.xlsx,.xls,.csv,.docx,.doc'

export type DocType =
  | 'photo_id'
  | 'business_tax_return'
  | 'personal_tax_return'
  | 'bank_statement'
  | 'profit_loss'
  | 'balance_sheet'
  | 'personal_financial_statement'
  | 'business_plan'
  | 'other'

export interface AttachedFile {
  docType: DocType
  file: File
}

/** Browsers sometimes report an empty type (HEIC on Windows, CSV on some OSes). */
export function mimeFor(file: File): string {
  if (file.type) return file.type.toLowerCase()
  const ext = file.name.split('.').pop()?.toLowerCase() ?? ''
  const byExt: Record<string, string> = {
    pdf: 'application/pdf',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    heic: 'image/heic',
    heif: 'image/heif',
    webp: 'image/webp',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    xls: 'application/vnd.ms-excel',
    csv: 'text/csv',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    doc: 'application/msword',
  }
  return byExt[ext] ?? ''
}

export async function checkApplicationsReady(): Promise<boolean> {
  try {
    const res = await fetch(`${CRM_API_URL}/api/public/lease-applications`, { cache: 'no-store' })
    if (!res.ok) return true
    const body = await res.json().catch(() => ({}))
    return body?.ready !== false
  } catch {
    // Can't tell (network/CORS) — let the submit itself report a real error.
    return true
  }
}

export type Progress =
  | { stage: 'saving' }
  | { stage: 'uploading'; done: number; total: number }
  | { stage: 'finalizing' }

export interface SubmitResult {
  applicationId: string
  missing: string[]
}

export async function submitLeaseApplication(
  form: Record<string, unknown>,
  files: AttachedFile[],
  onProgress: (p: Progress) => void,
): Promise<SubmitResult> {
  onProgress({ stage: 'saving' })
  const createRes = await fetch(`${CRM_API_URL}/api/public/lease-applications`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...form,
      files: files.map((f) => ({
        doc_type: f.docType,
        file_name: f.file.name,
        size: f.file.size,
        mime_type: mimeFor(f.file),
      })),
    }),
  })
  const created = await createRes.json().catch(() => ({}))
  if (!createRes.ok) throw new Error(created?.error || `Submission failed (${createRes.status})`)

  const uploads = (created.uploads ?? []) as Array<{ index: number; path: string; signed_url: string; token: string }>
  let done = 0
  onProgress({ stage: 'uploading', done, total: uploads.length })

  for (const u of uploads) {
    const file = files[u.index]?.file
    if (file) {
      // One retry per file; anything still failing is reported, not fatal —
      // the application itself must not be lost over one bad upload.
      for (let attempt = 0; attempt < 2; attempt++) {
        if (await uploadOne(u, file)) break
      }
    }
    done += 1
    onProgress({ stage: 'uploading', done, total: uploads.length })
  }

  onProgress({ stage: 'finalizing' })
  const finRes = await fetch(
    `${CRM_API_URL}/api/public/lease-applications/${encodeURIComponent(created.application_id)}/finalize`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ finalize_token: created.finalize_token }),
    },
  )
  const fin = await finRes.json().catch(() => ({}))
  if (!finRes.ok) throw new Error(fin?.error || `Submission failed (${finRes.status})`)
  return { applicationId: created.application_id, missing: Array.isArray(fin.missing) ? fin.missing : [] }
}

async function uploadOne(u: { path: string; signed_url: string; token: string }, file: File): Promise<boolean> {
  try {
    if (supabase) {
      const { error } = await supabase.storage
        .from(BUCKET)
        .uploadToSignedUrl(u.path, u.token, file, { contentType: mimeFor(file) || undefined })
      return !error
    }
    const body = new FormData()
    body.append('cacheControl', '3600')
    body.append('', file)
    const res = await fetch(u.signed_url, { method: 'PUT', headers: { 'x-upsert': 'false' }, body })
    return res.ok
  } catch {
    return false
  }
}
