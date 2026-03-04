'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { srConfig } from '@/lib/constants';
import { usePrefersReducedMotion } from '@/hooks';
import { Icon } from '@/components/icons';

interface FeaturedProps {
  featured: Array<{
    title: string;
    cover: string;
    tech: string[];
    github?: string;
    external?: string;
    cta?: string;
    content: string; // trusted HTML from local markdown processed at build time
  }>;
}

const Featured: React.FC<FeaturedProps> = ({ featured }) => {
  const revealTitle = useRef<HTMLHeadingElement>(null);
  const revealProjects = useRef<(HTMLLIElement | null)[]>([]);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;
    async function animate() {
      const sr = (await import('scrollreveal')).default();
      if (revealTitle.current) {
        sr.reveal(revealTitle.current, srConfig());
      }
      revealProjects.current.forEach((ref, i) => {
        if (ref) {
          sr.reveal(ref, srConfig(i * 100));
        }
      });
    }
    animate();
  }, [prefersReducedMotion]);

  return (
    <section id="projects">
      <h2 className="numbered-heading" ref={revealTitle}>
        Some Things I&apos;ve Built
      </h2>

      <ul className="featured-projects-grid">
        {featured.map((project, i) => {
          const { external, title, tech, github, cover, cta, content } = project;

          return (
            <li
              className="featured-project"
              key={i}
              ref={el => {
                revealProjects.current[i] = el;
              }}
            >
              <div className="project-content">
                <div>
                  <p className="project-overline">Featured Project</p>

                  <h3 className="project-title">
                    <a href={external}>{title}</a>
                  </h3>

                  {/* Content is trusted HTML from local markdown files processed at build time */}
                  <div
                    className="project-description"
                    dangerouslySetInnerHTML={{ __html: content }}
                  />

                  {tech.length > 0 && (
                    <ul className="project-tech-list">
                      {tech.map((t, j) => (
                        <li key={j}>{t}</li>
                      ))}
                    </ul>
                  )}

                  <div className="project-links">
                    {cta && (
                      <a href={cta} aria-label="Course Link" className="cta">
                        Learn More
                      </a>
                    )}
                    {github && (
                      <a href={github} aria-label="GitHub Link">
                        <Icon name="GitHub" />
                      </a>
                    )}
                    {external && !cta && (
                      <a href={external} aria-label="External Link" className="external">
                        <Icon name="External" />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <div className="project-image">
                <a href={external ? external : github ? github : '#'}>
                  <Image
                    src={cover}
                    alt={title}
                    width={700}
                    height={438}
                    className="img"
                  />
                </a>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default Featured;
