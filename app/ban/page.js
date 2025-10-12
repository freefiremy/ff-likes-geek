'use client';

import { useCallback, useState } from 'react';

const API_ENDPOINT = 'http://87.106.82.84:13522/check';

const UID_MIN_LENGTH = 8;
const UID_MAX_LENGTH = 11;

const statusStyles = {
  safe: 'border-emerald-400/60 bg-emerald-400/10 text-emerald-100',
  banned: 'border-rose-500/60 bg-rose-500/10 text-rose-100',
};

const normalizeStatus = (response) => {
  if (!response) return null;
  const isBanned = typeof response.ban_period === 'number' && response.ban_period > 0;
  return {
    isBanned,
    label: response.is_banned ?? (isBanned ? '❌ الحساب مبند' : '✅ الحساب ليس مبند'),
    banPeriod: response.ban_period ?? null,
    name: response.name ?? 'Unknown',
    region: response.region ?? 'Unknown',
  };
};

export default function BanCheckPage() {
  const [uid, setUid] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [status, setStatus] = useState(null);
  const [submittedUid, setSubmittedUid] = useState('');
  const handleUidChange = useCallback((event) => {
    const digitsOnly = event.target.value.replace(/\D/g, '').slice(0, UID_MAX_LENGTH);
    setUid(digitsOnly);
  }, []);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      const trimmed = uid.trim();

      if (!trimmed) {
        setErrorMessage('Please enter a UID first.');
        setStatus(null);
        setSubmittedUid('');
        return;
      }
      if (!/^\d+$/.test(trimmed)) {
        setErrorMessage('UID must contain digits only.');
        setStatus(null);
        setSubmittedUid('');
        return;
      }
      if (trimmed.length < UID_MIN_LENGTH || trimmed.length > UID_MAX_LENGTH) {
        setErrorMessage(`UID must be between ${UID_MIN_LENGTH} and ${UID_MAX_LENGTH} digits.`);
        setStatus(null);
        setSubmittedUid('');
        return;
      }

      setSubmittedUid(trimmed);
      setIsChecking(true);
      setErrorMessage('');
      setStatus(null);

      try {
        const url = `${API_ENDPOINT}?uid=${encodeURIComponent(trimmed)}`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`API responded with status ${response.status}`);
        }
        const data = await response.json();
        if (!data?.success) {
          throw new Error('The ban check API did not return a successful response.');
        }
        setStatus(normalizeStatus(data));
        setUid('');
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : 'Unable to reach the ban check service right now.',
        );
      } finally {
        setIsChecking(false);
      }
    },
    [uid],
  );

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.12),transparent_55%),radial-gradient(circle_at_bottom_right,rgba(236,72,153,0.12),transparent_60%),linear-gradient(140deg,rgba(8,15,40,1),rgba(11,9,36,1),rgba(17,6,31,1))]" />
      <div className="pointer-events-none absolute -left-32 top-24 h-72 w-72 rounded-full bg-cyan-400/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-12 h-64 w-64 rounded-full bg-fuchsia-500/30 blur-3xl" />

      <main className="relative mx-auto flex w-full max-w-4xl flex-col gap-10 px-4 pb-32 pt-28">
        <header className="text-center">
          <span className="text-xs uppercase tracking-[0.6em] text-cyan-300/80">
            Ban status lookup
          </span>
          <h1 className="mt-6 text-4xl font-semibold leading-tight text-slate-50 md:text-5xl">
            Check Account Ban Status
          </h1>
          <p className="mt-4 text-base text-slate-300 md:text-lg">
            Verify whether a Free Fire account is currently banned. Enter the UID below and we will
            query the AlliFF ban service for the latest status.
          </p>
        </header>

        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60 px-6 py-8 backdrop-blur-md md:px-10 md:py-10">
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_18%,rgba(56,189,248,0.14),transparent_50%),radial-gradient(circle_at_80%_18%,rgba(236,72,153,0.12),transparent_50%)]" />
          <form onSubmit={handleSubmit} className="relative flex flex-col gap-6 sm:flex-row sm:items-end">
            <label className="flex flex-1 flex-col gap-2 text-sm">
              <span className="font-medium text-slate-200/80">UID</span>
              <input
                type="text"
                inputMode="numeric"
                pattern="\d*"
                placeholder="Enter UID"
                value={uid}
                onChange={handleUidChange}
                maxLength={UID_MAX_LENGTH}
                autoComplete="off"
                className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-base font-semibold tracking-wide text-slate-100 placeholder:text-slate-500 focus:border-cyan-400/60 focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
              />
            </label>
            <button
              type="submit"
              className="h-12 rounded-full border border-cyan-400/60 bg-cyan-500/15 px-8 text-sm font-semibold uppercase tracking-[0.35em] text-cyan-100 transition-colors hover:bg-cyan-500/25 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isChecking}
            >
              {isChecking ? 'Checking…' : 'Check Status'}
            </button>
          </form>

          {errorMessage && (
            <p className="relative mt-6 rounded-2xl border border-rose-500/60 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
              {errorMessage}
            </p>
          )}

          {isChecking && !errorMessage && (
            <div className="relative mt-8 flex items-center justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-cyan-300/70 border-t-transparent" />
            </div>
          )}

          {status && !isChecking && (
            <div
              className={`relative mt-8 rounded-2xl border px-6 py-5 ${
                status.isBanned ? statusStyles.banned : statusStyles.safe
              }`}
            >
              <h2 className="text-lg font-semibold">{status.label}</h2>
              <div className="mt-4 grid gap-3 text-sm text-slate-100/90 sm:grid-cols-2">
                <Detail label="Nickname" value={status.name} />
                <Detail label="Region" value={status.region} />
                <Detail label="Ban period (days)" value={status.banPeriod ?? 0} />
                <Detail label="UID" value={submittedUid || 'Unknown'} />
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs uppercase tracking-[0.3em] text-slate-300/80">{label}</span>
      <span className="text-base font-medium text-slate-50">{value ?? 'Unknown'}</span>
    </div>
  );
}
