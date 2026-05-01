'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  submitQuestionnaire,
  signNda,
  type QuestionnaireResponse,
} from '@/lib/vault-client'

const LEAD_TYPES = [
  { id: 'buyer', label: 'Buyer / Investor' },
  { id: 'tenant', label: 'Tenant' },
  { id: 'operator', label: 'Operator' },
  { id: 'seller', label: 'Seller (own a similar property)' },
] as const

const BUDGET_BUYER = ['Under $1M', '$1M – $5M', '$5M – $10M', '$10M – $25M', '$25M+']
const BUDGET_TENANT = ['Under $5K/mo', '$5K – $15K/mo', '$15K – $50K/mo', '$50K+/mo']

const TIMELINES = ['Immediate (next 30 days)', '30–90 days', '3–6 months', '6–12 months', 'Exploratory']

const ASSET_CLASSES = ['Industrial', 'Office', 'Retail', 'Multifamily', 'Mixed-Use', 'Medical / Healthcare', 'Land', 'Hotel / Hospitality']

interface FormState {
  full_name: string
  email: string
  phone: string
  company: string
  title: string
  lead_type: '' | 'buyer' | 'seller' | 'tenant' | 'operator'
  asset_class_pref: string
  budget_range: string
  timeline: string
  geographic_focus: string
}

const empty: FormState = {
  full_name: '',
  email: '',
  phone: '',
  company: '',
  title: '',
  lead_type: '',
  asset_class_pref: '',
  budget_range: '',
  timeline: '',
  geographic_focus: '',
}

interface Props {
  slug: string
  propertyName: string
  propertyLocation: string
}

