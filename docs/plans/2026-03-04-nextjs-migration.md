# Gatsby → Next.js 15 + Tailwind CSS Migration Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Migrate a Gatsby v3 portfolio site to Next.js 15 (App Router) with Tailwind CSS v4, TypeScript, and React 19.

**Architecture:** Fresh Next.js scaffold in the same repo (replace Gatsby files). Content markdown files are preserved. All components are ported as client components with Tailwind replacing styled-components. Filesystem-based content loading replaces GraphQL.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS v4, next-mdx-remote, gray-matter, anime.js, scrollreveal, react-transition-group, prismjs

---

## Task 1: Scaffold Next.js Project

**Files:**
- Create: `package.json` (overwrite)
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `postcss.config.mjs`
- Create: `tailwind.config.ts` (placeholder)
- Delete: `gatsby-config.js`, `gatsby-node.js`, `gatsby-browser.js`, `gatsby-ssr.js`
- Delete: `src/styles/` (all styled-components files)
- Keep: `content/`, `src/images/`, `static/`

**Step 1: Remove Gatsby files and old node_modules**

```bash
rm -rf node_modules package-lock.json .cache public
rm gatsby-config.js gatsby-node.js gatsby-browser.js gatsby-ssr.js
rm -rf src/styles
```

**Step 2: Initialize Next.js project**

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --no-import-alias --no-turbopack
```

When prompted, accept defaults. This creates the scaffolded Next.js project with Tailwind CSS already configured.

Note: `create-next-app` will detect existing files. Choose to overwrite where prompted. The `/content` directory and `/src/images` will be preserved.

**Step 3: Install additional dependencies**

```bash
npm install next-mdx-remote gray-matter animejs@3 scrollreveal react-transition-group prismjs next-sitemap
npm install -D @types/react-transition-group @types/scrollreveal
```

**Step 4: Verify the scaffold runs**

```bash
npm run dev
```

Expected: Next.js dev server starts on http://localhost:3000 with default template page.

**Step 5: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js 15 project, remove Gatsby"
```

---

## Task 2: Tailwind Theme & Global Styles

**Files:**
- Modify: `src/app/globals.css`
- Modify: `tailwind.config.ts`
- Create: `src/lib/constants.ts`

**Step 1: Create constants file**

Port `src/config.js` to TypeScript. This holds site metadata, social links, nav links, colors, and scroll reveal config.

```typescript
// src/lib/constants.ts
export const siteConfig = {
  title: 'Your Name',
  description: 'Software engineer who specializes in building exceptional digital experiences.',
  siteUrl: 'https://yoursite.com',
  image: '/og.png',
  twitterUsername: '@yourhandle',
};

export const email = 'your@email.com';

export const socialMedia = [
  { name: 'GitHub', url: 'https://github.com/yourusername' },
  { name: 'Linkedin', url: 'https://www.linkedin.com/in/yourusername' },
];

export const navLinks = [
  { name: 'About', url: '/#about' },
  { name: 'Experience', url: '/#jobs' },
  { name: 'Work', url: '/#projects' },
  { name: 'Contact', url: '/#contact' },
];

export const colors = {
  green: '#64ffda',
  navy: '#0a192f',
  darkNavy: '#020c1b',
};

export const srConfig = (delay = 200, viewFactor = 0.25) => ({
  origin: 'bottom' as const,
  distance: '20px',
  duration: 500,
  delay,
  rotate: { x: 0, y: 0, z: 0 },
  opacity: 0,
  scale: 1,
  easing: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
  mobile: true,
  reset: false,
  useDelay: 'always' as const,
  viewFactor,
  viewOffset: { top: 0, right: 0, bottom: 0, left: 0 },
});

export const navDelay = 1000;
export const loaderDelay = 2000;

export const KEY_CODES = {
  ARROW_LEFT: 'ArrowLeft',
  ARROW_LEFT_IE11: 'Left',
  ARROW_RIGHT: 'ArrowRight',
  ARROW_RIGHT_IE11: 'Right',
  ARROW_UP: 'ArrowUp',
  ARROW_UP_IE11: 'Up',
  ARROW_DOWN: 'ArrowDown',
  ARROW_DOWN_IE11: 'Down',
  ESCAPE: 'Escape',
  ESCAPE_IE11: 'Esc',
  TAB: 'Tab',
  SPACE: ' ',
  SPACE_IE11: 'Spacebar',
  ENTER: 'Enter',
};
```

