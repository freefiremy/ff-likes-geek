'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/info', label: 'Info' },
  { href: '/ban', label: 'Ban Check' },
  { href: '/contact', label: 'Contact' },
];

export function NavBar() {
  const pathname = usePathname();
  const leftLinks = NAV_LINKS.slice(0, 3);
  const rightLink = NAV_LINKS[3];

  return (
    <nav className="sticky top-0 z-30 w-full border border-white/10 bg-slate-900/70 py-3 backdrop-blur-md">
      <div className="mx-auto flex w-[min(92%,900px)] items-center justify-center px-6">
        <div className="flex w-full items-center justify-between">
          <ul className="flex items-center gap-3">
            {leftLinks.map(({ href, label }) => {
              const isActive =
                href === '/'
                  ? pathname === '/'
                  : pathname === href || pathname.startsWith(`${href}/`);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={`rounded-full border-none px-5 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-cyan-300 text-slate-950'
                        : 'text-slate-200/70 hover:text-slate-100'
                    } focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 active:outline-none`}
                    aria-current={isActive ? 'page' : undefined}
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
              className={`rounded-full border-none px-5 py-2 text-sm font-medium transition-colors ${
                pathname === rightLink.href || pathname.startsWith(`${rightLink.href}/`)
                  ? 'bg-cyan-300 text-slate-950'
                  : 'text-slate-200/70 hover:text-slate-100'
              } focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 active:outline-none`}
              aria-current={
                pathname === rightLink.href || pathname.startsWith(`${rightLink.href}/`)
                  ? 'page'
                  : undefined
              }
            >
              {rightLink.label}
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
