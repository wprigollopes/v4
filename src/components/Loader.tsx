'use client';

import React, { useState, useEffect } from 'react';
import anime from 'animejs';
import { IconLoader } from '@/components/icons';

interface LoaderProps {
  finishLoading: () => void;
}

const Loader: React.FC<LoaderProps> = ({ finishLoading }) => {
  const [isMounted, setIsMounted] = useState(false);

  const animate = () => {
    const loader = anime.timeline({
      complete: () => finishLoading(),
    });

    loader
      .add({
        targets: '#logo path',
        delay: 300,
        duration: 1500,
        easing: 'easeInOutQuart',
        strokeDashoffset: [anime.setDashoffset, 0],
      })
      .add({
        targets: '#logo #B',
        duration: 700,
        easing: 'easeInOutQuart',
        opacity: 1,
      })
      .add({
        targets: '#logo',
        delay: 500,
        duration: 300,
        easing: 'easeInOutQuart',
        opacity: 0,
        scale: 0.1,
      })
      .add({
        targets: '.loader',
        duration: 200,
        easing: 'easeInOutQuart',
        opacity: 0,
        zIndex: -1,
      });
  };

  useEffect(() => {
    document.body.classList.add('hidden');
    const timeout = setTimeout(() => setIsMounted(true), 10);
    animate();
    return () => {
      clearTimeout(timeout);
      document.body.classList.remove('hidden');
    };
  }, []);

  return (
    <div
      className="loader fixed inset-0 w-full h-full bg-dark-navy z-[99] flex items-center justify-center"
    >
      <style>{`#logo #B { opacity: 0; } #logo { display: block; width: 100%; height: 100%; margin: 0 auto; fill: none; user-select: none; }`}</style>
      <div
        className="w-max max-w-[100px] transition-all"
        style={{ opacity: isMounted ? 1 : 0 }}
      >
        <IconLoader />
      </div>
    </div>
  );
};

export default Loader;
