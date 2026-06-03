# AI PPT Builder — Project Context Document

> Purpose: this document is a **codebase context sheet** for an AI assistant.  
> It summarizes the **current repository structure**, the **major modules**, and the **runtime flow** so the model can understand the project with minimal extra back-and-forth.

---

## 1) What this project is

**AI PPT Builder** is a Next.js 15 presentation SaaS that helps users:

- sign in with Google
- create a presentation from a prompt
- generate an AI outline and AI slide deck
- choose themes and layouts
- edit slides in a drag-and-drop editor
- manage projects, trash, templates, and shared presentations
- monetize templates and subscriptions through Lemon Squeezy

The app is built around:
- **Next.js App Router**
- **NextAuth + Google OAuth**
- **Prisma + PostgreSQL**
- **Google Gemini** for text generation
- **Gemini image generation** for slide images
- **Zustand** for client-side editor state
- **shadcn/ui + Radix UI** for UI primitives
- **Lemon Squeezy** for subscriptions/templates

---

## 2) Important note about repository truth vs older docs

Several markdown files in the repo are useful, but some are **out of sync** with the current code.

### Current codebase reality
- Authentication is implemented with **NextAuth**, not Clerk.
- AI generation currently uses:
  - `gemini-2.5-flash-lite` for text generation
  - `gemini-2.5-flash-image-preview` for image generation
- Project data is stored in **Prisma** with a PostgreSQL datasource.
- Payments / template commerce are handled through **Lemon Squeezy**.

### Older docs in the repo
- `README.md` mentions Clerk and Imagen 3.
- `PROJECT_OVERVIEW.md` and `GEMINI_INTEGRATION.md` reflect an older or broader architecture description.

This document follows the **actual source code currently present in the repo**.

---

## 3) High-level architecture

### Main app areas
1. **Public auth flow**
   - sign in
   - auth callback
   - sign-up redirect to sign-in

2. **Protected dashboard shell**
   - sidebar navigation
   - top info bar
   - project browsing
   - templates
   - trash
   - settings

3. **Presentation workspace**
   - presentation editor
   - slide layout preview
   - theme picker
   - right sidebar for editing layouts/components
   - text formatting toolbar
   - drag and drop editing

4. **AI generation**
   - prompt → outline generation
   - outline → semantic slide deck generation
   - image generation / fallback image replacement
   - single-slide AI insertion

5. **Payments / commerce**
   - subscription checkout
   - buying templates
   - webhook-driven subscription activation

---

## 4) Current repo structure

```text
AI-PPT-Builder-master copy/
├── README.md
├── PROJECT_OVERVIEW.md
├── LOCAL_SETUP.md
├── GEMINI_INTEGRATION.md
├── package.json
├── next.config.js
├── next.config.ts
├── tsconfig.json
├── eslint.config.mjs
├── postcss.config.mjs
├── components.json
├── prisma/
│   ├── prisma.config.ts
│   └── schema.prisma
├── public/
│   ├── logo.png
│   ├── logo.jpg
│   ├── slide.webp
│   └── other static assets
└── src/
    ├── actions/
    │   ├── ai.ts
    │   ├── gemini.ts
    │   ├── projects.ts
    │   ├── user.ts
    │   └── lemonSqueezy.ts
    ├── app/
    │   ├── (auth)/
    │   │   ├── layout.tsx
    │   │   ├── callback/
    │   │   │   ├── page.tsx
    │   │   │   └── loading.tsx
    │   │   ├── sign-in/[[...sign-in]]/page.tsx
    │   │   └── sign-up/[[...sign-up]]/page.tsx
    │   ├── (protected)/
    │   │   ├── layout.tsx
    │   │   ├── (pages)/
    │   │   │   ├── layout.tsx
    │   │   │   └── (dashboardPages)/
    │   │   │       ├── dashboard/page.tsx
    │   │   │       ├── create-page/page.tsx
    │   │   │       ├── settings/page.tsx
    │   │   │       ├── templates/page.tsx
    │   │   │       ├── templates/[templates]/page.tsx
    │   │   │       ├── trash/page.tsx
    │   │   │       └── share/[shareID]/page.tsx
    │   │   └── presentation/
    │   │       ├── page.tsx
    │   │       └── [presentationID]/
    │   │           ├── page.tsx
    │   │           ├── layout.tsx
    │   │           └── select-theme/page.tsx
    │   ├── api/
    │   │   ├── auth/[...nextauth]/route.ts
    │   │   └── webhook/subscriptions/route.ts
    │   ├── layout.tsx
    │   ├── page.tsx
    │   └── globals.css
    ├── components/
    │   ├── global/
    │   └── ui/
    ├── hooks/
    ├── lib/
    │   ├── ai/
    │   ├── export/
    │   ├── images/
    │   ├── layout/
    │   └── theme/
    ├── provider/
    ├── store/
    └── types/
```

