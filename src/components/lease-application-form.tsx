'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { SMS_CONSENT_TEXT } from '@/lib/sms-consent'
import {
  ACCEPT_ATTR,
  ACCEPTED_TYPES,
  MAX_FILE_BYTES,
  MAX_FILES,
  checkApplicationsReady,
  mimeFor,
  submitLeaseApplication,
  type AttachedFile,
  type DocType,
  type Progress,
} from '@/lib/lease-application-client'

const AUTHORIZATION_TEXT =
  'I/we certify that the information in this application is true and complete. I/we authorize the Landlord or its ' +
  'agent to obtain credit reports and a background check on the business and each owner/guarantor listed above, and ' +
  'to contact the references provided to verify this information. This application is not a lease or an offer to lease.'

const DOC_SLOTS: Array<{ type: DocType; label: string; hint: string; required?: boolean }> = [
  { type: 'photo_id', label: 'Photo ID', hint: "Driver's license or passport for each guarantor.", required: true },
  { type: 'business_tax_return', label: 'Business tax returns', hint: 'Last two years, if the business is operating.' },
  { type: 'personal_tax_return', label: 'Personal tax returns', hint: 'Last two years for each guarantor.' },
  { type: 'bank_statement', label: 'Bank statements', hint: 'Last three to six months, business and/or personal.' },
  { type: 'profit_loss', label: 'Profit & loss', hint: 'Year-to-date and prior year.' },
  { type: 'balance_sheet', label: 'Balance sheet', hint: 'Most recent.' },
  { type: 'personal_financial_statement', label: 'Personal financial statement', hint: 'For each guarantor.' },
  { type: 'business_plan', label: 'Business plan or pro forma', hint: 'Required for new businesses or new concepts.' },
  { type: 'other', label: 'Anything else', hint: 'Franchise approval, menus, references, etc.' },
]

interface Owner {
  name: string
  title: string
  ownership_pct: string
  guarantor: boolean
  phone: string
  email: string
  home_address: string
}

const emptyOwner = (): Owner => ({ name: '', title: '', ownership_pct: '', guarantor: true, phone: '', email: '', home_address: '' })

interface Props {
  propertySlug?: string
  propertyName?: string
  propertyLocation?: string
}

