'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Container } from '@/components/layout/Container'
import { MagneticButton } from '@/components/motion/MagneticButton'

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [pending, setPending] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setPending(true)
    // TODO: wire to /api/contact when backend is ready
    setTimeout(() => {
      setPending(false)
      setSubmitted(true)
    }, 600)
  }

  return (
    <>
      {/* Hero */}
      <section className="relative bg-charcoal-950 pt-40 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(78,205,196,0.06),transparent_60%)]" />
        <Container className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-px bg-teal-400" />
              <span className="text-teal-400 text-xs tracking-[0.3em] uppercase font-semibold font-mono">
                Contact
              </span>
            </div>
            <h1
              className="font-display text-cream-50 mb-6 leading-[0.95]"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}
            >
              Let&apos;s <span className="text-teal-400 teal-glow-text">Connect</span>
            </h1>
            <p className="text-xl text-charcoal-400 max-w-xl leading-relaxed">
              Tell us a sentence about what you need. We respond within 24 hours.
              Or skip the form and book 15 minutes directly.
            </p>
          </motion.div>
        </Container>
      </section>

      {/* Two-column: Form + Calendar */}
      <section className="bg-charcoal-950 pb-section relative overflow-hidden">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-charcoal-800/50">
            {/* SHORT FORM — left */}
            <div className="bg-charcoal-900 p-8 md:p-12">
              <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-teal-400 mb-3">
                Option 01 · Send us a note
              </p>
              <h2
                className="font-display text-cream-50 mb-8"
                style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)' }}
              >
                Quick Message
              </h2>

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border-l-2 border-teal-400 pl-6 py-4"
                >
                  <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-teal-400 mb-2">
                    Message Received
                  </p>
                  <p className="text-cream-100 text-lg">
                    Thanks, {form.name.split(' ')[0] || 'friend'}.
                  </p>
                  <p className="text-charcoal-400 text-sm mt-2">
                    A member of our team will be in touch within 24 hours.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <MinimalInput
                    label="Your name"
                    value={form.name}
                    onChange={(v) => setForm({ ...form, name: v })}
                    placeholder="John Smith"
                    required
                  />
                  <MinimalInput
                    label="Best email"
                    type="email"
                    value={form.email}
                    onChange={(v) => setForm({ ...form, email: v })}
                    placeholder="john@company.com"
                    required
                  />
                  <MinimalTextarea
                    label="What do you need?"
                    value={form.message}
                    onChange={(v) => setForm({ ...form, message: v })}
                    placeholder="Looking for 8,000 SF retail in Valparaiso. Or — just curious what's available."
                    rows={4}
                    required
                  />

                  <MagneticButton>
                    <button
                      type="submit"
                      disabled={pending}
                      className="group inline-flex items-center gap-3 bg-teal-400 hover:bg-teal-300 text-charcoal-950 px-7 py-4 text-xs tracking-[0.2em] uppercase font-semibold transition-all duration-500 disabled:opacity-50"
                    >
                      {pending ? 'Sending...' : 'Send Message'}
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </button>
                  </MagneticButton>
                </form>
              )}
            </div>

            {/* CALENDAR — right */}
            <div className="bg-charcoal-900 p-8 md:p-12 flex flex-col">
              <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-teal-400 mb-3">
                Option 02 · Book a call
              </p>
              <h2
                className="font-display text-cream-50 mb-8"
                style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)' }}
              >
                15-Min Intro
              </h2>

              {/* Calendar embed placeholder — swap with Calendly/SavvyCal iframe when ready */}
              <div className="flex-1 flex flex-col gap-4">
                <div className="border border-charcoal-800 bg-charcoal-950/40 px-6 py-8 flex-1 flex flex-col justify-center items-center text-center min-h-[280px]">
                  <div className="w-12 h-12 border border-teal-400/40 flex items-center justify-center mb-4">
                    <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                    </svg>
                  </div>
                  <p className="text-cream-100 text-base mb-2">Pick a time that works for you</p>
                  <p className="text-charcoal-400 text-sm mb-6 max-w-xs">
                    No pitch, no pressure. We answer your CRE questions and tell you
                    if we&apos;re a good fit.
                  </p>
                  <MagneticButton>
                    <a
                      href="https://calendly.com/stewardship-cre/intro"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 border border-teal-400 text-teal-400 hover:bg-teal-400 hover:text-charcoal-950 px-7 py-4 text-xs tracking-[0.2em] uppercase font-semibold transition-all duration-500"
                    >
                      Book 15 Minutes
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </a>
                  </MagneticButton>
                </div>

                {/* Direct contact info */}
                <div className="grid grid-cols-2 gap-px bg-charcoal-800/40 mt-2">
                  <div className="bg-charcoal-900 px-5 py-4">
                    <p className="font-mono text-[9px] tracking-[0.3em] uppercase text-charcoal-500 mb-1.5">
                      Email
                    </p>
                    <a href="mailto:info@stewardshipcre.com" className="text-sm text-cream-100 hover:text-teal-400 transition-colors">
                      info@stewardshipcre.com
                    </a>
                  </div>
                  <div className="bg-charcoal-900 px-5 py-4">
                    <p className="font-mono text-[9px] tracking-[0.3em] uppercase text-charcoal-500 mb-1.5">
                      Phone
                    </p>
                    <a href="tel:+12195550100" className="text-sm text-cream-100 hover:text-teal-400 transition-colors">
                      (219) 555-0100
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}

function MinimalInput({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  required,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  placeholder?: string
  required?: boolean
}) {
  return (
    <label className="block group">
      <span className="block font-mono text-[10px] tracking-[0.3em] uppercase text-charcoal-500 mb-2 group-focus-within:text-teal-400 transition-colors">
        {label}
        {required && <span className="text-teal-400">*</span>}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full bg-transparent text-cream-100 text-base border-b border-charcoal-700 focus:border-teal-400 outline-none py-3 transition-colors duration-300 placeholder:text-charcoal-600"
      />
    </label>
  )
}

function MinimalTextarea({
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
  required,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  rows?: number
  required?: boolean
}) {
  return (
    <label className="block group">
      <span className="block font-mono text-[10px] tracking-[0.3em] uppercase text-charcoal-500 mb-2 group-focus-within:text-teal-400 transition-colors">
        {label}
        {required && <span className="text-teal-400">*</span>}
      </span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        rows={rows}
        className="w-full bg-transparent text-cream-100 text-base border-b border-charcoal-700 focus:border-teal-400 outline-none py-3 transition-colors duration-300 placeholder:text-charcoal-600 resize-none"
      />
    </label>
  )
}
