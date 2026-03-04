import { getJobs, getProjects, getFeatured } from '@/lib/content';
import Layout from '@/components/Layout';
import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Jobs from '@/components/sections/Jobs';
import Featured from '@/components/sections/Featured';
import Projects from '@/components/sections/Projects';
import Contact from '@/components/sections/Contact';
import { remark } from 'remark';
import html from 'remark-html';

async function markdownToHtml(markdown: string): Promise<string> {
  const result = await remark().use(html).process(markdown);
  return result.toString();
}

export default async function Home() {
  const rawJobs = getJobs();
  const rawProjects = getProjects();
  const rawFeatured = getFeatured();

  // Jobs component expects { frontmatter: {...}, content: string (HTML) }
  const jobs = await Promise.all(
    rawJobs.map(async job => ({
      frontmatter: {
        title: job.title,
        company: job.company,
        location: job.location,
        range: job.range,
        url: job.url,
      },
      content: await markdownToHtml(job.content),
    })),
  );

  // Featured component expects content as HTML
  const featured = await Promise.all(
    rawFeatured.map(async item => ({
      ...item,
      content: await markdownToHtml(item.content),
    })),
  );

  // Projects component expects content as HTML
  const projects = await Promise.all(
    rawProjects.map(async project => ({
      ...project,
      content: await markdownToHtml(project.content),
    })),
  );

  return (
    <Layout isHome>
      <main className="fillHeight" style={{ counterReset: 'section' }}>
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
