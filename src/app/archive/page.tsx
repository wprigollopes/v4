import type { Metadata } from 'next';
import { getProjects } from '@/lib/content';
import Layout from '@/components/Layout';
import ArchiveContent from './ArchiveContent';

export const metadata: Metadata = {
  title: 'Archive',
};

export default function ArchivePage() {
  const projects = getProjects();
  return (
    <Layout>
      <ArchiveContent projects={projects} />
    </Layout>
  );
}
