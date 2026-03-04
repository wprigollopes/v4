import type { Metadata } from 'next';
import Link from 'next/link';
import { remark } from 'remark';
import html from 'remark-html';
import { getPosts } from '@/lib/content';
import Layout from '@/components/Layout';
import { kebabCase } from '@/lib/utils';

export async function generateStaticParams() {
  const posts = getPosts();
  return posts.map((post) => {
    const slug = post.slug.replace('/pensieve/', '').replace(/\/$/, '');
    return { slug };
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const posts = getPosts();
  const post = posts.find((p) => {
    const postSlug = p.slug.replace('/pensieve/', '').replace(/\/$/, '');
    return postSlug === slug;
  });
  return { title: post?.title ?? 'Blog Post' };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const posts = getPosts();
  const post = posts.find((p) => {
    const postSlug = p.slug.replace('/pensieve/', '').replace(/\/$/, '');
    return postSlug === slug;
  });

  if (!post) {
    return (
      <Layout>
        <main className="blog-post-page">
          <p>Post not found.</p>
        </main>
      </Layout>
    );
  }

  // Content comes from local trusted markdown files, safe to render as HTML
  const htmlContent = (await remark().use(html).process(post.content)).toString();
  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Layout>
      <main className="blog-post-page">
        <span className="blog-breadcrumb">
          <span className="blog-breadcrumb-arrow">&larr;</span>
          <Link href="/blog" className="inline-link">
            All posts
          </Link>
        </span>

        <header className="blog-post-header">
          <h1 className="medium-heading">{post.title}</h1>
          <p className="blog-post-subtitle">
            <time>{formattedDate}</time>
            <span className="blog-post-header-separator">&mdash;</span>
            {post.tags &&
              post.tags.map((tag, i) => (
                <span key={tag}>
                  <Link href={`/blog/tags/${kebabCase(tag)}`} className="blog-tag-link inline-link">
                    #{tag}
                  </Link>
                  {i < post.tags.length - 1 && <span>, </span>}
                </span>
              ))}
          </p>
        </header>

        {/* eslint-disable-next-line react/no-danger -- trusted local markdown content */}
        <div
          className="blog-post-content"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </main>
    </Layout>
  );
}
