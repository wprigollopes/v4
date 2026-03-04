import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDirectory = path.join(process.cwd(), 'content');

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface Post {
  title: string;
  description: string;
  date: string;
  draft: boolean;
  slug: string;
  tags: string[];
  content: string;
}

export interface Job {
  date: string;
  title: string;
  company: string;
  location: string;
  range: string;
  url: string;
  content: string;
}

export interface Project {
  date: string;
  title: string;
  github: string;
  external: string;
  tech: string[];
  company?: string;
  showInProjects: boolean;
  content: string;
}

export interface FeaturedProject {
  date: string;
  title: string;
  cover: string;
  github?: string;
  external: string;
  cta?: string;
  tech: string[];
  content: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Recursively find all .md files under a directory.
 */
function findMarkdownFiles(dir: string): string[] {
  const results: string[] = [];

  if (!fs.existsSync(dir)) {
    return results;
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findMarkdownFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      results.push(fullPath);
    }
  }

  return results;
}

/**
 * Parse a single markdown file and return its frontmatter + content.
 */
function parseMarkdownFile<T>(filePath: string): T {
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);
  return { ...data, content: content.trim() } as T;
}

/**
 * Sort items by date descending. Handles both real date strings and
 * numeric-string ordering (featured projects use '1', '2', '3').
 */
function sortByDateDesc<T extends { date: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();

    // If both parse as valid dates, sort descending
    if (!isNaN(dateA) && !isNaN(dateB)) {
      return dateB - dateA;
    }

    // Fall back to string comparison (handles numeric strings like '1', '2')
    return a.date.localeCompare(b.date);
  });
}

// ---------------------------------------------------------------------------
// Loader functions
// ---------------------------------------------------------------------------

export function getPosts(): Post[] {
  const dir = path.join(contentDirectory, 'posts');
  const files = findMarkdownFiles(dir);

  const posts = files.map(f => parseMarkdownFile<Post>(f));

  // Filter out drafts, then sort by date descending
  return sortByDateDesc(posts.filter(p => !p.draft));
}

export function getPostBySlug(slug: string): Post | undefined {
  const posts = getPosts();
  // Slugs in frontmatter are like "/pensieve/clickable-cards"
  // Allow matching with or without leading slash
  const normalised = slug.startsWith('/') ? slug : `/${slug}`;
  return posts.find(p => p.slug === normalised || p.slug === slug);
}

export function getJobs(): Job[] {
  const dir = path.join(contentDirectory, 'jobs');
  const files = findMarkdownFiles(dir);

  const jobs = files.map(f => parseMarkdownFile<Job>(f));
  return sortByDateDesc(jobs);
}

export function getProjects(): Project[] {
  const dir = path.join(contentDirectory, 'projects');
  const files = findMarkdownFiles(dir);

  // Exclude non-markdown entries (e.g. the "images" directory has no .md files)
  const projects = files.map(f => parseMarkdownFile<Project>(f));
  return sortByDateDesc(projects);
}

export function getFeatured(): FeaturedProject[] {
  const dir = path.join(contentDirectory, 'featured');
  const files = findMarkdownFiles(dir);

  const featured = files.map(f => {
    const item = parseMarkdownFile<FeaturedProject>(f);
    // Resolve relative cover path (e.g. './halcyon.png') to a public-accessible path.
    // The images live alongside the markdown files in content/featured/<project>/.
    // They should be symlinked or copied to public/images/featured/ for Next.js to serve.
    if (item.cover && item.cover.startsWith('./')) {
      const mdDir = path.dirname(f);
      const relativeToCwd = path.relative(process.cwd(), path.join(mdDir, item.cover));
      // Convert content/featured/HalcyonTheme/halcyon.png -> /images/featured/HalcyonTheme/halcyon.png
      item.cover = '/' + relativeToCwd.replace(/^content\//, 'images/');
    }
    return item;
  });
  return sortByDateDesc(featured);
}

export function getAllTags(): string[] {
  const posts = getPosts();
  const tagSet = new Set<string>();

  for (const post of posts) {
    if (post.tags) {
      for (const tag of post.tags) {
        tagSet.add(tag);
      }
    }
  }

  return Array.from(tagSet).sort();
}
