# Local Setup Guide

## Prerequisites

- Node.js 20+
- npm
- A NeonDB account (free tier works)
- A Google Cloud project with OAuth credentials
- A Google AI Studio API key (Gemini)

---

## Step 1 — Clone and Install

```bash
git clone <repo-url> && cd AI-PPT-Builder-master
npm install
```

---

## Step 2 — Set Up NeonDB

1. Go to [neon.tech](https://neon.tech) → create a project → create a database named `neondb`
2. In your Neon dashboard, go to **Connection Details**
3. Copy the **Pooled connection string** → paste as `DATABASE_URL`
4. Copy the **Direct connection string** (toggle off pooler) → paste as `DIRECT_URL`

---

## Step 3 — Set Up Google OAuth

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a project → enable **Google+ API** (or use the defaults)
3. Go to **APIs & Services → Credentials → Create Credentials → OAuth 2.0 Client ID**
4. Application type: **Web application**
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID → `GOOGLE_CLIENT_ID`
7. Copy Client Secret → `GOOGLE_CLIENT_SECRET`

---

## Step 4 — Get Gemini API Key

1. Go to [aistudio.google.com](https://aistudio.google.com)
2. Click **Get API Key** → create a key
3. Copy it → `GEMINI_API_KEY`

---

## Step 5 — Configure Environment Variables

Copy `.env.samples` to `.env.local` and fill in your values:

```bash
cp .env.samples .env.local
```

Then edit `.env.local`:

```bash
DATABASE_URL=postgres://...pooler...neon.tech/neondb?sslmode=require
DIRECT_URL=postgres://...neon.tech/neondb?sslmode=require

NEXTAUTH_SECRET=$(openssl rand -base64 32)
NEXTAUTH_URL=http://localhost:3000

GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxx

GEMINI_API_KEY=AIzaSy...

NEXT_PUBLIC_HOST_URL=http://localhost:3000/

DEV_BYPASS_PAYMENTS=true
```

> **Important:** `DEV_BYPASS_PAYMENTS=true` disables subscription checks — you can use all AI features locally for free.

---

## Step 6 — Run Database Migrations

First time only (creates the tables):

```bash
npx prisma migrate dev --name init
```

If you're connecting to an existing database:

```bash
npx prisma db push
```

Generate Prisma client (run after any schema changes):

```bash
npx prisma generate
```

---

## Step 7 — Start Dev Server

```bash
npm run dev
```

App runs at [http://localhost:3000](http://localhost:3000)

---

## Common Commands

```bash
npm run dev          # Start dev server with Turbopack
npm run build        # Production build
npm run lint         # ESLint
npx tsc --noEmit     # TypeScript type check
npx prisma studio    # Visual DB browser
npx prisma db push   # Sync schema to DB without migration file
```

---

## Troubleshooting

**Sign-in redirects to error page:**
- Check `NEXTAUTH_URL` is set to `http://localhost:3000`
- Check `NEXTAUTH_SECRET` is set
- Check Google OAuth redirect URI exactly matches `http://localhost:3000/api/auth/callback/google`

**AI generation returns 403:**
- Check `DEV_BYPASS_PAYMENTS=true` is in `.env`
- Check `GEMINI_API_KEY` is valid

**Prisma errors on start:**
- Run `npx prisma generate` after any schema change
- Run `npx prisma db push` to sync schema to DB

**Build fails with type errors:**
- Run `npx tsc --noEmit` to see all errors
- Run `npx prisma generate` to regenerate types
