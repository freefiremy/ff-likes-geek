'use client';

import { useCallback, useMemo, useState } from 'react';

const REGION_OPTIONS = [
  'SG',
  'BR',
  'US',
  'EU',
  'ID',
  'IN',
  'BD',
  'ME',
  'RU',
  'TH',
  'VN',
  'TW',
];

const API_BASE = 'https://accinfo.vercel.app/player-info';

const importantFields = (data) => {
  const info = data?.basicInfo;
  if (!info) return null;

  const lastLoginSeconds = Number(info.lastLoginAt);
  const lastLoginDate =
    Number.isFinite(lastLoginSeconds) && lastLoginSeconds > 0
      ? new Date(lastLoginSeconds * 1000)
      : null;

  return {
    accountId: info.accountId,
    nickname: info.nickname,
    region: info.region,
    level: info.level,
    exp: info.exp,
    brRank: info.rank,
    brPoints: info.rankingPoints,
    csRank: info.csRank,
    csPoints: info.csRankingPoints,
    likes: info.liked,
    lastLogin: lastLoginDate,
  };
};

const formatDate = (date) =>
  date
    ? date.toLocaleString('en-US', {
        timeZoneName: 'short',
        hour12: true,
      })
    : 'Unknown';

export default function InfoPage() {
  const [uid, setUid] = useState('');
  const [region, setRegion] = useState('SG');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const buildUrl = useMemo(
    () => (regionCode, accountId) =>
      `${API_BASE}?region=${encodeURIComponent(regionCode)}&uid=${encodeURIComponent(accountId)}`,
    [],
  );

  const handleLookup = useCallback(
    async (event) => {
      event.preventDefault();

      const trimmedUid = uid.trim();
      if (!trimmedUid) {
        setErrorMessage('Please enter a UID first.');
        setResult(null);
        return;
      }
      if (!/^\d+$/.test(trimmedUid)) {
        setErrorMessage('UID must contain digits only.');
        setResult(null);
        return;
      }

      setIsLoading(true);
      setErrorMessage('');
      setResult(null);

      try {
        const response = await fetch(buildUrl(region, trimmedUid));
        if (!response.ok) {
          throw new Error(`API responded with ${response.status}`);
        }
        const payload = await response.json();
        const mapped = importantFields(payload);

        if (!mapped) {
          throw new Error('No account information returned for this UID.');
        }

        setResult(mapped);
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : 'Unable to retrieve account information.',
        );
      } finally {
        setIsLoading(false);
      }
    },
    [buildUrl, region, uid],
  );

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.12),transparent_55%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.12),transparent_60%),linear-gradient(140deg,rgba(8,15,40,1),rgba(11,9,36,1),rgba(17,6,31,1))]" />
      <div className="pointer-events-none absolute -left-32 top-24 h-72 w-72 rounded-full bg-cyan-400/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-12 h-64 w-64 rounded-full bg-fuchsia-500/30 blur-3xl" />

      <main className="relative mx-auto flex w-full max-w-4xl flex-col gap-10 px-4 pb-32 pt-28">
        <header className="text-center">
          <span className="text-xs uppercase tracking-[0.6em] text-cyan-300/80">
            Account intelligence
          </span>
          <h1 className="mt-6 text-4xl font-semibold leading-tight text-slate-50 md:text-5xl">
            Free Fire Profile Lookup
          </h1>
          <p className="mt-4 text-base text-slate-300 md:text-lg">
            Enter any Free Fire UID and region to fetch essential account information: nickname,
            level, Battle Royale & Clash Squad ranks, likes, and last login timestamp.
          </p>
        </header>

        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60 px-6 py-8 backdrop-blur-md md:px-10 md:py-10">
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_18%_18%,rgba(56,189,248,0.14),transparent_50%),radial-gradient(circle_at_82%_18%,rgba(236,72,153,0.12),transparent_50%)]" />
          <form
            onSubmit={handleLookup}
            className="relative flex flex-col gap-6 text-slate-200 sm:flex-row sm:items-end"
          >
            <label className="flex flex-1 flex-col gap-2 text-sm">
              <span className="font-medium text-slate-200/80">UID</span>
              <input
                type="text"
                inputMode="numeric"
                placeholder="Enter UID"
                value={uid}
                onChange={(event) => setUid(event.target.value)}
                className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-base font-semibold tracking-wide text-slate-100 placeholder:text-slate-500 focus:border-cyan-400/60 focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
              />
            </label>
            <label className="flex w-full flex-col gap-2 text-sm sm:w-40">
              <span className="font-medium text-slate-200/80">Region</span>
              <select
                value={region}
                onChange={(event) => setRegion(event.target.value)}
                className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-base font-semibold text-slate-100 focus:border-cyan-400/60 focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
              >
                {REGION_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <button
              type="submit"
              className="h-12 rounded-full border border-cyan-400/60 bg-cyan-500/15 px-8 text-sm font-semibold uppercase tracking-[0.35em] text-cyan-100 transition-colors hover:bg-cyan-500/25 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isLoading}
            >
              {isLoading ? 'Searching…' : 'Search'}
            </button>
          </form>

          {errorMessage && (
            <p className="relative mt-6 rounded-2xl border border-rose-400/50 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
              {errorMessage}
            </p>
          )}

          {isLoading && !errorMessage && (
            <div className="relative mt-8 flex items-center justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-cyan-300/70 border-t-transparent" />
            </div>
          )}

          {result && !isLoading && (
            <div className="relative mt-8 grid gap-6 rounded-2xl border border-white/10 bg-slate-950/40 p-6 text-sm sm:grid-cols-2">
              <InfoRow label="UID" value={result.accountId} />
              <InfoRow label="Nickname" value={result.nickname} />
              <InfoRow label="Region" value={result.region} />
              <InfoRow label="Level" value={result.level} />
              <InfoRow label="Experience" value={result.exp?.toLocaleString?.() ?? result.exp} />
              <InfoRow
                label="BR Rank"
                value={
                  result.brRank !== undefined
                    ? `${result.brRank} (${result.brPoints ?? 0} pts)`
                    : 'Unknown'
                }
              />
              <InfoRow
                label="CS Rank"
                value={
                  result.csRank !== undefined
                    ? `${result.csRank} (${result.csPoints ?? 0} pts)`
                    : 'Unknown'
                }
              />
              <InfoRow label="Total Likes" value={result.likes?.toLocaleString?.() ?? result.likes} />
              <InfoRow label="Last Login" value={formatDate(result.lastLogin)} />
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs uppercase tracking-[0.3em] text-slate-400">{label}</span>
      <span className="text-base font-medium text-slate-100">{value ?? 'Unknown'}</span>
    </div>
  );
}
