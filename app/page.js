'use client';

import { Buffer } from 'buffer';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';

const gummyNimbus = 'YXN0dXRlMmsz';
const sleepyTrails = {
  like: ['aHR0cHM6Ly9saWtlcy4=', 'YXBpLmZyZWVmaXJl', 'b2ZmaWNpYWwuY29tL2FwaS9zZy8='],
  info: ['aHR0cHM6Ly9hcGku', 'YWxsb3JpZ2lucy53aW4=', 'L3Jhdz91cmw9'],
  infoPath: ['aHR0cHM6Ly9ub2RlanMt', 'aW5mby52ZXJjZWVsLmFwcC8=', 'L2luZm8='],
};

const murkyLedger = {
  'NjY3MzUyNjc4': 'eyJleHBpcmF0aW9uIjoiMjAyNi0wNy0xNFQxMjoyNzowMCswNTozMCJ9',
  'MjgwNTM2NTcwMg==': 'eyJleHBpcmF0aW9uIjoiMjAyNi0wNy0xNFQxMjoyNzowMCswNTozMCJ9',
  'MjUwNjE0OTg4MA==': 'eyJleHBpcmF0aW9uIjoiMjAyNi0wNy0xNFQxMjoyNzowMCswNTozMCJ9',
  'MjA1MjU4MDEzMg==': 'eyJleHBpcmF0aW9uIjoiMjAyNi0wNy0xNFQxMjoyNzowMCswNTozMCJ9',
  'Mjg3NDI5MDk2NQ==': 'eyJleHBpcmF0aW9uIjoiMjAyNi0wNy0xNFQxMjoyNzowMCswNTozMCJ9',
  'MTg5NTAyODg1NA==': 'eyJleHBpcmF0aW9uIjoiMjAyNS0xMC0xNVQxMjoyNzowMCswNTozMCJ9',
  'MzY1NDM2Njk2': 'eyJleHBpcmF0aW9uIjoiMjAyNS0wOC0zMVQxOTo0MTowMCswNTozMCJ9',
  'NzUzNTI0ODM5': 'eyJleHBpcmF0aW9uIjoiMjAyNS0xMS0xMlQwMDowMDowMCswNTozMCJ9',
  'OTIzODI0NzQx': 'eyJleHBpcmF0aW9uIjoiMjAyNS0wNy0zMFQwMDowMDowMCswNTozMCJ9',
  'NTE0NTY0NDc4Ng==': 'eyJleHBpcmF0aW9uIjoiMjAyNS0wOS0wN1QwMDowMDowMCswNTozMCJ9',
  'MTkxODMwMTkxNA==': 'eyJleHBpcmF0aW9uIjoiMjAyNS0wOC0wM1QwMDowMDowMCswNTozMCJ9',
  'Mjg4MjQyNTI1': 'eyJleHBpcmF0aW9uIjoiMjAyNi0wNS0wMVQwMDowMDowMCswNTozMCJ9',
  'MjEzODQxODg2OQ==': 'eyJleHBpcmF0aW9uIjoiMjAyNi0wNS0wMVQwMDowMDowMCswNTozMCJ9',
  'MTcxMDg4NDE0OA==': 'eyJleHBpcmF0aW9uIjoiMjAyNS0wOC0wNFQwMDowMDowMCswNTozMCJ9',
  'MTcyMTAyODI4': 'eyJleHBpcmF0aW9uIjoiMjAyNS0wOC0wNFQwMDowMDowMCswNTozMCJ9',
  'MjMyODExMTUzMw==': 'eyJleHBpcmF0aW9uIjoiMjAyNS0wOC0wNFQwMDowMDowMCswNTozMCJ9',
  'OTA4MzQ5NTM2': 'eyJleHBpcmF0aW9uIjoiMjAyNS0wOC0wNFQwMDowMDowMCswNTozMCJ9',
  'NDAxMjkzNTg3': 'eyJleHBpcmF0aW9uIjoiMjAyNS0wOC0wNFQwMDowMDowMCswNTozMCJ9',
  'MjExNDA2NDAxNA==': 'eyJleHBpcmF0aW9uIjoiMjAyNS0wOC0wNFQwMDowMDowMCswNTozMCJ9',
  'MjkwOTg3NTcyNQ==': 'eyJleHBpcmF0aW9uIjoiMjAyNS0wNy0xMlQwMDowMDowMCswNTozMCJ9',
  'MTQxOTQ2NjI3Mg==': 'eyJleHBpcmF0aW9uIjoiMjAyNS0wNy0xMlQwMDowMDowMCswNTozMCJ9',
  'MzI4MzEwODcxMg==': 'eyJleHBpcmF0aW9uIjoiMjAyOC0wNC0xNFQxMjowMDowMCswNTozMCJ9',
  'MTE1MzE4NjE4MA==': 'eyJleHBpcmF0aW9uIjoiMjAyNS0wOS0xN1QwMDowMDowMCswNTozMCJ9',
  'MjYwNzQxMjE4MQ==': 'eyJleHBpcmF0aW9uIjoiMjAyNS0xMC0yMFQwMDowMDowMCswNTozMCJ9',
  'MzA4OTAwNDcyNA==': 'eyJleHBpcmF0aW9uIjoiMjAyNS0wOC0yMVQwMDowMDowMCswNTozMCJ9',
  'MTk4NzczMjUx': 'eyJleHBpcmF0aW9uIjoiMjAyNS0xMS0wN1QwMDowMDowMCswNTozMCJ9',
};

