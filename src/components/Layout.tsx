'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Loader from './Loader';
import Nav from './Nav';
import Social from './Social';
import Email from './Email';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  isHome?: boolean;
}

export default function Layout({ children, isHome = false }: LayoutProps) {
  const [isLoading, setIsLoading] = useState(isHome);
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    // Handle hash-based scroll
    if (window.location.hash) {
      const id = window.location.hash.substring(1);
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView();
          el.focus();
        }
      }, 0);
    }

    // Handle external links
    const allLinks = Array.from(document.querySelectorAll('a'));
    allLinks.forEach(link => {
      if (link.host !== window.location.host) {
        link.setAttribute('rel', 'noopener noreferrer');
        link.setAttribute('target', '_blank');
      }
    });
  }, [isLoading]);

  return (
    <>
      <a id="skip-to-content" href="#content">
        Skip to Content
      </a>

      {isLoading && isHome ? (
        <Loader finishLoading={() => setIsLoading(false)} />
      ) : (
        <div className="flex flex-col min-h-screen">
          <Nav isHome={isHome} />
          <Social isHome={isHome} />
          <Email isHome={isHome} />

          <div id="content">
            {children}
            <Footer />
          </div>
        </div>
      )}
    </>
  );
}
