# Stewardship CRE — Project Documentation

> Full-service commercial real estate brokerage marketing site for Stewardship Asset Group, serving Northwest Indiana and the greater Chicagoland area.

**Live:** https://stewardship-cre.netlify.app
**Repo:** `stewardship-cre/` (local, not yet pushed to GitHub)
**Netlify Site ID:** `0467338a-1a5c-4c61-bd14-3a361e4b213b`
**Team:** Stewardship Squad (Pro plan)

---

## Table of Contents

1. [Project Goals](#project-goals)
2. [Tech Stack](#tech-stack)
3. [Design System](#design-system)
4. [Architecture](#architecture)
5. [Component Inventory](#component-inventory)
6. [Page Composition](#page-composition)
7. [Motion / Animation System](#motion--animation-system)
8. [Data Layer](#data-layer)
9. [Deployment](#deployment)
10. [Strategic Architecture (CRM, Listings, Inbound Leads)](#strategic-architecture)
11. [Roadmap & Next Steps](#roadmap--next-steps)
12. [Known Issues & Tech Debt](#known-issues--tech-debt)
13. [Reference: Color Migration Notes](#reference-color-migration-notes)

---

## Project Goals

The site needs to do three things at once:

1. **Cinematic / agency-grade design** — communicate "serious firm, top-of-class" within the first 10 seconds of landing
2. **Real proof + credibility** — show actual listings, stats, and case studies, not Unsplash placeholders
3. **Frictionless conversion** — sticky search, magnetic CTAs, calendar booking, < 5-min lead acknowledgment

**The principle:** Animation should *reveal* content, not BE content. Every cinematic moment should serve credibility or conversion.

**The benchmark:** Better than 95% of CRE sites including national brands (CBRE, JLL, Newmark regional). Comparable to Avison Young's premium pages, lsce.com-style cinematic flow, but with modern speed.

---

## Tech Stack

### Runtime
- **Next.js 16.2.1** with Turbopack
- **React 19.2.4**
- **TypeScript 5.9.3**
- **Node 20** (Netlify build env)

### Styling & UI
- **Tailwind CSS 4.2.2** (using `@theme` directive, no `tailwind.config.js`)
- **clsx + tailwind-merge** via `cn()` utility (`src/lib/utils.ts`)

### Motion
- **framer-motion 12.38.0** — scroll-linked transforms, page transitions, spring physics
- **lenis** — buttery-smooth damped scroll inertia

### Forms / Validation
- **zod 4.3.6** (installed, used in form schemas)

### Hosting
- **Netlify** with `@netlify/plugin-nextjs` for full Next.js SSR/edge support
- Production URL: `https://stewardship-cre.netlify.app`

---

## Design System

### Color Palette

The site uses **coral-on-deep-teal-charcoal** as the brand foundation, with cream for soft contrast and JetBrains Mono for data labels. **Primary accent is coral `#E07A5F`** (matches the internal Stewardship CRM dashboard). Teal is retained as a *secondary* / data accent only — the same role it plays in the CRM's "Earned" chart line. All colors are CSS custom properties exposed via Tailwind v4's `@theme` block.

> **Brand history:** the site originally used a gold + forest palette (early dev), migrated to teal-on-charcoal, then in April 2026 shifted to coral-on-charcoal to (a) match the internal CRM dashboard and (b) differentiate from XPAND Commercial's teal palette which dominated John's prior firm. See "Reference: Color Migration Notes" at the bottom.

#### Charcoal (background, surfaces, body text)
| Token | Hex | Use |
|---|---|---|
| `charcoal-50` | `#F7F7F7` | Highest contrast on dark backgrounds |
| `charcoal-100` | `#E3E3E3` | Light text |
| `charcoal-200` | `#C8C8C8` | Subtle text |
| `charcoal-300` | `#A4A4A4` | Body copy on dark |
| `charcoal-400` | `#818181` | Secondary text |
| `charcoal-500` | `#666666` | Tertiary text, label color |
| `charcoal-600` | `#4D4D4D` | Faded text, hover states |
| `charcoal-700` | `#383838` | Borders |
| `charcoal-800` | `#282828` | Card surfaces |
| `charcoal-900` | `#1A1A1A` | Section backgrounds |
| `charcoal-950` | `#0D0D0D` | Page background |

#### Cream
| Token | Hex | Use |
|---|---|---|
| `cream-50` | `#FFFFFF` | Pure white, hero text |
| `cream-100` | `#FAF8F5` | Body text on dark |
| `cream-200` | `#F0EDE8` | Soft surfaces |
| `cream-300` | `#E5E0D8` | Cream variant |
| `cream-400` | `#D4CEC4` | Muted cream |

#### Coral (PRIMARY brand accent)
| Token | Hex | Use |
|---|---|---|
| `coral-50`  | `#FCF1EE` | Subtle coral tint backgrounds |
| `coral-100` | `#F8DBD2` | Light surfaces |
| `coral-200` | `#F2BCAB` | Disabled/light buttons |
| `coral-300` | `#EA9A82` | Hover-light, secondary buttons |
| `coral-400` | `#E07A5F` | **Primary brand accent** — CTAs, links, hero accents, active states |
| `coral-500` | `#C66648` | Primary CTA hover |
| `coral-600` | `#A55236` | Pressed state |
| `coral-700` | `#843E27` | Deep accent |
| `coral-800` | `#5F2C1B` | Dark variant |
| `coral-900` | `#3A1A10` | Deepest |

#### Steward (deep teal-charcoal background tints — matches internal CRM)
| Token | Hex | Use |
|---|---|---|
| `steward-base`  | `#0A1615` | Body gradient endpoints |
| `steward-dark`  | `#0D1F1E` | Body gradient (~30%) |
| `steward-mid`   | `#142827` | Body gradient (~60%) |
| `steward-panel` | `#1A2726` | Card surfaces in CRM-aligned components |

The body uses `linear-gradient(160deg, steward-base 0%, steward-dark 30%, steward-mid 60%, steward-base 100%)` background-attachment fixed.

#### Teal (secondary / data accent — same role as CRM's "Earned" chart line)
| Token | Hex | Use |
|---|---|---|
| `teal-50` | `#EDFAF8` | Subtle teal tint backgrounds |
| `teal-100` | `#D0F4EE` | Light surfaces |
| `teal-200` | `#A3E8DD` | Disabled/light buttons |
| `teal-300` | `#6DD8C9` | Hover-light, secondary buttons |
| `teal-400` | `#4ECDC4` | **Primary brand accent** — CTAs, links, active states |
| `teal-500` | `#3CB8AD` | Primary CTA hover |
| `teal-600` | `#2E9A91` | Pressed state |
| `teal-700` | `#247B74` | Deep accent |
| `teal-800` | `#1A5C57` | Dark variant |
| `teal-900` | `#103D3A` | Deepest |

#### Navy (legacy, used in CTASection background)
Same scale as charcoal but with cooler temperature. Tokens `navy-50` through `navy-900`.

### Typography

Three voices working together:

#### Display — `Cinzel`
- **Use sparingly.** Reserved for: the wordmark, the hero "DONE RIGHT" accent, big display numbers, section heroes.
- Font variable: `--font-display`
- Class: `.font-display`
- Style: tracking 0.02em, uppercase, weight 600+

#### Heading — `DM Sans`
- The everyday "modern serious" voice. Used for section headings, card titles, regular `<h1>–<h6>`.
- Font variable: `--font-heading`
- All `<h1>–<h6>` default to this via `globals.css`
- Style: tracking -0.01em (tight), weight 600

#### Body — `Inter`
- Body copy, paragraphs, descriptions.
- Font variable: `--font-body`
- Default body font

#### Mono — `JetBrains Mono`
- Data labels, prices, addresses, SF measurements, status indicators, eyebrow text, ticker rows.
- Font variable: `--font-mono`
- Class: `font-mono`
- This is the "Bloomberg terminal" voice that makes the site feel like a working firm, not a brochure.

### Spacing

```css
--spacing-section: clamp(80px, 12vw, 160px);     /* py-section */
--spacing-section-sm: clamp(48px, 8vw, 96px);    /* py-section-sm */
```

Used as `py-section` class on every full-width section.

### Animation Tokens

```css
--animate-marquee: marquee 30s linear infinite;
--animate-fade-in: fadeIn 0.6s ease-out forwards;
--animate-slide-up: slideUp 0.6s ease-out forwards;
--animate-shimmer: shimmer 2s linear infinite;
--animate-pulse-glow: pulseGlow 3s ease-in-out infinite;
--animate-float: float 6s ease-in-out infinite;
```

### Special Effects (custom CSS classes)

Defined in `src/app/globals.css`:

- `.glass` — frosted blur background (`backdrop-filter: blur(20px) saturate(180%)`)
- `.glass-light` — softer glass for tags
- `.scroll-progress` — top-of-page progress bar in teal gradient
- `.grain-overlay::after` — fixed-position 2% opacity SVG noise grain
- `.gradient-border` — animated teal gradient border using `mask-composite`
- `.reveal-line` — hover-triggered teal underline using `transform: scaleX`
- `.animated-underline` — width-based hover underline
- `.image-reveal` — clip-path mask animation for image entries
- `.teal-glow` — box-shadow halo
- `.teal-glow-text` — text-shadow halo

### Selection / Scrollbar

- Selection: teal-400 background, charcoal-950 text
- Scrollbar: 6px wide, teal-600 thumb, charcoal-950 track

---

## Architecture

```
src/
├── app/                          # Next.js 16 app router
│   ├── layout.tsx                # Root layout w/ fonts, Header, Footer, SmoothScroll, ScrollProgress, PageTransition
│   ├── page.tsx                  # Homepage composition
│   ├── globals.css               # Theme + custom utility classes
│   ├── about/page.tsx
│   ├── contact/page.tsx          # 3-field form + Calendly booking column
│   ├── insights/page.tsx
│   ├── not-found.tsx
│   ├── properties/page.tsx
│   ├── services/page.tsx
│   ├── team/page.tsx
│   └── api/                      # (placeholder routes)
│
├── components/
│   ├── layout/
│   │   ├── Container.tsx         # max-w-[1400px] wrapper, responsive padding
│   │   ├── Header.tsx            # Glass header, magnetic CTA, mobile nav
│   │   ├── Footer.tsx            # Brand + 3 link columns + LinkedIn
│   │   └── MobileNav.tsx         # Full-screen overlay menu
│   │
│   ├── motion/
│   │   ├── SmoothScroll.tsx      # Lenis provider, exposes window.__lenis
│   │   ├── ScrollProgress.tsx    # Top progress bar driven by scrollYProgress
│   │   ├── PageTransition.tsx    # Curtain-cover route transitions
│   │   ├── ParallaxImage.tsx     # Generic parallax image
│   │   ├── ImageReveal.tsx       # Clip-path scroll reveal (production-grade)
│   │   ├── SplitText.tsx         # Character-stagger text reveal
│   │   ├── WordFade.tsx          # Word-by-word paragraph reveal
│   │   ├── MagneticButton.tsx    # Cursor-attracting wrapper
│   │   ├── HorizontalScroll.tsx  # Scroll-jacked horizontal stage
│   │   ├── RevealSection.tsx     # Generic scroll-reveal wrapper
│   │   ├── FadeIn.tsx            # Simple in-view fade
│   │   ├── CountUp.tsx           # Animated counter
│   │   ├── Marquee.tsx           # Continuous text marquee
│   │   ├── StaggerChildren.tsx   # Stagger-orchestrator + StaggerItem
│   │   └── TextReveal.tsx        # Word-by-word with blur
│   │
│   ├── sections/
│   │   ├── HeroSlideshow.tsx     # Cinematic hero: rotating real listings + data plates
│   │   ├── PropertySearch.tsx    # Sticky intent + type + location search bar
│   │   ├── LiveStats.tsx         # Bloomberg-terminal live stats with ticker
│   │   ├── FeaturedListings.tsx  # 1 hero feature + 6-grid layout
│   │   ├── CaseStudies.tsx       # Problem / Approach / Outcome zigzag
│   │   ├── ServicesPinned.tsx    # Pinned scroll-scrubbed services + side-rail
│   │   ├── TeamPreview.tsx       # Editorial team with pull quotes
│   │   ├── CTASection.tsx        # Closer with parallax bg
│   │   ├── Hero.tsx              # (legacy, replaced by HeroSlideshow)
│   │   ├── ServicesPreview.tsx   # (legacy, replaced by ServicesPinned)
│   │   └── StatsBar.tsx          # (legacy, replaced by LiveStats)
│   │
│   └── ui/
│       ├── Button.tsx            # primary | secondary | ghost | outline · sm | md | lg
│       ├── Card.tsx              # Light or dark theme, optional hover
│       ├── Badge.tsx             # default | teal | navy | outline
│       ├── Input.tsx
│       ├── Textarea.tsx
│       ├── Select.tsx
│       └── Skeleton.tsx
│
├── data/
│   └── portfolio.ts              # PORTFOLIO[] (7 listings) + HERO_SLIDES (first 4)
│
└── lib/
    └── utils.ts                  # cn() (clsx + tailwind-merge)
```

---

## Component Inventory

### Layout

#### `Header.tsx`
Fixed-position header that morphs on scroll.
- Initial state: transparent, larger padding
- Scrolled state (>50px): `.glass` blur, white border, smaller padding
- Mobile: full-screen overlay nav with staggered link reveal
- Desktop CTA: magnetic "Get Started" button with arrow icon
- Wordmark: `STEWARDSHIP` in Cinzel teal-400, "Commercial Real Estate" subtitle in mono charcoal-400

#### `Footer.tsx`
Dark footer with 3 link columns + brand column.
- Wordmark + description + LinkedIn icon
- Properties / Company / Services link columns
- Bottom bar: copyright + Privacy / Terms

#### `Container.tsx`
Layout primitive: `max-w-[1400px] mx-auto px-6 lg:px-8`. Responsive container for every section.

### Section Components

#### `HeroSlideshow.tsx` (Homepage hero)
Cinematic 100vh hero with rotating real listings.
- **Slideshow:** 4 slides from `HERO_SLIDES`, 6.5s cycle
- **Ken Burns zoom:** Each slide scales from 1.0 → 1.08 over its lifetime
- **Crossfade:** 1.4s fade between slides
- **Parallax:** Background drifts 25% as user scrolls; content drifts 12%
- **Headline:** "COMMERCIAL / REAL ESTATE / DONE RIGHT" — character-stagger reveal, "Done Right" in glowing teal
- **Eyebrow:** "Northwest Indiana & Chicagoland" with teal accent line
- **CTAs:** Magnetic "View Properties" (teal solid) + "Connect With Us" (outline)
- **Data plate** (bottom-right, glass): Live indicator showing the active slide's address, status, year, type, price, size, and outcome quote — clickable to property detail
- **Slide indicators:** 4 horizontal teal bars, each fills over 6.5s while active, click to jump
- **Marquee:** Bottom strip with `Office / Retail / Industrial / Multifamily / Land / Mixed-Use / Investment Sales / Consulting`
- **Scroll cue:** Pulsing vertical line at bottom-center

#### `PropertySearch.tsx`
Sticky search bar that lives directly under the hero.
- Eyebrow: "Find a Property" in mono teal
- 3 dropdown selects: Intent (Buy / Lease / Sell / Invest) · Type (Office / Retail / Industrial / Multifamily / Land / Mixed-Use / Any) · Location (Northwest Indiana, Chicagoland, Valparaiso IN, Crown Point IN, Merrillville IN, Michigan City IN, Joliet IL)
- Magnetic "Search" CTA → routes to `/properties?intent=&type=&location=`
- Custom select styling with mono labels + teal hover states

#### `LiveStats.tsx`
Bloomberg-terminal-feel live stats section.
- **Top bar:** Pulsing teal dot + "Live Inventory · Northwest Indiana & Chicagoland" + scrolling market ticker (cycles 6 rates every 3.5s)
- **Big-number grid:** 4-cell grid showing **Active 12 (with pulse) / $14.8M Available / Closed Q1 3 / Tours·30D 18**
- Numbers in Cinzel display, expand-on-hover divider lines below
- "Last updated · [date]" stamp at bottom-right
- **Data is currently static placeholder** — wire to Supabase when real data is available

#### `FeaturedListings.tsx`
The conversion-priority section — listings get hero treatment.
- **Hero feature listing** (full-bleed): 5-column grid (3 image / 2 details), 4-quadrant data plate (Price / Size / Type / Status), italicized outcome quote, magnetic "View Listing" button
- **Supporting grid:** 6 listings in 3-column dense grid with parallax images, mono labels, teal price highlighting

#### `CaseStudies.tsx`
The trust signal that most CRE sites lack.
- 3 case studies in alternating zigzag layout (text left, then text right)
- Each shows:
  - **Asset header:** "Case · 01" + city + asset type
  - **Asset name** as display heading
  - **The Problem:** What was wrong
  - **What We Did:** The approach
  - **Outcome:** Hero metric in giant glowing teal display ("14 days to 3 buyers", "+9% over appraisal", "7yr NNN renewal")
  - **Outcome note:** Mono detail line
- Data lives inline in the component; placeholder copy that needs replacement with real Stewardship deals.

#### `ServicesPinned.tsx`
Cinematic pinned scroll section.
- 4 services pin in a sticky container for **240vh** of scroll (60vh per slide — trimmed from original 400vh for UX)
- Each slide cross-fades into the next with computed opacity using `useMotionValueEvent` (NOT `useTransform` — see [tech debt](#known-issues--tech-debt))
- Right column shows service image with parallax scale
- Left column: number, title, description, 3 bullet points
- **Side-rail nav** (desktop): `01 / 02 / 03 / 04` with active indicator + click-to-jump using Lenis `scrollTo`
- Bottom progress bar with "ALL SERVICES" CTA
- Services: Brokerage · Investment Sales · Consulting · Property Management

#### `TeamPreview.tsx`
Editorial-style team grid.
- 3 team members in 3-column grid
- 440px portrait cards with grayscale → color hover
- Name + title overlaid on image (gradient mask)
- Pull-quote per person in italics with teal accent border (e.g., *"I've sold the same intersection three times in eight years."*)
- Specialty tags in mono teal

#### `CTASection.tsx`
Final closer with parallax background.
- Full-bleed parallax background image
- "Let's Find Your Next **Opportunity**" with teal glow on the accent word
- Two magnetic CTAs: "Schedule a Consultation" (primary teal) + "Browse Properties" (ghost)

### UI Primitives

#### `Button.tsx`
Polymorphic button/link (renders as `<button>` or Next `<Link>` based on `href` prop).
- **Variants:** `primary` (teal solid), `secondary` (charcoal w/ border), `ghost` (transparent), `outline` (teal border)
- **Sizes:** `sm` (12px text), `md` (12px text), `lg` (14px text)
- All variants share: `inline-flex items-center justify-center gap-2 font-semibold tracking-[0.15em] uppercase transition-all duration-500`

#### `Badge.tsx`
- **Variants:** `default` (charcoal w/ blur), `teal` (teal tint), `navy` (navy tint), `outline`
- 10px text, 0.15em tracking, uppercase, `backdrop-blur-sm`

#### `Card.tsx`
- Variants: light (white bg) or dark (charcoal-800 bg)
- Optional hover: border color change, shadow, translate-y

---

## Page Composition

### Homepage (`/`)

```tsx
<HeroSlideshow />        // 100vh cinematic
<PropertySearch />       // Sticky search bar
<LiveStats />            // Bloomberg ticker + 4 big numbers
<FeaturedListings />     // 1 hero + 6 grid
<CaseStudies />          // 3 zigzag case studies
<ServicesPinned />       // 240vh pinned scroll-scrubbed
<TeamPreview />          // 3 editorial team cards
<CTASection />           // Parallax closer
```

### Other Pages
- **`/about`** — Built on Stewardship; values; timeline
- **`/services`** — All 4 services with details
- **`/team`** — Full team listing
- **`/properties`** — All listings with filter (currently uses static `PORTFOLIO`)
- **`/insights`** — Market intelligence / blog
- **`/contact`** — 3-field form + Calendly booking column

---

## Motion / Animation System

### `SmoothScroll.tsx` (Lenis)
Wraps the entire app to provide damped scroll inertia.

```ts
new Lenis({
  duration: 1.6,
  easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  wheelMultiplier: 0.9,
  touchMultiplier: 1.5,
  lerp: 0.08,
  smoothWheel: true,
})
```

The instance is exposed globally as `window.__lenis` so components like `ServicesPinned` can call `lenis.scrollTo()` for jump-to-slide behavior.

### `ScrollProgress.tsx`
Top-of-viewport progress bar driven by `useScroll`'s `scrollYProgress`. Uses `useSpring` with stiffness 100 / damping 30 for buttery feel.

### `PageTransition.tsx`
Barba-style curtain transition between routes.
- On route change: charcoal-950 curtain sweeps in from bottom (0.8s, ease 0.77/0/0.175/1)
- Wordmark "STEWARDSHIP" appears in teal during the hold
- Curtain sweeps up to reveal new page
- `pathname` from `useNextNavigation` triggers `AnimatePresence`

### `ImageReveal.tsx` (production-hardened)
Clip-path mask reveal on scroll-in. **Note: this component went through 4 revisions** because:
1. `IntersectionObserver` missed Lenis-driven smooth scrolls
2. RAF polling got canceled by React 19 strict-mode double-invocation
3. `useMotionValueEvent` was unreliable on programmatic scrolls
4. **Final solution:** 100ms `setInterval` polling + plain CSS transition for the clip-path animation

```tsx
useEffect(() => {
  if (revealed) return
  const intervalId = setInterval(() => {
    const el = ref.current
    if (el && el.getBoundingClientRect().top < window.innerHeight + 100) {
      setRevealed(true)
      clearInterval(intervalId)
    }
  }, 100)
  return () => clearInterval(intervalId)
}, [revealed])
```

The clip-path animation uses CSS transition (`transition: clip-path 1.1s cubic-bezier(0.77, 0, 0.175, 1)`) rather than framer-motion to avoid further timing issues. Inner parallax `y` still uses framer-motion's `useTransform`.

### `WordFade.tsx`
Paragraph reveals word-by-word as it enters viewport. Each word fades in with a small upward shift, staggered 40ms apart.

### `SplitText.tsx`
Character-by-character reveal for headlines. Used in HeroSlideshow for "COMMERCIAL / REAL ESTATE / DONE RIGHT".

### `MagneticButton.tsx`
Wraps any child element to make it follow the cursor with a spring physics tween (stiffness 150, damping 15, mass 0.1, strength 0.3). Used on all primary CTAs.

### `ServicesPinned` slide animation (technical detail)
Uses pure JS computation (`computeOpacity`, `computeYPercent`) driven by `useMotionValueEvent` rather than `useTransform`, because framer-motion v12's WAAPI animator has issues with overlapping ranges in `useTransform`. Each slide computes its own opacity based on scroll progress, ensuring clean cross-fades centered on slide boundaries.

```ts
function computeOpacity(progress, index, total) {
  const slot = 1 / total
  const half = slot * 0.1  // 10% cross-fade window
  const start = index / total
  const end = (index + 1) / total
  // Returns 0 outside slot, 1 in middle, smoothly cross-faded at boundaries
}
```

### `useMotionValueEvent` for initial sync
On `ServicesPinned` mount, we explicitly read `progress.get()` and set initial opacity/y so direct page loads at scroll position N show the correct slide.

---

## Data Layer

### `src/data/portfolio.ts`

Single source of truth for listings (currently static, will move to Supabase).

```ts
interface PortfolioItem {
  slug: string
  address: string
  city: string
  state: string
  type: 'Office' | 'Retail' | 'Industrial' | 'Multifamily' | 'Land' | 'Mixed-Use'
  status: 'For Sale' | 'For Lease' | 'Sold' | 'Leased'
  priceLabel: string  // pre-formatted display label
  size: string        // "8,500 SF"
  year: string
  image: string       // Currently Unsplash URLs — replace with real photography
  outcome?: string    // Optional; shown on data plate when present
}
```

Currently 7 listings (53 W Jefferson Joliet, 156 S Flynn Westville, 108 Lincolnway Valpo, 1200 Franklin Michigan City, 420 N Main Crown Point, 8500 Industrial Pkwy Merrillville, 700 Wabash Chesterton).

`HERO_SLIDES` exports the first 4 for the rotating hero.

---

## Deployment

### Current Setup
- **Hosting:** Netlify
- **Site:** `stewardship-cre` (https://stewardship-cre.netlify.app)
- **Site ID:** `0467338a-1a5c-4c61-bd14-3a361e4b213b`
- **Team:** Stewardship Squad (Pro)
- **Plugin:** `@netlify/plugin-nextjs` for full Next 16 SSR/edge support
- **Node version:** 20

### `netlify.toml`
```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[build.environment]
  NODE_VERSION = "20"

[[headers]]
  for = "/fonts/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/_next/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

### Initial Deploy Command (used)
```bash
netlify link --id 0467338a-1a5c-4c61-bd14-3a361e4b213b
netlify deploy --prod --build
```

Required `NETLIFY_AUTH_TOKEN` env var (PAT). **The token shared in chat should be revoked at https://app.netlify.com/user/applications#personal-access-tokens.**

### Post-Deploy URLs
- **Production:** https://stewardship-cre.netlify.app
- **Build logs:** https://app.netlify.com/projects/stewardship-cre/deploys

### Recommended Next: GitHub auto-deploy
1. Create GitHub repo (e.g., `stewardship-asset-group/stewardship-cre`)
2. Push initial commit
3. Connect to Netlify in the UI: Settings → Build & Deploy → Connect repository
4. Every commit to `main` will then auto-deploy

---

## Strategic Architecture

The strategic conversation that informed how the site connects to the broader Stewardship operation.

### The CRE Listings Source-of-Truth Decision

**Path B (chosen):** Stewardship CRM (Supabase) becomes the source of truth.

```
              ┌──────────────────────────────────┐
              │ STEWARDSHIP CRM (Supabase)        │
              │ ← Listings entered ONCE here       │
              └───────────────────┬──────────────┘
                                  │
               ┌──────────────────┼─────────────────────┐
               ▼                  ▼                     ▼
        ┌───────────┐     ┌──────────────┐     ┌──────────────┐
        │ Stewardship│     │   CREXi       │     │  Buildout     │
        │  website   │     │ (Listing API  │     │ (browser auto │
        │            │     │  one-way push)│     │  fill, review,│
        │  (auto)    │     │   (auto)      │     │  submit)      │
        └───────────┘     └──────────────┘     └──────────────┘
                                                       │
                                                       ▼
                                              syndicates to
                                              LoopNet, CoStar,
                                              Showcase
```

**Why not Buildout as source of truth:** Free Buildout tier (eXp Commercial) has no API. Upgrading would cost ~$200–400/mo and add a platform.

**Why not the website as source of truth:** Same data needs to flow to LoopNet/CREXi anyway, and we want one editor experience for the broker.

**The compromise:** Buildout remains for syndication only. Browser automation handles the final Buildout entry step (broker reviews + clicks save).

### Inbound Lead Architecture

Six channels, one unified inbox, one intake agent.

```
┌─ Stewardship website forms ────┐
│   (contact, property inquiry,   │
│    Book 15-min)                 │
├─ CREXi inquiries (email)─────── │
├─ LoopNet/CoStar (email) ─────── │
├─ Buildout aggregated (email) ── ├─→ UNIFIED INBOX TABLE (Supabase)
├─ Phone calls (Vapi/Bland AI) ── │      │
├─ SMS (Twilio) ───────────────── │      ▼
└─ Direct email to info@ ──────── │   INTAKE AGENT (Claude w/ tools)
                                        │
                                        ▼
                                   CRM (single inbox view)
                                        │
                                        ▼
                                  BROKER reviews + sends
```

**The 5-minute SLA:** CRE leads contacted within 5 minutes convert 7x higher than within an hour. The intake agent fires an instant personalized acknowledgment with property matches and a Calendly link, while drafting the human follow-up for broker approval.

### AI Agent Layer (Six agents)

1. **Listings → Buildout sync agent** — pulls Buildout XML feed daily (or browser-automation submission), normalizes to Supabase
2. **Tenant matching agent** — nightly cross-reference CRM tenant requirements with active listings, drops match suggestions into CRM
3. **OM / Brochure / LOI generator** — Claude pulls listing data, writes branded PDFs in Stewardship voice
4. **Inbound intake agent** — dedupe, enrich, score, draft acknowledgment, escalate hot leads via SMS
5. **Follow-up agent** — reads CRM stage + last touch, drafts next outreach
6. **Market report generator** — pulls public data (BLS, Census, permits, broker access to CoStar/CREXi), generates branded reports

### Channel-by-Channel Wiring Strategy

| Channel | Mechanism | Status |
|---|---|---|
| Website forms | Direct → Supabase | Form UI built; not yet wired |
| CREXi inquiries | Email forwarded to `inbound@stewardshipcre.com` → Cloudflare Email Worker / Resend Inbound → Claude parser → Supabase | Not built |
| LoopNet/CoStar inquiries | Same email parser pattern | Not built |
| Buildout aggregated | Same email parser pattern (Buildout aggregates from syndicated platforms) | Not built |
| Phone calls | Vapi or Bland AI receptionist, transcript → Supabase | Not built (broker handles for now) |
| SMS | Twilio number → webhook → Supabase | Twilio being set up by broker |
| Direct email | Cloudflare Email Worker classifies and routes | Not built |

---

## Roadmap & Next Steps

### Immediate (this week)
- [x] Site live at https://stewardship-cre.netlify.app
- [ ] Revoke leaked PAT
- [ ] Push to GitHub repo, connect Netlify auto-deploy
- [ ] Decide on production domain (stewardshipcre.com?) and configure DNS

### Phase 1 — Real Content (1 day of work + photographer)
- [ ] Real photography of 5–6 active listings + team headshots
- [ ] Write 3 real case study writeups with actual numbers
- [ ] Replace `portfolio.ts` Unsplash URLs with real photos
- [ ] Replace `CaseStudies.tsx` placeholder copy with real deals
- [ ] Replace `TeamPreview.tsx` placeholder photos + quotes
- [ ] Update `LiveStats.tsx` with manually-curated real Q-by-Q numbers (or wire to Supabase)

### Phase 2 — Make the Site Real (backend wiring, ~1 week)
- [ ] Spin up Supabase project (or extend existing stewardship-crm Supabase)
- [ ] Listings table schema matching `PortfolioItem` interface
- [ ] Fetch listings on the homepage from Supabase instead of static `portfolio.ts`
- [ ] Build `/properties` listing page that respects `?intent=&type=&location=` from PropertySearch
- [ ] Build property detail pages at `/properties/[slug]`
- [ ] Wire contact form to Resend → broker email
- [ ] Configure real Calendly account, swap the placeholder URL in `/contact`
- [ ] Wire `PropertySearch` to actually filter Supabase

### Phase 3 — Inbound Lead Infrastructure (1–2 weeks)
- [ ] `inbound@stewardshipcre.com` email infrastructure (Cloudflare Email Workers OR Resend Inbound)
- [ ] Claude-based email parser (Anthropic API, structured output to leads schema)
- [ ] Forward CREXi / LoopNet / Buildout notification emails to inbound parser
- [ ] Twilio phone number + SMS webhook
- [ ] Vapi or Bland voice receptionist for phone calls

### Phase 4 — AI Agent Layer (Month 2)
- [ ] Intake agent (dedupe, enrich, score, draft, escalate)
- [ ] OM / LOI / BOV generators
- [ ] Tenant matching agent (nightly cron)
- [ ] Follow-up agent
- [ ] Market report generator

### Phase 5 — Polish & Optimization
- [ ] Add custom cursor (subtle teal dot following mouse)
- [ ] Loading screen animation on first visit
- [ ] Service worker for instant repeat-visit loads
- [ ] Lighthouse performance audit + optimization
- [ ] Real OG images per listing (auto-generated via og.dev or @vercel/og)
- [ ] Sitemap.xml + structured data (Schema.org for listings)

---

## Known Issues & Tech Debt

### `ImageReveal` polling overhead
Uses 100ms `setInterval` to detect viewport entry. Each ImageReveal mounts its own interval until it reveals. Practically: ~13 intervals on initial homepage load, all clear once their target is in view. Net cost: trivial (a few microseconds per tick). Not a real problem but worth noting.

### Stale legacy section components
Three components remain in `src/components/sections/` but are no longer used:
- `Hero.tsx` (replaced by `HeroSlideshow.tsx`)
- `StatsBar.tsx` (replaced by `LiveStats.tsx`)
- `ServicesPreview.tsx` (replaced by `ServicesPinned.tsx`)

Safe to delete; left in case we want to revert any specific section.

### Lenis + framer-motion `useScroll` interaction
Initial development hit a snag where `useScroll` + Lenis fired `scrollYProgress` events, but `useTransform`-driven animations occasionally lagged. Workaround in `ServicesPinned` is to compute opacity manually via `useMotionValueEvent` rather than relying on `useTransform`. This is the framer-motion v12 WAAPI animator quirk — clean range definitions help but the pattern of computing values manually is the safest.

### Calendly URL is a placeholder
`/contact` links to `https://calendly.com/stewardship-cre/intro` which is not a real account. Will 404 if clicked.

### CREXi/LoopNet forms placeholder
The Stewardship CRM and the public site both reference inbound email parsing, but the email infrastructure is not yet provisioned. `info@stewardshipcre.com` and `inbound@stewardshipcre.com` need to be set up.

### Property detail pages don't exist
Links like `/properties/53-w-jefferson-joliet` will 404. Building these is part of Phase 2.

### Build output size
The `.next` directory after `npm run build` is ~50 MB. Netlify handles this fine but the local dev directory on Google Drive sync is large; consider working in a non-synced location for the development cycle.

### Google Drive read latency
Working directly in Google Drive's mounted folder occasionally caused file-read timeouts during development (`stewardship-tech-flow.jsx` failed to read multiple times). Solution: copy the working tree to `~/Code/stewardship-cre` for active development, sync changes back manually OR use the GitHub auto-deploy flow once that's set up.

---

## Reference: Color Migration Notes

The site originally used a **gold + forest** palette. Mid-build, we discovered the actual Stewardship brand color is **teal** (the Stewardship Asset Group wordmark and accent are teal `#4ECDC4`-ish). A global find-replace was performed across all `src/**/*.tsx` and `src/**/*.ts` files:

```
gold-50  → teal-50    forest-50  → teal-50
gold-100 → teal-100   forest-100 → teal-100
gold-200 → teal-200   forest-200 → teal-200
gold-300 → teal-300   forest-300 → teal-300
gold-400 → teal-300   forest-400 → teal-400
gold-500 → teal-400   forest-500 → teal-500
gold-600 → teal-500   forest-600 → teal-700
gold-700 → teal-600   forest-700 → teal-800
gold-800 → teal-800   forest-800 → teal-900
gold-900 → teal-900   forest-900 → teal-900

variant="gold"   → variant="teal"
variant="forest" → variant="teal"
```

The `gold-*` and `forest-*` token definitions were also removed from `globals.css`. If any stale references appear, run the same `sed` substitutions.

---

## Decision Log

### Why Cinzel for display only, not headings
Cinzel reads as elegant/wedding-invitation when overused. We tightened it to display moments (wordmark, hero accent, big numbers) only. Section headings now use **DM Sans** which feels more "Goldman Sachs" — modern, tight, serious.

### Why Lenis instead of CSS scroll-behavior: smooth
CSS smooth scroll has no inertia, no damping, and feels mechanical. Lenis gives the buttery momentum that makes the cinematic effects feel premium. Cost: ~3KB gzipped + a single requestAnimationFrame loop.

### Why setInterval (not RAF) in ImageReveal
React 19 strict-mode runs effects twice in development, canceling RAF before it fires. Changing to `setInterval(... , 100)` sidesteps this entirely. 100ms latency for visual reveal is imperceptible to users.

### Why "Path B" (Stewardship CRM as source of truth) instead of upgrading Buildout
Free Buildout via eXp has no API. Upgrading costs $200–400/mo and adds another face. The CRM the broker already built (`stewardship-crm`, Netlify) is the natural single source of truth. Browser-automated Buildout entry (with human review) preserves syndication while keeping the data home in Supabase.

### Why teal-only branding (no other accents)
Earlier drafts had gold + forest + navy. Real Stewardship brand is teal. Single-accent branding is also more disciplined and reads as more confident — the rule "if everything is highlighted, nothing is" applies to color systems too.

### Why character-stagger (not just fade) on hero headline
Cinematic letter-by-letter reveal is the agency-grade touch that signals "this is a serious firm" within the first 2 seconds. The cost is one component (`SplitText.tsx`) and a 1.5-second hero animation budget. Worth it.

---

## Appendix: Component Usage Patterns

### Adding a new section
1. Create in `src/components/sections/YourSection.tsx`
2. Mark `'use client'` if it uses motion or hooks
3. Wrap content in `<Container>` for consistent max-width
4. Use `py-section` class on the outer `<section>` for vertical rhythm
5. Eyebrow pattern:
   ```tsx
   <div className="flex items-center gap-4 mb-4">
     <div className="w-12 h-px bg-teal-400" />
     <span className="text-teal-400 text-xs tracking-[0.3em] uppercase font-semibold font-mono">
       Section Name
     </span>
   </div>
   ```
6. Heading pattern:
   ```tsx
   <h2
     className="font-display text-cream-50"
     style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
   >
     Section Title
   </h2>
   ```

### Adding a magnetic CTA
```tsx
<MagneticButton>
  <Link href="/somewhere" className="inline-flex items-center gap-3 bg-teal-400 hover:bg-teal-300 text-charcoal-950 px-8 py-4 text-sm tracking-[0.15em] uppercase font-semibold transition-all duration-500">
    Action Label
  </Link>
</MagneticButton>
```

### Using ImageReveal
```tsx
<div className="relative h-72 overflow-hidden">  {/* Parent must have explicit height */}
  <ImageReveal
    src="/your-image.jpg"
    alt="..."
    className="absolute inset-0"   {/* Required: absolute inset-0 */}
    parallaxAmount={0.08}           {/* Optional: how much parallax drift */}
  />
</div>
```

### Using WordFade
```tsx
<WordFade
  text="Your paragraph that should reveal word by word."
  className="text-charcoal-400 text-lg max-w-xl"
  stagger={0.04}    // Optional: time between each word
/>
```

---

## Build & Run

```bash
# Install
npm install

# Dev server (http://localhost:3000)
npm run dev

# Production build
npm run build

# Production preview
npm run start

# Deploy to Netlify (after netlify link + NETLIFY_AUTH_TOKEN)
netlify deploy --prod --build
```

---

*Last updated: April 2026*
*Maintained by: John Mathewson / Stewardship Asset Group*
