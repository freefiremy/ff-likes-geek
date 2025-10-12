'use client';

import Link from 'next/link';
import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const ADMIN_PASSWORD_HASH = 'bba246c355c6b4eb27137d69b3f24ce942820bc10d0d001dc610b95674c09da0';
const AUTH_STORAGE_KEY = 'ff-admin-authenticated';

const textEncoder = new TextEncoder();

async function hashPassword(value) {
  const cryptoObj = globalThis.crypto || (typeof window !== 'undefined' ? window.crypto : undefined);
  if (!cryptoObj?.subtle) {
    throw new Error('Secure hashing is unavailable in this environment.');
  }
  const buffer = await cryptoObj.subtle.digest('SHA-256', textEncoder.encode(value));
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-100">
          <span className="text-sm text-slate-400">Loading…</span>
        </div>
      }
    >
      <AdminLoginContent />
    </Suspense>
  );
}

function AdminLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectPath = useMemo(() => searchParams.get('redirectTo') || '/admin', [searchParams]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const isAuthenticated = localStorage.getItem(AUTH_STORAGE_KEY) === 'true';
    if (isAuthenticated) {
      router.replace(redirectPath);
    }
  }, [redirectPath, router]);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      setError('');

      const trimmedPassword = password.trim();
      if (!trimmedPassword) {
        setError('Please enter the admin password.');
        return;
      }

      try {
        setIsSubmitting(true);
        const hashed = await hashPassword(trimmedPassword);
        if (hashed !== ADMIN_PASSWORD_HASH) {
          setError('Incorrect password. Please try again.');
          setPassword('');
          return;
        }
        localStorage.setItem(AUTH_STORAGE_KEY, 'true');
        router.replace(redirectPath);
      } catch (submitError) {
        console.error('Failed to validate password', submitError);
        setError('Unable to verify password right now. Please retry.');
      } finally {
        setIsSubmitting(false);
      }
    },
    [password, redirectPath, router],
  );

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-slate-950 text-slate-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.12),transparent_55%),radial-gradient(circle_at_bottom_right,rgba(236,72,153,0.12),transparent_60%),linear-gradient(140deg,rgba(8,15,40,1),rgba(11,9,36,1),rgba(17,6,31,1))]" />
      <div className="relative w-[min(92%,420px)] rounded-3xl border border-white/10 bg-slate-900/70 p-8 backdrop-blur-lg shadow-lg">
        <div className="space-y-3 text-center">
          <span className="text-xs uppercase tracking-[0.6em] text-cyan-300/80">Admin Access</span>
          <h1 className="text-2xl font-semibold text-slate-50">Sign in to Dashboard</h1>
          <p className="text-sm text-slate-300">
            Enter the administrator password to manage registered users and likes.
          </p>
          <nav className="flex justify-center gap-4 text-xs uppercase tracking-[0.35em] text-slate-400">
            <Link
              href="/"
              className="transition-colors hover:text-slate-200"
            >
              Home
            </Link>
            <Link
              href="/info"
              className="transition-colors hover:text-slate-200"
            >
              Info
            </Link>
            <Link
              href="/ban"
              className="transition-colors hover:text-slate-200"
            >
              Ban Check
            </Link>
            <Link
              href="/contact"
              className="transition-colors hover:text-slate-200"
            >
              Contact
            </Link>
          </nav>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <label className="block text-sm font-medium text-slate-200/80">
            Password
            <input
              type="password"
              autoComplete="current-password"
              className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-base font-medium text-slate-100 placeholder:text-slate-500 focus:border-cyan-400/60 focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
              placeholder="Enter admin password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={isSubmitting}
            />
          </label>
          {error && (
            <p className="rounded-2xl border border-rose-500/60 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
              {error}
            </p>
          )}
          <button
            type="submit"
            className="w-full rounded-full border border-cyan-400/60 bg-cyan-500/20 px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-100 transition-colors hover:bg-cyan-500/30 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Verifying…' : 'Enter Dashboard'}
          </button>
          <Link
            href="/"
            className="flex w-full justify-center rounded-full border border-white/20 bg-white/10 px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-slate-200 transition-colors hover:bg-white/15"
          >
            Exit Admin
          </Link>
        </form>
      </div>
    </div>
  );
}

