'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { srConfig } from '@/lib/constants';
import { usePrefersReducedMotion } from '@/hooks';
import { Icon } from '@/components/icons';

interface ProjectsProps {
  projects: Array<{
    title: string;
    tech: string[];
    github?: string;
    external?: string;
    content: string; // trusted HTML from local markdown processed at build time
  }>;
}

const GRID_LIMIT = 6;

const Projects: React.FC<ProjectsProps> = ({ projects }) => {
  const [showMore, setShowMore] = useState(false);
  const revealTitle = useRef<HTMLHeadingElement>(null);
  const revealArchiveLink = useRef<HTMLAnchorElement>(null);
  const revealProjects = useRef<(HTMLLIElement | null)[]>([]);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;
    async function animate() {
      const sr = (await import('scrollreveal')).default();
      if (revealTitle.current) {
        sr.reveal(revealTitle.current, srConfig());
      }
      if (revealArchiveLink.current) {
        sr.reveal(revealArchiveLink.current, srConfig());
      }
      revealProjects.current.forEach((ref, i) => {
        if (ref) {
          sr.reveal(ref, srConfig(i * 100));
        }
      });
    }
    animate();
  }, [prefersReducedMotion]);

  const firstSix = projects.slice(0, GRID_LIMIT);
  const projectsToShow = showMore ? projects : firstSix;

  const projectInner = (project: ProjectsProps['projects'][number]) => {
    const { github, external, title, tech, content } = project;

    return (
      <div className="project-inner">
        <header>
          <div className="project-top">
            <div className="folder">
              <Icon name="Folder" />
            </div>
            <div className="project-links">
              {github && (
                <a href={github} aria-label="GitHub Link" target="_blank" rel="noreferrer">
                  <Icon name="GitHub" />
                </a>
              )}
              {external && (
                <a
                  href={external}
                  aria-label="External Link"
                  className="external"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Icon name="External" />
                </a>
              )}
            </div>
          </div>

          <h3 className="project-title">
            <a href={external} target="_blank" rel="noreferrer">
              {title}
            </a>
          </h3>

          {/* Content is trusted HTML from local markdown files processed at build time */}
          <div
            className="project-description"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </header>

        <footer>
          {tech && (
            <ul className="project-tech-list">
              {tech.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          )}
        </footer>
      </div>
    );
  };

  return (
    <section className="other-projects-section">
      <h2 ref={revealTitle}>Other Noteworthy Projects</h2>

      <Link className="inline-link archive-link" href="/archive" ref={revealArchiveLink}>
        view the archive
      </Link>

      <ul className="projects-grid">
        {prefersReducedMotion ? (
          <>
            {projectsToShow.map((project, i) => (
              <li className="project-card" key={i}>
                {projectInner(project)}
              </li>
            ))}
          </>
        ) : (
          <TransitionGroup component={null}>
            {projectsToShow.map((project, i) => (
              <CSSTransition
                key={i}
                classNames="fadeup"
                timeout={i >= GRID_LIMIT ? (i - GRID_LIMIT) * 300 : 300}
                exit={false}
              >
                <li
                  className="project-card"
                  ref={el => {
                    revealProjects.current[i] = el;
                  }}
                  style={{
                    transitionDelay: `${i >= GRID_LIMIT ? (i - GRID_LIMIT) * 100 : 0}ms`,
                  }}
                >
                  {projectInner(project)}
                </li>
              </CSSTransition>
            ))}
          </TransitionGroup>
        )}
      </ul>

      <button className="more-button" onClick={() => setShowMore(!showMore)}>
        Show {showMore ? 'Less' : 'More'}
      </button>
    </section>
  );
};

export default Projects;
