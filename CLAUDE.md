# CLAUDE.md — Stewardship CRE

> Working memory for Claude assistants. Auto-loaded as context when working in this repo. Read this first; refer to `PROJECT.md` for the full architectural deep-dive.

---

## Quick orientation

This is the **public marketing site** for Stewardship CRE — the commercial brokerage arm of Stewardship Asset Group, serving Northwest Indiana and Chicagoland. It's one of two repos in the Stewardship ecosystem:

| Repo | Purpose | Path | Audience |
|---|---|---|---|
| `stewardshipcre` (this one) | Public marketing site | `~/Documents/GitHub/stewardshipcre` | Prospects, public |
| `CRECRM` | Internal CRM dashboard (deployed name: `stewardship-crm`) | `~/Documents/GitHub/CRECRM` | John only (single-user, gated) |

The two apps are deliberately separate:
- **Marketing site** = read-only public face, listings display, contact form
- **CRM** = operations, lead inbox, comp analysis, deal pipeline, AI agents

They communicate via one HTTPS connector: marketing site contact form → POST `/api/leads/intake` on the CRM.

---

## Stack snapshot

- **Next.js 16.2.1** (Turbopack) + **React 19.2.4** + **TypeScript 5.9**
- **Tailwind CSS 4.2.2** using `@theme` directive (no `tailwind.config.js`)
- **framer-motion 12.38** + **Lenis** for scroll/motion
- **zod 4** for schema validation
- **Netlify** hosting via `@netlify/plugin-nextjs`, Node 20

Sibling CRM stack (different): Next 14 + React 18 + Tailwind 3 + Supabase + raw fetch to Anthropic API. Don't conflate.

---

## Brand system (lock these — they appear in every new asset)