---

## 5) Route map

### Public / auth routes
- `/sign-in` → Google sign-in page
- `/sign-up` → redirects to `/sign-in`
- `/callback` → auth callback handling

### Protected dashboard routes
- `/dashboard` → project list
- `/create-page` → create a new presentation
- `/settings` → user settings / Lemon Squeezy config
- `/templates` → browse sellable templates
- `/templates/[templates]` → open a template/project detail
- `/trash` → deleted projects
- `/share/[shareID]` → shared presentation page

### Presentation routes
- `/presentation/[presentationID]` → editor workspace
- `/presentation/[presentationID]/select-theme` → theme selection flow

### API routes
- `/api/auth/[...nextauth]` → NextAuth handler
- `/api/webhook/subscriptions` → Lemon Squeezy webhook

---

## 6) Request / navigation flow

### Home route
`src/app/page.tsx` immediately redirects to `/dashboard`.

### Protected shell
`src/app/(protected)/layout.tsx`
- calls `onAuthenticateUser()`
- redirects to `/sign-in` when no session exists
- otherwise renders protected content

### Dashboard shell
`src/app/(protected)/(pages)/layout.tsx`
- loads recent projects
- loads authenticated user
- renders:
  - `AppSidebar`
  - `UpperInfobar`
  - page content inside a sidebar layout

### Presentation workspace
`src/app/(protected)/presentation/[presentationID]/page.tsx`
- fetches the project by ID
- resolves the active theme from saved `themeName`
- stores project + slides + theme in Zustand
- renders:
  - fixed navbar
  - left slide preview sidebar
  - main editor canvas
  - right sidebar tools
  - text formatting toolbar
  - bottom toolbar

---

## 7) Core product flows

## 7.1 Authentication flow
### Files involved
- `src/lib/auth.ts`
- `src/app/api/auth/[...nextauth]/route.ts`
- `src/actions/user.ts`
- `src/middleware.ts`
- `src/app/(auth)/sign-in/[[...sign-in]]/page.tsx`
- `src/app/(auth)/callback/page.tsx`

### How it works
- NextAuth is configured with **GoogleProvider** and a **PrismaAdapter**
- sessions use JWT strategy
- `jwt` and `session` callbacks attach `user.id`
- `middleware.ts` protects dashboard/presentation routes
- auth callback redirects successful logins to `/dashboard`

### Key behavior
- sign-in is Google-only
- sign-up is not separate; it redirects to sign-in
- authenticated users are created/fetched in the Prisma DB

---

## 7.2 Dashboard / project management flow
### Files involved
- `src/actions/projects.ts`
- `src/components/global/projects/index.tsx`
- `src/components/global/project-card/index.tsx`
- `src/app/(protected)/(pages)/(dashboardPages)/dashboard/page.tsx`
- `src/app/(protected)/(pages)/(dashboardPages)/trash/page.tsx`
- `src/app/(protected)/(pages)/(dashboardPages)/templates/page.tsx`