**Step 2: Configure Tailwind theme**

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        'dark-navy': '#020c1b',
        navy: '#0a192f',
        'light-navy': '#112240',
        'lightest-navy': '#233554',
        slate: '#8892b0',
        'light-slate': '#a8b2d1',
        'lightest-slate': '#ccd6f6',
        white: '#e6f1ff',
        green: '#64ffda',
        'green-tint': 'rgba(100,255,218,0.1)',
        pink: '#f57dff',
        blue: '#57cbff',
      },
      fontFamily: {
        sans: ['Calibre', 'Inter', 'San Francisco', 'SF Pro Text', '-apple-system', 'system-ui', 'sans-serif'],
        mono: ['SF Mono', 'Fira Code', 'Fira Mono', 'Roboto Mono', 'monospace'],
      },
      fontSize: {
        xxs: '12px',
        xs: '13px',
        sm: '14px',
        md: '16px',
        lg: '18px',
        xl: '20px',
        xxl: '22px',
        heading: '32px',
      },
      screens: {
        'mobile-s': '330px',
        'mobile-m': '400px',
        'mobile-l': '480px',
        'tablet-s': '600px',
        'tablet-l': '768px',
        'desktop-xs': '900px',
        'desktop-s': '1080px',
        'desktop-m': '1200px',
        'desktop-l': '1400px',
      },
      transitionTimingFunction: {
        'custom-ease': 'cubic-bezier(0.645, 0.045, 0.355, 1)',
      },
    },
  },
  plugins: [],
};
export default config;
```

**Step 3: Write global CSS**

Port the GlobalStyle.js CSS custom properties and base styles into `src/app/globals.css`. This includes:
- CSS custom properties (:root variables for colors, fonts, sizes, transitions)
- Base element styles (html, body, headings, links, images, buttons)
- Scrollbar styling
- `.big-heading`, `.medium-heading`, `.numbered-heading` classes
- `.fancy-list` styling with green triangle markers
- Skip-to-content accessibility link
- Transition animation classes (`.fadeup-enter`, `.fadedown-enter`, `.fade-enter`)
- Prism code highlighting styles
- Body blur/hidden classes for mobile menu overlay
- Main/section responsive padding

Reference the existing `src/styles/GlobalStyle.js` and `src/styles/variables.js` for exact values.

**Step 4: Copy font files to public directory**

```bash
cp -r src/fonts public/fonts
cp -r static/* public/
```

**Step 5: Verify Tailwind works**

Create a minimal `src/app/page.tsx`:

```tsx
export default function Home() {
  return (
    <div className="min-h-screen bg-navy text-slate flex items-center justify-center">
      <h1 className="text-green text-4xl font-mono">It works!</h1>
    </div>
  );
}
```

Run `npm run dev` and verify the green text on dark navy background renders correctly.

**Step 6: Commit**

```bash
git add -A
git commit -m "feat: add Tailwind theme, global styles, and constants"
```

---

## Task 3: Custom Hooks

**Files:**
- Create: `src/hooks/usePrefersReducedMotion.ts`
- Create: `src/hooks/useScrollDirection.ts`
- Create: `src/hooks/useOnClickOutside.ts`
- Create: `src/hooks/index.ts`

**Step 1: Port all three hooks to TypeScript**

These are pure React hooks with no Gatsby dependencies — direct port with type annotations.

```typescript
// src/hooks/usePrefersReducedMotion.ts
import { useState, useEffect } from 'react';

const QUERY = '(prefers-reduced-motion: no-preference)';

export function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(true);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(QUERY);
    setPrefersReducedMotion(!mediaQueryList.matches);

    const listener = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(!event.matches);
    };

    mediaQueryList.addEventListener('change', listener);
    return () => mediaQueryList.removeEventListener('change', listener);
  }, []);

  return prefersReducedMotion;
}
```

```typescript
// src/hooks/useScrollDirection.ts
import { useState, useEffect } from 'react';

type ScrollDirection = 'up' | 'down';

interface UseScrollDirectionProps {
  initialDirection?: ScrollDirection;
  thresholdPixels?: number;
  off?: boolean;
}

export function useScrollDirection({
  initialDirection = 'down',
  thresholdPixels = 0,
  off = false,
}: UseScrollDirectionProps = {}): ScrollDirection {
  const [scrollDir, setScrollDir] = useState<ScrollDirection>(initialDirection);

  useEffect(() => {
    if (off) return;

    let lastScrollY = window.pageYOffset;
    let ticking = false;

    const updateScrollDir = () => {
      const scrollY = window.pageYOffset;
      if (Math.abs(scrollY - lastScrollY) < thresholdPixels) {
        ticking = false;
        return;
      }
      setScrollDir(scrollY > lastScrollY ? 'down' : 'up');
      lastScrollY = scrollY > 0 ? scrollY : 0;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollDir);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [initialDirection, thresholdPixels, off]);

  return scrollDir;
}
```

```typescript
// src/hooks/useOnClickOutside.ts
import { useEffect, RefObject } from 'react';

export function useOnClickOutside(
  ref: RefObject<HTMLElement | null>,
  handler: (event: MouseEvent | TouchEvent) => void,
): void {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}
```

```typescript
// src/hooks/index.ts
export { usePrefersReducedMotion } from './usePrefersReducedMotion';
export { useScrollDirection } from './useScrollDirection';
export { useOnClickOutside } from './useOnClickOutside';
```

**Step 2: Commit**

```bash
git add src/hooks/
git commit -m "feat: port custom hooks to TypeScript"
```

---

## Task 4: Content Loading Utilities

**Files:**
- Create: `src/lib/content.ts`
- Create: `src/lib/utils.ts`

**Step 1: Create content loading utilities**

Replace Gatsby's GraphQL data layer with filesystem reads + gray-matter. Create typed interfaces for each content type (PostFrontmatter, JobFrontmatter, ProjectFrontmatter, FeaturedFrontmatter) and loader functions (getPosts, getJobs, getProjects, getFeatured, getPostBySlug, getAllTags).

Each loader function:
1. Reads markdown files from the appropriate `content/` subdirectory
2. Parses frontmatter with `gray-matter`
3. Sorts by date descending
4. Filters drafts (for posts)

```typescript
// src/lib/utils.ts
export function hex2rgba(hex: string, alpha = 1): string {
  const [r, g, b] = hex.match(/\w\w/g)!.map(x => parseInt(x, 16));
  return `rgba(${r},${g},${b},${alpha})`;
}

export function kebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}
```

**Step 2: Commit**

```bash
git add src/lib/
git commit -m "feat: add content loading utilities and helpers"
```

---

## Task 5: Icon Components

**Files:**
- Create: `src/components/icons/` (all icon SVG components ported to TSX)

**Step 1: Port icon components**

Copy all SVG icon components from the existing `src/components/icons/` directory, converting to TypeScript. Each is a simple functional component returning SVG markup. Convert PropTypes to TypeScript interfaces.

Create `src/components/icons/index.ts` as a barrel export with an `Icon` component that maps icon names to components (same pattern as current `icon.js`).

**Step 2: Commit**

```bash
git add src/components/icons/
git commit -m "feat: port icon components to TypeScript"
```

---

## Task 6: Loader Component

**Files:**
- Create: `src/components/Loader.tsx`

**Step 1: Port the Loader component**

This component uses anime.js for the SVG path animation. It's a client component (`"use client"`).

Key details from current implementation:
- Full-screen fixed overlay (z-index 99)
- Anime.js timeline: logo path stroke animation → "B" letter fade in → scale down → fade out
- Sets `document.body.classList.add('hidden')` during loading
- Calls `finishLoading()` callback on completion
- Uses `useState` for `isMounted` to trigger CSS opacity transition

Convert styled-components to Tailwind classes. The SVG path animation requires inline styles for anime.js targets.

**Step 2: Commit**

```bash
git add src/components/Loader.tsx
git commit -m "feat: port Loader component with anime.js animation"
```

---

## Task 7: Nav, Menu, Social, Email Components

**Files:**
- Create: `src/components/Nav.tsx`
- Create: `src/components/Menu.tsx`
- Create: `src/components/Social.tsx`
- Create: `src/components/Email.tsx`

**Step 1: Port Nav component**

Key details:
- Fixed header with backdrop blur and translucent navy background
- Scroll direction detection (hide on scroll down, show on scroll up)
- Height transitions (100px → 70px when scrolled)
- CSSTransition for staggered fade-in animation of nav links
- Logo (hex icon with inner letter), nav links with numbered counter, resume button
- Mobile: shows hamburger Menu component instead of nav links
- Uses `useScrollDirection`, `usePrefersReducedMotion` hooks
- Replace Gatsby Link with `next/link`

**Step 2: Port Menu component**

Key details:
- Full-screen mobile overlay (aside element)
- Hamburger button with CSS-animated bars (3 bars → X transform)
- Focus trap: traps tab focus inside menu when open
- Sets `document.body.classList` for blur effect
- Uses `useOnClickOutside` hook
- Links + resume button inside

**Step 3: Port Social component**

Fixed left sidebar with social media icons. Simple list of icon links with a vertical line below.

**Step 4: Port Email component**

Fixed right sidebar with email link rotated 90 degrees and vertical line below.

**Step 5: Commit**

```bash
git add src/components/Nav.tsx src/components/Menu.tsx src/components/Social.tsx src/components/Email.tsx
git commit -m "feat: port Nav, Menu, Social, Email components"
```

---

## Task 8: Section Components (Hero, About, Jobs)

**Files:**
- Create: `src/components/sections/Hero.tsx`
- Create: `src/components/sections/About.tsx`
- Create: `src/components/sections/Jobs.tsx`

**Step 1: Port Hero section**

Key details:
- Staggered fade-up animation using CSSTransition + TransitionGroup
- 5 elements animated in sequence: greeting, name, subtitle, description, CTA button
- Uses `usePrefersReducedMotion` to skip animations
- No data fetching — static content
- Replace Gatsby Link with next/link

**Step 2: Port About section**

Key details:
- Two-column layout (text + profile image)
- `next/image` replaces `StaticImage` from gatsby-plugin-image
- Skills list in a grid
- ScrollReveal for reveal animation
- `.numbered-heading` class for section title

**Step 3: Port Jobs section**

Key details:
- Tabbed interface (vertical tabs on desktop, horizontal scroll on mobile)
- Content loaded from markdown frontmatter (passed as props from server component)
- Keyboard navigation (arrow keys switch tabs)
- Active tab highlight bar with CSS transform
- Markdown HTML content rendered from build-time-generated trusted local markdown files
- ScrollReveal animation

**Step 4: Commit**

```bash
git add src/components/sections/
git commit -m "feat: port Hero, About, Jobs section components"
```

---

## Task 9: Section Components (Featured, Projects, Contact) + Footer

**Files:**
- Create: `src/components/sections/Featured.tsx`
- Create: `src/components/sections/Projects.tsx`
- Create: `src/components/sections/Contact.tsx`
- Create: `src/components/Footer.tsx`

**Step 1: Port Featured section**

Key details:
- Alternating left/right layout for featured projects
- `next/image` for project screenshots (replaces GatsbyImage)
- Cover images referenced in frontmatter — need to handle image paths
- Tech stack pills, GitHub/external link icons
- Content passed as props from server component
- ScrollReveal animation

**Step 2: Port Projects section**

Key details:
- Grid of project cards (initially shows 6, "Show More" button reveals rest)
- Folder icon, GitHub/external link icons in card header
- Tech stack list in card footer
- CSSTransition for staggered card animation
- Content passed as props from server component

**Step 3: Port Contact section**

Simple section: numbered heading, paragraph, mailto CTA button.

**Step 4: Port Footer**

Key details:
- Credit text with link to original template
- Fetches GitHub star count at build time via `fetch` in server component
- Social links visible on mobile only

**Step 5: Commit**

```bash
git add src/components/sections/ src/components/Footer.tsx
git commit -m "feat: port Featured, Projects, Contact, Footer components"
```

---

## Task 10: Layout Component + Root Layout

**Files:**
- Create: `src/components/Layout.tsx`
- Modify: `src/app/layout.tsx`

**Step 1: Create client Layout component**

Port the `layout.js` component logic:
- Skip-to-content link
- Conditional Loader (only on home page)
- Loading state management
- External link handling (add target="_blank" and rel attributes)
- Hash-based scroll-to-element functionality
- Nav, Social, Email, Footer composition

```tsx
// src/components/Layout.tsx — "use client" component
```

**Step 2: Set up root layout**

```tsx
// src/app/layout.tsx
import type { Metadata } from 'next';
import { siteConfig } from '@/lib/constants';
import './globals.css';

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.siteUrl,
    images: [{ url: siteConfig.image }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    creator: siteConfig.twitterUsername,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
```

**Step 3: Commit**

```bash
git add src/components/Layout.tsx src/app/layout.tsx
git commit -m "feat: set up root layout and client Layout component"
```

---

## Task 11: Home Page

**Files:**
- Modify: `src/app/page.tsx`

**Step 1: Build the home page**

Server component that loads content and passes it to client section components.

```tsx
// src/app/page.tsx
import { getJobs, getProjects, getFeatured } from '@/lib/content';
import Layout from '@/components/Layout';
import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Jobs from '@/components/sections/Jobs';
import Featured from '@/components/sections/Featured';
import Projects from '@/components/sections/Projects';
import Contact from '@/components/sections/Contact';

export default function Home() {
  const jobs = getJobs();
  const projects = getProjects();
  const featured = getFeatured();

  return (
    <Layout isHome>
      <main className="fill-height" style={{ counterReset: 'section' }}>
        <Hero />
        <About />
        <Jobs jobs={jobs} />
        <Featured featured={featured} />
        <Projects projects={projects} />
        <Contact />
      </main>
    </Layout>
  );
}
```

**Step 2: Verify home page renders**

```bash
npm run dev
```

Navigate to http://localhost:3000 and verify all sections render with correct styling.

**Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: build home page with all sections"
```

---

## Task 12: Archive Page

**Files:**
- Create: `src/app/archive/page.tsx`

**Step 1: Port archive page**

Table view of all projects. Server component loads projects, client component handles animations.

Key details:
- Table with columns: Year, Title, Made at (company), Built with (tech), Link
- CSSTransition for staggered row animation
- Back-to-home link

**Step 2: Commit**

```bash
git add src/app/archive/
git commit -m "feat: port archive page"
```

---

## Task 13: Blog Pages

**Files:**
- Create: `src/app/blog/page.tsx`
- Create: `src/app/blog/[slug]/page.tsx`
- Create: `src/app/blog/tags/[tag]/page.tsx`

**Step 1: Create blog index page**

Server component that lists all posts in a grid. Port from `src/pages/pensieve/index.js`.

**Step 2: Create blog post page**

Dynamic route that renders individual posts using `next-mdx-remote` for MDX compilation. Use `generateStaticParams` to pre-render all post pages at build time. Use `generateMetadata` for per-post SEO.

**Step 3: Create tag archive page**

Dynamic route that filters posts by tag. Use `generateStaticParams` from `getAllTags()`.

**Step 4: Commit**

```bash
git add src/app/blog/
git commit -m "feat: port blog pages with MDX support"
```

---

## Task 14: SEO & Sitemap

**Files:**
- Create: `next-sitemap.config.js`
- Modify: `package.json` (add postbuild script)

**Step 1: Configure next-sitemap**

```javascript
// next-sitemap.config.js
/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://yoursite.com',
  generateRobotsTxt: true,
};
```

**Step 2: Add postbuild script**

In `package.json`, add:
```json
"postbuild": "next-sitemap"
```

**Step 3: Commit**

```bash
git add next-sitemap.config.js package.json
git commit -m "feat: add sitemap and robots.txt generation"
```

---

## Task 15: Final Cleanup & Build Verification

**Files:**
- Delete: old `src/components/` (Gatsby JS versions if still present)
- Delete: old `src/pages/` (Gatsby JS versions if still present)
- Delete: old `src/templates/`
- Delete: old `src/utils/`
- Delete: old `src/config.js`

**Step 1: Remove old Gatsby source files**

```bash
rm -rf src/templates/ src/utils/ src/config.js
```

Remove any remaining `.js` component files that have been replaced by `.tsx` versions.

**Step 2: Build the project**

```bash
npm run build
```

Expected: Successful build with no errors.

**Step 3: Test the production build**

```bash
npm run start
```

Navigate through all pages and verify:
- Home page with all sections
- Animations work (scroll reveal, transitions)
- Mobile menu works
- Archive page
- Blog index and individual posts
- Tag pages
- Images load correctly
- External links open in new tabs

**Step 4: Final commit**

```bash
git add -A
git commit -m "chore: remove old Gatsby files, verify production build"
```

---

## Summary

| Task | Description | Complexity |
|------|------------|------------|
| 1 | Scaffold Next.js project | Low |
| 2 | Tailwind theme & global styles | Medium |
| 3 | Custom hooks | Low |
| 4 | Content loading utilities | Medium |
| 5 | Icon components | Low |
| 6 | Loader component | Medium |
| 7 | Nav, Menu, Social, Email | High |
| 8 | Hero, About, Jobs sections | High |
| 9 | Featured, Projects, Contact, Footer | High |
| 10 | Layout + Root Layout | Medium |
| 11 | Home page | Low |
| 12 | Archive page | Medium |
| 13 | Blog pages | High |
| 14 | SEO & Sitemap | Low |
| 15 | Final cleanup & build | Low |
