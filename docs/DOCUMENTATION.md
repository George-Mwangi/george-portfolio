# George Mwangi Portfolio — Complete Documentation

> Version 2.0 · Next.js 15 · React 19 · Prisma 6 · PostgreSQL

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Architecture](#2-architecture)
3. [Folder Structure](#3-folder-structure)
4. [Database Schema](#4-database-schema)
5. [Pages & Routes](#5-pages--routes)
6. [Admin Console](#6-admin-console)
7. [API Reference](#7-api-reference)
8. [Environment Variables](#8-environment-variables)
9. [Local Setup Guide](#9-local-setup-guide)
10. [Deployment Guide (Free)](#10-deployment-guide-free)
11. [Media & Branding Uploads](#11-media--branding-uploads)
12. [Testimonial Moderation](#12-testimonial-moderation)
13. [Security Design](#13-security-design)
14. [Performance & SEO](#14-performance--seo)
15. [Customisation Guide](#15-customisation-guide)
16. [Troubleshooting](#16-troubleshooting)
17. [Upgrade Guide](#17-upgrade-guide)

---

## 1. System Overview

This is a production-ready, full-stack portfolio web application for **George Mwangi**, a Certified Cyber Security Specialist & Web Develope. It combines:

- A **public-facing portfolio website** with separate pages for each section
- A **secure admin console** where all content can be added, edited, or deleted
- A **client testimonials system** where visitors submit reviews that go live only after admin approval
- **Media management** for profile photo, logo, and favicon uploads

### Technology Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15.3 (App Router + Turbopack) |
| UI Library | React 19 |
| Styling | Tailwind CSS 3 + custom design tokens |
| Animations | Motion 12 (`motion/react`) |
| Database | PostgreSQL (Neon free tier recommended) |
| ORM | Prisma 6 |
| Authentication | NextAuth v5 (Auth.js beta) |
| Language | TypeScript 5.8 |
| Deployment | Vercel (free tier) |

---

## 2. Architecture

```
Browser
  │
  ├── Public Portfolio (SSR, Server Components)
  │     ├── /                  → Home (all sections overview)
  │     ├── /about             → About Me
  │     ├── /skills            → Skills & Tools
  │     ├── /experience        → Work Experience
  │     ├── /education         → Education & Certifications
  │     ├── /projects          → Projects Portfolio
  │     ├── /clients           → Clients + Testimonials + Submit Form
  │     ├── /contact           → Contact Form
  │     └── /resume            → CV Download
  │
  ├── Admin Console (Protected, Client Components)
  │     └── /admin/dashboard   → Full CMS (guarded by middleware)
  │
  └── API Routes (Edge-compatible)
        ├── /api/auth/[...nextauth]   → Authentication
        ├── /api/contact              → Contact form (rate-limited)
        ├── /api/testimonials         → Public testimonial submission
        ├── /api/resume/download      → Download analytics
        └── /api/admin/*              → Protected CMS endpoints
```

---

## 3. Folder Structure

```
george-portfolio/
├── prisma/
│   ├── schema.prisma          ← Full database schema (all 14 models)
│   └── seed.ts                ← Seeds George's data on first run
│
├── public/
│   └── uploads/               ← Profile photo, logo, favicon (local dev)
│
├── src/
│   ├── app/                   ← Next.js App Router
│   │   ├── globals.css        ← Design tokens, Tailwind directives
│   │   ├── layout.tsx         ← Root layout (fonts, providers, metadata)
│   │   ├── page.tsx           ← Homepage (/)
│   │   ├── about/page.tsx
│   │   ├── skills/page.tsx
│   │   ├── experience/page.tsx
│   │   ├── education/page.tsx
│   │   ├── projects/page.tsx
│   │   ├── clients/page.tsx   ← Includes testimonial submission form
│   │   ├── contact/page.tsx
│   │   ├── resume/page.tsx
│   │   ├── sitemap.ts
│   │   ├── robots.ts
│   │   ├── admin/
│   │   │   ├── login/page.tsx
│   │   │   └── dashboard/page.tsx
│   │   └── api/
│   │       ├── auth/[...nextauth]/route.ts
│   │       ├── contact/route.ts
│   │       ├── testimonials/route.ts       ← Public submission (pending)
│   │       ├── resume/download/route.ts
│   │       └── admin/
│   │           ├── profile/route.ts
│   │           ├── media/route.ts          ← Photo/logo/favicon upload
│   │           ├── experience/[id]/route.ts
│   │           ├── education/[id]/route.ts
│   │           ├── skills/[id]/route.ts
│   │           ├── tools/[id]/route.ts
│   │           ├── certifications/[id]/route.ts
│   │           ├── projects/[id]/route.ts
│   │           ├── clients/[id]/route.ts
│   │           ├── testimonials/[id]/route.ts
│   │           └── messages/[id]/route.ts
│   │
│   ├── components/
│   │   ├── sections/          ← All public-facing section components
│   │   │   ├── HeroSection.tsx
│   │   │   ├── AboutSection.tsx
│   │   │   ├── SkillsSection.tsx
│   │   │   ├── ExperienceSection.tsx
│   │   │   ├── EducationSection.tsx
│   │   │   ├── CertificationsSection.tsx
│   │   │   ├── ToolsSection.tsx
│   │   │   ├── ProjectsSection.tsx
│   │   │   ├── ClientsSection.tsx
│   │   │   ├── TestimonialsSection.tsx
│   │   │   ├── TestimonialSubmitForm.tsx   ← Public submit form
│   │   │   ├── ResumeSection.tsx
│   │   │   └── ContactSection.tsx
│   │   │
│   │   ├── admin/             ← Admin console components
│   │   │   ├── AdminDashboardClient.tsx   ← Main shell (sidebar + routing)
│   │   │   ├── AdminProfileEditor.tsx
│   │   │   ├── AdminMediaUploader.tsx     ← Photo/logo/favicon uploader
│   │   │   ├── AdminExperienceEditor.tsx
│   │   │   ├── AdminEducationEditor.tsx
│   │   │   ├── AdminSkillsEditor.tsx
│   │   │   ├── AdminToolsEditor.tsx
│   │   │   ├── AdminCertificationsEditor.tsx
│   │   │   ├── AdminProjectsEditor.tsx
│   │   │   ├── AdminClientsEditor.tsx
│   │   │   ├── AdminTestimonialsEditor.tsx ← Approve/reject/edit
│   │   │   └── AdminMessagesPanel.tsx
│   │   │
│   │   └── shared/
│   │       ├── Navbar.tsx         ← Page-route aware nav with active state
│   │       ├── Footer.tsx
│   │       ├── PageHero.tsx       ← Consistent page header with breadcrumb
│   │       ├── ParticleBackground.tsx
│   │       └── ThemeProvider.tsx
│   │
│   ├── lib/
│   │   ├── auth.ts            ← NextAuth config (JWT, credentials)
│   │   ├── prisma.ts          ← Prisma client singleton
│   │   └── utils.ts           ← cn(), formatDate(), rateLimit(), sanitizeInput()
│   │
│   └── middleware.ts          ← Protects /admin/* and /api/admin/*
│
├── .env.example               ← Template for all env variables
├── .env.local                 ← Your actual values (never commit this)
├── postcss.config.mjs         ← Required for Tailwind processing
├── tailwind.config.js         ← Design tokens, custom colours, animations
├── next.config.mjs            ← Next.js config (headers, images)
├── Dockerfile                 ← Production Docker image
├── docker-compose.yml         ← Local dev with PostgreSQL
└── vercel.json                ← Vercel deployment config
```

---

## 4. Database Schema

### Models Overview

| Model | Purpose |
|---|---|
| `User` | Admin accounts (email + bcrypt password) |
| `Profile` | George's bio, contact info, photo URL, favicon URL |
| `Experience` | Work history entries |
| `Education` | Academic qualifications |
| `Certification` | Professional certifications (CPSP-K etc.) |
| `Skill` | Skills with category and proficiency (0–100) |
| `Tool` | Tools & technologies by category |
| `Project` | Portfolio projects with tags, client, featured flag |
| `Client` | Client/organisation entries with logo |
| `Testimonial` | Client reviews — `isPublished: false` until approved |
| `ContactMessage` | Contact form submissions with read/replied status |
| `Resume` | CV file versions with download counter |
| `SiteSettings` | Key-value settings (analytics, maintenance mode, etc.) |
| `AuditLog` | Every admin action is logged here |

### Key Relationships

- `Testimonial.isPublished` defaults to `false` — must be set to `true` by admin
- `Project.isFeatured` surfaces projects at the top with a "Featured" badge
- `AuditLog` links to `User` via `userId`

---

## 5. Pages & Routes

### Public Pages

| Route | Page | Description |
|---|---|---|
| `/` | Home | Full overview with all sections visible |
| `/about` | About Me | Summary + stats + current role |
| `/skills` | Skills & Tools | Proficiency bars + tools grid |
| `/experience` | Work Experience | Animated timeline |
| `/education` | Education | Degrees + certifications |
| `/projects` | Projects | Portfolio cards with category filter |
| `/clients` | Clients & Testimonials | Client grid + approved testimonials + submit form |
| `/contact` | Contact | Contact form + contact info |
| `/resume` | Resume / CV | Download page |

### Admin Routes

| Route | Description |
|---|---|
| `/admin/login` | Login page |
| `/admin/dashboard` | Full CMS — all sections |

---

## 6. Admin Console

Access at `/admin/login`. Protected by NextAuth JWT sessions.

### What you can do in each tab

**Profile**
Edit name, titles, summary, email, phone, location, LinkedIn, WhatsApp.

**Media & Branding**
Upload profile photo, optional logo, and favicon. Files saved to `/public/uploads/`.

**Experience**
Add, edit, delete work history. Each entry has: role, company, dates, location, achievements list.

**Education**
Add, edit, delete degrees and courses. Supports "currently studying" toggle.

**Skills**
Add, edit, delete skills. Set category (Core / Technical / Soft / Language) and proficiency percentage with a slider.

**Tools**
Add, edit, delete tools by category (CRM, Productivity, Project Management, Communication, ERP).

**Certifications**
Add, edit, delete certifications. Stores issuer, dates, credential ID and verification URL.

**Projects**
Add, edit, delete portfolio projects. Set title, description, category, client, tags, image URL, project URL. Toggle "Featured" to pin to top.

**Clients**
Add, edit, delete client organisations. Store name, industry, logo URL, website.

**Testimonials**
Review all submissions (pending shown with amber badge). Approve to publish, unpublish, edit, or delete. Pending count shown in sidebar.

**Messages**
Read contact form submissions. Mark as read, replied, or archived. Click any message to view full content and reply via email.

---

## 7. API Reference

### Public endpoints

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/contact` | Submit contact form (rate-limited: 5/15min) |
| `POST` | `/api/testimonials` | Submit testimonial (rate-limited: 3/hour) — saved as `isPublished: false` |
| `POST` | `/api/resume/download` | Track CV download (increments counter) |

### Protected admin endpoints (require valid session)

| Method | Path | Description |
|---|---|---|
| `PUT` | `/api/admin/profile` | Update profile |
| `POST` | `/api/admin/media` | Upload photo/logo/favicon |
| `DELETE` | `/api/admin/media` | Remove photo/logo/favicon |
| `GET/POST` | `/api/admin/experience` | List / create experience |
| `PUT/DELETE` | `/api/admin/experience/[id]` | Update / delete |
| `GET/POST` | `/api/admin/education` | List / create |
| `PUT/DELETE` | `/api/admin/education/[id]` | Update / delete |
| `GET/POST` | `/api/admin/skills` | List / create |
| `PUT/DELETE` | `/api/admin/skills/[id]` | Update / delete |
| `GET/POST` | `/api/admin/tools` | List / create |
| `PUT/DELETE` | `/api/admin/tools/[id]` | Update / delete |
| `GET/POST` | `/api/admin/certifications` | List / create |
| `PUT/DELETE` | `/api/admin/certifications/[id]` | Update / delete |
| `GET/POST` | `/api/admin/projects` | List / create |
| `PUT/DELETE` | `/api/admin/projects/[id]` | Update / delete |
| `GET/POST` | `/api/admin/clients` | List / create |
| `PUT/DELETE` | `/api/admin/clients/[id]` | Update / delete |
| `GET/POST` | `/api/admin/testimonials` | List all (inc. unpublished) / create |
| `PUT/PATCH/DELETE` | `/api/admin/testimonials/[id]` | Edit / toggle published / delete |
| `PATCH` | `/api/admin/messages/[id]` | Update message status |

---

## 8. Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```env
# ── Required ──────────────────────────────────────────────
DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"
DIRECT_URL="postgresql://user:pass@host/db?sslmode=require"

AUTH_SECRET="generate with: openssl rand -base64 32"
AUTH_URL="http://localhost:3000"        # your actual URL in production

ADMIN_PASSWORD="ChooseAStrongPassword"  # used during db:seed

NEXT_PUBLIC_SITE_URL="https://your-domain.vercel.app"

# ── Optional: Email notifications ─────────────────────────
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your@gmail.com"
SMTP_PASS="your-app-password"
CONTACT_EMAIL="mwangig25@gmail.com"

# ── Optional: Analytics ───────────────────────────────────
NEXT_PUBLIC_PLAUSIBLE_DOMAIN="your-domain.vercel.app"
```

---

## 9. Local Setup Guide

### Prerequisites
- Node.js 20 or newer (`node -v` to check)
- A PostgreSQL database (free at neon.tech)

### Steps

```bash
# 1. Extract zip and open terminal in the folder
cd george-mwangi-portfolio

# 2. Install dependencies
npm install

# 3. Create .env.local
cp .env.example .env.local
# Edit .env.local — add your DATABASE_URL and AUTH_SECRET at minimum

# 4. Generate Prisma client + push schema + seed data
npm run db:generate
npm run db:push
npm run db:seed

# 5. Run dev server
npm run dev
```

Open:
- Portfolio: http://localhost:3000
- Admin: http://localhost:3000/admin/login

Login credentials:
- Email: `mwangig25@gmail.com`
- Password: whatever you set as `ADMIN_PASSWORD` in `.env.local` (default: `Admin@2024!`)

---

## 10. Deployment Guide (Free)

### Step 1 — Free PostgreSQL at Neon

1. Go to **neon.tech** → Sign up free (no credit card)
2. Create project → name it `george-portfolio`
3. Copy the **Connection string** (looks like `postgresql://...`)

### Step 2 — Push code to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
# Create a repo on github.com first, then:
git remote add origin https://github.com/YOUR_USERNAME/george-portfolio.git
git push -u origin main
```

### Step 3 — Deploy on Vercel

1. Go to **vercel.com** → Sign up with GitHub
2. Click **Add New Project** → import your repo
3. Before deploying, expand **Environment Variables** and add:

| Variable | Value |
|---|---|
| `DATABASE_URL` | Your Neon connection string |
| `DIRECT_URL` | Same Neon connection string |
| `AUTH_SECRET` | Run `openssl rand -base64 32` |
| `AUTH_URL` | `https://your-app.vercel.app` |
| `NEXT_PUBLIC_SITE_URL` | `https://your-app.vercel.app` |
| `ADMIN_PASSWORD` | A strong password |

4. Click **Deploy** (takes ~2 minutes)

### Step 4 — Seed the live database (once)

On your computer, temporarily point your local `.env.local` `DATABASE_URL` to Neon, then run:

```bash
npm run db:seed
```

This loads George's profile, skills, experience, and sample projects into the live database.

### Step 5 — Custom domain (optional, free)

In Vercel dashboard → your project → **Domains** → add your domain (e.g. `georgemwangi.co.ke`). Vercel provides free SSL automatically.

---

## 11. Media & Branding Uploads

Go to **Admin → Media & Branding**. Three upload slots:

| Slot | Use | Recommended Size |
|---|---|---|
| Profile Photo | Shown in hero section | 400×400px min, square |
| Logo (optional) | Shown in navbar & footer | SVG or PNG, transparent background |
| Favicon | Browser tab icon | 32×32 or 64×64px PNG/ICO |

**Note on favicon:** After uploading, the new favicon is served via Next.js metadata. Clear browser cache (Ctrl+Shift+R) if the old icon persists.

**Local uploads** go to `/public/uploads/`. On Vercel, these persist within a deployment but are reset on redeploy. For permanent storage, upgrade to **AWS S3** or **Cloudflare R2** — see `src/app/api/admin/media/route.ts` and replace the `writeFile` logic with your S3 `PutObject` call.

---

## 12. Testimonial Moderation

The flow is:

```
Visitor fills form on /clients page
         ↓
POST /api/testimonials
         ↓
Saved to DB with isPublished: false
         ↓
Admin sees "Pending Review (N)" badge in sidebar
         ↓
Admin reviews in Testimonials tab
         ↓
Click "Approve & Publish" → isPublished: true → appears on site immediately
```

Admins can also:
- **Edit** testimonial content/rating/name before approving
- **Unpublish** an already-live testimonial
- **Delete** spam or inappropriate submissions

Rate limiting: 3 submissions per hour per IP address.

---

## 13. Security Design

| Concern | Implementation |
|---|---|
| Authentication | NextAuth v5 JWT, 24h sessions, bcrypt (cost 12) |
| Route protection | Middleware guards all `/admin/*` and `/api/admin/*` |
| CSRF | Handled by NextAuth built-in |
| XSS | Input sanitisation on all user inputs (`sanitizeInput()`) |
| Rate limiting | In-memory per-IP limiter on contact + testimonial APIs |
| File uploads | Type + size validation before writing to disk |
| Security headers | X-Frame-Options, X-Content-Type-Options, HSTS, Referrer-Policy |
| SQL injection | Prisma parameterised queries — no raw SQL |
| Audit trail | Every admin mutation logged to `AuditLog` table |

---

## 14. Performance & SEO

- **Server Components** — all public pages are server-rendered, no client JS needed to show content
- **Dynamic metadata** — each page has its own `<title>`, `<description>`, and Open Graph tags
- **Structured data** — JSON-LD Person schema on homepage
- **Sitemap** — auto-generated at `/sitemap.xml`
- **robots.txt** — at `/robots.txt`, blocks admin and API routes
- **next/font** — fonts loaded via Next.js (no layout shift, no external request at render time)
- **Image optimisation** — Next.js `<Image>` with AVIF/WebP formats
- **Lazy loading** — all sections below the fold wrapped in `<Suspense>`

---

## 15. Customisation Guide

### Change brand colour

In `src/app/globals.css`:
```css
:root {
  --primary: 162 69% 37%;  /* HSL — change these numbers */
}
.dark {
  --primary: 162 60% 44%;
}
```

### Add a new page section

1. Create `src/components/sections/NewSection.tsx`
2. Create `src/app/new-section/page.tsx` (copy any existing page route)
3. Add a link in `src/components/shared/Navbar.tsx`
4. If it needs a database model, add it to `prisma/schema.prisma` and run `npm run db:migrate:dev`
5. Add an admin editor in `src/components/admin/`

### Add a new skill category

In `prisma/schema.prisma` update the `SkillCategory` enum, then:
```bash
npm run db:migrate:dev
```
Add the label to `CATEGORY_LABELS` in `AdminSkillsEditor.tsx` and `SkillsSection.tsx`.

---

## 16. Troubleshooting

**Page has no styling / looks unstyled**
→ Make sure `postcss.config.mjs` exists at the project root. This file is required for Tailwind to process CSS.

**`PrismaClientInitializationError`**
→ Check `DATABASE_URL` in `.env.local`. Make sure it includes `?sslmode=require` for Neon.

**Admin login gives "Invalid credentials"**
→ Run `npm run db:seed` first to create the admin user. Check `ADMIN_PASSWORD` matches what you used.

**Hydration mismatch warning about password managers**
→ Ensure `suppressHydrationWarning` is on all `<form>`, `<div>`, and `<input>` elements in forms. Already done in this codebase.

**Vercel build fails: "Prisma client not generated"**
→ Check `vercel.json` — the `buildCommand` must be `prisma generate && next build`.

**Uploaded images don't persist after Vercel redeploy**
→ Local `/public/uploads/` is ephemeral on Vercel. Upgrade to S3/Cloudflare R2 for persistent storage.

**Theme toggle shows wrong icon on first load**
→ The `mounted` guard in Navbar prevents this. If you see it elsewhere, add a `mounted` state + `useEffect` before rendering theme-dependent UI.

---

## 17. Upgrade Guide

### Upgrading Next.js

```bash
npm install next@latest react@latest react-dom@latest
npm run type-check   # check for breaking changes
```

### Upgrading Prisma

```bash
npm install prisma@latest @prisma/client@latest
npm run db:generate
```

### Upgrading Motion (framer-motion replacement)

```bash
npm install motion@latest
# Import path stays the same: from 'motion/react'
```

### Resetting the database (destructive)

```bash
npm run db:reset     # drops all tables and re-runs migrations + seed
```

---

*Documentation generated for George Mwangi Portfolio v2.0 — June 2026*
