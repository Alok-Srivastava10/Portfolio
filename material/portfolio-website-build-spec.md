# Build Spec v2: Alok Srivastava — Portfolio Website + Admin Dashboard

> **Purpose of this document**: This is a complete build prompt for an AI coding agent (Claude Code, Cursor, etc.) to build a full-stack personal portfolio website with an admin dashboard, backed by MongoDB. Follow it section by section. Ask for clarification only if something is truly ambiguous — otherwise use the sensible defaults stated here.

> **What changed in v2** (read this first if you already built v1):
> 1. Remove any "Available for SDE Roles" (or similar open-to-work/status badge) text — it should not appear anywhere on the site (Hero, Nav, footer, meta tags, etc.).
> 2. The visual bar is raised. v1 leaned too minimal/plain. v2 still avoids "cringe" AI-template clichés, but now explicitly asks for a more visually rich, attractive, well-animated site with a more confident color story — see the rewritten Section 2 and Section 8 below.

---

## 1. Project Overview

Build a two-part application:

1. **Public Portfolio Site** — a polished, animated, professional single-scroll (or multi-page) portfolio showcasing the owner's experience, projects, skills, and achievements. Content is **not hardcoded** — it is fetched from a MongoDB database via an API.
2. **Admin Dashboard** — a private, authenticated page where the owner can log in and edit every piece of content that appears on the public site (bio, experience entries, projects, skills, achievements, education, contact links, resume file, etc.) without touching code.

Content changes made in the dashboard should reflect on the public site immediately (or after a simple revalidation/refetch).

---

## 2. Design Direction — "Elevated, not cringe"

This is the most important non-functional requirement, and it has been intentionally raised for v2. The previous bar ("light, but not cringe") produced something correct but too plain/safe. The site should now feel genuinely attractive and memorable — like a designer-built studio site — while still avoiding the generic AI-portfolio tells.

**Explicitly removed in v2:**
- No "Available for SDE Roles" text, badge, pill, or status dot anywhere on the site (Hero, Nav, footer, page `<title>`/meta description). If a v1 build included this, remove it entirely — don't just hide it with CSS, delete it from the component and from any seeded content.