export default function LeaseApplicationForm({ propertySlug, propertyName, propertyLocation }: Props) {
  const [ready, setReady] = useState(true)
  const [f, setF] = useState({
    property_label: propertyName ? [propertyName, propertyLocation].filter(Boolean).join(', ') : '',
    suite: '',
    desired_sf: '',
    desired_move_in: '',
    business_legal_name: '',
    dba: '',
    intended_use: '',
    fein: '',
    years_in_business: '',
    entity_type: '',
    entity_type_other: '',
    state_of_formation: '',
    business_address: '',
    business_phone: '',
    business_email: '',
    current_address: '',
    current_tenure: '',
    current_monthly_rent: '',
    current_landlord: '',
    current_landlord_phone: '',
    monthly_revenue: '',
    monthly_expenses: '',
    cash_savings: '',
    total_assets: '',
    total_liabilities: '',
    startup_cost: '',
    funding_source: '',
    notes: '',
    website: '',
  })
  const [owners, setOwners] = useState<Owner[]>([emptyOwner()])
  const [refs, setRefs] = useState([{ name: '', phone: '', email: '' }, { name: '', phone: '', email: '' }])
  const [files, setFiles] = useState<AttachedFile[]>([])
  const [signatures, setSignatures] = useState<Record<number, string>>({})
  const [authorized, setAuthorized] = useState(false)
  // A2P 10DLC: starts false, only ever set by an explicit tick.
  const [smsConsent, setSmsConsent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const [progress, setProgress] = useState<Progress | null>(null)
  const [result, setResult] = useState<{ missing: string[] } | null>(null)

  useEffect(() => {
    checkApplicationsReady().then(setReady)
  }, [])

  // The confirmation replaces a long form; jump to it. Lenis owns scrolling
  // on this site, so a bare window.scrollTo is ignored while it's running.
  useEffect(() => {
    if (!result) return
    const lenis = (window as unknown as { __lenis?: { scrollTo: (t: number, o?: { immediate?: boolean }) => void } }).__lenis
    if (lenis) lenis.scrollTo(0, { immediate: true })
    else window.scrollTo(0, 0)
  }, [result])

  const set = (k: keyof typeof f, v: string) => setF((prev) => ({ ...prev, [k]: v }))
  const setOwner = (i: number, k: keyof Owner, v: string | boolean) =>
    setOwners((prev) => prev.map((o, j) => (j === i ? { ...o, [k]: v } : o)))

  // Every guarantor signs; with no guarantor, the first owner signs.
  const signers = useMemo(() => {
    const idx = owners.map((o, i) => (o.guarantor ? i : -1)).filter((i) => i >= 0)
    return idx.length ? idx : [0]
  }, [owners])

  function addFiles(docType: DocType, list: FileList | null) {
    setFileError(null)
    if (!list) return
    const incoming = Array.from(list)
    const problems: string[] = []
    const ok: AttachedFile[] = []
    for (const file of incoming) {
      const mime = mimeFor(file)
      if (!ACCEPTED_TYPES.includes(mime)) problems.push(`${file.name}: use PDF, image, Excel, Word or CSV`)
      else if (file.size > MAX_FILE_BYTES) problems.push(`${file.name}: over 25 MB`)
      else if (file.size === 0) problems.push(`${file.name}: empty file`)
      else ok.push({ docType, file })
    }
    setFiles((prev) => {
      const next = [...prev, ...ok]
      if (next.length > MAX_FILES) {
        problems.push(`At most ${MAX_FILES} files total`)
        return next.slice(0, MAX_FILES)
      }
      return next
    })
    if (problems.length) setFileError(problems.join(' · '))
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    const cleanOwners = owners.filter((o) => o.name.trim())
    if (!f.business_legal_name.trim()) return setError('Business legal name is required.')
    if (cleanOwners.length === 0) return setError('List at least one owner.')
    if (!cleanOwners[0].email.trim() && !f.business_email.trim())
      return setError('An email for the business or the first owner is required.')
    if (!files.some((x) => x.docType === 'photo_id')) return setError('Attach a photo ID for each guarantor.')
    if (!authorized) return setError('Please accept the authorization to submit.')
    const missingSig = signers.find((i) => !(signatures[i] ?? '').trim())
    if (missingSig !== undefined) return setError(`${owners[missingSig]?.name || 'Each guarantor'} needs to type their name to sign.`)

    const phoneForConsent = cleanOwners[0].phone.trim() || f.business_phone.trim()
    try {
      const res = await submitLeaseApplication(
        {
          ...f,
          property_slug: propertySlug,
          owners: owners.filter((o) => o.name.trim()),
          trade_references: refs.filter((r) => r.name.trim()),
          signatures: signers.map((i) => ({ name: (signatures[i] ?? '').trim() })),
          credit_authorization: true,
          sms_consent: Boolean(smsConsent && phoneForConsent),
          sms_consent_text: smsConsent && phoneForConsent ? SMS_CONSENT_TEXT : undefined,
        },
        files,
        setProgress,
      )
      setResult({ missing: res.missing })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed. Please try again.')
      setProgress(null)
    }
  }

  if (result) {
    return (
      <div className="lease-app text-cream-100">
        <div className="text-xs tracking-[0.2em] uppercase text-coral-400 mb-2">Application received</div>
        <h1 className="font-heading text-3xl mb-3">Thank you — we have your application.</h1>
        <p className="text-charcoal-300 text-sm leading-relaxed mb-4">
          We&apos;ll review it with the landlord and follow up within one business day. If the application moves forward,
          each guarantor will receive a secure link from our credit-check provider to complete the credit and
          background check.
        </p>
        {result.missing.length > 0 && (
          <p className="text-sm text-coral-300 border-l-2 border-coral-400 pl-4 mb-4">
            These files didn&apos;t upload: {result.missing.join(', ')}. Please email them to{' '}
            <a className="underline" href="mailto:inquiries@stewardshipcre.com">inquiries@stewardshipcre.com</a>.
          </p>
        )}
        <Link href={propertySlug ? `/properties/${propertySlug}` : '/properties'} className="text-coral-400 text-xs tracking-[0.18em] uppercase">
          ← Back to {propertySlug ? 'the listing' : 'listings'}
        </Link>
      </div>
    )
  }

  const busy = progress !== null
  const busyLabel =
    progress?.stage === 'saving' ? 'Saving application…'
    : progress?.stage === 'uploading' ? `Uploading files (${progress.done} of ${progress.total})…`
    : progress?.stage === 'finalizing' ? 'Finishing up…'
    : 'Submit application'

  return (
    <div className="lease-app text-cream-100">
      {propertySlug && (
        <Link href={`/properties/${propertySlug}`} className="text-coral-400 text-xs tracking-[0.18em] uppercase no-underline">
          ← Back to listing
        </Link>
      )}
      <div className="text-xs tracking-[0.2em] uppercase text-coral-400 mt-4 mb-2">Commercial lease application</div>
      <h1 className="font-heading text-2xl md:text-3xl mb-2">Apply to lease{propertyName ? ` at ${propertyName}` : ''}</h1>
      <p className="text-charcoal-400 text-sm mb-2">
        About 10 minutes. Have your financial statements and a photo ID for each guarantor ready to upload.
      </p>
      <p className="text-charcoal-500 text-xs mb-8">
        Your information is shared only with the landlord and Stewardship CRE to evaluate this application.
      </p>

      {!ready && (
        <div className="mb-8 border-l-2 border-coral-400 pl-4 text-sm text-coral-200">
          Online applications are temporarily unavailable. Please email{' '}
          <a className="underline" href="mailto:inquiries@stewardshipcre.com">inquiries@stewardshipcre.com</a> and
          we&apos;ll send the application directly.
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-10" noValidate>
        <Section n={1} title="Property">
          <Row>
            <Field label="Property address">
              <input value={f.property_label} onChange={(e) => set('property_label', e.target.value)} readOnly={!!propertySlug} className="form-input" placeholder="Address or listing name" />
            </Field>
            <Field label="Suite / unit">
              <input value={f.suite} onChange={(e) => set('suite', e.target.value)} className="form-input" />
            </Field>
          </Row>
          <Row>
            <Field label="Square feet needed">
              <input value={f.desired_sf} onChange={(e) => set('desired_sf', e.target.value)} className="form-input" inputMode="numeric" placeholder="e.g. 2,400" />
            </Field>
            <Field label="Target move-in">
              <input value={f.desired_move_in} onChange={(e) => set('desired_move_in', e.target.value)} className="form-input" placeholder="e.g. March 2027" />
            </Field>
          </Row>
        </Section>

        <Section n={2} title="Business">
          <Row>
            <Field label="Business legal name *">
              <input required value={f.business_legal_name} onChange={(e) => set('business_legal_name', e.target.value)} className="form-input" autoComplete="organization" />
            </Field>
            <Field label="DBA (if different)">
              <input value={f.dba} onChange={(e) => set('dba', e.target.value)} className="form-input" />
            </Field>
          </Row>
          <Field label="Type of business / intended use">
            <input value={f.intended_use} onChange={(e) => set('intended_use', e.target.value)} className="form-input" placeholder="e.g. Physical therapy clinic" />
          </Field>
          <Row>
            <Field label="Federal tax ID (FEIN)">
              <input value={f.fein} onChange={(e) => set('fein', e.target.value)} className="form-input" placeholder="12-3456789" />
            </Field>
            <Field label="Years in business">
              <input value={f.years_in_business} onChange={(e) => set('years_in_business', e.target.value)} className="form-input" inputMode="decimal" />
            </Field>
          </Row>
          <Row>
            <Field label="Entity type">
              <select value={f.entity_type} onChange={(e) => set('entity_type', e.target.value)} className="form-input">
                <option value="">Select…</option>
                <option value="llc">LLC</option>
                <option value="corporation">Corporation</option>
                <option value="partnership">Partnership</option>
                <option value="sole_proprietor">Sole proprietor</option>
                <option value="other">Other</option>
              </select>
            </Field>
            <Field label={f.entity_type === 'other' ? 'Entity type (other)' : 'State of formation'}>
              {f.entity_type === 'other' ? (
                <input value={f.entity_type_other} onChange={(e) => set('entity_type_other', e.target.value)} className="form-input" />
              ) : (
                <input value={f.state_of_formation} onChange={(e) => set('state_of_formation', e.target.value)} className="form-input" placeholder="e.g. Indiana" />
              )}
            </Field>
          </Row>
          <Field label="Principal office address">
            <input value={f.business_address} onChange={(e) => set('business_address', e.target.value)} className="form-input" autoComplete="street-address" />
          </Field>
          <Row>
            <Field label="Business phone">
              <input value={f.business_phone} onChange={(e) => set('business_phone', e.target.value)} className="form-input" type="tel" autoComplete="tel" />
            </Field>
            <Field label="Business email">
              <input value={f.business_email} onChange={(e) => set('business_email', e.target.value)} className="form-input" type="email" autoComplete="email" />
            </Field>
          </Row>
        </Section>

        <Section n={3} title="Owners & guarantors">
          <p className="text-xs text-charcoal-400 -mt-2">
            List each owner with 20% or more. Each guarantor signs below and uploads a photo ID. We don&apos;t collect
            Social Security numbers or dates of birth online — if the application moves forward, each guarantor gets a
            secure link from our credit-check provider.
          </p>
          {owners.map((o, i) => (
            <div key={i} className="border border-charcoal-800 rounded-sm p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] tracking-[0.18em] uppercase text-charcoal-400 font-semibold">Owner {i + 1}</span>
                {i > 0 && (
                  <button type="button" onClick={() => setOwners((prev) => prev.filter((_, j) => j !== i))} className="text-xs text-charcoal-500 hover:text-coral-400">
                    Remove
                  </button>
                )}
              </div>
              <Row>
                <Field label={i === 0 ? 'Full name *' : 'Full name'}>
                  <input value={o.name} onChange={(e) => setOwner(i, 'name', e.target.value)} className="form-input" autoComplete={i === 0 ? 'name' : 'off'} />
                </Field>
                <Field label="Title">
                  <input value={o.title} onChange={(e) => setOwner(i, 'title', e.target.value)} className="form-input" />
                </Field>
              </Row>
              <Row>
                <Field label="Ownership %">
                  <input value={o.ownership_pct} onChange={(e) => setOwner(i, 'ownership_pct', e.target.value)} className="form-input" inputMode="decimal" />
                </Field>
                <label className="flex items-center gap-2 text-sm text-charcoal-300 cursor-pointer md:mt-6">
                  <input type="checkbox" checked={o.guarantor} onChange={(e) => setOwner(i, 'guarantor', e.target.checked)} className="w-4 h-4 accent-coral-400" />
                  Will personally guarantee the lease
                </label>
              </Row>
              <Row>
                <Field label="Phone">
                  <input value={o.phone} onChange={(e) => setOwner(i, 'phone', e.target.value)} className="form-input" type="tel" autoComplete={i === 0 ? 'tel' : 'off'} />
                </Field>
                <Field label={i === 0 ? 'Email *' : 'Email'}>
                  <input value={o.email} onChange={(e) => setOwner(i, 'email', e.target.value)} className="form-input" type="email" autoComplete={i === 0 ? 'email' : 'off'} />
                </Field>
              </Row>
              {i === 0 && (
                /* A2P 10DLC express written consent — unchecked, never required. */
                <label className="flex gap-2.5 items-start text-[11px] leading-relaxed text-charcoal-500 -mt-2 cursor-pointer">
                  <input type="checkbox" checked={smsConsent} onChange={(e) => setSmsConsent(e.target.checked)} className="mt-0.5 h-3.5 w-3.5 shrink-0 accent-coral-400 cursor-pointer" />
                  <span>
                    {SMS_CONSENT_TEXT}{' '}
                    <a href="/privacy" className="text-coral-400 hover:underline" target="_blank" rel="noopener noreferrer">Privacy Policy</a> and{' '}
                    <a href="/terms" className="text-coral-400 hover:underline" target="_blank" rel="noopener noreferrer">Terms</a>.
                  </span>
                </label>
              )}
              <Field label="Home address">
                <input value={o.home_address} onChange={(e) => setOwner(i, 'home_address', e.target.value)} className="form-input" />
              </Field>
            </div>
          ))}
          {owners.length < 4 && (
            <button type="button" onClick={() => setOwners((prev) => [...prev, emptyOwner()])} className="text-xs tracking-[0.18em] uppercase text-coral-400 hover:text-coral-300">
              + Add another owner
            </button>
          )}
        </Section>

        <Section n={4} title="Current location">
          <Field label="Current business address">
            <input value={f.current_address} onChange={(e) => set('current_address', e.target.value)} className="form-input" placeholder="Leave blank if this is a new business" />
          </Field>
          <Row>
            <Field label="Rent or own">
              <select value={f.current_tenure} onChange={(e) => set('current_tenure', e.target.value)} className="form-input">
                <option value="">—</option>
                <option value="rent">Rent</option>
                <option value="own">Own</option>
                <option value="none">No current location</option>
              </select>
            </Field>
            <Field label="Monthly rent ($)">
              <input value={f.current_monthly_rent} onChange={(e) => set('current_monthly_rent', e.target.value)} className="form-input" inputMode="decimal" />
            </Field>
          </Row>
          <Row>
            <Field label="Current landlord / property manager">
              <input value={f.current_landlord} onChange={(e) => set('current_landlord', e.target.value)} className="form-input" />
            </Field>
            <Field label="Landlord phone">
              <input value={f.current_landlord_phone} onChange={(e) => set('current_landlord_phone', e.target.value)} className="form-input" type="tel" />
            </Field>
          </Row>
        </Section>

        <Section n={5} title="References">
          <p className="text-xs text-charcoal-400 -mt-2">Bank, supplier or former landlord. No friends or family.</p>
          {refs.map((r, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Field label={`Reference ${i + 1} — name / company`}>
                <input value={r.name} onChange={(e) => setRefs((prev) => prev.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))} className="form-input" />
              </Field>
              <Field label="Phone">
                <input value={r.phone} onChange={(e) => setRefs((prev) => prev.map((x, j) => (j === i ? { ...x, phone: e.target.value } : x)))} className="form-input" type="tel" />
              </Field>
              <Field label="Email">
                <input value={r.email} onChange={(e) => setRefs((prev) => prev.map((x, j) => (j === i ? { ...x, email: e.target.value } : x)))} className="form-input" type="email" />
              </Field>
            </div>
          ))}
        </Section>

        <Section n={6} title="Financial snapshot">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="Monthly gross revenue ($)"><input value={f.monthly_revenue} onChange={(e) => set('monthly_revenue', e.target.value)} className="form-input" inputMode="decimal" /></Field>
            <Field label="Monthly expenses ($)"><input value={f.monthly_expenses} onChange={(e) => set('monthly_expenses', e.target.value)} className="form-input" inputMode="decimal" /></Field>
            <Field label="Cash & savings ($)"><input value={f.cash_savings} onChange={(e) => set('cash_savings', e.target.value)} className="form-input" inputMode="decimal" /></Field>
            <Field label="Total assets ($)"><input value={f.total_assets} onChange={(e) => set('total_assets', e.target.value)} className="form-input" inputMode="decimal" /></Field>
            <Field label="Total liabilities ($)"><input value={f.total_liabilities} onChange={(e) => set('total_liabilities', e.target.value)} className="form-input" inputMode="decimal" /></Field>
            <Field label="Start-up cost, this location ($)"><input value={f.startup_cost} onChange={(e) => set('startup_cost', e.target.value)} className="form-input" inputMode="decimal" /></Field>
          </div>
          <Field label="How will start-up costs be funded?">
            <textarea value={f.funding_source} onChange={(e) => set('funding_source', e.target.value)} className="form-input" rows={2} />
          </Field>
        </Section>

        <Section n={7} title="Documents">
          <p className="text-xs text-charcoal-400 -mt-2">
            PDF, photo, Excel, Word or CSV · up to 25 MB each · {MAX_FILES} files max. Complete financials get reviewed fastest.
          </p>
          <div className="space-y-3">
            {DOC_SLOTS.map((slot) => {
              const attached = files.filter((x) => x.docType === slot.type)
              return (
                <div key={slot.type} className="border border-charcoal-800 rounded-sm p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm text-cream-100">{slot.label}{slot.required ? ' *' : ''}</div>
                      <div className="text-[11px] text-charcoal-500">{slot.hint}</div>
                    </div>
                    <label className="shrink-0 cursor-pointer text-[11px] tracking-[0.16em] uppercase text-coral-400 hover:text-coral-300 border border-coral-400/40 px-3 py-1.5 rounded-sm">
                      Add file
                      <input type="file" multiple accept={ACCEPT_ATTR} className="sr-only" onChange={(e) => { addFiles(slot.type, e.target.files); e.target.value = '' }} />
                    </label>
                  </div>
                  {attached.length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {attached.map((a) => (
                        <li key={`${a.file.name}-${a.file.size}-${a.file.lastModified}`} className="flex items-center justify-between gap-3 text-[12px] text-charcoal-300">
                          <span className="truncate">{a.file.name} <span className="text-charcoal-500">· {fmtSize(a.file.size)}</span></span>
                          <button type="button" onClick={() => setFiles((prev) => prev.filter((x) => x !== a))} className="text-charcoal-500 hover:text-coral-400 shrink-0">Remove</button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )
            })}
          </div>
          {fileError && <p className="text-xs text-coral-300">{fileError}</p>}
        </Section>

        <Section n={8} title="Authorization & signatures">
          <label className="flex items-start gap-2 cursor-pointer text-sm text-charcoal-300">
            <input type="checkbox" checked={authorized} onChange={(e) => setAuthorized(e.target.checked)} className="mt-1 w-4 h-4 accent-coral-400 shrink-0" />
            <span>{AUTHORIZATION_TEXT}</span>
          </label>
          <div className="space-y-4">
            {signers.map((i) => (
              <Field key={i} label={`Signature — ${owners[i]?.name || `Owner ${i + 1}`} (type full legal name)`}>
                <input value={signatures[i] ?? ''} onChange={(e) => setSignatures((prev) => ({ ...prev, [i]: e.target.value }))} className="form-input font-serif italic" />
              </Field>
            ))}
            <p className="text-[11px] text-charcoal-500">
              Typing your name constitutes your electronic signature, dated {new Date().toLocaleDateString('en-US')}.
            </p>
          </div>
          <Field label="Anything else we should know?">
            <textarea value={f.notes} onChange={(e) => set('notes', e.target.value)} className="form-input" rows={3} />
          </Field>
        </Section>

        {/* Honeypot — hidden from people, bots fill it. */}
        <div className="absolute -left-[9999px] top-auto w-px h-px overflow-hidden" aria-hidden="true">
          <label>Website<input type="text" tabIndex={-1} autoComplete="off" value={f.website} onChange={(e) => set('website', e.target.value)} /></label>
        </div>

        {error && <div role="alert" className="text-coral-300 text-sm border-l-2 border-coral-400 pl-4">{error}</div>}

        <button
          type="submit"
          disabled={busy || !ready}
          className="w-full bg-coral-400 hover:bg-coral-300 text-charcoal-950 font-semibold tracking-[0.15em] uppercase text-sm py-3.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {busyLabel}
        </button>
        <p className="text-xs text-charcoal-500 -mt-6">
          Submitting is not a lease or an offer to lease. Questions? <a href="mailto:inquiries@stewardshipcre.com" className="text-coral-400 hover:underline">inquiries@stewardshipcre.com</a>
        </p>
      </form>

      <style jsx global>{`
        .lease-app .form-input {
          width: 100%;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #f0ede4;
          padding: 10px 12px;
          border-radius: 2px;
          font-size: 16px;
          outline: none;
          transition: border-color 0.15s;
        }
        @media (min-width: 768px) {
          .lease-app .form-input { font-size: 14px; }
        }
        .lease-app .form-input:focus { border-color: rgba(224, 122, 95, 0.5); }
        .lease-app .form-input[readonly] { opacity: 0.7; }
        .lease-app select.form-input option { background: #1a1a1a; }
      `}</style>
    </div>
  )
}

function Section({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <fieldset className="space-y-4">
      <legend className="flex items-center gap-3 mb-4">
        <span className="font-mono text-xs text-coral-400">{String(n).padStart(2, '0')}</span>
        <span className="font-heading text-lg text-cream-100">{title}</span>
      </legend>
      {children}
    </fieldset>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[10px] tracking-[0.16em] uppercase text-charcoal-400 font-semibold mb-1.5">{label}</span>
      {children}
    </label>
  )
}

function Row({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
}

function fmtSize(b: number): string {
  if (b < 1024 * 1024) return `${Math.max(1, Math.round(b / 1024))} KB`
  return `${(b / 1024 / 1024).toFixed(1)} MB`
}
