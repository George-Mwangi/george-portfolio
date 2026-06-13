# Joan Mwangi – Professional Portfolio

A production-ready, full-stack portfolio web application for **Joan Mwangi**, Certified Procurement & Supply Professional (CPSP-K).

Built with **Next.js 15**, **React 19**, **TypeScript**, **Tailwind CSS**, **Motion (v12)**, **Prisma**, and **PostgreSQL**.

---

## ✨ Features

- **Futuristic dark/light UI** — glassmorphism cards, animated particle background, smooth transitions
- **Dynamic hero** with rotating professional titles
- **Animated skills dashboard** with proficiency bars and category filtering
- **Interactive experience timeline** with responsibilities
- **Education & certifications** sections
- **Tools & technologies** grid with categorised filtering
- **Contact form** with rate limiting, input sanitisation, and email notifications
- **CV download** with analytics tracking
- **Admin dashboard** — edit profile, experience, skills, manage messages
- **SEO optimised** — structured data, Open Graph, Twitter Cards, sitemap, robots.txt
- **Security hardened** — CSRF via NextAuth, OWASP headers, rate limiting, XSS sanitisation
- **Accessible** — WCAG 2.2 compliant, keyboard nav, screen reader support

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15.3+ (App Router, Turbopack) |
| UI | React 19, Tailwind CSS 3, Radix UI, shadcn/ui |
| Animation | Motion 12 (`motion/react`) |
| Database | PostgreSQL via Neon (free tier) |
| ORM | Prisma 6 |
| Auth | NextAuth v5 (Auth.js beta) |
| Language | TypeScript 5.8 |
| Deployment | Vercel |

---

## 🚀 Quick Start (Local)

### 1. Clone & install

```bash
git clone https://github.com/yourusername/joan-mwangi-portfolio.git
cd joan-mwangi-portfolio
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
# Edit .env.local with your values (see below)
```

Minimum required variables for local development:

```env
DATABASE_URL="postgresql://..."
AUTH_SECRET="your-32-char-secret"
AUTH_URL="http://localhost:3000"
```

### 3. Set up the database

```bash
npm run db:generate   # Generate Prisma client
npm run db:push       # Push schema to database
npm run db:seed       # Seed with Joan's data
```

### 4. Run dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the portfolio.

Admin panel: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- Email: `joanivymwangi@gmail.com`
- Password: `Admin@2024!` *(change this in production!)*

---

## ☁️ Deploy to Vercel (Recommended – Free)

### Step 1: Create a Neon database