**Do (raised bar):**
- Background can still be off-white/warm base (e.g. `#FAFAF8`), but bring in **real color** elsewhere: a confident primary accent plus one complementary secondary accent, used deliberately (e.g. deep indigo `#3730A3` paired with a warm amber/terracotta `#C2703D`, or forest green `#1F4D3A` paired with a soft gold `#D4A94A`). Two-color accent systems read as more designed than a single flat accent.
- Use accent color(s) with intention across the page — not just links/buttons, but section backgrounds (subtle tinted panels), tag/pill fills, gradient edges on cards, timeline connectors, and hover states — so the palette feels cohesive rather than sprinkled.
- Subtle gradients are allowed if tasteful and low-saturation (e.g. a soft mesh/blob gradient behind the Hero, or a gradient border on the featured project card) — this is different from the "neon SaaS gradient" ban below; the difference is restraint and color harmony, not gradients themselves.
- Strong, distinctive typography: pair a serif or characterful display font for headings (e.g. "Fraunces", "Instrument Serif", "Playfair Display") with a clean sans for body (e.g. "Inter", "Geist", "Satoshi"). Consider a fluid type scale (`clamp()`) so headline sizes feel intentional at every breakpoint, not just responsive-by-default.
- Richer, more layered motion than v1: staggered entrance animations, scroll-linked reveals with slight variation per section (not identical fade+slide everywhere — vary direction/distance/easing subtly by section), a magnetic or spotlight-follow effect on primary CTA buttons, animated underlines/accents on nav links, smooth shared-layout transitions when opening a project detail page. Cap it at roughly 4–6 coordinated motion techniques total (up from v1's 2–3) so it reads as "well-produced," not overloaded. Always respect `prefers-reduced-motion`.
- Elevated card and section treatment: soft layered shadows (not flat single low-opacity shadow), gentle border/gradient accents on hover, subtle scale/lift on interactive elements, occasional asymmetric layout moments (e.g. an offset image, a pull-quote-style stat callout) instead of every section being a centered stack.
- Add 1–2 "wow" but tasteful details: e.g. a custom animated cursor near interactive elements, an animated number counter for stats (test coverage %, LeetCode peak rating, DSA problems solved), or a subtle grain/noise texture overlay for depth. Pick a small number — don't stack all of them.
- Generous whitespace and clear grid still apply — richness comes from color, motion, and typographic confidence, not from cramming more elements in.
- Real content hierarchy: name + role first, one clear CTA (View Resume / Contact), then experience → projects → skills → achievements → education → contact.

**Don't (unchanged from v1):**
- No neon gradients, no glassmorphism overload, no confetti/particle backgrounds, no typewriter-effect names, no rainbow skill bars, no emoji as bullet icons, no "Hi 👋 I'm..." intros, no stock 3D astronaut/blob illustrations.
- No autoplay sound, no aggressive parallax that causes jank.
- Avoid pure black text on pure white; use a near-black (`#1A1A1A`) for text.
- No "Available for X roles" / open-to-work badges anywhere (new in v2, see above).

**Reference feel:** think of an award-shortlisted studio portfolio (e.g. the kind featured on Awwwards/Godly in the "clean but rich" category) — confident color, purposeful motion, clear typographic voice — not a "hire-me flashy" template, but also not a plain resume-as-webpage.

Read `frontend-design` conventions if using an AI IDE with a design skill available; otherwise follow the rules above strictly.

---

## 3. Tech Stack

| Layer | Choice | Notes |
|---|---|---|
| Frontend | **Next.js 14+ (App Router)** + TypeScript | SSR/ISR for fast, SEO-friendly portfolio; also hosts the dashboard under a protected route |
| Styling | **Tailwind CSS** + a small set of custom CSS variables for theme tokens | Keep design tokens (colors, fonts, spacing) centralized in `tailwind.config.ts` |
| Animation | **Framer Motion** (scroll reveals, page transitions, hover states, shared layout transitions) | Keep durations 200–600ms, easing `easeOut`/custom cubic-bezier, vary per section per Section 2, respect `prefers-reduced-motion` |
| Backend/API | Next.js Route Handlers (`/app/api/*`) — no separate backend service needed | Alternative: standalone Express server if agent prefers a decoupled API; default to Next.js API routes for simplicity |
| Database | **MongoDB** (Atlas free tier or local) via **Mongoose** | See schema in Section 6 |
| Auth (dashboard only) | **NextAuth.js (Auth.js) with Credentials provider**, or a simple JWT + hashed password (bcrypt) stored in an `Admin` collection | Single-user auth is enough — this is a personal dashboard, not multi-tenant |
| File storage (resume PDF, images) | **Cloudinary** (free tier) — matches a tool already used in the owner's ScholarFusion project, so credentials/logic will feel familiar | Store only the returned URL in MongoDB, not binary blobs |
| Deployment target | Vercel (frontend+API) + MongoDB Atlas | Mention `.env.example` for required keys |
| Forms/validation | **Zod** for schema validation on both client and API routes | |
| Icons | **lucide-react** | Avoid emoji icons |

---

## 4. Information Architecture

### 4.1 Public Site Routes
- `/` — Home: Hero, About/Summary, Experience, Projects, Skills, Achievements, Education, Contact (all sections on one scrollable page with anchor nav; smooth-scroll nav bar that highlights active section)
- `/resume` — Optionally a dedicated route that renders/downloads the latest uploaded resume PDF (button also available in Hero and Nav)
- `/projects/[slug]` — Optional: individual project detail page for deeper case studies (only build if project entries have a `detailed` flag/content — otherwise projects are just cards linking out to GitHub)

### 4.2 Dashboard Routes (all protected, prefixed `/dashboard`)
- `/dashboard/login` — Login form
- `/dashboard` — Overview / quick links to each editable section
- `/dashboard/profile` — Edit name, title/role, tagline, summary, contact info, social links (LinkedIn, LeetCode, GFG, GitHub, email, phone), profile photo
- `/dashboard/experience` — CRUD list of work experience entries
- `/dashboard/projects` — CRUD list of projects (with tech tags, bullet points, links)
- `/dashboard/skills` — CRUD skill categories and individual skills
- `/dashboard/achievements` — CRUD achievement bullet points
- `/dashboard/education` — CRUD education entries
- `/dashboard/resume` — Upload/replace resume PDF (stored via Cloudinary, URL saved to DB)
- `/dashboard/settings` — Change password, theme accent color(s) toggle (now supports primary + secondary accent per Section 2)

All dashboard writes go through validated API routes protected by session/JWT middleware. Public GET endpoints are open (read-only) so the portfolio can render without auth.

---

## 5. Content to Seed Initially (from resume)

Use this as the **seed data** / first admin entry so the site isn't empty on first run. The agent should write a `seed.ts` / `seed.js` script that populates MongoDB with this content on first setup. **Do not include any "available for roles" status text in the seed data.**

**Profile**
- Name: Alok Srivastava
- Role/Title: Backend Developer
- Tagline: Building reliable, well-tested backend systems with Java and Spring Boot.
- Phone: +91 7380888600
- Email: alok27141@gmail.com
- Location: Lucknow, Uttar Pradesh, India
- Links: LinkedIn (https://www.linkedin.com/in/alok-srivastava-1651462b9), GitHub (https://github.com/Alok-Srivastava10), LeetCode (https://leetcode.com/u/ALOK_SRIVASTAVA/). GFG and Twitter are not set; leave them empty (editable in dashboard)
- Summary: Backend Developer at Tata Consultancy Services, specializing in Java, Spring Boot, and AEM (OSGi, Sling) with PostgreSQL. Experienced in building REST APIs and microservices, with JUnit and Mockito test coverage of 95-98%. Solved 1000+ DSA problems, with a LeetCode peak rating of 1884 (Top 5%) and a top 1% finish in TCS CodeVita 2024.

**Skills** (group by category)
- Backend Development: Java, Spring Boot, Spring Data JPA, Spring Security, REST APIs, Microservices, AEM, OSGi, Sling, Node.js, Express.js
- Frontend Development: React.js, JavaScript, HTML, CSS
- Database: MySQL, MongoDB, PostgreSQL
- Tools & Practices: Git, GitHub, GitLab, Maven, Postman, Jenkins, SonarQube
- Testing: JUnit, Mockito, Postman API Testing
- CS Concepts: OOP, DSA, DBMS, CN, OS

**Experience**
- Company: Tata Consultancy Services
- Role: Backend Developer
- Stack tags: Java, Spring Boot, AEM, PostgreSQL, REST APIs, SonarQube
- Duration: April 2026 – Present
- Bullets:
  - Developed AEM backend components with OSGi and Sling, implementing business logic, backend validation, and application enhancements.
  - Worked with PostgreSQL for data retrieval, validation, and troubleshooting as part of backend development.
  - Wrote JUnit and Mockito tests, cutting post-release issues and raising test coverage to 95-98%.
  - Developed and maintained Java and Spring Boot microservices for the Marketing Tower, applying Spring Data JPA, multithreading, concurrency, and design patterns to improve performance.
  - Led sprint planning, user story refinement, and cross-functional deliverables as Scrum Master (Backup PM), facilitating core Agile ceremonies to keep team velocity and delivery predictable.

**Projects**
1. **JWT Authentication System** — Java, Spring Boot, Spring Security, MySQL (July 2025 – Oct 2025) — GitHub: https://github.com/Alok-Srivastava10/Implementation-of-JWT-Authentication
   - Designed and implemented a JWT-based authentication system with secure login/logout flow, reducing unauthorized access attempts by 50% in testing.
   - Integrated token expiration and refresh logic, improving session security and API reliability.
   - Conducted performance testing on 20+ API endpoints, keeping average response times under 200 ms.
2. **ScholarFusion** — Node.js, Express.js, MongoDB, JWT, Nodemailer, Cloudinary (Nov 2024 – April 2025) — GitHub: https://github.com/Alok-Srivastava10/Scholar-Fusion
   - Implemented secure user authentication with JWT.
   - Integrated Cloudinary for media uploads.
   - Enabled email notifications and password recovery through Nodemailer.
   - Built personalized dashboards for students and educators to manage uploaded content securely.

(The Project schema has no date field, so the dates above are for reference only and are not seeded.)

**Achievements**
- Ranked in the top 1% in TCS CodeVita 2024 among 550,000+ participants globally.
- Peak rating: 1884 on LeetCode (Top 5%), 1407 (2★) on CodeChef.
- Global Rank 220, 404 in LeetCode Contests among 40,000+ participants.
- Solved 1000+ DSA problems across LeetCode, CodeChef, CodeForces and GeeksforGeeks.

**Education**
- Feroze Gandhi Institute of Engineering and Technology, Raebareli, Uttar Pradesh
- Bachelor of Technology — Computer Science and Engineering, 7.77 CGPA
- August 2021 – June 2025

---

## 6. MongoDB Schema (Mongoose Models)

Design one flexible `Portfolio` document (singleton, since this is a single-owner site) OR normalized collections. **Use normalized collections** for cleaner CRUD in the dashboard:

```
/models
  Admin.ts        // { email, passwordHash }
  Profile.ts      // singleton document
  Experience.ts
  Project.ts
  SkillCategory.ts
  Achievement.ts
  Education.ts
```

**Profile** (singleton — only one document ever exists)
```ts
{
  name: string
  role: string
  tagline: string           // short one-liner for hero
  summary: string           // paragraph for About section
  email: string
  phone: string
  location?: string
  socials: {
    linkedin?: string
    github?: string
    leetcode?: string
    gfg?: string
    twitter?: string
  }
  profileImageUrl?: string  // Cloudinary URL
  resumeUrl?: string        // Cloudinary URL to latest PDF
  accentColor?: string      // hex, primary accent, editable in dashboard settings, default indigo
  secondaryAccentColor?: string // hex, secondary accent, editable in dashboard settings (new in v2)
  updatedAt: Date
}
```

**Experience**
```ts
{
  company: string
  role: string
  startDate: string          // e.g. "April 2026"
  endDate: string             // "Present" or a date
  techTags: string[]
  bullets: string[]
  order: number               // for manual reordering in dashboard (drag-and-drop)
  createdAt, updatedAt
}
```

**Project**
```ts
{
  title: string
  techTags: string[]
  bullets: string[]
  githubUrl?: string
  liveUrl?: string
  featured: boolean           // show prominently on homepage
  order: number
  createdAt, updatedAt
}
```

**SkillCategory**
```ts
{
  category: string            // e.g. "Backend Development"
  skills: string[]            // e.g. ["Java", "Spring Boot", ...]
  order: number
}
```

**Achievement**
```ts
{
  text: string
  order: number
}
```

**Education**
```ts
{
  institution: string
  degree: string
  field: string
  cgpaOrGrade?: string
  location?: string
  startDate: string
  endDate: string
  order: number
}
```

**Admin**
```ts
{
  email: string
  passwordHash: string
  createdAt: Date
}
```

---

## 7. API Endpoints

All under `/app/api/...`. Public `GET`s are unauthenticated; all `POST/PUT/PATCH/DELETE` require a valid admin session (middleware checks JWT/session cookie).

```
POST   /api/auth/login              — admin login, returns session cookie
POST   /api/auth/logout

GET    /api/profile                 — public
PUT    /api/profile                 — admin only

GET    /api/experience              — public, sorted by order
POST   /api/experience              — admin only
PUT    /api/experience/:id          — admin only
DELETE /api/experience/:id          — admin only

GET    /api/projects
POST   /api/projects
PUT    /api/projects/:id
DELETE /api/projects/:id

GET    /api/skills
POST   /api/skills
PUT    /api/skills/:id
DELETE /api/skills/:id

GET    /api/achievements
POST   /api/achievements
PUT    /api/achievements/:id
DELETE /api/achievements/:id

GET    /api/education
POST   /api/education
PUT    /api/education/:id
DELETE /api/education/:id

POST   /api/upload                  — admin only, handles image/PDF upload to Cloudinary, returns URL
```

Use Zod schemas per resource for request validation; return consistent `{ success, data, error }` JSON shape.

---

## 8. Public Site — Section-by-Section Spec (v2, elevated)

1. **Nav bar** — sticky, transparent-to-solid on scroll, links to each section, active-section highlight with an animated underline/indicator (not just a color swap), resume download button (primary accent), mobile hamburger menu with slide-in drawer with staggered link entrance.
2. **Hero** — Name (large display font, fluid type scale), role/title, one-line tagline, two CTAs ("Download Resume", "Contact Me") — **no availability/status badge of any kind**. Subtle animated background (soft gradient blob/mesh or fine noise texture) behind the text for depth. Staggered entrance animation (fade+slide-up on load, not on every scroll). Optional: animated stat counters (e.g. "95%+ test coverage", "1884 LeetCode peak rating", "1000+ DSA problems solved") as a secondary Hero element.
3. **About/Summary** — profile summary paragraph, optionally profile photo with a subtle accent-colored frame/offset shape behind it, animated on scroll-into-view (fade+slide, once only — don't re-trigger on scroll up/down repeatedly).
4. **Experience** — vertical timeline with an animated accent-colored connecting line that draws in on scroll, or clean stacked cards with layered shadow and a colored left-border accent; company, role, duration, tech tags as small pills, bullet achievements. Reveal each item on scroll with slight stagger, direction varying slightly from the Projects section for visual variety.
5. **Projects** — grid of cards (2–3 columns desktop, 1 mobile); each card: title, tech tags, 2–3 top bullets, GitHub/live links with icon buttons; hover = lift + soft layered shadow + subtle accent-colored glow/border, no tilt/3D gimmicks. Featured project can get a slightly larger card or a gradient border treatment to stand out.
6. **Skills** — grouped by category, rendered as clean pill/tag clusters with a subtle hover fill animation (not progress bars/percentages — those are hard to justify and read as "cringe").
7. **Achievements** — short list with a subtle icon (trophy/star from lucide, in accent color, used once per line, not decorative repetition); consider animated counting numbers for the numeric achievements (rank, rating).
8. **Education** — single clean entry/card with a small accent-colored detail (border, icon, or corner accent), institution, degree, dates, CGPA.
9. **Contact/Footer** — email, phone, social icons with hover micro-interaction (lift/color fill), small "built with" or copyright line. Simple mailto/tel links; do not build a contact form backend unless requested (adds scope — flag this as optional).

All content in sections 3–8 is fetched from the API at build/request time (use ISR with a short revalidate window, e.g. 60s, so dashboard edits show up quickly without a full redeploy).

---

## 9. Admin Dashboard Spec

- Clean, minimal internal-tool aesthetic — can reuse the same design tokens but doesn't need to be as "designed" as the public site. Sidebar nav + content area is fine.
- Login page: email + password, show error on failure, redirect to `/dashboard` on success.
- Each content type gets a list view (table/cards) + add/edit form (modal or dedicated route) + delete with confirmation.
- Drag-and-drop or simple up/down arrows to reorder items that have an `order` field (Experience, Projects, Skills, Achievements, Education).
- Image/PDF upload fields use a drag-and-drop uploader that calls `/api/upload` and stores the returned Cloudinary URL.
- Autosave or explicit "Save" button — explicit Save is simpler and safer for a first build.
- Show a "Last updated" timestamp and a "View live site" link in the dashboard header.
- Settings page allows editing both `accentColor` (primary) and `secondaryAccentColor` (secondary) with a live preview swatch (new in v2).

---

## 10. Security Notes
- Hash admin password with bcrypt (never store plaintext).
- Protect all mutating API routes with middleware that verifies the session/JWT.
- Rate-limit the login endpoint (basic in-memory or simple delay is fine for a personal site).
- Store all secrets (`MONGODB_URI`, `NEXTAUTH_SECRET`/`JWT_SECRET`, `CLOUDINARY_*` keys) in `.env.local`; provide a `.env.example` with placeholder values.
- Sanitize/validate all admin inputs server-side even though it's single-user (defense in depth).

---

## 11. Project Structure (suggested)

```
/app
  /(public)
    page.tsx                 — homepage with all sections
    /resume/page.tsx
  /dashboard
    layout.tsx                — auth guard wrapper
    page.tsx
    /login/page.tsx
    /profile/page.tsx
    /experience/page.tsx
    /projects/page.tsx
    /skills/page.tsx
    /achievements/page.tsx
    /education/page.tsx
    /resume/page.tsx
  /api
    /auth/...
    /profile/route.ts
    /experience/route.ts
    /experience/[id]/route.ts
    /projects/route.ts
    /projects/[id]/route.ts
    /skills/route.ts
    /skills/[id]/route.ts
    /achievements/route.ts
    /achievements/[id]/route.ts
    /education/route.ts
    /education/[id]/route.ts
    /upload/route.ts
/components
  /public       — Nav, Hero, About, Experience, Projects, Skills, Achievements, Education, Footer
  /dashboard    — Sidebar, DataTable, FormModal, Uploader
  /ui           — shared buttons, inputs, cards (small local design system)
/lib
  db.ts          — Mongoose connection helper (cached for serverless)
  auth.ts        — session/JWT helpers
  cloudinary.ts
  validators/    — Zod schemas per resource
/models          — Mongoose schemas (Section 6)
/scripts
  seed.ts        — seeds DB with content from Section 5
.env.example
```

---

## 12. Build Order (recommended steps for the agent)

1. Scaffold Next.js + TypeScript + Tailwind project; set up design tokens (fonts, primary + secondary accent colors) per Section 2.
2. Set up MongoDB connection (`lib/db.ts`) and all Mongoose models (Section 6).
3. Write and run `seed.ts` to populate initial content (Section 5) — confirm no "available for roles" text is present anywhere in seed data or components.
4. Build public read-only API routes; confirm data flows correctly with a quick test page.
5. Build the static/animated public site sections against real seeded data (Section 8), applying the elevated color/motion treatment.
6. Add admin auth (login route, session/JWT, password hashing) and seed one `Admin` user via the seed script (from an env-provided email/password, don't hardcode).
7. Build dashboard CRUD pages one resource at a time, wiring to the protected API routes.
8. Add Cloudinary upload for profile image and resume PDF.
9. Polish animations (Framer Motion), responsiveness, and accessibility (focus states, alt text, `prefers-reduced-motion`, semantic HTML). Do a final visual pass against Section 2's "elevated, not cringe" bar — check color usage, motion variety, and shadow/depth treatment specifically.
10. Add `.env.example`, README with setup instructions (Mongo URI, Cloudinary keys, admin bootstrap credentials), and verify a clean `npm install && npm run dev` works end to end.

---

## 13. Acceptance Criteria

- [ ] Public site renders all content from MongoDB, not hardcoded strings.
- [ ] No "Available for SDE Roles" or any open-to-work/status badge text appears anywhere on the site.
- [ ] Site looks visually rich and attractive — passes the "elevated, not cringe" bar from Section 2 (confident color story, layered motion, designed feel) — not just clean/plain.
- [ ] Scroll/entrance animations are smooth, varied by section, and don't jank on mobile.
- [ ] Dashboard requires login; unauthenticated users cannot reach `/dashboard/*` or hit mutating API routes.
- [ ] Every section on the public site (Profile, Experience, Projects, Skills, Achievements, Education) is fully editable from the dashboard, including add/edit/delete/reorder.
- [ ] Resume PDF and profile photo can be uploaded/replaced from the dashboard and reflect on the public site.
- [ ] Primary and secondary accent colors are both editable from dashboard settings and applied consistently across the site.
- [ ] Site is responsive (mobile, tablet, desktop) and reasonably accessible.
- [ ] `.env.example` and README make local setup (including MongoDB + Cloudinary + admin bootstrap) reproducible.

---

## 14. Open Questions for the Owner (flag, don't block on)

- GFG profile URL (not set yet; `gfg` is left empty in the seed).
- Live/demo URLs for JWT Authentication System and ScholarFusion, if either is deployed (`liveUrl` is empty for both).
- Whether a contact form (with email-sending backend, e.g. Resend/Nodemailer) is wanted, or mailto/tel links are sufficient.
- Preferred primary/secondary accent color pairing (default to deep indigo `#3730A3` + warm amber `#C2703D` if no preference given).
- Profile photo and resume PDF: to be uploaded through the dashboard once Cloudinary keys are configured.