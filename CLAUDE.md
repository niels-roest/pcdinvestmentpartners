# PCD Investment Partners — Static Website

## Project Overview
Static HTML website for **PCD Investment Partners**, a Dutch healthcare technology investment company building the CareHub ecosystem for digital care in the Netherlands and Europe. Migrated from WordPress/Elementor to static HTML for GitHub Pages deployment.

**Live domain:** pcdinvestmentpartners.com
**Language:** Dutch (nl)

## Tech Stack
- **HTML5** — Semantic markup, one H1 per page, ARIA labels
- **Tailwind CSS** — Via CDN (`cdn.tailwindcss.com`), no build step
- **Vanilla JavaScript** — Single IIFE in `js/main.js`, deferred loading
- **Inter font** — Via Google Fonts with preconnect
- **No frameworks, no bundler, no Node.js** — Pure static files

## Tailwind Custom Config
Defined inline in each HTML `<head>` via `tailwind.config`:
```
navy-900: #0a1628    navy-800: #0f1f3d    navy-700: #152a4a    navy-600: #1a3558
brand-blue: #046bd2  brand-blue-dark: #045cb4  brand-light: #f4f6f8
```

## Project Structure
```
/
├── index.html                              # Homepage
├── carehub-zorg-digitalisering.html        # CareHub ecosystem
├── zorgorganisaties.html                   # For healthcare organizations
├── zorgtech-softwarebedrijven.html         # For healthtech companies
├── investeerders-partners.html             # For investors & partners
├── pioneering-health-care-technology.html  # About PCD
├── leiderschap.html                        # Leadership team
├── esg-verklaring.html                     # ESG statement
├── cases.html                              # Cases overview
├── case-ggz.html                           # Case: GGZ digital care
├── case-ziekenhuis-care.html               # Case: Hospital integration
├── case-24-7-digitale-zorg.html            # Case: 24/7 digital care
├── insights.html                           # Insights/articles overview
├── insight-interoperabiliteit-nederlandse-zorg.html  # Insight: Interoperabiliteit
├── insight-werkdruk-zorg-technologie.html            # Insight: Werkdruk & technologie
├── insight-buy-and-build-zorgtechnologie.html        # Insight: Buy-and-build strategie
├── insight-mensgerichte-ai-healthcare.html           # Insight: Mensgerichte AI (by Niels Roest)
├── insight-datagedreven-zorg.html                    # Insight: Datagedreven zorg
├── insight-ai-zorg-kansen-verantwoordelijkheid.html  # Insight: AI kansen & verantwoordelijkheid
├── contact.html                            # Contact (Patrick Dinkela)
├── privacyverklaring.html                  # Privacy statement
├── cookiebeleid-eu.html                    # Cookie policy
├── 404.html                                # Custom 404 (noindex)
├── robots.txt
├── sitemap.xml
├── css/
│   └── custom.css                          # Supplementary styles
├── js/
│   └── main.js                             # All JavaScript (IIFE)
└── assets/
    ├── logo/
    │   ├── pcd-logo.png                    # Main logo (500x200, transparent)
    │   ├── pcd-logo-blauw-500x200.png      # Source transparent logo
    │   └── pcd-logo-design-blauw-transparant-500x500.png  # Square logo (OG images)
    ├── favicon/
    │   ├── apple-touch-icon.png
    │   ├── favicon-32x32.png
    │   └── favicon-192x192.png
    └── images/                             # ~50 images (webp, png)
```

## SEO Implementation
Every page includes:
- Unique `<title>` (70-90 chars) and `<meta name="description">` (140-160 chars)
- `<link rel="canonical">` and `<link rel="alternate" hreflang="nl">`
- Full Open Graph tags (og:title, og:description, og:type, og:url, og:image, og:locale)
- Twitter Card tags (summary_large_image)
- `<meta name="robots" content="index, follow">` (except 404: noindex)
- `<link rel="preconnect">` for Google Fonts
- Skip-to-content link for accessibility