### What users can do
- view all projects
- open a project
- soft delete a project
- recover a deleted project
- permanently delete multiple projects from trash
- browse sellable templates
- buy template access via Lemon Squeezy

### Important implementation detail
Project deletion is **soft delete** using `isDeleted`.
Trash is just the same `Project` table filtered by `isDeleted = true`.

---

## 7.3 Create presentation flow
### Files involved
- `src/app/(protected)/(pages)/(dashboardPages)/create-page/page.tsx`
- `src/app/(protected)/(pages)/(dashboardPages)/create-page/_components/renderPage.tsx`
- `src/app/(protected)/(pages)/(dashboardPages)/create-page/_components/*`

### Create page modes
The create flow is split into multiple UI modes:
- template select
- method select
- creative AI
- manual

### General behavior
- users must be authenticated
- users must have an active subscription unless `DEV_BYPASS_PAYMENTS=true`
- the page is wrapped in a `Suspense` fallback skeleton

### UI building blocks
- `method-select/`
- `template-select/`
- `generate-ai/`
- `manual/`
- `common/`
- `create-page/`

---

## 7.4 AI generation flow
### Files involved
- `src/actions/ai.ts`
- `src/lib/ai/*`
- `src/lib/slideLayouts.ts`
- `src/lib/slideComponents.ts`
- `src/lib/slideUtils.ts`
- `src/lib/images/placeholder.ts`

### Generation stages
1. **Prompt to outline**
   - `generateCreativePrompt(userPrompt)`
   - returns JSON with an `outlines` array

2. **Outline to semantic slide deck**
   - `generateLayoutsJSON(outlines)`
   - builds a semantic deck using schema validation and prompt composition

3. **Compose semantic slide deck into full slide objects**
   - `composeDeck(...)`
   - maps each semantic slide kind to a predefined layout template

4. **Image replacement**
   - `replaceImagesWithGenerated(...)`
   - finds every `image` node inside the slide tree
   - generates a prompt using slide context
   - attempts Gemini image generation
   - falls back to a deterministic placeholder image if needed

5. **Persist slides**
   - the finished slide array is stored in `Project.slides`

### Actual AI models used in the current code
- `gemini-2.5-flash-lite` for text generation
- `gemini-2.5-flash-image-preview` for image generation

### Reliability features
- JSON fence stripping
- schema validation with Zod
- retry flow for semantic deck generation
- concurrency-limited image generation
- fallback deck generation when AI validation fails

---

## 7.5 Presentation editor flow
### Files involved
- `src/app/(protected)/presentation/[presentationID]/page.tsx`
- `src/app/(protected)/presentation/[presentationID]/_components/editor/editor.tsx`
- `src/app/(protected)/presentation/[presentationID]/_components/editor-sidebar/*`
- `src/components/global/editor/*`
- `src/store/useSlideStore.tsx`
- `src/store/useEditorStore.tsx`

### Editor features
- drag-and-drop slide manipulation
- layout preview sidebar
- component palette / right sidebar editing
- text formatting toolbar
- slide insertion
- slide duplication / reordering
- content editing for text, lists, tables, callouts, images, etc.
- autosave / save status handling in editor state

### Key UI regions
- **Navbar**: presentation controls
- **Left sidebar**: slide thumbnails / layout preview
- **Center canvas**: editable slide content
- **Right sidebar**: theme/layout/component controls
- **Top text toolbar**: formatting for selected text
- **Bottom toolbar**: additional editor controls

---

## 7.6 Theme flow
### Files involved
- `src/lib/theme/themes.ts`
- `src/lib/theme/resolveTheme.ts`
- `src/lib/theme/tokens.ts`
- `src/lib/theme/SlideThemeProvider.tsx`
- `src/lib/theme/index.ts`
- `src/app/(protected)/presentation/[presentationID]/select-theme/*`

### What theme system does
- stores curated themes with color, typography, radius, shadow, density, and chart palette tokens
- resolves incomplete themes into full design-token objects
- converts theme values into CSS custom properties
- applies theme locally to slide containers, not globally to the app shell

