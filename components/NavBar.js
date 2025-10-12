'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/info', label: 'Info' },
  { href: '/ban', label: 'Ban Check' },
  { href: '/contact', label: 'Contact' },
];

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

const normalizeHref = (href) => {
  if (!href || href === '/') {
    return '/';
  }
  return href.endsWith('/') ? href : `${href}/`;
};

const resolveHrefWithBase = (href) => {
  const normalized = normalizeHref(href);
  if (!basePath) {
    return normalized;
  }
  if (normalized === '/') {
    return `${basePath}/`;
  }
  const cleanedBase = basePath.endsWith('/') ? basePath.slice(0, -1) : basePath;
  return `${cleanedBase}${normalized}`;
};

const shouldSkipClientNav = (event) =>
  event.defaultPrevented ||
  (typeof event.button === 'number' && event.button !== 0) ||
  event.metaKey ||
  event.altKey ||
  event.ctrlKey ||
  event.shiftKey;

export function NavBar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuButtonRef = useRef(null);
  const menuPanelRef = useRef(null);
  const wasMenuOpen = useRef(false);
  const leftLinks = NAV_LINKS.slice(0, 3);
  const rightLink = NAV_LINKS[3];
  const menuId = 'primary-navigation';

  const isLinkActive = (href) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const activeLink = NAV_LINKS.find(({ href }) => isLinkActive(href));

  const navigateWithReload = useCallback((href) => {
    if (typeof window === 'undefined') {
      return;
    }
    const target = resolveHrefWithBase(href);
    window.location.assign(target);
  }, []);

  const createLinkHandler = useCallback(
    (href) => (event) => {
      if (shouldSkipClientNav(event)) {
        return;
      }
      event.preventDefault();
      setIsMenuOpen(false);
      navigateWithReload(href);
    },
    [navigateWithReload],
  );

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    let focusTimer;

    if (isMenuOpen) {
      const firstLink = menuPanelRef.current?.querySelector('[data-menu-item="true"]');
      if (firstLink instanceof HTMLElement) {
        focusTimer = setTimeout(() => firstLink.focus(), 0);
      }
    } else if (wasMenuOpen.current) {
      menuButtonRef.current?.focus();
    }

    wasMenuOpen.current = isMenuOpen;

    return () => {
      if (focusTimer) {
        clearTimeout(focusTimer);
      }
    };
  }, [isMenuOpen]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 768px)');
    const handleMediaChange = (event) => {
      if (event.matches) {
        setIsMenuOpen(false);
      }
    };

    mediaQuery.addEventListener('change', handleMediaChange);
    return () => {
      mediaQuery.removeEventListener('change', handleMediaChange);
    };
  }, []);

  return (
    <nav className="sticky top-0 z-30 w-full border border-white/10 bg-slate-900/70 py-3 backdrop-blur-md">
      <div className="mx-auto flex w-[min(92%,900px)] items-center justify-center px-6">
        <div className="relative flex w-full items-center justify-between">
          <div className="hidden w-full items-center justify-between md:flex">
            <ul className="flex items-center gap-3">
              {leftLinks.map(({ href, label }) => {
                const isActive = isLinkActive(href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    prefetch={false}
                    className={`rounded-full border-none px-5 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-cyan-300 text-slate-950'
                        : 'text-slate-200/70 hover:text-slate-100'
                    } focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 active:outline-none`}
                    aria-current={isActive ? 'page' : undefined}
                    onClick={createLinkHandler(href)}
                  >
                    {label}
                  </Link>
                </li>
              );
              })}
            </ul>
          {rightLink && (
            <Link
              href={rightLink.href}
              prefetch={false}
              className={`rounded-full border-none px-5 py-2 text-sm font-medium transition-colors ${
                isLinkActive(rightLink.href)
                  ? 'bg-cyan-300 text-slate-950'
                  : 'text-slate-200/70 hover:text-slate-100'
              } focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 active:outline-none`}
              aria-current={isLinkActive(rightLink.href) ? 'page' : undefined}
              onClick={createLinkHandler(rightLink.href)}
            >
              {rightLink.label}
            </Link>
          )}
        </div>

          <div className="flex w-full items-center justify-between md:hidden">
            {activeLink ? (
              <Link
                href={activeLink.href}
                prefetch={false}
                className="rounded-full px-5 py-2 text-sm font-medium transition-colors bg-cyan-300 text-slate-950 focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 active:outline-none"
                aria-current="page"
                onClick={createLinkHandler(activeLink.href)}
              >
                {activeLink.label}
              </Link>
            ) : (
              <span className="rounded-full px-5 py-2 text-sm font-medium text-slate-200/70">
                Menu
              </span>
            )}
            <button
              ref={menuButtonRef}
              type="button"
              className="ml-4 inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-slate-200/80 transition-colors hover:text-slate-100 focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 active:outline-none"
              aria-expanded={isMenuOpen}
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={() => setIsMenuOpen((prev) => !prev)}
            >
              <span>Menu</span>
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M5 7h14M5 12h14M5 17h14"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          <div
            ref={menuPanelRef}
            id={menuId}
            className={`absolute left-0 right-0 top-full mt-3 rounded-2xl border border-white/10 bg-slate-900/95 p-3 shadow-lg backdrop-blur-xl transition-all duration-200 ease-out md:hidden ${
              isMenuOpen
                ? 'pointer-events-auto translate-y-0 opacity-100'
                : 'pointer-events-none -translate-y-2 opacity-0'
            }`}
            aria-hidden={!isMenuOpen}
          >
            <ul className="flex flex-col gap-2">
              {NAV_LINKS.map(({ href, label }) => {
                const isActive = isLinkActive(href);
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      prefetch={false}
                      data-menu-item="true"
                      className={`block w-full rounded-full px-5 py-3 text-base font-medium transition-colors ${
                        isActive
                          ? 'bg-cyan-300 text-slate-950'
                          : 'text-slate-200/80 hover:text-slate-100'
                      } focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 active:outline-none`}
                      aria-current={isActive ? 'page' : undefined}
                      onClick={createLinkHandler(href)}
                    >
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
