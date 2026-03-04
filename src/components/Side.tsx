'use client';

import { useState, useEffect, ReactNode } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { loaderDelay } from '@/lib/constants';
import { usePrefersReducedMotion } from '@/hooks';

interface SideProps {
  children: ReactNode;
  isHome: boolean;
  orientation: 'left' | 'right';
}

const Side = ({ children, isHome, orientation }: SideProps) => {
  const [isMounted, setIsMounted] = useState(!isHome);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!isHome || prefersReducedMotion) {
      return;
    }
    const timeout = setTimeout(() => setIsMounted(true), loaderDelay);
    return () => clearTimeout(timeout);
  }, [isHome, prefersReducedMotion]);

  return (
    <div
      className={`w-10 fixed bottom-0 z-10 text-light-slate max-[768px]:hidden ${
        orientation === 'left'
          ? 'left-10 right-auto max-[1080px]:left-5'
          : 'right-10 left-auto max-[1080px]:right-5'
      }`}
    >
      {prefersReducedMotion ? (
        <>{children}</>
      ) : (
        <TransitionGroup component={null}>
          {isMounted && (
            <CSSTransition classNames={isHome ? 'fade' : ''} timeout={isHome ? loaderDelay : 0}>
              {children}
            </CSSTransition>
          )}
        </TransitionGroup>
      )}
    </div>
  );
};

export default Side;
