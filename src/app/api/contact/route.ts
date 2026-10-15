import { randomUUID } from 'crypto'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { SMS_CONSENT_TEXT } from '@/lib/sms-consent'

// The CRM intake pipeline runs two Claude calls (qualify + draft) before it
// responds, so this proxy needs the same 60s ceiling the CRM route declares.
export const maxDuration = 60
export const dynamic = 'force-dynamic'

const CRM_API_URL =
  process.env.CRM_API_URL ||
  process.env.NEXT_PUBLIC_CRM_API_URL ||
  'https://stewardship-crm.netlify.app'

const ContactSchema = z.object({
  name: z.string().trim().min(1).max(200),
  email: z.string().trim().email().max(320),
  phone: z.string().trim().max(40).optional().default(''),
  message: z.string().trim().min(1).max(5000),
  smsConsent: z.boolean().optional().default(false),
  // Honeypot: real users never see this field, bots fill it.
  website: z.string().max(0).optional().default(''),
})

export async function POST(req: Request) {
  let json: unknown
  try {
    json = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const parsed = ContactSchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Please check the form and try again.' }, { status: 400 })
  }
  const form = parsed.data

  const consented = form.smsConsent && form.phone.length > 0

  const intakePayload = {
    source: 'website',
    sender_name: form.name,
    sender_email: form.email,
    sender_phone: form.phone || null,
    raw_subject: `Website contact form — ${form.name}`,
    raw_body: form.message,
    source_message_id: `website-contact-${randomUUID()}`,
    raw_payload: {
      form: 'contact',
      page: '/contact',
      submitted_at: new Date().toISOString(),
      sms_consent: consented,
      ...(consented
        ? { sms_consent_text: SMS_CONSENT_TEXT, sms_consent_source: 'web_form' }
        : {}),
    },
  }

  let crmRes: Response
  try {
    crmRes = await fetch(`${CRM_API_URL}/api/leads/intake`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(intakePayload),
      cache: 'no-store',
    })
  } catch (err) {
    console.error('[api/contact] CRM unreachable:', err)
    return NextResponse.json(
      { error: 'We could not send your message right now. Please email inquiries@stewardshipcre.com.' },
      { status: 502 }
    )
  }

  if (!crmRes.ok) {
    const detail = await crmRes.text().catch(() => '')
    console.error('[api/contact] CRM intake failed:', crmRes.status, detail.slice(0, 500))
    return NextResponse.json(
      { error: 'We could not send your message right now. Please email inquiries@stewardshipcre.com.' },
      { status: 502 }
    )
  }

  const result = (await crmRes.json().catch(() => ({}))) as { lead_id?: string; status?: string }
  return NextResponse.json({ ok: true, status: result.status ?? 'received' })
}
