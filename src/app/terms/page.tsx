import type { Metadata } from 'next'
import { Container } from '@/components/layout/Container'
import { FadeIn } from '@/components/motion/FadeIn'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'Stewardship CRE terms of service, including messaging terms and conditions for SMS communications.',
}

const EFFECTIVE_DATE = 'May 5, 2026'

export default function TermsPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-charcoal-950 pt-32 pb-16">
        <Container>
          <FadeIn>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-px bg-coral-400" />
              <span className="text-coral-400 text-xs tracking-[0.3em] uppercase font-semibold font-mono">
                Terms of Service
              </span>
            </div>
            <h1
              className="font-heading text-cream-100 mb-4 max-w-3xl"
              style={{ fontSize: 'clamp(2.25rem, 4.5vw, 3.5rem)' }}
            >
              Terms of Service
            </h1>
            <p className="text-charcoal-400 text-sm">Effective {EFFECTIVE_DATE}</p>
          </FadeIn>
        </Container>
      </section>

      {/* Body */}
      <section className="bg-cream-100 py-16 md:py-24">
        <Container>
          <div className="max-w-3xl mx-auto">
            <FadeIn>
              <div className="space-y-5">
                <P>
                  These Terms of Service (&ldquo;Terms&rdquo;) govern your use of
                  stewardshipcre.com and the services provided by Stewardship CRE, the
                  brokerage arm of Stewardship Asset Group (&ldquo;Stewardship,&rdquo;
                  &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;). By using
                  this website or communicating with us, you agree to these Terms.
                </P>

                <H>Our Services</H>
                <P>
                  Stewardship CRE provides commercial real estate brokerage,
                  investment-sales, consulting, and property-management services across
                  Northwest Indiana and the greater Chicagoland area. Information on
                  this website — including listings, pricing, cap rates, and property
                  details — is provided for general informational purposes, is sourced
                  from parties we believe reliable, and is not guaranteed. It does not
                  constitute an offer, financial advice, or a substitute for your own
                  due diligence.
                </P>

                <H>Property Information &amp; Confidentiality</H>
                <P>
                  Detailed financials, rent rolls, and due-diligence materials are made
                  available only after you submit an inquiry and execute the applicable
                  confidentiality agreement. You agree to use confidential materials
                  solely to evaluate a potential transaction and not to disclose them
                  to unauthorized parties.
                </P>

                <H id="sms">Messaging Terms &amp; Conditions (SMS)</H>
                <P>
                  By providing your mobile phone number to Stewardship CRE — through an
                  inquiry form on this website, by texting us directly, or by providing
                  it verbally during a call and requesting follow-up — you agree to
                  receive conversational and customer-care text messages from us
                  related to the listing(s) and inquiries you have engaged with.
                </P>
                <Ul items={[
                  'Program description: Stewardship CRE sends text messages that respond to property inquiries, share listing and document links, coordinate property tours and calls, and follow up on active conversations.',
                  'Message frequency: Message frequency varies based on your conversation with us. This is not a recurring marketing or promotional program.',
                  'Costs: Message and data rates may apply, depending on your mobile carrier and plan. Stewardship CRE does not charge for the messages themselves.',
                  'Opt out: You may opt out at any time by replying STOP to any text message. You will receive one confirmation message and then no further messages.',
                  'Help: Reply HELP to any message for assistance, or email inquiries@stewardshipcre.com.',
                  'Eligibility: Supported carriers include major U.S. mobile carriers. Carriers are not liable for delayed or undelivered messages.',
                  'No condition of service: Your consent to receive text messages is not a condition of purchasing or receiving any property, service, or information from us.',
                ]} />
                <P>
                  We do not sell or share your mobile number or message content with
                  third parties for their marketing. See our{' '}
                  <a className="text-coral-600 underline" href="/privacy">Privacy Policy</a>{' '}
                  for full details on how we handle your information.
                </P>

                <H>Acceptable Use</H>
                <P>
                  You agree not to use this website or our communications channels for
                  any unlawful purpose, to misrepresent your identity, or to interfere
                  with the operation of our systems.
                </P>

                <H>Disclaimers &amp; Limitation of Liability</H>
                <P>
                  This website and its content are provided &ldquo;as is&rdquo; without
                  warranties of any kind. To the fullest extent permitted by law,
                  Stewardship CRE is not liable for any indirect, incidental, or
                  consequential damages arising from your use of the site or reliance
                  on its content. Nothing in these Terms limits liability that cannot
                  be limited under applicable law.
                </P>

                <H>Changes to These Terms</H>
                <P>
                  We may update these Terms from time to time. Material changes will be
                  reflected by updating the effective date above. Continued use of the
                  site after changes constitutes acceptance of the revised Terms.
                </P>

                <H>Contact</H>
                <P>
                  Questions about these Terms? Email{' '}
                  <a className="text-coral-600 underline" href="mailto:inquiries@stewardshipcre.com">
                    inquiries@stewardshipcre.com
                  </a>
                  .
                </P>
                <P className="text-charcoal-500 text-sm">
                  Stewardship CRE · Stewardship Asset Group · Northwest Indiana
                </P>
              </div>
            </FadeIn>
          </div>
        </Container>
      </section>
    </>
  )
}

// ── Local presentational helpers ───────────────────────────────────────────

function H({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <h2
      id={id}
      className="font-heading text-charcoal-900 pt-6"
      style={{ fontSize: 'clamp(1.25rem, 2.2vw, 1.6rem)' }}
    >
      {children}
    </h2>
  )
}

function P({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <p className={`text-charcoal-600 leading-relaxed ${className}`}>{children}</p>
}

function Ul({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 list-disc pl-5">
      {items.map((it, i) => (
        <li key={i} className="text-charcoal-600 leading-relaxed">{it}</li>
      ))}
    </ul>
  )
}
