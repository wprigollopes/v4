'use client';

import React, { useEffect, useRef } from 'react';
import { srConfig } from '@/lib/constants';
import { usePrefersReducedMotion } from '@/hooks';
import { Icon } from '@/components/icons';
import type { Project } from '@/lib/content';

interface ArchiveContentProps {
  projects: Project[];
}

const ArchiveContent: React.FC<ArchiveContentProps> = ({ projects }) => {
  const revealTitle = useRef<HTMLHeadingElement>(null);
  const revealTable = useRef<HTMLTableElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;
    async function animate() {
      const sr = (await import('scrollreveal')).default();
      if (revealTitle.current) {
        sr.reveal(revealTitle.current, srConfig());
      }
      if (revealTable.current) {
        sr.reveal(revealTable.current, srConfig(200));
      }
    }
    animate();
  }, [prefersReducedMotion]);

  return (
    <main>
      <header>
        <h1 className="big-heading" ref={revealTitle}>
          Archive
        </h1>
        <p className="archive-subtitle">A big list of things I&apos;ve worked on</p>
      </header>

      <table className="archive-table" ref={revealTable}>
        <thead>
          <tr>
            <th>Year</th>
            <th>Title</th>
            <th className="hide-on-mobile">Made at</th>
            <th className="hide-on-mobile">Built with</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project, i) => {
            const { date, github, external, title, tech, company } = project;
            const year = new Date(date).getFullYear();

            return (
              <tr key={i} className="archive-row">
                <td className="archive-year overline">{year}</td>

                <td className="archive-title">{title}</td>

                <td className="archive-company hide-on-mobile">
                  {company ? company : <span>—</span>}
                </td>

                <td className="archive-tech hide-on-mobile">
                  {tech && tech.length > 0 && (
                    <span className="archive-tech-list">
                      {tech.map((t, j) => (
                        <span key={j}>
                          {t}
                          {j < tech.length - 1 && (
                            <span className="archive-middot" aria-hidden="true">
                              &middot;
                            </span>
                          )}
                        </span>
                      ))}
                    </span>
                  )}
                </td>

                <td className="archive-links">
                  <div className="archive-links-inner">
                    {external && (
                      <a
                        href={external}
                        aria-label={`${title} External Link`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Icon name="External" />
                      </a>
                    )}
                    {github && (
                      <a
                        href={github}
                        aria-label={`${title} GitHub Link`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Icon name="GitHub" />
                      </a>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </main>
  );
};

export default ArchiveContent;
