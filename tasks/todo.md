# AB3 Visuals — Project Handoff & Next Steps

## Current Status
- **Live URL:** https://ab3visuals.vercel.app
- **GitHub Repo:** https://github.com/letstalk-code/ab3-visuals
- **Stack:** Plain HTML/CSS/JS · Vercel hosting · Decap CMS (blog)
- **Last deployed:** March 2026

---

## What Has Been Built

### Pages
| File | URL | Status |
|---|---|---|
| `index.html` | `/` | ✅ Complete |
| `about.html` | `/about.html` | ✅ Complete |
| `portfolio.html` | `/portfolio.html` | ✅ Complete |
| `contact.html` | `/contact.html` | ✅ Complete |
| `book.html` | `/book.html` | ✅ Complete |
| `blog.html` | `/blog.html` | ✅ Complete |
| `blog-post.html` | `/blog-post.html?post=SLUG` | ✅ Complete |
| `services/real-estate.html` | `/services/real-estate.html` | ✅ Complete |
| `services/aerial.html` | `/services/aerial.html` | ✅ Complete |
| `services/commercials.html` | `/services/commercials.html` | ✅ Complete |
| `services/matterport.html` | `/services/matterport.html` | ✅ Complete |

### Features Built
- Hero video (autoplay, no poster/thumbnail)
- YouTube playlist section (auto-updates when client posts)
- Stats bar with count-up animation (2,000+ / 5★ / Same-Day / FAA 107)
- Services grid
- Portfolio preview section
- About section (drone pilot photo, FAA cert callout)
- AB3 Difference section (6 reasons + referral program)
- Testimonials section
- FAQ accordion (15 questions from old site schema)
- Footer with red AB3 logo, social links, CreativelyGrow credit (pulsing heart)
- Blog listing page (featured post + card grid)
- Blog post page (markdown rendered with marked.js)
- Booking page (Aryeo embed + sidebar with Leaflet map)
- Contact page (simple form)
- Map shows St. Pete, Tampa, Pasco, Clearwater, Sarasota service area
- Decap CMS admin at `/admin`
- 3 existing blog posts migrated from old site

### CSS Files
- `css/styles.css` — global styles, nav, footer, shared components
- `css/home.css` — homepage-specific styles
- `css/pages.css` — interior page styles

### JS Files
- `js/main.js` — nav, hamburger, IntersectionObserver fade-up, stats animation, FAQ accordion, cursor, portfolio filter

### API (Vercel Serverless Functions)
- `api/posts.js` — reads `/posts/*.md` files, returns JSON list for blog
- `api/auth.js` — GitHub OAuth handler for Decap CMS login

### Blog Posts (in `/posts/`)
- `2023-01-04-what-is-virtual-staging.md`
- `2022-04-02-matterport-3d-tours.md`
- `2022-03-23-invest-in-video-marketing.md`

---

## ⚠️ One Thing Still Needed — Decap CMS OAuth

The blog admin at `/admin` loads but can't log in yet. Needs **2 steps** to activate:

### Step 1 — Create GitHub OAuth App
URL: https://github.com/settings/applications/new (logged in as `letstalk-code`)
- Application name: `AB3 Visuals CMS`
- Homepage URL: `https://ab3visuals.vercel.app`
- Authorization callback URL: `https://ab3visuals.vercel.app/api/auth`
→ Copy the **Client ID** and **Client Secret**

### Step 2 — Add to Vercel Environment Variables
URL: https://vercel.com → ab3visuals project → Settings → Environment Variables
- `GITHUB_CLIENT_ID` = (Client ID from above)
- `GITHUB_CLIENT_SECRET` = (Client Secret from above)
→ Redeploy once after saving

### Step 3 — Give Client GitHub Access
URL: https://github.com/letstalk-code/ab3-visuals/settings/access
- Add client's GitHub username as **Write** collaborator
- Client logs into `/admin` with their GitHub account

---

## When Domain Changes (ab3visuals.com)

Two files need updating:

1. **`admin/index.html` line 18** — change `base_url`:
   ```
   base_url: 'https://ab3visuals.com'
   ```

2. **GitHub OAuth App** — update callback URL to:
   ```
   https://ab3visuals.com/api/auth
   ```

---

## Next Session — Next.js Migration Plan

### Why migrate?
- Unlocks Keystatic CMS (visual editor, no GitHub login needed for client)
- Blog posts pre-rendered at build time (proper SEO)
- `next/image` for automatic WebP + lazy loading
- Shared `<Nav />` and `<Footer />` components (no more copy-paste across 11 files)
- Access to full React/Next.js ecosystem

### Migration steps (estimated 11-13 hours)
- [ ] Scaffold Next.js 14 project with App Router + TypeScript
- [ ] Set up `next/font` with Cormorant Garamond + Instrument Sans
- [ ] Copy all CSS files, convert to CSS Modules or keep as globals
- [ ] Build shared `Nav` and `Footer` components
- [ ] Migrate homepage (`index.html` → `app/page.tsx`)
- [ ] Migrate about page
- [ ] Migrate portfolio page
- [ ] Migrate contact page
- [ ] Migrate booking page
- [ ] Migrate all 4 service pages
- [ ] Migrate blog listing page (`app/blog/page.tsx`)
- [ ] Migrate blog post page (`app/blog/[slug]/page.tsx`) — static generation
- [ ] Set up Keystatic CMS + migrate 3 existing posts
- [ ] Re-implement JS animations (IntersectionObserver, stats counter) as React hooks
- [ ] Re-implement Leaflet map in booking page
- [ ] Test all pages, deploy to new Vercel project
- [ ] Switch domain

### Key decisions for Next.js build
- **App Router** (not Pages Router) — current standard
- **TypeScript** — yes
- **CSS approach** — keep existing global CSS files (least friction, pixel-perfect match)
- **CMS** — Keystatic with GitHub storage mode
- **Images** — move all to `public/images/`, use `next/image`
- **Animations** — keep Intersection Observer logic, wrap in `useEffect`

### New GitHub repo for Next.js version
Create fresh repo: `letstalk-code/ab3-visuals-next`
Keep the HTML version live until Next.js version is confirmed working.

---

## Design Tokens (for reference in Next.js build)
```css
--cream: #f5f0e8
--dark: #1a1007
--red: #e31c1c
--font-display: 'Cormorant Garamond', serif
--font-body: 'Instrument Sans', sans-serif
```

---

## Client Info
- **Client:** Anthony Bove — AB3 Visuals
- **Phone:** 727-203-4223
- **Email:** info@ab3visuals.com
- **Location:** St. Petersburg, FL
- **Service area:** Tampa Bay (St. Pete, Tampa, Pasco, Clearwater, Sarasota)
- **Social:** @ab3visuals on Instagram, Facebook, YouTube
- **Old site:** ab3visuals.com (still live, has 8 blog posts — 3 migrated so far)
- **Aryeo booking:** https://ab3-visuals.aryeo.com/order
- **YouTube playlist:** PLpJmD_K3EXlA71f-clIvATzq4TgkFlPXQ

---

## Agency Notes
- Built by CreativelyGrow (creativelygrow.com)
- Footer credit on all pages: "Created with ♥ at CreativelyGrow"
- For future clients: build in Next.js from the start
- Decap CMS works for any plain HTML client site — reuse `api/auth.js` and `api/posts.js`
- One GitHub OAuth App per domain (new app needed per client site)