### Theme selection
The theme picker lives in `select-theme/` and drives the visual style before the deck is finalized or edited.

---

## 7.7 Payments and templates
### Files involved
- `src/actions/lemonSqueezy.ts`
- `src/app/api/webhook/subscriptions/route.ts`
- `src/actions/user.ts`
- `src/components/global/project-card/index.tsx`
- `src/app/(protected)/(pages)/(dashboardPages)/settings/_components/userSettings.tsx`

### Payment-related capabilities
- subscription checkout
- webhook-based subscription activation
- template purchase flow
- storing user-specific Lemon Squeezy credentials in the database
- template ownership linking via `PurchasedProjects`

### Important environment behavior
- `DEV_BYPASS_PAYMENTS=true` makes users behave like subscribed users during development

---

## 8) Database schema

### File
- `prisma/schema.prisma`

### Models

#### `User`
Fields:
- `id`
- `name`
- `email`
- `emailVerified`
- `image`
- `subscription`
- `lemonSqueezyAPIKey`
- `storeID`
- `webhookSecret`
- timestamps

Relations:
- `accounts`
- `Projects` (owned projects)
- `PurchasedProjects` (templates purchased from other users)

#### `Account`
NextAuth OAuth account record:
- provider
- providerAccountId
- tokens
- user relation

#### `Project`
Core application data:
- `id`
- `userId`
- `title`
- `slides` (JSON)
- `outlines` (`String[]`)
- `variantId`
- `thumbnail`
- `themeName`
- `isDeleted`
- `isSellable`
- timestamps

### How project data is used
- `outlines`: AI-generated slide titles
- `slides`: the full generated/editable slide tree
- `themeName`: selected theme
- `isDeleted`: soft delete
- `isSellable`: listed in template marketplace

---

## 9) Slide data model

### Main types
File: `src/lib/types.ts`

#### `Slide`
```ts
{
  id: string;
  slideName: string;
  type: string;
  content: ContentItem;
  slideOrder: number;
  className?: string;
}
```

#### `ContentItem`
A recursive node type used to build slide content trees.  
It supports:
- text blocks
- headings
- paragraphs
- images
- tables
- columns
- lists
- quotes
- callouts
- code blocks
- links
- dividers
- table of contents
- custom buttons

#### `Theme`
Theme tokens include:
- font family
- font color
- background color
- accent color
- optional extended tokens for radius, shadows, density, image style, and chart palette

---

## 10) State management

### `src/store/useSlideStore.tsx`
Holds the active presentation state:
- slides
- project
- current theme
- current slide index
- slide add/remove/reorder operations
- content editing helpers
- layout application helper

### `src/store/useEditorStore.tsx`
Holds editor UI state:
- selected content ID
- selected slide ID
- toolbar rectangle position
- current text styles
- save status
- editing focus / blur coordination
- dropdown state

### `src/store/useCreativeAIStore.tsx`
Holds creative prompt generation state:
- AI prompt text
- generated outlines
- prompt history / reset behavior

### `src/store/usePromptStore.tsx`
Holds create-page navigation state:
- current create flow page
- prompt history
- selected theme

---

## 11) UI / component structure

## 11.1 `src/components/global/`
App-specific reusable components.

### Important groups
- `app-sidebar/`  
  Dashboard navigation shell with logo, main nav, recent projects, and footer actions

- `upper-infobar/`  
  Top dashboard bar with search, theme switcher, and new project button

- `projects/`  
  Project grid rendering

- `project-card/`  
  Card UI for project/template/trash entries; handles open/delete/recover/buy actions

- `page-header/`  
  Reusable title + subtitle + action layout

- `not-found/`  
  Empty state rendering

- `alert-dialog/`  
  Confirmation modal wrapper

- `editor/`  
  Text formatting and editor-specific content renderers