**Primary accent: CORAL** (matches internal CRM dashboard, differentiates from XPAND Commercial's teal). Teal kept as a secondary/data accent only.

```
Coral-400 (PRIMARY ACCENT)        #E07A5F
Coral-500 (hover)                 #C66648
Steward-base (body bg gradient)   #0A1615 → #0D1F1E → #142827 → #0A1615
Charcoal-900 (sections)           #1A1A1A
Charcoal-800 (cards)              #282828
Cream-50 (hero text)              #FFFFFF
Cream-100 (body on dark)          #FAF8F5
Teal-400 (secondary/data accent)  #4ECDC4
```

Body background uses a 4-stop diagonal gradient through the steward-* tints, matching the CRM's ambient feel.

**Typography hierarchy:**
- **Cinzel** — display only (wordmarks, hero accents, big numbers). Use sparingly.
- **DM Sans** — section headings (`<h1>`–`<h6>` default).
- **Inter** — body copy.
- **JetBrains Mono** — data labels, prices, addresses, status — Bloomberg-terminal voice.

Spacing: `--spacing-section: clamp(80px, 12vw, 160px)` via `py-section` class.

---

## Domains & infrastructure

- **Marketing site:** `stewardshipcre.com` → Netlify (`stewardship-cre.netlify.app`, site ID `0467338a-1a5c-4c61-bd14-3a361e4b213b`, Stewardship Squad team / Pro plan).
- **Sibling domain:** `stewardshipassetgroup.com` (property management arm — different brand, different audience).
- **Email infrastructure:**
  - `john@johnmathewson.co` — current personal catch-all (used to receive all platform leads pre-migration)
  - `john@stewardshipcre.com` — provisioned in Google Workspace
  - `inquiries@stewardshipcre.com` — **dedicated lead pipeline mailbox (provisioning in progress)**. AI watcher polls this exclusively → clean signal, no classification needed.
  - Forwarding rule on `john@johnmathewson.co` for `@crexi.com / @loopnet.com / @costar.com / @buildout.com` senders → `inquiries@stewardshipcre.com` as safety net during migration.
- **Twilio:**
  - Number: **+1 (317) 804-1980** (Indianapolis area code, fits the regional market)
  - Account SID and Auth Token configured via env vars (NEVER paste in chat — original token leaked, was rotated)
  - **A2P 10DLC registration in progress** — required before SMS to consumers will deliver reliably

---

## Architecture decisions (locked in)

### 1. Path B — CRM is source of truth for listings
Stewardship CRM (Supabase) holds canonical listing data. Marketing site reads from it. CREXi/LoopNet sync via API or browser-automated entry. Buildout free tier (eXp) has no API and isn't worth $200–400/mo to upgrade.

### 2. Two-app split (NOT merge)
The lead inbox lives **inside the CRM**, not on the marketing site. Marketing site stays public read-only. Auth wall around all operations.

### 3. Listings as Drive folders, not (initially) DB rows
For the lead-response pipeline, listings live as folders under `/Stewardship CRE/Active Listings/[address]/` with OMs, due diligence, photos. Single OAuth grant, set up once. Per-listing workflow = drag the finished OM into the right subfolder. No registration ritual. The DB `listings` table can be added later for the public site without disturbing the email pipeline.

### 4. Two-tier acknowledgment SLA
- **<60 sec:** automated brief receipt ("Got your inquiry on [property]. I'm running right now — will follow up personally within the hour. — John"). Auto-sent. No OM, no details.
- **<60 min:** AI-drafted substantive reply with OM attached. **John taps to send.** Risk surface drops to near-zero on multi-million-dollar deals.

### 5. Mobile-first inbox UI
The broker reviews leads from his phone 90% of the time. The `/inbox/[id]` page is what Twilio SMS deeplinks open — must be flawless on mobile. Card-based lists (no tables), thumb-zone action bar, sticky bottom Send button, no horizontal scroll.

### 6. Schema migrations discipline (just adopted)
Going forward, schema changes are SQL files in `CRECRM/supabase/migrations/`. The CRM didn't have this folder before; we're starting it now. Cheap discipline, makes the schema reproducible.

---

## Currently building: inbound lead pipeline (live in `CRECRM`)

```
Lead arrives  ──►  Apps Script catches  ──►  POST /api/leads/intake (CRECRM)
(any channel)      (60-sec poll)              ▼
                                              Claude Haiku extracts
                                              (sender/property/intent/urgency)
                                              ▼
                                              Insert into leads table
                                              ▼
                          ┌───────────────────┼───────────────────┐
                          ▼                   ▼                   ▼
                    Auto-ack (<60s)     Claude Sonnet         Twilio SMS
                    via Gmail API       drafts substantive    to John's cell
                    from john@stew…     reply w/ OM attached  with /inbox/[id] link
                                                              ▼
                                                              John reviews + sends
                                                              from john@stew… via Gmail API
```

**Channel ingress paths converge at `/api/leads/intake`:**
| Channel | Ingress | Auto-ack |
|---|---|---|
| Email (CREXi/LoopNet/Buildout/direct) | Apps Script polling Workspace | Auto-reply email |
| SMS | Twilio webhook | Auto-reply SMS |
| Voice | Twilio voicemail → transcription → webhook | Auto-reply SMS to caller (NOT voicemail — creepy) |
| Website form | Marketing site POST | Auto-reply email |

---

## Schema additions to CRECRM Supabase (pending migration)

Existing tables (NO changes): `properties`, `contacts`, `companies`, `deals`, `deal_stages`, `intakes`, `intake_units`, `comps`.

**Two new tables:**

```sql
leads
├── id uuid pk, created_at timestamptz
├── org_id, created_by uuid     -- match existing hardcoded constants
├── source enum                 -- crexi|loopnet|buildout|costar|website|email|phone|sms
├── sender_name, sender_email, sender_phone text
├── property_id uuid → properties (nullable, AI-matched)
├── property_label text         -- "Joliet medical building" (what they said)
├── intent enum                 -- buy|lease|sell|info
├── urgency enum                -- hot|warm|cold
├── qualifier_summary text      -- AI-extracted: "1031 buyer, $4M, 60-day window"
├── raw_email_subject/body text
├── claude_extraction jsonb
├── auto_ack_sent_at timestamptz
├── draft_reply text
├── draft_attachments jsonb     -- [{name, drive_url}]
├── final_reply text, final_sent_at timestamptz
├── status enum                 -- new|acknowledged|drafted|sent|archived
├── linked_contact_id uuid → contacts (dedupe known senders)
└── linked_deal_id uuid → deals (promote-to-pipeline path)

lead_messages
├── id, lead_id → leads, sent_at
├── direction (inbound|outbound)
├── subject, body
└── attachments jsonb
```

**Single-user constants** (matches existing CRM convention from `/api/intake/save/route.ts`):
- `ORG_ID = "a0000000-0000-0000-0000-000000000001"`
- `USER_ID = "b0000000-0000-0000-0000-000000000001"`

---

## CRM coding conventions (mirror these when adding to CRECRM)

- **kebab-case** filenames (`create-contact-modal.tsx`)
- All components are `'use client'`
- **Raw fetch to `api.anthropic.com/v1/messages`** — NOT the SDK abstraction (matches existing pattern)
- Models: **Claude Haiku 4.5** for extraction (`claude-haiku-4-5-20251001`), **Claude Sonnet 4** for drafting (`claude-sonnet-4-20250514`)
- Plain `useState`/`useCallback` — no zustand/jotai/redux/zod/form libs
- Tailwind-only styling with custom `.glass` classes (in `globals.css`); no shadcn/radix
- Middleware-based auth (`/src/middleware.ts`) — any new gated route is automatically protected
- **Add prompt caching** for OM context — listing OMs are reused across many drafts; huge cost win

---

## Reference assets in this repo

- `PROJECT.md` — full architectural deep-dive (component inventory, motion system, design tokens, tech debt)
- `public/banner-john.html` — John's personal-brand banner for CREXi/LinkedIn (2000×500 + 1584×396). Open in Chrome, use DevTools "Capture node screenshot" to export PNG.
- `public/lead-pipeline-map.html` — visual architecture map for the inbound lead pipeline. Same brand system.
- `src/data/portfolio.ts` — static listing data (placeholder Unsplash; replace with real photos in Phase 1)
- `src/components/sections/` — composed homepage sections (HeroSlideshow, FeaturedListings, CaseStudies, ServicesPinned, etc.)

## SEO content layer (deliberately separate visual world)

156 static-HTML SEO pages live in `public/`, organized by category. They serve at clean URLs through Next.js's static-asset pipeline:

```
public/
├── markets/[slug]/index.html       (1 — NW Indiana regional hub)
├── counties/[slug]/index.html      (3 — Lake, Porter, LaPorte)
├── cities/[slug]/index.html        (28 — every NW Indiana city we cover)
├── property-types/[slug]/index.html (16 — office, industrial, retail, flex, etc.)
├── services/[slug]/index.html      (14 — BOV, leasing, advisory, etc.)
├── investments/[slug]/index.html   (8 — NNN, gas station, car wash, etc.)
├── insights/[slug]/index.html      (86 — long-tail Q&A briefs)
└── assets/css/style.css            (shared SEO-page stylesheet)
```

**Visual identity:** The SEO pages have their **own** simple header/nav/footer using `public/assets/css/style.css` — they don't share the cinematic brand system of the main marketing site. This is intentional: the SEO content layer is supposed to be "discreet but indexable" — not fight the homepage. Clicking the brand wordmark / "Hub" link on any SEO page returns the user to `/` (the cinematic homepage).

**Schema markup:** Every page already includes `BreadcrumbList` + `FAQPage` JSON-LD per the SEO protocol (`stewardship-commercial-seo-pages/SEO-page-protocol.md` in the source folder). Canonical URLs point to `https://www.stewardshipcre.com/[category]/[slug]/`.

**Discovery + indexing:**
- `src/app/sitemap.ts` — dynamically reads `public/` at build time and emits every category/slug combo into `/sitemap.xml` (currently 162 URLs: 7 main app routes + 155 SEO pages).
- `src/app/robots.ts` — allows all, points crawlers to `/sitemap.xml`, blocks `/api/` and `/admin/`.
- `Footer.tsx` — 4th column "Markets" with 6 anchor links to high-value money pages so the SEO layer isn't orphaned (Google devalues orphan pages).

**Source content lives outside the repo:** The original Codex-generated source is at `/Users/stewardship/Documents/New project/stewardship-commercial-seo-pages/`. To regenerate or add new pages, edit there and re-copy `pages/` + `assets/` into `public/`. The sitemap will auto-pick up new URLs at next build.

**To add a new SEO page:**
1. Drop a new `index.html` into `public/[category]/[slug]/` (must be valid HTML with title, description, canonical, schema)
2. Make sure internal "Hub" links point to `/` (not `../../../index.html`)
3. Optionally add an anchor link in `Footer.tsx` `FOOTER_LINKS.Markets` if it's a money page
4. Push — sitemap auto-updates at build time

**Visual style is deliberately different from the main site.** Don't restyle SEO pages to match the cinematic brand — that's the wrong instinct. They're a separate content layer.

---

## Open threads (as of this write)

1. **John needs to:** provision `inquiries@stewardshipcre.com`, rotate Twilio auth token (leaked in chat), start A2P 10DLC registration, set up `/Stewardship CRE/` Drive folder structure, drop OMs for active listings into folders.
2. **Claude needs to:** write SQL migration for `leads` + `lead_messages`, build `/api/leads/intake` endpoint in CRECRM, build mobile-first `/inbox` + `/inbox/[id]` UI, write Apps Script email watcher.
3. **Pending decisions:** none — schema migrations and API key both confirmed.
4. **CREXi profile updates queued:** new banner (rendered via `public/banner-john.html`), new About text (drafted), tagline fix (`Retail · Office · Industrial · Storage · 12 Years`).

---

## Voice + tone notes (for any AI-drafted content)

- John reads pro formas the way **investors** do, not the way listing agents do (he's an active CRE owner himself).
- Voice is direct, concrete, numbers-forward. No "elevate your portfolio" / "luxury" / "premier opportunity" broker-speak.
- The site brand line is "Commercial Real Estate Done Right" — applies to written voice too: *show* the rigor, don't claim it.
- Auto-acknowledgment template (locked):
  > Hey [Name] — got your inquiry on **[property]**. I'm running between meetings right now but will follow up personally within the hour. — John
- Substantive reply (AI-drafted): tight, 2-3 qualifying questions max, OM attached, signature block.

---

*Last updated: April 2026. When in doubt, ask John before assuming.*
