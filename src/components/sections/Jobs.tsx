'use client';

import { useState, useEffect, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import { srConfig, KEY_CODES } from '@/lib/constants';
import { usePrefersReducedMotion } from '@/hooks';

interface JobData {
  frontmatter: {
    title: string;
    company: string;
    location: string;
    range: string;
    url: string;
  };
  content: string; // Pre-rendered HTML from trusted local markdown files
}

interface JobsProps {
  jobs: JobData[];
}

const Jobs = ({ jobs }: JobsProps) => {
  const [activeTabId, setActiveTabId] = useState(0);
  const [tabFocus, setTabFocus] = useState<number | null>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const revealContainer = useRef<HTMLElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    async function animate() {
      const sr = (await import('scrollreveal')).default();
      sr.reveal(revealContainer.current!, srConfig());
    }
    animate();
  }, [prefersReducedMotion]);

  const focusTab = () => {
    if (tabFocus === null) return;
    if (tabs.current[tabFocus]) {
      tabs.current[tabFocus]!.focus();
      return;
    }
    // If we're at the end, go to the start
    if (tabFocus >= tabs.current.length) {
      setTabFocus(0);
    }
    // If we're at the start, move to the end
    if (tabFocus < 0) {
      setTabFocus(tabs.current.length - 1);
    }
  };

  // Only re-run the effect if tabFocus changes
  useEffect(() => focusTab(), [tabFocus]);

  // Focus on tabs when using up & down arrow keys
  const onKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case KEY_CODES.ARROW_UP: {
        e.preventDefault();
        setTabFocus((prev) => (prev ?? 0) - 1);
        break;
      }

      case KEY_CODES.ARROW_DOWN: {
        e.preventDefault();
        setTabFocus((prev) => (prev ?? 0) + 1);
        break;
      }

      default: {
        break;
      }
    }
  };

  return (
    <section id="jobs" className="max-w-[700px]" ref={revealContainer}>
      <h2 className="numbered-heading">Where I&apos;ve Worked</h2>

      <div className="jobs-inner flex min-[700px]:min-h-[340px] max-[600px]:block">
        <div
          className="jobs-tab-list"
          role="tablist"
          aria-label="Job tabs"
          onKeyDown={(e) => onKeyDown(e)}>
          {jobs &&
            jobs.map((job, i) => {
              const { company } = job.frontmatter;
              return (
                <button
                  key={i}
                  className={`jobs-tab-button ${activeTabId === i ? 'active' : ''}`}
                  onClick={() => setActiveTabId(i)}
                  ref={(el) => {
                    tabs.current[i] = el;
                  }}
                  id={`tab-${i}`}
                  role="tab"
                  tabIndex={activeTabId === i ? 0 : -1}
                  aria-selected={activeTabId === i}
                  aria-controls={`panel-${i}`}>
                  <span>{company}</span>
                </button>
              );
            })}
          <div
            className="jobs-tab-highlight"
            style={
              {
                '--active-tab-id': activeTabId,
              } as React.CSSProperties
            }
          />
        </div>

        <div className="jobs-tab-panels relative w-full ml-5 max-[600px]:ml-0">
          {jobs &&
            jobs.map((job, i) => {
              const { frontmatter, content } = job;
              const { title, url, company, range } = frontmatter;

              return (
                <CSSTransition key={i} in={activeTabId === i} timeout={250} classNames="fade">
                  <div
                    className="jobs-tab-panel"
                    id={`panel-${i}`}
                    role="tabpanel"
                    tabIndex={activeTabId === i ? 0 : -1}
                    aria-labelledby={`tab-${i}`}
                    aria-hidden={activeTabId !== i}
                    hidden={activeTabId !== i}>
                    <h3 className="mb-[2px] text-xxl font-medium leading-[1.3]">
                      <span>{title}</span>
                      <span className="text-green">
                        &nbsp;@&nbsp;
                        <a href={url} className="inline-link">
                          {company}
                        </a>
                      </span>
                    </h3>

                    <p className="mb-[25px] text-light-slate font-mono text-xs">{range}</p>

                    {/* Content is pre-rendered HTML from trusted local markdown files processed at build time */}
                    <div
                      className="fancy-list"
                      dangerouslySetInnerHTML={{ __html: content }}
                    />
                  </div>
                </CSSTransition>
              );
            })}
        </div>
      </div>
    </section>
  );
};

export default Jobs;
