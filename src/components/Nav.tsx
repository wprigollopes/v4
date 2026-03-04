'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { navLinks, loaderDelay } from '@/lib/constants';
import { useScrollDirection, usePrefersReducedMotion } from '@/hooks';
import Menu from '@/components/Menu';
import { IconLogo, IconHex } from '@/components/icons';

interface NavProps {
  isHome: boolean;
}

const Nav = ({ isHome }: NavProps) => {
  const [isMounted, setIsMounted] = useState(!isHome);
  const scrollDirection = useScrollDirection({ initialDirection: 'down' });
  const [scrolledToTop, setScrolledToTop] = useState(true);
  const prefersReducedMotion = usePrefersReducedMotion();

  const handleScroll = () => {
    setScrolledToTop(window.pageYOffset < 50);
  };

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    const timeout = setTimeout(() => {
      setIsMounted(true);
    }, 100);

    window.addEventListener('scroll', handleScroll);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [prefersReducedMotion]);

  const timeout = isHome ? loaderDelay : 0;
  const fadeClass = isHome ? 'fade' : '';
  const fadeDownClass = isHome ? 'fadedown' : '';

  const scrollUpActive = scrollDirection === 'up' && !scrolledToTop;
  const scrollDownActive = scrollDirection === 'down' && !scrolledToTop;

  const headerClasses = `fixed top-0 z-[11] w-full px-[50px] h-[var(--nav-height)]
    bg-[rgba(10,25,47,0.85)] backdrop-blur-[10px]
    flex justify-between items-center
    transition-all duration-250 ease-[var(--easing)]
    pointer-events-auto select-auto
    filter-none!
    max-[1080px]:px-10 max-[768px]:px-[25px]
    ${scrollUpActive ? 'motion-safe:h-[var(--nav-scroll-height)] motion-safe:translate-y-0 motion-safe:bg-[rgba(10,25,47,0.85)] motion-safe:shadow-[0_10px_30px_-10px_rgba(2,12,27,0.7)]' : ''}
    ${scrollDownActive ? 'motion-safe:h-[var(--nav-scroll-height)] motion-safe:-translate-y-[var(--nav-scroll-height)] motion-safe:shadow-[0_10px_30px_-10px_rgba(2,12,27,0.7)]' : ''}`;

  const Logo = (
    <div className="nav-logo flex justify-center items-center" tabIndex={-1}>
      {isHome ? (
        <a href="/" aria-label="home">
          <div className="hex-container">
            <IconHex />
          </div>
          <div className="logo-container">
            <IconLogo />
          </div>
        </a>
      ) : (
        <Link href="/" aria-label="home">
          <div className="hex-container">
            <IconHex />
          </div>
          <div className="logo-container">
            <IconLogo />
          </div>
        </Link>
      )}
    </div>
  );

  const ResumeLink = (
    <a
      className="ml-[15px] text-[var(--text-xs)] text-green font-mono leading-none
        border border-green rounded-[var(--border-radius)] py-3 px-4
        transition-all duration-250 ease-[var(--easing)]
        hover:bg-green-tint focus-visible:bg-green-tint"
      href="/resume.pdf"
      target="_blank"
      rel="noopener noreferrer"
    >
      Resume
    </a>
  );

  return (
    <header className={headerClasses}>
      <nav className="flex justify-between items-center relative w-full text-lightest-slate font-mono z-12 [counter-reset:item_0]">
        {prefersReducedMotion ? (
          <>
            {Logo}

            <div className="nav-links flex items-center max-[768px]:hidden">
              <ol>
                {navLinks &&
                  navLinks.map(({ url, name }, i) => (
                    <li key={i}>
                      <Link href={url}>{name}</Link>
                    </li>
                  ))}
              </ol>
              <div>{ResumeLink}</div>
            </div>

            <Menu />
          </>
        ) : (
          <>
            <TransitionGroup component={null}>
              {isMounted && (
                <CSSTransition classNames={fadeClass} timeout={timeout}>
                  <>{Logo}</>
                </CSSTransition>
              )}
            </TransitionGroup>

            <div className="nav-links flex items-center max-[768px]:hidden">
              <ol>
                <TransitionGroup component={null}>
                  {isMounted &&
                    navLinks &&
                    navLinks.map(({ url, name }, i) => (
                      <CSSTransition key={i} classNames={fadeDownClass} timeout={timeout}>
                        <li key={i} style={{ transitionDelay: `${isHome ? i * 100 : 0}ms` }}>
                          <Link href={url}>{name}</Link>
                        </li>
                      </CSSTransition>
                    ))}
                </TransitionGroup>
              </ol>

              <TransitionGroup component={null}>
                {isMounted && (
                  <CSSTransition classNames={fadeDownClass} timeout={timeout}>
                    <div style={{ transitionDelay: `${isHome ? navLinks.length * 100 : 0}ms` }}>
                      {ResumeLink}
                    </div>
                  </CSSTransition>
                )}
              </TransitionGroup>
            </div>

            <TransitionGroup component={null}>
              {isMounted && (
                <CSSTransition classNames={fadeClass} timeout={timeout}>
                  <Menu />
                </CSSTransition>
              )}
            </TransitionGroup>
          </>
        )}
      </nav>
    </header>
  );
};

export default Nav;
