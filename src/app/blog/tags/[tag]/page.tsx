import type { Metadata } from 'next';
import Link from 'next/link';
import { getPosts, getAllTags } from '@/lib/content';
import Layout from '@/components/Layout';
import { kebabCase } from '@/lib/utils';

export async function generateStaticParams() {
  const tags = getAllTags();
  return tags.map((tag) => ({ tag: kebabCase(tag) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag } = await params;
  return { title: `Tagged: #${tag}` };
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const posts = getPosts();

  const filteredPosts = posts.filter(
    (post) =>
      post.tags &&
      post.tags.some((t) => kebabCase(t) === tag),
  );

  return (
    <Layout>
      <main className="blog-tags-page">
        <span className="blog-breadcrumb">
          <span className="blog-breadcrumb-arrow">&larr;</span>
          <Link href="/blog" className="inline-link">
            All posts
          </Link>
        </span>

        <header className="blog-tags-header">
          <h1>
            <span className="blog-tag-hash">#{tag}</span>
          </h1>
          <Link href="/blog" className="inline-link">
            View all tags
          </Link>
        </header>

        <ul className="fancy-list blog-tags-list">
          {filteredPosts.map((post) => {
            const urlSlug = post.slug.replace('/pensieve/', '').replace(/\/$/, '');
            const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            });
            return (
              <li key={post.slug} className="blog-tags-list-item">
                <h2 className="blog-tags-post-title">
                  <Link href={`/blog/${urlSlug}`} className="inline-link">
                    {post.title}
                  </Link>
                </h2>
                <p className="blog-tags-post-meta">
                  <span className="blog-tags-post-date">{formattedDate}</span>
                  <span className="blog-tags-post-separator">&mdash;</span>
                  {post.tags.map((t, i) => (
                    <span key={t}>
                      <Link href={`/blog/tags/${kebabCase(t)}`} className="blog-tag-link">
                        #{t}
                      </Link>
                      {i < post.tags.length - 1 && <span>, </span>}
                    </span>
                  ))}
                </p>
              </li>
            );
          })}
        </ul>
      </main>
    </Layout>
  );
}
