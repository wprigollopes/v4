# Gatsby v3 → Next.js 15 + Tailwind CSS Migration Design

**Date:** 2026-03-04
**Status:** Approved

## Context

Portfolio site currently built with Gatsby v3, React 17, styled-components 5. Gatsby ecosystem is in maintenance mode. Migrating to Next.js 15 (App Router) with Tailwind CSS v4 and TypeScript for a modern, actively maintained stack.

## Approach

**Fresh Scaffold + Port Logic:** Create a new Next.js project, port content and component logic from the existing Gatsby project. This gives the cleanest codebase without legacy Gatsby artifacts.

## Architecture

- **Framework:** Next.js 15, App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **React:** v19
- **Content:** MDX via `next-mdx-remote`, frontmatter parsed with `gray-matter`
- **Deployment:** Vercel or Netlify

### Project Structure

```
/app
  layout.tsx              # Root layout (fonts, metadata, theme)
  page.tsx                # Home page (composes section components)
  globals.css             # Tailwind base + custom CSS variables
  /archive/page.tsx       # Project archive table
  /blog/
    page.tsx              # Blog index
    [slug]/page.tsx       # Blog post pages
    tags/[tag]/page.tsx   # Tag archive pages
/components
  Layout.tsx              # Client layout wrapper (loader, side elements)
  Nav.tsx                 # Navigation with scroll behavior
  Menu.tsx                # Mobile hamburger menu
  Footer.tsx              # Footer with GitHub stats
  Social.tsx              # Fixed social links sidebar
  Email.tsx               # Fixed email sidebar
  /sections
    Hero.tsx
    About.tsx
    Jobs.tsx
    Featured.tsx
    Projects.tsx
    Contact.tsx
  /icons                  # SVG icon components
/content                  # Markdown files (carried over from Gatsby project)
  /posts
  /projects
  /jobs
  /featured
/hooks
  usePrefersReducedMotion.ts
  useScrollDirection.ts
  useOnClickOutside.ts
/lib
  content.ts              # Markdown/frontmatter parsing utilities
  sr.ts                   # ScrollReveal config
  utils.ts                # hex2rgba, constants
/public                   # Static assets (og.png, resume, fonts)
```

### Components Migration

All interactive components are Client Components (`"use client"`). Static content loading happens in Server Components (page files).

| Gatsby Component | Next.js Component | Notes |
|---|---|---|
| Layout.js | app/layout.tsx + components/Layout.tsx | Split: metadata in layout.tsx, interactivity in Layout.tsx |
| Nav.js | components/Nav.tsx | Same logic, Tailwind classes |
| Hero.js | components/sections/Hero.tsx | Same animations |
| About.js | components/sections/About.tsx | next/image replaces StaticImage |
| Jobs.js | components/sections/Jobs.tsx | Content loaded server-side, passed as props |
| Featured.js | components/sections/Featured.tsx | Content loaded server-side, passed as props |
| Projects.js | components/sections/Projects.tsx | Content loaded server-side, passed as props |
| Contact.js | components/sections/Contact.tsx | Minimal changes |
| Footer.js | components/Footer.tsx | GitHub API call at build time |
| Menu.js | components/Menu.tsx | Same focus trap logic |
| SEO/Head | Next.js metadata API | Built-in, no library needed |

### Styling Migration

- CSS custom properties from `variables.js` → `tailwind.config.ts` theme + `globals.css`
- Styled-component mixins → Tailwind utility classes
- Global styles → `@layer base` in globals.css
- Color scheme preserved: dark-navy, navy, green accent, slate text

### Content System

- No GraphQL — filesystem reads with `fs.readFileSync` + `gray-matter`
- Blog posts rendered with `next-mdx-remote`
- Code highlighting with `prismjs` or `shiki`
- Static generation via `generateStaticParams` for blog routes

### Animations

- ScrollReveal: kept (client-side only)
- Anime.js: kept for loader
- React Transition Group: kept for staggered reveals
- `usePrefersReducedMotion`: carried over

### SEO

- `generateMetadata` for dynamic pages (blog posts, tags)
- Static metadata export for fixed pages
- `next-sitemap` for sitemap.xml and robots.txt
- OG image in /public

### Dependencies

**Production:**
- next, react, react-dom
- tailwindcss, @tailwindcss/postcss
- next-mdx-remote, gray-matter
- animejs, scrollreveal, react-transition-group
- prismjs (or shiki)
- next-sitemap

**Dev:**
- typescript, @types/react, @types/node
- eslint, eslint-config-next
- prettier, prettier-plugin-tailwindcss