export default function InquireFlow({ slug, propertyName, propertyLocation }: Props) {
  const router = useRouter()
  const [step, setStep] = useState<'questionnaire' | 'nda' | 'direct'>('questionnaire')
  const [form, setForm] = useState<FormState>(empty)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submission, setSubmission] = useState<QuestionnaireResponse | null>(null)

  // NDA step state
  const [typedName, setTypedName] = useState('')
  const [typedEmail, setTypedEmail] = useState('')
  const [agreed, setAgreed] = useState(false)

  function set<K extends keyof FormState>(k: K, v: FormState[K]) {
    setForm(f => ({ ...f, [k]: v }))
  }

  async function onSubmitQuestionnaire(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    // Light client-side validation
    if (!form.full_name.trim() || !form.email.trim() || !form.lead_type) {
      setError('Name, email, and your role are required.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError('Please enter a valid email address.')
      return
    }

    setSubmitting(true)
    try {
      const res = await submitQuestionnaire({
        property_slug: slug,
        full_name: form.full_name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        company: form.company.trim() || undefined,
        title: form.title.trim() || undefined,
        lead_type: form.lead_type,
        asset_class_pref: form.asset_class_pref || undefined,
        budget_range: form.budget_range || undefined,
        timeline: form.timeline || undefined,
        geographic_focus: form.geographic_focus.trim() || undefined,
      })
      setSubmission(res)
      // Pre-fill the NDA signer with what they just gave us
      setTypedName(form.full_name.trim())
      setTypedEmail(form.email.trim())

      if (res.next_step === 'direct_contact') {
        setStep('direct')
      } else {
        setStep('nda')
      }
    } catch (err: any) {
      setError(err.message || 'Submission failed')
    } finally {
      setSubmitting(false)
    }
  }

  async function onSignNda(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!submission?.nda) return
    if (!typedName.trim()) return setError('Please type your full name to sign.')
    if (!agreed) return setError('Please confirm you agree to the terms.')

    setSubmitting(true)
    try {
      const res = await signNda({
        submission_id: submission.submission_id,
        nda_version_id: submission.nda.version_id,
        typed_name: typedName.trim(),
        typed_email: typedEmail.trim(),
      })
      // Navigate to the vault. URL is bookmarkable; token has 7-day expiry.
      router.push(`/properties/${slug}/vault?token=${encodeURIComponent(res.consent_token)}`)
    } catch (err: any) {
      setError(err.message || 'Sign failed')
      setSubmitting(false)
    }
  }

  // ── Direct contact path (sellers) ─────────────────────────────
  if (step === 'direct') {
    return (
      <div className="text-cream-100">
        <Link href={`/properties/${slug}`} className="text-coral-400 text-xs tracking-[0.18em] uppercase no-underline">
          ← Back to listing
        </Link>
        <h1 className="font-heading text-3xl mt-4 mb-3">Thanks — we'll reach out directly</h1>
        <p className="text-charcoal-300 text-sm leading-relaxed">
          Seller inquiries are routed straight to John Mathewson. He'll be in touch within
          one business day to discuss your property and any potential listing fit.
        </p>
        <div className="mt-8 text-xs text-charcoal-500">
          If urgent, email{' '}
          <a href="mailto:inquiries@stewardshipcre.com" className="text-coral-400 hover:underline">
            inquiries@stewardshipcre.com
          </a>
          .
        </div>
      </div>
    )
  }

  // ── NDA review + sign ─────────────────────────────────────────
  if (step === 'nda' && submission?.nda) {
    return (
      <div className="text-cream-100">
        <div className="text-xs tracking-[0.2em] uppercase text-coral-400 mb-2">Step 2 of 2</div>
        <h1 className="font-heading text-2xl md:text-3xl mb-3">{submission.nda.title}</h1>
        <p className="text-charcoal-400 text-xs mb-6">
          Property: <span className="text-cream-200">{propertyName}</span>
          {propertyLocation && <span> · {propertyLocation}</span>}
        </p>

        <div
          className="bg-charcoal-900/60 border border-charcoal-800 rounded-sm p-5 text-charcoal-200 text-sm leading-relaxed whitespace-pre-line mb-6"
          style={{ maxHeight: '60vh', overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}
        >
          {submission.nda.body_md}
        </div>
        <p className="text-[10.5px] text-charcoal-500 -mt-4 mb-6 text-center">
          Scroll to read the full agreement before signing.
        </p>

        <form onSubmit={onSignNda} className="space-y-4">
          <Field label="Your full legal name (typed signature)">
            <input
              required
              value={typedName}
              onChange={e => setTypedName(e.target.value)}
              className="form-input"
              autoComplete="name"
            />
          </Field>
          <Field label="Email">
            <input
              type="email"
              required
              value={typedEmail}
              onChange={e => setTypedEmail(e.target.value)}
              className="form-input"
              autoComplete="email"
            />
          </Field>
          <label className="flex items-start gap-2 cursor-pointer text-sm text-charcoal-300">
            <input
              type="checkbox"
              checked={agreed}
              onChange={e => setAgreed(e.target.checked)}
              className="mt-1 w-4 h-4 accent-coral-400"
              required
            />
            <span>
              I confirm I am at least 18 years old, have read and understood the agreement above,
              and that typing my name + clicking <strong>Agree &amp; Continue</strong> constitutes a
              legal electronic signature.
            </span>
          </label>

          {error && <div className="text-coral-400 text-sm">{error}</div>}

          <button
            type="submit"
            disabled={submitting || !agreed}
            className="w-full bg-coral-400 hover:bg-coral-300 text-charcoal-950 font-semibold tracking-[0.15em] uppercase text-sm py-3.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Recording signature…' : 'Agree & Continue'}
          </button>
        </form>

        <style jsx>{`
          .form-input {
            width: 100%;
            background: rgba(255, 255, 255, 0.04);
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: var(--cream, #f0ede4);
            padding: 10px 12px;
            border-radius: 2px;
            font-size: 14px;
            outline: none;
            transition: border-color 0.15s;
          }
          .form-input:focus {
            border-color: rgba(224, 122, 95, 0.5);
          }
        `}</style>
      </div>
    )
  }

  // ── Questionnaire ────────────────────────────────────────────
  const budgetOptions = form.lead_type === 'tenant' ? BUDGET_TENANT : BUDGET_BUYER

  return (
    <div className="text-cream-100">
      <Link href={`/properties/${slug}`} className="text-coral-400 text-xs tracking-[0.18em] uppercase no-underline">
        ← Back to listing
      </Link>
      <div className="text-xs tracking-[0.2em] uppercase text-coral-400 mt-4 mb-2">Step 1 of 2</div>
      <h1 className="font-heading text-2xl md:text-3xl mb-2">Request the full package</h1>
      <p className="text-charcoal-400 text-sm mb-2">
        For: <span className="text-cream-200">{propertyName}</span>
        {propertyLocation && <span> · {propertyLocation}</span>}
      </p>
      <p className="text-charcoal-500 text-xs mb-8">
        Quick form, then a brief confidentiality agreement. After that, financials, rent rolls,
        and due diligence are yours. We don't share your details outside Stewardship CRE.
      </p>

      <form onSubmit={onSubmitQuestionnaire} className="space-y-4">
        <Row>
          <Field label="Full name *">
            <input required value={form.full_name} onChange={e => set('full_name', e.target.value)} className="form-input" autoComplete="name" />
          </Field>
          <Field label="Email *">
            <input required type="email" value={form.email} onChange={e => set('email', e.target.value)} className="form-input" autoComplete="email" />
          </Field>
        </Row>
        <Row>
          <Field label="Phone">
            <input value={form.phone} onChange={e => set('phone', e.target.value)} className="form-input" autoComplete="tel" />
          </Field>
          <Field label="Company">
            <input value={form.company} onChange={e => set('company', e.target.value)} className="form-input" autoComplete="organization" />
          </Field>
        </Row>
        <Field label="Title / role at company">
          <input value={form.title} onChange={e => set('title', e.target.value)} className="form-input" autoComplete="organization-title" />
        </Field>

        <Field label="What best describes you? *">
          <select required value={form.lead_type} onChange={e => set('lead_type', e.target.value as any)} className="form-input">
            <option value="">Select…</option>
            {LEAD_TYPES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
          </select>
        </Field>

        {form.lead_type && form.lead_type !== 'seller' && (
          <>
            <Row>
              <Field label="Asset class focus">
                <select value={form.asset_class_pref} onChange={e => set('asset_class_pref', e.target.value)} className="form-input">
                  <option value="">No preference</option>
                  {ASSET_CLASSES.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </Field>
              <Field label={form.lead_type === 'tenant' ? 'Rent budget' : 'Acquisition budget'}>
                <select value={form.budget_range} onChange={e => set('budget_range', e.target.value)} className="form-input">
                  <option value="">Prefer not to say</option>
                  {budgetOptions.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </Field>
            </Row>
            <Row>
              <Field label="Timeline">
                <select value={form.timeline} onChange={e => set('timeline', e.target.value)} className="form-input">
                  <option value="">—</option>
                  {TIMELINES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </Field>
              <Field label="Geographic focus">
                <input
                  value={form.geographic_focus}
                  onChange={e => set('geographic_focus', e.target.value)}
                  className="form-input"
                  placeholder="e.g. Lake County IN"
                />
              </Field>
            </Row>
          </>
        )}

        {error && <div className="text-coral-400 text-sm">{error}</div>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-coral-400 hover:bg-coral-300 text-charcoal-950 font-semibold tracking-[0.15em] uppercase text-sm py-3.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4"
        >
          {submitting ? 'Submitting…' : 'Continue'}
        </button>

        <p className="text-xs text-charcoal-500 mt-3">
          By continuing you agree your information may be used by Stewardship CRE to follow up on
          this inquiry. We don't share, sell, or syndicate your contact info.
        </p>
      </form>

      <style jsx>{`
        .form-input {
          width: 100%;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: var(--cream, #f0ede4);
          padding: 10px 12px;
          border-radius: 2px;
          font-size: 14px;
          outline: none;
          transition: border-color 0.15s;
        }
        .form-input:focus {
          border-color: rgba(224, 122, 95, 0.5);
        }
      `}</style>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[10px] tracking-[0.16em] uppercase text-charcoal-400 font-semibold mb-1.5">
        {label}
      </span>
      {children}
    </label>
  )
}

function Row({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
}
