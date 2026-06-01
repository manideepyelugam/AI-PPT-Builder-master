# AI PPT Builder

![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)
![Status](https://img.shields.io/badge/status-active-brightgreen?style=flat-square)
![Next.js](https://img.shields.io/badge/Next.js-15-blue?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-38B2AC?style=flat-square&logo=tailwindcss)

---

## About

AI PPT Builder is a SaaS tool that helps you create beautiful, professional presentations using **Google Gemini AI**. It generates slide outlines, themes, layouts, and visuals while allowing full customization with an intuitive **drag-and-drop editor**.

Built with **Next.js, Clerk, Prisma, and Lemon Squeezy**.

---

## Key Features

- **Clerk Authentication** – Secure login and signup.
- **AI Outline Generator** – Turn prompts into structured slides via Gemini.
- **Themes & Layouts** – Choose from prebuilt or AI-generated themes.
- **AI-Powered Images** – Generate visuals using Google Imagen 3.
- **Drag-and-Drop Editor** – Fully customizable slides.
- **Save & Manage Projects** – All presentations in one place.
- **Monetization** – Integrated with Lemon Squeezy.

---

## Tech Stack

- **Frontend:** Next.js 15, TypeScript, TailwindCSS 4, ShadCN UI
- **Backend:** Prisma ORM, Neon PostgreSQL
- **AI:** Google Gemini (text) + Imagen 3 (images)
- **Auth:** Clerk
- **Payments:** Lemon Squeezy
- **State:** Zustand

---

## Getting Started

### Prerequisites

- Node.js 18+
- Neon PostgreSQL account
- Google Gemini API Key ([Get one here](https://aistudio.google.com/app/apikey))
- Clerk API Keys
- Lemon Squeezy API Keys (optional, for payments)

### Installation

```bash
git clone <your-repo-url>
cd ai-ppt-builder
npm install
```

### Configuration

Copy `.env.samples` to `.env.local` and fill in your values:

```bash
cp .env.samples .env.local
```

```env
# Neon PostgreSQL
DATABASE_URL=postgres://user:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require
DIRECT_URL=postgres://user:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require&pgbouncer=false

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
CLERK_SECRET_KEY=your_secret_key

# Gemini
GEMINI_API_KEY=your_gemini_api_key

# Lemon Squeezy (optional)
LEMON_SQUEEZY_API_KEY=your_api_key
```

> **Neon tip:** In your Neon dashboard, go to your project → Connection Details.
> For `DATABASE_URL`, use the **Pooled connection** string.
> For `DIRECT_URL`, use the **Direct connection** string.

### Database Setup

```bash
# Push the schema to your Neon database
npx prisma db push

# (Optional) Open Prisma Studio to explore/manage data
npx prisma studio
```

### Run

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## Directory Structure

```
src/
├── actions/         # Server actions (AI generation, DB operations)
├── app/             # Next.js App Router pages
├── components/      # Reusable UI components
├── lib/             # Utilities, types, constants
├── provider/        # Theme provider
└── store/           # Zustand state stores
prisma/
└── schema.prisma    # Database schema
```

---

## Roadmap

- [x] AI Slide Generator
- [x] Themes & Images
- [x] Clerk Authentication
- [x] Lemon Squeezy Integration
- [ ] Team Collaboration
- [ ] Export as PPTX/PDF
- [ ] Cloud Deployment (Vercel)

---

## License

MIT License © 2025 Manideep Yelugam
