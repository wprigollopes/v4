'use client';

import Link from 'next/link';
import IconBookmark from '@/components/icons/bookmark';
import { kebabCase } from '@/lib/utils';

interface PostSummary {
  title: string;
  description: string;
  date: string;
  slug: string;
  tags: string[];
}

interface BlogContentProps {
  posts: PostSummary[];
}

export default function BlogContent({ posts }: BlogContentProps) {
  return (
    <main className="blog-page">
      <header className="blog-header">
        <h1 className="big-heading">Pensieve</h1>
        <p className="blog-subtitle">
          <Link href="https://www.wizardingworld.com/writing-by-jk-rowling/pensieve" className="inline-link">
            a collection of memories and thoughts
          </Link>
        </p>
      </header>

      <ul className="blog-grid">
        {posts.map((post) => {
          const urlSlug = post.slug.replace('/pensieve/', '').replace(/\/$/, '');
          return (
            <li key={post.slug} className="blog-post-card">
              <div className="blog-post-card-inner">
                <div className="blog-post-card-top">
                  <div className="blog-post-icon">
                    <IconBookmark />
                  </div>
                </div>
                <h2 className="blog-post-card-title">
                  <Link href={`/blog/${urlSlug}`}>{post.title}</Link>
                </h2>
                <p className="blog-post-card-description">{post.description}</p>
                <footer className="blog-post-card-footer">
                  <span className="blog-post-date">
                    {new Date(post.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                  <ul className="blog-post-tags">
                    {post.tags &&
                      post.tags.map((tag) => (
                        <li key={tag}>
                          <Link href={`/blog/tags/${kebabCase(tag)}`}>#{tag}</Link>
                        </li>
                      ))}
                  </ul>
                </footer>
              </div>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
