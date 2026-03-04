'use client';

import { useState, useEffect } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { navDelay, loaderDelay } from '@/lib/constants';
import { usePrefersReducedMotion } from '@/hooks';

const Hero = () => {
  const [isMounted, setIsMounted] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    const timeout = setTimeout(() => setIsMounted(true), navDelay);
    return () => clearTimeout(timeout);
  }, [prefersReducedMotion]);

  const one = (
    <h1 className="m-0 mb-[30px] ml-1 text-green font-mono text-[clamp(var(--text-sm),5vw,var(--text-md))] font-normal max-[480px]:mb-5 max-[480px]:ml-[2px]">
      Hi, my name is
    </h1>
  );
  const two = <h2 className="big-heading">Brittany Chiang.</h2>;
  const three = (
    <h3 className="big-heading mt-[5px] text-slate leading-[0.9]">
      I build things for the web.
    </h3>
  );
  const four = (
    <>
      <p className="mt-5 max-w-[540px]">
        I&apos;m a software engineer specializing in building (and occasionally designing)
        exceptional digital experiences. Currently, I&apos;m focused on building accessible,
        human-centered products at{' '}
        <a href="https://upstatement.com/" target="_blank" rel="noreferrer">
          Upstatement
        </a>
        .
      </p>
    </>
  );
  const five = (
    <a
      className="big-button mt-[50px]"
      href="https://www.newline.co/courses/build-a-spotify-connected-app"
      target="_blank"
      rel="noreferrer">
      Check out my course!
    </a>
  );

  const items = [one, two, three, four, five];

  return (
    <section className="hero-section flex items-center flex-col !items-start min-h-screen h-screen !p-0">
      {prefersReducedMotion ? (
        <>
          {items.map((item, i) => (
            <div key={i}>{item}</div>
          ))}
        </>
      ) : (
        <TransitionGroup component={null}>
          {isMounted &&
            items.map((item, i) => (
              <CSSTransition key={i} classNames="fadeup" timeout={loaderDelay}>
                <div style={{ transitionDelay: `${i + 1}00ms` }}>{item}</div>
              </CSSTransition>
            ))}
        </TransitionGroup>
      )}
    </section>
  );
};

export default Hero;
