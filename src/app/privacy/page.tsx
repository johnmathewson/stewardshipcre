import type { Metadata } from 'next'
import { Container } from '@/components/layout/Container'
import { FadeIn } from '@/components/motion/FadeIn'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Stewardship CRE privacy policy — how we collect, use, and protect your personal information, including phone numbers and SMS messaging consent.',
}

const EFFECTIVE_DATE = 'May 5, 2026'

export default function PrivacyPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-charcoal-950 pt-32 pb-16">
        <Container>
          <FadeIn>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-px bg-coral-400" />
              <span className="text-coral-400 text-xs tracking-[0.3em] uppercase font-semibold font-mono">
                Privacy Policy
              </span>
            </div>
            <h1
              className="font-heading text-cream-100 mb-4 max-w-3xl"
              style={{ fontSize: 'clamp(2.25rem, 4.5vw, 3.5rem)' }}
            >
              Your Privacy Matters
            </h1>
            <p className="text-charcoal-400 text-sm">Effective {EFFECTIVE_DATE}</p>
          </FadeIn>
        </Container>
      </section>

      {/* Body */}
      <section className="bg-cream-100 py-16 md:py-24">
        <Container>
          <div className="max-w-3xl mx-auto prose-policy">
            <Policy>
              <P>
                Stewardship CRE, the brokerage arm of Stewardship Asset Group
                (&ldquo;Stewardship,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or
                &ldquo;our&rdquo;), respects your privacy. This policy explains what
                information we collect, how we use it, and the choices you have. It
                applies to stewardshipcre.com and to any communications we exchange
                with you, including email, phone, and text message.
              </P>

              <H>Information We Collect</H>
              <P>We collect information you provide directly to us, including:</P>
              <Ul items={[
                'Contact details — name, email address, phone number, and company — when you submit an inquiry, request a property package, sign a confidentiality agreement, or contact us.',
                'Inquiry details — the property or properties you are interested in, your buyer/tenant criteria, budget range, and timeline.',
                'Communications — the content of emails, texts, and call notes exchanged with our team.',
              ]} />
              <P>
                We also collect limited technical information automatically when you
                visit our website (such as pages viewed and general location derived
                from your IP address) to operate and improve the site. We do not use
                this information to identify you personally.
              </P>

              <H>How We Use Your Information</H>
              <Ul items={[
                'To respond to your inquiries and provide the property information, documents, and services you request.',
                'To coordinate property tours, calls, and follow-ups on active conversations.',
                'To send you transactional and customer-care messages related to listings you have inquired about.',
                'To comply with legal obligations and protect our rights and the rights of our clients.',
              ]} />

              <H id="sms">Text Messaging (SMS) &amp; Phone Numbers</H>
              <P>
                When you provide your phone number — by submitting an inquiry form on
                this website, texting us directly, or verbally during a call while
                requesting follow-up — you consent to receive conversational and
                customer-care text messages from Stewardship CRE related to your
                inquiry. These messages may include responses to questions, listing
                and document links, tour scheduling, and follow-ups on active
                conversations.
              </P>
              <Ul items={[
                'Message frequency varies based on your conversation with us.',
                'Message and data rates may apply, depending on your mobile carrier and plan.',
                'You can opt out of text messages at any time by replying STOP to any message. You will receive a single confirmation and no further messages.',
                'For help, reply HELP to any message, or email inquiries@stewardshipcre.com.',
                'Consent to receive text messages is not a condition of purchasing or receiving any service.',
              ]} />
              <P>
                <strong>
                  We do not sell, rent, or share your phone number or the contents of
                  your text messages with third parties for their own marketing
                  purposes.
                </strong>{' '}
                Mobile information is shared only with service providers (such as our
                messaging platform) strictly to deliver the messages you have
                requested, and never for promotional purposes by those providers. No
                mobile opt-in data is shared with any third party for marketing.
              </P>

              <H>How We Share Information</H>
              <P>
                We do not sell your personal information. We share it only as needed
                to provide our services — for example, with the property owner or
                principals in a transaction you are pursuing, with service providers
                who operate our website, CRM, email, and messaging systems under
                confidentiality obligations, or when required by law.
              </P>

              <H>Data Retention &amp; Security</H>
              <P>
                We retain your information for as long as needed to provide our
                services and meet legal and recordkeeping obligations, then delete or
                anonymize it. We use reasonable administrative and technical
                safeguards to protect your information, though no method of
                transmission or storage is completely secure.
              </P>

              <H>Your Choices</H>
              <Ul items={[
                'Opt out of text messages by replying STOP.',
                'Unsubscribe from emails using the link in any email, or by contacting us.',
                'Request access to, correction of, or deletion of your personal information by contacting us at the address below.',
              ]} />

              <H>Contact Us</H>
              <P>
                Questions about this policy or your information? Email{' '}
                <a className="text-coral-600 underline" href="mailto:inquiries@stewardshipcre.com">
                  inquiries@stewardshipcre.com
                </a>
                .
              </P>
              <P className="text-charcoal-500 text-sm">
                Stewardship CRE · Stewardship Asset Group · Northwest Indiana
              </P>
            </Policy>
          </div>
        </Container>
      </section>
    </>
  )
}

// ── Local presentational helpers ───────────────────────────────────────────

function Policy({ children }: { children: React.ReactNode }) {
  return <FadeIn><div className="space-y-5">{children}</div></FadeIn>
}

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
