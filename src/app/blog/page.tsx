import type { Metadata } from 'next';
import { getPosts } from '@/lib/content';
import Layout from '@/components/Layout';
import BlogContent from './BlogContent';

export const metadata: Metadata = { title: 'Blog' };

export default function BlogPage() {
  const posts = getPosts();
  return (
    <Layout>
      <BlogContent posts={posts} />
    </Layout>
  );
}