### `src/components/global/editor/components/`
Content renderers used inside the slide canvas:
- `blockQuote.tsx`
- `calloutBox.tsx`
- `codeBlock.tsx`
- `columnComponent.tsx`
- `divider.tsx`
- `headings.tsx`
- `imageComponent.tsx`
- `listComponent.tsx`
- `paragraph.tsx`
- `tableComponet.tsx`
- `tableOfContents.tsx`
- `uploadImage.tsx`

---

## 11.2 `src/components/ui/`
This folder contains the generated **shadcn/ui** style primitives:
- button
- dialog
- dropdown-menu
- sheet
- sidebar
- tabs
- select
- table
- tooltip
- and many more

These are the building blocks used by the rest of the app.

---

## 11.3 Presentation workspace components
### `src/app/(protected)/presentation/[presentationID]/_components/`
Main editor workspace pieces:
- `editor/`
- `editor-sidebar/`
- `navbar/`
- `select-theme/`

### Editor sub-areas
- left sidebar for slide/layout previews
- right sidebar for component / theme / layout selection
- navbar for actions
- bottom toolbar for editor controls
- AI slide modal
- drag/drop zone

---

## 12) Library modules

## 12.1 `src/lib/ai/`
The semantic deck engine:
- `schema.ts` → Zod schema for AI output
- `prompt.ts` → prompt builders
- `compose.ts` → converts semantic slides into actual slide trees
- `familyPicker.ts` → layout family selection logic
- `index.ts` → re-exports

## 12.2 `src/lib/theme/`
Theme engine:
- `themes.ts` → curated theme definitions
- `resolveTheme.ts` → fills missing theme fields and computes derived values
- `tokens.ts` → converts theme values into CSS variables
- `SlideThemeProvider.tsx` → local theme wrapper
- `index.ts` → re-exports

## 12.3 `src/lib/layout/`
Layout helpers:
- `aliases.ts`
- `slotKinds.ts`
- `swap.ts`
- `index.ts`

These support layout swapping, slot mapping, and editor layout operations.

## 12.4 `src/lib/export/`
- `pptx.ts` → presentation export generation using `pptxgenjs`

## 12.5 `src/lib/images/`
- `placeholder.ts` → deterministic fallback image generation / placeholder handling

## 12.6 `src/lib/`
Other important files:
- `auth.ts` → NextAuth config
- `prisma.ts` → Prisma singleton client
- `constant.ts` → navigation items, themes, layout metadata, animation variants
- `slideLayouts.ts` → predefined layout templates
- `slideComponents.ts` → primitive content component definitions
- `slideUtils.ts` → blank slide creation, deep clone helpers
- `utils.ts` → general utility helpers
- `axios.ts` → Lemon Squeezy axios wrapper
- `IconsComponent.tsx` → icon catalog for layouts/components

---

## 13) AI pipeline in detail

## 13.1 Prompt outline generation
File: `src/actions/ai.ts`

Function:
- `generateCreativePrompt(userPrompt)`

Behavior:
- asks Gemini for a JSON object containing at least 5 outline titles
- strips markdown fences
- parses raw JSON
- validates there is a non-empty `outlines` array
- returns `ReturnProps`

---

## 13.2 Semantic deck generation
Files:
- `src/lib/ai/prompt.ts`
- `src/lib/ai/schema.ts`
- `src/lib/ai/compose.ts`

Behavior:
- prompts the model to return a semantic deck
- validates each slide against a Zod schema
- retries with error-specific feedback if validation fails
- falls back to a generated deck if the model still fails

The semantic slide kinds include:
- hero
- section
- titleBody
- twoColumn
- threeColumn
- imageLeft
- imageRight
- imageGrid
- quote
- stats
- table
- fullImage

---

## 13.3 Composition into actual slides
Behavior:
- each semantic kind is mapped to a predefined layout in `slideLayouts.ts`
- content trees are deep-cloned and assigned new IDs
- semantic content is inserted into template slots
- image slots are tagged so they can later be filled with generated visuals