1. Go to [neon.tech](https://neon.tech) and create a free account
2. Create a new project named `joan-portfolio`
3. Copy the **connection string** (looks like `postgresql://user:pass@host/db?sslmode=require`)

### Step 2: Deploy to Vercel

1. Push your code to a GitHub repository
2. Go to [vercel.com](https://vercel.com) → **New Project** → Import your repo
3. Add these environment variables in Vercel's dashboard:

| Variable | Value |
|---|---|
| `DATABASE_URL` | Your Neon connection string |
| `DIRECT_URL` | Same Neon connection string |
| `AUTH_SECRET` | Run `openssl rand -base64 32` to generate |
| `AUTH_URL` | `https://your-domain.vercel.app` |
| `NEXT_PUBLIC_SITE_URL` | `https://your-domain.vercel.app` |
| `ADMIN_PASSWORD` | A strong password for Joan's admin account |

4. Click **Deploy**

### Step 3: Run database setup

After first deployment, run the seed via Vercel CLI or locally pointing to your Neon DB:

```bash
# Point to production DB
DATABASE_URL="your-neon-url" npm run db:seed
```

---

## 🔑 Admin Panel

Access at `/admin/login` with your credentials. Features:

- **Profile** — edit name, summary, contact details, social links
- **Experience** — add/edit/delete work history
- **Messages** — view, reply, archive contact form submissions
- **Skills, Tools, Education, Certifications** — full CRUD (API-ready, extend UI as needed)

Changes reflect immediately on the public portfolio.

---

## 🐳 Docker (Self-Hosted)

```bash
# Development with local PostgreSQL
docker-compose up -d

# Check logs
docker-compose logs -f app

# Run migrations
docker-compose exec app npx prisma migrate deploy
docker-compose exec app npm run db:seed
```

---

## 📁 Project Structure

```
joan-portfolio/
├── src/
│   ├── app/
│   │   ├── page.tsx                  # Public portfolio (Server Component)
│   │   ├── layout.tsx                # Root layout + SEO metadata
│   │   ├── sitemap.ts                # XML sitemap
│   │   ├── robots.ts                 # robots.txt
│   │   ├── admin/
│   │   │   ├── login/page.tsx        # Admin login
│   │   │   └── dashboard/page.tsx    # Admin dashboard (protected)
│   │   └── api/
│   │       ├── auth/[...nextauth]/   # NextAuth v5 handlers
│   │       ├── contact/              # Contact form endpoint
│   │       ├── resume/download/      # Download analytics
│   │       └── admin/                # Protected CMS endpoints
│   ├── components/
│   │   ├── sections/                 # Public portfolio sections
│   │   ├── admin/                    # Admin dashboard components
│   │   └── shared/                   # Navbar, Footer, ParticleBackground
│   ├── lib/
│   │   ├── auth.ts                   # NextAuth config
│   │   ├── prisma.ts                 # Prisma client singleton
│   │   └── utils.ts                  # Helpers, rate limiting
│   ├── middleware.ts                  # Route protection
│   └── styles/globals.css            # Design tokens + global styles
├── prisma/
│   ├── schema.prisma                 # Full database schema
│   └── seed.ts                       # Seed with Joan's data
├── Dockerfile                        # Production Docker image
├── docker-compose.yml                # Local dev with PostgreSQL
├── .env.example                      # Environment variable template
└── .github/workflows/ci.yml          # CI/CD pipeline
```

---

## 🔒 Security

- **CSRF** — handled by NextAuth v5 automatically
- **Auth** — JWT sessions with 24h expiry, bcrypt password hashing (cost 12)
- **Rate limiting** — contact form: 5 req/15min per IP; configurable per route
- **Input sanitisation** — XSS prevention on all user inputs
- **Security headers** — HSTS, X-Frame-Options, CSP, X-Content-Type-Options
- **Admin protection** — middleware guards all `/admin/*` and `/api/admin/*` routes
- **Audit logging** — all admin mutations logged to `AuditLog` table

---

## 🎨 Customising the Design

All design tokens live in `tailwind.config.ts` and `src/styles/globals.css`.

To change the brand colour (currently teal `#1D9E75`):

```css
/* src/styles/globals.css */
:root {
  --primary: 162 69% 37%;  /* HSL: change this */
}
```

---

## 📧 Email Setup (Optional)

To receive contact form notifications:

1. **Gmail** (easiest): Enable 2FA, create an App Password, add to `.env.local`
2. **Resend** (recommended for production): [resend.com](https://resend.com) — free 100 emails/day
3. **Postmark**: Enterprise-grade deliverability

---

## 🔄 Upgrading CV / Profile Photo

1. Log in to `/admin/login`
2. Go to **Profile** → upload new photo or update CV URL
3. Changes appear instantly on the public site

---

## 📈 Analytics (Optional)

Add to `.env.local`:

```env
NEXT_PUBLIC_PLAUSIBLE_DOMAIN="joanmwangi.vercel.app"
```

Then add the Plausible script to `src/app/layout.tsx`:

```tsx
<Script defer data-domain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN}
  src="https://plausible.io/js/script.js" />
```

---

## 🛟 Troubleshooting

**`PrismaClientInitializationError`** — Check your `DATABASE_URL` in `.env.local`. Ensure the database is running and reachable.

**`[auth] error` on login** — Ensure `AUTH_SECRET` is set and is at least 32 characters.

**Vercel build fails with Prisma error** — Add `prisma generate` to the build command: `prisma generate && next build`

**Contact form not sending email** — Email is optional. Messages always save to the database. Check SMTP credentials if email notifications are needed.

---

## 📄 License

Private — all rights reserved by Joan Mwangi.
#   j o a n - p o r t f o l i o  
 