# orobosa.xyz

Personal portfolio for Samuel Amagbakhen — full-stack developer from Lagos.

## Stack

- **Framework** — Next.js 16 (App Router)
- **Styling** — Tailwind CSS v4
- **Animations** — Motion (v12)
- **Font** — Plus Jakarta Sans via `next/font/google`
- **Language** — TypeScript
- **Package manager** — pnpm

## Pages

| Route | Description |
|---|---|
| `/` | Hero, stack bar, featured work, about |
| `/projects` | Full project list |
| `/articles` | Articles fetched from dev.to |
| `/articles/[slug]` | Individual article |
| `/contact` | Contact info and social links |

## Getting started

**Prerequisites:** Node.js 18+, pnpm

```bash
# Install dependencies
pnpm install

# Copy env template and fill in your values
cp .env.local.example .env.local

# Start dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

Create `.env.local` from the example file:

```bash
cp .env.local.example .env.local
```

| Variable | Description | Where to get it |
|---|---|---|
| `DEV_TO_API_KEY` | Authenticates the articles fetch | [dev.to/settings/extensions](https://dev.to/settings/extensions) |
| `DEV_TO_USERNAME` | Your dev.to handle (used for article slugs) | Your dev.to profile URL |

The articles page falls back to a "coming soon" message if either variable is missing — the rest of the site works fine without them.

## Project structure

```
app/
├── layout.tsx          # Root layout — font, metadata, Nav, Footer
├── template.tsx        # Page transition animation (re-mounts on navigation)
├── page.tsx            # Home
├── projects/
│   └── page.tsx
├── articles/
│   ├── page.tsx
│   └── [slug]/
│       └── page.tsx
├── contact/
│   └── page.tsx
├── components/
│   ├── Nav.tsx
│   ├── Hero.tsx
│   ├── StackBar.tsx
│   ├── WorkList.tsx    # Accepts limit + title props; data lives in ALL_WORKS
│   ├── About.tsx
│   ├── Contact.tsx
│   ├── Footer.tsx
│   ├── SectionLabel.tsx
│   └── ArticleList.tsx
├── lib/
│   └── devto.ts        # getArticles() + getArticle(slug)
├── globals.css         # Design tokens, Tailwind theme, prose styles
└── icon.svg            # Favicon
```

## Design tokens

Defined as CSS variables in `globals.css` and mapped to Tailwind utilities via `@theme inline`:

| Token | Value | Tailwind class |
|---|---|---|
| `--bg` | `#0c0c0c` | `bg-bg`, `text-bg` |
| `--surface` | `#161616` | `bg-surface` |
| `--ink` | `#f0ebe2` | `text-ink` |
| `--muted` | `#a8a8a8` | `text-muted` |
| `--mid` | `#c8c8c8` | `text-mid` |
| `--faint` | `#2a2a2a` | `border-faint` |
| `--green` | `#82c79a` | `text-green`, `bg-green` |

## Updating content

**Projects** — edit `ALL_WORKS` in [app/components/WorkList.tsx](app/components/WorkList.tsx).

**Stack tags** — edit `TAGS` in [app/components/StackBar.tsx](app/components/StackBar.tsx).

**About copy / meta** — edit [app/components/About.tsx](app/components/About.tsx).

**Social links** — edit `SOCIAL_LINKS` in [app/components/Footer.tsx](app/components/Footer.tsx) and [app/components/Contact.tsx](app/components/Contact.tsx).

## Deployment

Deploy to [Vercel](https://vercel.com) — it auto-detects Next.js. Add `DEV_TO_API_KEY` and `DEV_TO_USERNAME` in the Vercel project environment variables.

```bash
pnpm build   # verify the build locally before pushing
```