---

## 13.4 Image generation
Current implementation:
- recursively finds image nodes in the slide tree
- extracts slide context from nearby title / heading
- uses Gemini image generation
- retries once on failure
- falls back to placeholder images if generation is unavailable

This is concurrency-limited to avoid rate-limit issues.

---

## 14) Environment variables to expect

Based on the code and setup docs, the project expects variables similar to:

```env
DATABASE_URL=
DIRECT_URL=

NEXTAUTH_SECRET=
NEXTAUTH_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

GEMINI_API_KEY=

NEXT_PUBLIC_HOST_URL=

LEMON_SQUEEZY_API_KEY=
LEMON_SQUEEZY_STORE_ID=
LEMON_SQUEEZY_VARIANT_ID=
LEMON_SQUEEZY_WEBHOOK_SECRTE=

DEV_BYPASS_PAYMENTS=true
```

Notes:
- `DEV_BYPASS_PAYMENTS=true` bypasses subscription gating in development.
- There is a webhook secret spelling in code/docs that appears as `WEBHOOK_SECRTE` / similarly misspelled in places; keep the code and env names aligned exactly.

---

## 15) NPM scripts

From `package.json`:

- `npm run dev` → Next.js dev server with Turbopack
- `npm run build` → production build
- `npm run start` → start production server
- `npm run lint` → lint
- `npm run format` → Prettier format
- `postinstall` → `prisma generate`

---

## 16) Notable implementation characteristics

### Soft delete instead of hard delete
Projects are hidden via `isDeleted` rather than removed from the database.

### Auth-aware server actions
Most data mutations call `onAuthenticateUser()` first.

### Theme-local rendering
Slide theming is applied locally with CSS variables instead of changing the whole app shell.

### Persisted client state
Zustand stores use persistence for:
- creative prompts
- slide editor state
- prompt flow state

### Drag and drop
The presentation editor uses:
- `react-dnd`
- `react-dnd-html5-backend`

### Export support
There is an export utility for PPTX generation in `src/lib/export/pptx.ts`.

---

## 17) Things an AI should understand quickly

If this repo is fed to another AI, the model should know:

1. **This is a presentation builder**, not a generic CMS.
2. **The source of truth for auth is NextAuth + Prisma + Google OAuth**.
3. **Project content lives inside `Project.slides` as JSON**.
4. **Theme selection matters** because slides are rendered through a local theme provider.
5. **Most app logic is in server actions** under `src/actions/`.
6. **The editor is stateful and relies heavily on Zustand**.
7. **There is a clear lifecycle**:
   prompt → outlines → semantic slides → composed slides → editor → save.
8. **Some repo docs are outdated**, so current source code should be trusted first.

---

## 18) Short reference list of the most important files

- `src/actions/ai.ts`
- `src/actions/projects.ts`
- `src/actions/user.ts`
- `src/actions/lemonSqueezy.ts`
- `src/lib/auth.ts`
- `src/lib/types.ts`
- `src/lib/ai/schema.ts`
- `src/lib/ai/prompt.ts`
- `src/lib/ai/compose.ts`
- `src/lib/slideLayouts.ts`
- `src/lib/theme/themes.ts`
- `src/lib/theme/resolveTheme.ts`
- `src/store/useSlideStore.tsx`
- `src/store/useEditorStore.tsx`
- `src/app/(protected)/presentation/[presentationID]/page.tsx`
- `src/app/(protected)/(pages)/layout.tsx`
- `prisma/schema.prisma`

---

## 19) Summary

This repo is a **full-stack AI presentation SaaS** with:
- authenticated dashboard workflows
- project CRUD + trash
- template marketplace support
- AI-powered deck generation
- a rich slide editor
- theme system
- PPTX export tooling
- subscription / webhook support

The most important current implementation detail is that the app is built around **NextAuth + Prisma + Google OAuth**, and the presentation data model is centered on **Projects containing AI-generated outlines and slide JSON**.
