import { useState, useEffect } from 'react';

type ScrollDirection = 'up' | 'down';

interface UseScrollDirectionProps {
  initialDirection?: ScrollDirection;
  thresholdPixels?: number;
  off?: boolean;
}

export function useScrollDirection({
  initialDirection = 'down',
  thresholdPixels = 0,
  off = false,
}: UseScrollDirectionProps = {}): ScrollDirection {
  const [scrollDir, setScrollDir] = useState<ScrollDirection>(initialDirection);

  useEffect(() => {
    if (off) return;

    let lastScrollY = window.pageYOffset;
    let ticking = false;

    const updateScrollDir = () => {
      const scrollY = window.pageYOffset;
      if (Math.abs(scrollY - lastScrollY) < thresholdPixels) {
        ticking = false;
        return;
      }
      setScrollDir(scrollY > lastScrollY ? 'down' : 'up');
      lastScrollY = scrollY > 0 ? scrollY : 0;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollDir);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [initialDirection, thresholdPixels, off]);

  return scrollDir;
}
