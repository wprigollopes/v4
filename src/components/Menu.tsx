'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { navLinks, KEY_CODES } from '@/lib/constants';
import { useOnClickOutside } from '@/hooks';

const Menu = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const navRef = useRef<HTMLElement>(null);

  let menuFocusables: HTMLElement[];
  let firstFocusableEl: HTMLElement;
  let lastFocusableEl: HTMLElement;

  const setFocusables = () => {
    menuFocusables = [
      buttonRef.current!,
      ...Array.from(navRef.current?.querySelectorAll('a') ?? []),
    ];
    firstFocusableEl = menuFocusables[0];
    lastFocusableEl = menuFocusables[menuFocusables.length - 1];
  };

  const handleBackwardTab = (e: KeyboardEvent) => {
    if (document.activeElement === firstFocusableEl) {
      e.preventDefault();
      lastFocusableEl.focus();
    }
  };

  const handleForwardTab = (e: KeyboardEvent) => {
    if (document.activeElement === lastFocusableEl) {
      e.preventDefault();
      firstFocusableEl.focus();
    }
  };

  const onKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case KEY_CODES.ESCAPE:
      case KEY_CODES.ESCAPE_IE11: {
        setMenuOpen(false);
        break;
      }

      case KEY_CODES.TAB: {
        if (menuFocusables && menuFocusables.length === 1) {
          e.preventDefault();
          break;
        }
        if (e.shiftKey) {
          handleBackwardTab(e);
        } else {
          handleForwardTab(e);
        }
        break;
      }

      default: {
        break;
      }
    }
  };

  const onResize = (e: UIEvent) => {
    if ((e.currentTarget as Window).innerWidth > 768) {
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown);
    window.addEventListener('resize', onResize);

    setFocusables();

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.classList.add('blur');
    } else {
      document.body.classList.remove('blur');
    }

    return () => {
      document.body.classList.remove('blur');
    };
  }, [menuOpen]);

  const wrapperRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(wrapperRef, () => setMenuOpen(false));

  return (
    <div className="hidden max-[768px]:block">
      <div ref={wrapperRef}>
        <button
          onClick={toggleMenu}
          ref={buttonRef}
          aria-label="Menu"
          className={`hidden max-[768px]:flex max-[768px]:justify-center max-[768px]:items-center
            relative z-10 -mr-[15px] p-[15px] border-0 bg-transparent text-inherit
            transition-[opacity,filter] duration-150 ease-linear cursor-pointer`}
        >
          <div className="ham-box">
            <div className={`ham-box-inner${menuOpen ? ' active' : ''}`} />
          </div>
        </button>

        <aside
          className={`mobile-menu-sidebar hidden max-[768px]:flex max-[768px]:justify-center max-[768px]:items-center
            fixed top-0 bottom-0 right-0 p-[50px_10px] w-[min(75vw,400px)] h-screen
            outline-0 bg-light-navy shadow-[-10px_0px_30px_-15px_rgba(2,12,27,0.7)]
            z-[9] transition-all duration-250 ease-[var(--easing)]
            ${menuOpen ? 'translate-x-0 visible' : 'translate-x-[100vw] invisible'}`}
          aria-hidden={!menuOpen}
          tabIndex={menuOpen ? 1 : -1}
        >
          <nav ref={navRef}>
            {navLinks && (
              <ol>
                {navLinks.map(({ url, name }, i) => (
                  <li key={i}>
                    <Link href={url} onClick={() => setMenuOpen(false)}>
                      {name}
                    </Link>
                  </li>
                ))}
              </ol>
            )}

            <a
              href="/resume.pdf"
              className="mt-[10%] mx-auto mb-0 w-max py-[18px] px-[50px]
                text-green font-mono text-[var(--text-sm)] leading-none
                border border-green rounded-[var(--border-radius)]
                transition-all duration-250 ease-[var(--easing)]
                hover:bg-green-tint focus-visible:bg-green-tint"
            >
              Resume
            </a>
          </nav>
        </aside>
      </div>
    </div>
  );
};

export default Menu;