const STATUS_STYLES = {
  success: 'border-emerald-400/50 bg-emerald-400/10 text-emerald-200',
  warning: 'border-amber-400/50 bg-amber-400/10 text-amber-100',
  error: 'border-rose-400/50 bg-rose-400/10 text-rose-100',
};

const decodeBase64 = (value) => {
  if (typeof window !== 'undefined' && typeof window.atob === 'function') {
    return window.atob(value);
  }
  return Buffer.from(value, 'base64').toString('utf-8');
};

const joinParts = (parts) => parts.map(decodeBase64).join('');

const formatSriLankaTime = (date) =>
  date.toLocaleString('en-US', {
    timeZone: 'Asia/Colombo',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

const calculateRemainingDays = (expiration) => {
  const now = Date.now();
  const diff = expiration.getTime() - now;
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};

export default function HomePage() {
  const [uid, setUid] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [copyLabel, setCopyLabel] = useState('Copy Details');
  const [showTopButton, setShowTopButton] = useState(false);

  const apiKey = useMemo(() => decodeBase64(gummyNimbus), []);
  const likeEndpoint = useMemo(() => joinParts(sleepyTrails.like), []);
  const infoEndpoint = useMemo(() => joinParts(sleepyTrails.info), []);
  const infoPath = useMemo(() => joinParts(sleepyTrails.infoPath), []);

  const registry = useMemo(() => {
    const entries = Object.entries(murkyLedger).map(([key, value]) => {
      const decodedKey = decodeBase64(key);
      const decodedValue = JSON.parse(decodeBase64(value));
      return [decodedKey, new Date(decodedValue.expiration)];
    });
    return new Map(entries);
  }, []);

  const buildLikeUrl = useCallback(
    (id) => `${likeEndpoint}${id}?key=${encodeURIComponent(apiKey)}`,
    [apiKey, likeEndpoint],
  );

  const buildInfoUrl = useCallback(
    (id) => `${infoEndpoint}${infoPath}?uid=${encodeURIComponent(id)}`,
    [infoEndpoint, infoPath],
  );

  const fetchNickname = useCallback(
    async (id) => {
      try {
        const response = await fetch(buildInfoUrl(id));
        if (!response.ok) {
          return 'Unknown';
        }
        const data = await response.json();
        return data?.response?.PlayerNickname || 'Unknown';
      } catch {
        return 'Unknown';
      }
    },
    [buildInfoUrl],
  );

  const handleCopy = useCallback(async () => {
    if (!result?.copyText) return;
    try {
      await navigator.clipboard.writeText(result.copyText);
      setCopyLabel('Copied!');
      setTimeout(() => setCopyLabel('Copy Details'), 2000);
    } catch {
      setCopyLabel('Copy failed');
      setTimeout(() => setCopyLabel('Copy Details'), 2000);
    }
  }, [result]);

  const handleSend = useCallback(async () => {
    if (isSubmitting) return;

    const trimmed = uid.trim();
    setCopyLabel('Copy Details');

    if (!trimmed) {
      setResult({
        status: 'error',
        title: 'UID required',
        lines: ['Please enter your Free Fire UID before sending a like.'],
        copyText: 'UID required. Please enter your Free Fire UID before sending a like.',
      });
      return;
    }

    if (!/^\d+$/.test(trimmed)) {
      setResult({
        status: 'error',
        title: 'Invalid UID format',
        lines: ['The UID should contain digits only. Remove any spaces or letters and try again.'],
        copyText:
          'Invalid UID format. The UID should contain digits only. Remove any spaces or letters and try again.',
      });
      return;
    }

    const expiration = registry.get(trimmed);
    if (!expiration) {
      setResult({
        status: 'error',
        title: 'UID not registered',
        lines: [
          'We could not find this UID in the active registry.',
          'Reach out to the GEEKS FF team to get set up before sending likes.',
        ],
        copyText:
          'UID not registered. Contact the GEEKS FF team to register before sending likes.',
      });
      return;
    }

    if (Date.now() > expiration.getTime()) {
      const formatted = formatSriLankaTime(expiration);
      setResult({
        status: 'warning',
        title: 'Registration expired',
        lines: [
          `This registration expired on ${formatted}.`,
          'Contact the team to renew your access and continue sending likes.',
        ],
        copyText: `Registration expired. Expired on ${formatted}. Contact the team to renew your access.`,
      });
      return;
    }

    setIsSubmitting(true);
    setResult(null);

    try {
      const response = await fetch(buildLikeUrl(trimmed));
      const data = await response.json();

      if (data?.status === 3) {
        const remaining = calculateRemainingDays(expiration);
        const message = data?.message || 'Like limit reached';
        const lines = [
          'You have reached the like limit for today.',
          `Your registration stays active for ${remaining} day${remaining === 1 ? '' : 's'}.`,
          'Try again after 1:30 AM Sri Lankan time.',
        ];

        setResult({
          status: 'warning',
          title: message,
          lines,
          copyText: [message, ...lines].join('\n'),
        });
        return;
      }

      if (data?.status === 1 && data?.response) {
        const nickname = await fetchNickname(trimmed);
        const remaining = calculateRemainingDays(expiration);
        const formattedExpiry = formatSriLankaTime(expiration);
        const details = {
          nickname,
          uid: data.response.UID,
          level: data.response.PlayerLevel,
          likesGiven: data.response.LikesGivenByAPI,
          likesBefore: data.response.LikesbeforeCommand,
          likesAfter: data.response.LikesafterCommand,
          remaining,
          expires: formattedExpiry,
        };

        const copyLines = [
          'Like sent successfully!',
          `Player: ${details.nickname}`,
          `UID: ${details.uid}`,
          `Level: ${details.level}`,
          `Likes before command: ${details.likesBefore}`,
          `Likes after command: ${details.likesAfter}`,
          `Likes recorded for this command: ${details.likesGiven}`,
          `Days remaining: ${details.remaining}`,
          `Registration expires: ${details.expires}`,
        ];

        setResult({
          status: 'success',
          title: 'Like sent successfully!',
          details,
          lines: [
            `Player: ${details.nickname}`,
            `UID: ${details.uid}`,
            `Level: ${details.level}`,
            `Likes recorded this time: ${details.likesGiven}`,
            `Before ➜ After: ${details.likesBefore} ➜ ${details.likesAfter}`,
            `Days remaining: ${details.remaining}`,
            `Registration expires: ${details.expires}`,
          ],
          copyText: copyLines.join('\n'),
        });
        return;
      }

      throw new Error(data?.message || 'Unexpected response from the API.');
    } catch (error) {
      setResult({
        status: 'error',
        title: 'Request failed',
        lines: [
          'We were unable to complete the request.',
          error instanceof Error ? error.message : 'Unknown error.',
        ],
        copyText: `Request failed. ${error instanceof Error ? error.message : 'Unknown error.'}`,
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [buildLikeUrl, fetchNickname, isSubmitting, registry, uid]);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      await handleSend();
    },
    [handleSend],
  );

  useEffect(() => {
    const onScroll = () => {
      setShowTopButton(window.scrollY > 320);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const statusStyle = result ? STATUS_STYLES[result.status] : '';

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.12),transparent_55%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.1),transparent_60%),linear-gradient(140deg,rgba(8,15,40,1),rgba(11,9,36,1),rgba(17,6,31,1))]" />
      <div className="pointer-events-none absolute -left-32 top-24 h-72 w-72 rounded-full bg-cyan-400/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-12 h-64 w-64 rounded-full bg-fuchsia-500/30 blur-3xl" />

      <div className="relative mx-auto flex w-full max-w-5xl flex-col gap-16 px-4 pb-40 pt-28">
        <main className="relative" id="info">
          <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60 px-6 py-8 backdrop-blur-md md:px-12 md:py-12">
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_15%_20%,rgba(56,189,248,0.18),transparent_55%),radial-gradient(circle_at_85%_15%,rgba(236,72,153,0.15),transparent_50%)]" />
            <form onSubmit={handleSubmit} className="relative space-y-8">
              <div>
                <label htmlFor="uid-input" className="block text-sm font-medium text-slate-200/90">
                  Enter your UID
                </label>
                <div className="mt-3 rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-2 focus-within:border-cyan-400/60 focus-within:ring-2 focus-within:ring-cyan-400/30">
                  <input
                    id="uid-input"
                    type="text"
                    autoComplete="off"
                    className="w-full bg-transparent text-lg font-semibold tracking-wide text-slate-50 placeholder:text-slate-500 focus:outline-none"
                    placeholder="e.g. 753524839"
                    value={uid}
                    onChange={(event) => setUid(event.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  type="submit"
                  className="inline-flex h-12 w-full items-center justify-center rounded-full border border-cyan-400/60 bg-cyan-500/20 px-6 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-100 transition-colors hover:bg-cyan-400/30 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send Like'}
                </button>
                <p className="text-xs text-slate-400 sm:text-sm">
                  Limited slots? We’ll let you know if you’ve hit today’s cap.
                </p>
              </div>
              {!result && (
                <div className="space-y-3 rounded-2xl border border-white/10 bg-slate-950/50 px-6 py-5 text-center">
                  <span className="text-xs uppercase tracking-[0.6em] text-cyan-300/80">
                    Premium Like Delivery
                  </span>
                  <h2 className="text-2xl font-semibold text-slate-50 md:text-3xl">
                    GEEKS FF Likes Store
                  </h2>
                  <p className="text-sm text-slate-300 md:text-base">
                    Boost your registered Free Fire profile with premium likes, stay on top of your
                    renewal date, and get in touch with the team in seconds.
                  </p>
                </div>
              )}
            </form>

            <div className="relative mt-10 min-h-[160px]">
              {isSubmitting && (
                <div className="flex h-32 items-center justify-center">
                  <div className="h-10 w-10 animate-spin rounded-full border-2 border-cyan-300/70 border-t-transparent" />
                </div>
              )}

              {!isSubmitting && result && (
                <div
                  className={`space-y-4 rounded-2xl border px-6 py-5 transition-colors ${statusStyle}`}
                >
                  <h2 className="text-lg font-semibold">{result.title}</h2>
                  <ul className="space-y-1 text-sm leading-relaxed text-slate-100/80">
                    {result.lines?.map((line, index) => (
                      <li key={index}>{line}</li>
                    ))}
                  </ul>

                  {result.details && (
                    <dl className="grid grid-cols-1 gap-3 text-sm text-slate-100/80 sm:grid-cols-2">
                      <div>
                        <dt className="text-xs uppercase tracking-[0.3em] text-slate-400">Player</dt>
                        <dd className="mt-1 font-medium text-slate-100">{result.details.nickname}</dd>
                      </div>
                      <div>
                        <dt className="text-xs uppercase tracking-[0.3em] text-slate-400">UID</dt>
                        <dd className="mt-1 font-medium text-slate-100">{result.details.uid}</dd>
                      </div>
                      <div>
                        <dt className="text-xs uppercase tracking-[0.3em] text-slate-400">Level</dt>
                        <dd className="mt-1 font-medium text-slate-100">{result.details.level}</dd>
                      </div>
                      <div>
                        <dt className="text-xs uppercase tracking-[0.3em] text-slate-400">
                          Likes recorded
                        </dt>
                        <dd className="mt-1 font-medium text-slate-100">
                          {result.details.likesGiven}
                        </dd>
                      </div>
                    </dl>
                  )}

                  {result.copyText && (
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-50 transition-colors hover:bg-white/10"
                    >
                      {copyLabel}
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="relative mt-12 grid gap-4 rounded-2xl border border-white/10 bg-slate-900/60 p-5 text-sm text-slate-300 md:grid-cols-2">
              <p>
                Haven’t registered for likes yet? The GEEKS FF crew can onboard you in just a few
                minutes—no guesswork, no waiting.
              </p>
              <p>
                Already registered? Drop your UID above to see how many days remain and when you can
                send the next wave of likes.
              </p>
            </div>
          </section>

          <section className="mt-12 grid gap-4 text-sm text-slate-300 md:grid-cols-2">
            <Link
              href="/info"
              className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 transition-colors hover:border-cyan-400/60 hover:bg-slate-900/70"
            >
              <h2 className="text-lg font-semibold text-slate-50">Need deeper profile insight?</h2>
              <p className="mt-3">
                Use the Info tab to pull level, XP, likes, and BR/CS ranks for any Free Fire UID.
              </p>
            </Link>
            <Link
              href="/ban"
              className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 transition-colors hover:border-cyan-400/60 hover:bg-slate-900/70"
            >
              <h2 className="text-lg font-semibold text-slate-50">Need to verify ban status?</h2>
              <p className="mt-3">Head to the Ban Check tab to confirm whether an account is safe.</p>
            </Link>
          </section>
        </main>
      </div>

      <footer
        className="border-t border-white/10 bg-slate-950/80 px-4 py-16 text-center text-sm text-slate-400"
      >
        <div className="mx-auto flex w-[min(92%,820px)] flex-col items-center gap-8">
          <img
            src="https://dl.dir.freefiremobile.com/common/web_event/official2/dist/client/img/garena_logo.b28b2b6.png"
            alt="Garena logo"
            className="h-10 w-auto"
            loading="lazy"
          />
          <ul className="flex flex-wrap items-center justify-center gap-6 text-xs uppercase tracking-[0.35em] text-slate-500">
            <li>
              <a
                href="https://content.garena.com/legal/pp/pp_en.html"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-slate-200"
              >
                Privacy Policy
              </a>
            </li>
            <li>
              <a
                href="https://content.garena.com/legal/tos/tos_en.html"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-slate-200"
              >
                Terms of Service
              </a>
            </li>
            <li>
              <a
                href="https://www.garena.sg/support"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-slate-200"
              >
                Support
              </a>
            </li>
          </ul>
          <p className="text-xs text-slate-500">
            Copyright © Garena International. Trademarks belong to their respective owners. All
            rights reserved.
          </p>
        </div>
      </footer>

      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed bottom-8 right-6 z-30 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/5 text-slate-100 transition-all duration-300 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300 ${
          showTopButton ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-label="Back to top"
      >
        {'\u2191'}
      </button>
    </div>
  );
}