## JSON-LD Structured Data
| Schema | Pages |
|--------|-------|
| Organization | All 23 pages |
| WebSite + SearchAction | index.html only |
| BreadcrumbList | All 21 subpages |
| FAQPage | index, carehub, zorgorganisaties, zorgtech, investeerders |
| Article | 3 case study pages + 6 insight article pages |
| HowTo | zorgtech-softwarebedrijven, investeerders-partners |
| SpeakableSpecification | index, carehub, 3 case pages |

## JavaScript Features (js/main.js)
- `handleHeaderScroll()` — Sticky header with `.scrolled` class at 50px
- Mobile hamburger menu with `.open` class toggle
- Mobile dropdown accordion (close-others-on-open)
- FAQ accordion (one-open-at-a-time, `.active` class, `.faq-trigger`/`.faq-content`)
- `IntersectionObserver` for `.fade-in-up` scroll animations (threshold 0.1)
- `animateCounter()` for `.stat-counter[data-target]` elements (2s ease-out cubic)
- Smooth scroll for anchor links (offset for fixed header)

## CSS Architecture (css/custom.css)
- CSS custom properties for brand colors (`--color-navy-900`, `--color-brand-blue`, etc.)
- Header scroll effect (`#site-header.scrolled`)
- Dropdown animations
- `.fade-in-up` animation (opacity 0→1, translateY 30px→0)
- FAQ accordion transitions (max-height, icon rotation 45deg)
- Card hover effects (translateY -4px)
- `.breadcrumb` styles (white text for dark hero sections)
- Print stylesheet
- `prefers-reduced-motion` support

## Images
- Transparent PNG logos in `assets/logo/` (processed with Pillow flood-fill)
- ~14 illustrations converted from webp→png with transparent backgrounds
- Team headshots: circular crops with transparent backgrounds
- All images have descriptive Dutch `alt` text and `width`/`height` attributes
- Below-fold images use `loading="lazy"`, hero images use `loading="eager"`

## Key Contacts & Company Info
- **Company:** PCD Investment Partners
- **Address:** Lijndonk 4, Breda, Nederland
- **Phone:** +31 6 53 85 27 53
- **Contact person:** Patrick Dinkela (Co-Founder, COO & Vice-Chairman)
- **LinkedIn:** linkedin.com/company/pcd-investment-partners/
- **Founded:** 2024

## Team Members (leiderschap.html)
1. Frans van den Berg — CEO & Board Member
2. Patrick Dinkela — Co-Founder, COO & Vice-Chairman
3. Coby Dinkela — Co-Founder & CCO
4. Niels Roest — Chief AI & Innovation Officer (CAIO)
5. Frank van Antwerpen — CFO
6. Kevin de Rooij — Legal Director

## Content Guidelines
- All content in **Dutch**
- Primary keywords: digitale zorg, zorg digitalisering, zorgtechnologie, CareHub, ECD integratie, interoperabiliteit
- Tone: professional, authoritative, accessible
- No emojis unless explicitly requested

## Insight Article Pages
6 individual insight/blog article pages following a consistent template:
- **Template based on:** case study pages (e.g., `case-ggz.html`) adapted for blog format
- **Layout:** Narrow `max-w-3xl` centered column, 3-5 h2 sections, alternating `bg-white`/`bg-brand-light` sections
- **Components:** Hero with breadcrumb + category pill, article meta (author/date/tag), stat callout boxes, related insights (2 cards), CTA section
- **Breadcrumb:** Home > Insights > Article Title
- **Nav active state:** "Insights" link gets `border-b-2 border-brand-blue`
- **Author:** PCD Investment Partners (Organization) for most; Niels Roest (Person) for `insight-mensgerichte-ai-healthcare.html`
- **Filename pattern:** `insight-{slug}.html`

## Deployment
- **GitHub repo:** https://github.com/niels-roest/pcdinvestmentpartners
- Target: GitHub Pages (static hosting)
- All internal links use relative paths (e.g. `href="contact.html"`)
- No server-side dependencies
- CNAME file needed for custom domain setup
