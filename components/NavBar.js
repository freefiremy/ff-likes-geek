'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_LINKS = [
  { href: '/', label: 'Home', alignment: 'left' },
  { href: '/info', label: 'Info', alignment: 'left' },
  { href: '/ban', label: 'Ban Check', alignment: 'left' },
  { href: '/contact', label: 'Contact', alignment: 'right' },
];

export function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-30 w-full border border-white/10 bg-slate-900/70 py-3 backdrop-blur-md">
      <div className="mx-auto flex w-[min(92%,900px)] items-center justify-center px-6">
        <div className="flex w-full items-center justify-between gap-4 rounded-full border border-white/10 bg-slate-900/60 px-4 py-1">
          <ul className="flex items-center gap-2">
            {NAV_LINKS.filter(({ alignment }) => alignment === 'left').map(({ href, label }) => {
              const isActive =
                href === '/'
                  ? pathname === '/'
                  : pathname === href || pathname.startsWith(`${href}/`);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-cyan-300 text-slate-950'
                        : 'text-slate-200/70 hover:text-slate-100'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <ul className="flex items-center gap-2">
            {NAV_LINKS.filter(({ alignment }) => alignment === 'right').map(({ href, label }) => {
              const isActive =
                href === '/'
                  ? pathname === '/'
                  : pathname === href || pathname.startsWith(`${href}/`);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-cyan-300 text-slate-950'
                        : 'text-slate-200/70 hover:text-slate-100'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
