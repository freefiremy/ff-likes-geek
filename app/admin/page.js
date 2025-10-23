'use client';

import { Buffer } from 'buffer';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

const AUTH_STORAGE_KEY = 'ff-admin-authenticated';
const USER_STORAGE_KEY = 'ff-admin-users';
const DEFAULT_MONEY = 500;

const ENCODED_REGISTRY = {
  'MjgwNTM2NTcwMg==': 'eyJleHBpcmF0aW9uIjoiMjEwMC0wMS0wMVQwMDowMDowMFoifQ==',
  'MjUwNjE0OTg4MA==': 'eyJleHBpcmF0aW9uIjoiMjEwMC0wMS0wMVQwMDowMDowMFoifQ==',
  'MjA1MjU4MDEzMg==': 'eyJleHBpcmF0aW9uIjoiMjEwMC0wMS0wMVQwMDowMDowMFoifQ==',
  'Mjg3NDI5MDk2NQ==': 'eyJleHBpcmF0aW9uIjoiMjEwMC0wMS0wMVQwMDowMDowMFoifQ==',
  'MTg5NTAyODg1NA==': 'eyJleHBpcmF0aW9uIjoiMjAyNS0xMi0xOVQxMjoyNzowMCswNTozMCJ9',
  'MzY1NDM2Njk2': 'eyJleHBpcmF0aW9uIjoiMjAyNS0wOC0zMVQxOTo0MTowMCswNTozMCJ9',
  'NzUzNTI0ODM5': 'eyJleHBpcmF0aW9uIjoiMjAyNS0xMS0xMlQwMDowMDowMCswNTozMCJ9',
  'OTIzODI0NzQx': 'eyJleHBpcmF0aW9uIjoiMjAyNS0wNy0zMFQwMDowMDowMCswNTozMCJ9',
  'NTE0NTY0NDc4Ng==': 'eyJleHBpcmF0aW9uIjoiMjAyNS0xMS0yMFQwMDowMDowMCswNTozMCJ9',
  'MTkxODMwMTkxNA==': 'eyJleHBpcmF0aW9uIjoiMjAyNS0wOC0wM1QwMDowMDowMCswNTozMCJ9',
  'Mjg4MjQyNTI1': 'eyJleHBpcmF0aW9uIjoiMjEwMC0wMS0wMVQwMDowMDowMFoifQ==',
  'MjEzODQxODg2OQ==': 'eyJleHBpcmF0aW9uIjoiMjEwMC0wMS0wMVQwMDowMDowMFoifQ==',
  'MTcxMDg4NDE0OA==': 'eyJleHBpcmF0aW9uIjoiMjAyNS0wOC0wNFQwMDowMDowMCswNTozMCJ9',
  'MTcyMTAyODI4': 'eyJleHBpcmF0aW9uIjoiMjAyNS0wOC0wNFQwMDowMDowMCswNTozMCJ9',
  'MjMyODExMTUzMw==': 'eyJleHBpcmF0aW9uIjoiMjAyNS0wOC0wNFQwMDowMDowMCswNTozMCJ9',
  'OTA4MzQ5NTM2': 'eyJleHBpcmF0aW9uIjoiMjAyNS0wOC0wNFQwMDowMDowMCswNTozMCJ9',
  'NDAxMjkzNTg3': 'eyJleHBpcmF0aW9uIjoiMjAyNS0wOC0wNFQwMDowMDowMCswNTozMCJ9',
  'MjExNDA2NDAxNA==': 'eyJleHBpcmF0aW9uIjoiMjAyNS0wOC0wNFQwMDowMDowMCswNTozMCJ9',
  'MjkwOTg3NTcyNQ==': 'eyJleHBpcmF0aW9uIjoiMjAyNS0wNy0xMlQwMDowMDowMCswNTozMCJ9',
  'MTQxOTQ2NjI3Mg==': 'eyJleHBpcmF0aW9uIjoiMjAyNS0wNy0xMlQwMDowMDowMCswNTozMCJ9',
  'MzI4MzEwODcxMg==': 'eyJleHBpcmF0aW9uIjoiMjEwMC0wMS0wMVQwMDowMDowMFoifQ==',
  'MTE1MzE4NjE4MA==': 'eyJleHBpcmF0aW9uIjoiMjAyNS0wOS0xN1QwMDowMDowMCswNTozMCJ9',
  'MjYwNzQxMjE4MQ==': 'eyJleHBpcmF0aW9uIjoiMjAyNS0xMC0zMFQwMDowMDowMCswNTozMCJ9',
  'MzA4OTAwNDcyNA==': 'eyJleHBpcmF0aW9uIjoiMjAyNS0wOC0yMVQwMDowMDowMCswNTozMCJ9',
  'MTk4NzczMjUx': 'eyJleHBpcmF0aW9uIjoiMjAyNS0xMS0wN1QwMDowMDowMCswNTozMCJ9',
  'MjIwODg1ODQy': 'eyJleHBpcmF0aW9uIjoiMjAyNi0wMy0yMlQwMDowMDowMCswNTozMCJ9',
};

const nicknameLedger = Object.freeze({
  '2805365702': 'RasikaSrimal',
  '2506149880': 'HEY.Podii_?',
  '2052580132': 'LiyonCursed',
  '2874290965': '★GEEK★『sLc』',
  '1895028854': '★ＲＡＶＡＮ★『sLc』',
  '365436696': '★IRASH★『sLc』',
  '753524839': 'Aѕʟᴍʀ┃RUSHᅠ★',
  '923824741': 'OGGγ5 Śҽყϝαα',
  '5145644786': 'SLᅠROSHANᅠ亗',
  '1918301914': '★SCEMO★『sLc』',
  '288242525': 'HEY.Ghost<',
  '2138418869': 'X_SACHIN®★',
  '1710884148': 'ᅠ98ᅠᴀᴍᴀsʜɪᅠ',
  '172102828': '98ᅠᴊᴋ',
  '2328111533': 'Cѕʟᴍʀ┃ERAN',
  '908349536': '98-DANA',
  '401293587': 'xTOP/ISHARA亗',
  '2114064014': 'シXɪᴀᴏᅠʏᴀɴᅠ',
  '2909875725': 'TᅠuᅠTᅠuᅠ亗',
  '1419466272': '★MAKARA★sLc',
  '3283108712': 'sleepysnow`',
  '1153186180': 'naahihi.',
  '2607412181': 'Bѕʟᴍʀ┃SNOOP',
  '3089004724': 'unaaè.',
  '198773251': 'accnotFound-',
});

const INITIAL_USERS = buildInitialUsersFromRegistry(ENCODED_REGISTRY);

const STATUS_STYLES = {
  active: 'bg-emerald-500/15 text-emerald-200 border-emerald-400/40',
  expired: 'bg-rose-500/15 text-rose-200 border-rose-400/40',
  vip: 'bg-blue-500/15 text-blue-200 border-blue-400/40',
};
const STATUS_SEQUENCE = ['all', 'active', 'expired', 'vip'];

function decodeBase64(value) {
  if (typeof window !== 'undefined' && typeof window.atob === 'function') {
    return window.atob(value);
  }
  return Buffer.from(value, 'base64').toString('utf-8');
}

function sanitizeNickname(input) {
  if (!input) {
    return 'Unknown';
  }
  try {
    const normalized = input.normalize('NFKC').replace(/[\u0000-\u001F\u007F-\u009F]+/g, '').trim();
    return normalized || 'Unknown';
  } catch {
    const cleaned = input.replace(/[\u0000-\u001F\u007F-\u009F]+/g, '').trim();
    return cleaned || 'Unknown';
  }
}

function resolveNickname(uid, fallback) {
  const candidate =
    typeof fallback === 'string' && fallback.trim() ? fallback : nicknameLedger[uid] ?? 'Unknown';
  return sanitizeNickname(candidate);
}

function parseMoney(value) {
  const numeric = Number.parseInt(value, 10);
  return Number.isFinite(numeric) ? numeric : DEFAULT_MONEY;
}

function formatExpirationDate(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return 'Unknown';
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function buildInitialUsersFromRegistry(registry) {
  if (!registry || typeof registry !== 'object') {
    return [];
  }

  return Object.entries(registry).map(([encodedUid, encodedPayload]) => {
    const uid = decodeBase64(encodedUid);
    let expiration = new Date().toISOString();
    let money = DEFAULT_MONEY;
    let nickname = resolveNickname(uid);

    try {
      const decodedPayload = JSON.parse(decodeBase64(encodedPayload));
      if (decodedPayload?.expiration) {
        expiration = decodedPayload.expiration;
      }
      if (decodedPayload?.money !== undefined) {
        money = parseMoney(decodedPayload.money);
      }
      if (decodedPayload?.nickname) {
        nickname = resolveNickname(uid, decodedPayload.nickname);
      }
    } catch {
      // swallow decode errors and keep fallback values
    }

    return {
      uid,
      expiration,
      money,
      nickname,
    };
  });
}

function mergeStoredUsersWithBaseline(storedUsers, baselineUsers) {
  if (!Array.isArray(storedUsers) || storedUsers.length === 0) {
    return baselineUsers.map((user) => ({ ...user }));
  }

  const storedMap = new Map();
  storedUsers.forEach((user) => {
    if (!user || typeof user.uid !== 'string') {
      return;
    }
    storedMap.set(user.uid, {
      ...user,
      money: parseMoney(user.money),
      nickname: resolveNickname(user.uid, user.nickname),
    });
  });

  const merged = baselineUsers.map((user) => {
    const override = storedMap.get(user.uid);
    if (override) {
      storedMap.delete(user.uid);
      return {
        ...override,
        expiration: user.expiration,
        nickname: resolveNickname(user.uid, override.nickname ?? user.nickname),
        money: parseMoney(override.money ?? user.money),
      };
    }
    return {
      ...user,
      nickname: resolveNickname(user.uid, user.nickname),
    };
  });

  storedMap.forEach((user) => {
    merged.push({
      ...user,
      nickname: resolveNickname(user.uid, user.nickname),
    });
  });

  return merged;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [usersState, setUsersState] = useState(INITIAL_USERS);
  const [statusFilter, setStatusFilter] = useState('all');
  const [isDaysLeftDescending, setIsDaysLeftDescending] = useState(true);
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const isAuthenticated = localStorage.getItem(AUTH_STORAGE_KEY) === 'true';
    if (!isAuthenticated) {
      const redirectParam = encodeURIComponent('/admin');
      router.replace(`/admin/login?redirectTo=${redirectParam}`);
      setAuthChecked(true);
      return;
    }

    setIsAuthorized(true);
    setAuthChecked(true);

    try {
      const storedUsers = JSON.parse(localStorage.getItem(USER_STORAGE_KEY) || 'null');
      if (Array.isArray(storedUsers) && storedUsers.length) {
        setUsersState(mergeStoredUsersWithBaseline(storedUsers, INITIAL_USERS));
      }
    } catch (error) {
      console.warn('Failed to parse stored users', error);
    }
  }, [router]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(usersState));
  }, [usersState]);

  const users = useMemo(() => {
    const now = Date.now();
    return usersState.map((user) => {
      const expirationDate = new Date(user.expiration);
      const expirationTime = expirationDate.getTime();
      const isValidExpiration = !Number.isNaN(expirationTime);
      const isExpired = isValidExpiration ? expirationTime < now : false;
      const daysLeft = isValidExpiration
        ? Math.max(0, Math.ceil((expirationTime - now) / (1000 * 60 * 60 * 24)))
        : 0;
      const isVip = daysLeft > 1000;
      const nickname = resolveNickname(user.uid, user.nickname);
      return {
        ...user,
        nickname,
        expirationDate,
        isValidExpiration,
        status: isExpired ? 'expired' : 'active',
        daysLeft,
        isVip,
        money: parseMoney(user.money),
      };
    });
  }, [usersState]);

  const filteredUsers = useMemo(() => {
    if (statusFilter === 'vip') {
      return users.filter((user) => user.isVip);
    }
    const nonVipUsers = users.filter((user) => !user.isVip);
    if (statusFilter === 'all') {
      return nonVipUsers;
    }
    return nonVipUsers.filter((user) => user.status === statusFilter);
  }, [statusFilter, users]);

  const sortedUsers = useMemo(() => {
    const compare = (a, b) => {
      const diff = (a.daysLeft ?? 0) - (b.daysLeft ?? 0);
      return isDaysLeftDescending ? -diff : diff;
    };
    return [...filteredUsers].sort(compare);
  }, [filteredUsers, isDaysLeftDescending]);

  const statusSummary = useMemo(() => {
    return users.reduce(
      (totals, user) => {
        if (!user.isVip) {
          totals[user.status] += 1;
        }
        return totals;
      },
      { active: 0, expired: 0 },
    );
  }, [users]);

  const handleLogout = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
    router.replace('/admin/login');
  }, [router]);

  if (!authChecked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-100">
        <div className="animate-pulse text-sm text-slate-400">Verifying access…</div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="relative min-h-screen bg-slate-950 pb-24 text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.12),transparent_55%),radial-gradient(circle_at_bottom_right,rgba(236,72,153,0.12),transparent_60%),linear-gradient(140deg,rgba(8,15,40,1),rgba(11,9,36,1),rgba(17,6,31,1))]" />
      <div className="relative mx-auto w-[min(94%,1080px)] px-4 pt-10">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="text-xs uppercase tracking-[0.6em] text-cyan-300/80">
              Admin Dashboard
            </span>
            <h1 className="mt-3 text-3xl font-semibold text-slate-50">Registered Users Overview</h1>
            <p className="mt-2 text-sm text-slate-300">
              Monitor active registrations, track expirations, and keep the roster up to date.
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="self-start rounded-full border border-white/15 bg-slate-900/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-200 transition-colors hover:bg-slate-900/90"
          >
            Log out
          </button>
        </header>

        <section className="mt-10 grid gap-6 lg:grid-cols-[2fr,1fr]">
          <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 backdrop-blur-md">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-50">Registered Users</h2>
                <p className="text-sm text-slate-400">
                  Active: {statusSummary.active} | Expired: {statusSummary.expired}
                </p>
              </div>
            </div>
            <div className="mt-6 grid gap-4 sm:hidden">
              {sortedUsers.map((user) => {
                const statusKey = user.isVip ? 'vip' : user.status;
                const statusClasses = STATUS_STYLES[statusKey];
                const daysLeftLabel =
                  user.daysLeft > 0
                    ? `${user.daysLeft} day${user.daysLeft === 1 ? '' : 's'}`
                    : 'Expired';
                const expirationLabel = formatExpirationDate(user.expirationDate);
                return (
                  <article
                    key={user.uid}
                    className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-sm text-slate-300"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <span className="block font-mono text-base font-semibold text-slate-100">
                          {user.uid}
                        </span>
                        <p className="mt-1 truncate text-sm font-semibold text-slate-200">
                          {user.nickname}
                        </p>
                      </div>
                      <span
                        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] ${statusClasses}`}
                      >
                        <span
                          className={`h-2 w-2 rounded-full ${
                            user.isVip
                              ? 'bg-blue-400'
                              : user.status === 'active'
                              ? 'bg-emerald-400'
                              : 'bg-rose-400'
                          }`}
                        />
                        {user.isVip ? 'VIP' : user.status}
                      </span>
                    </div>
                    <dl className="mt-3 space-y-2 text-xs text-slate-400">
                      <div className="flex items-center justify-between">
                        <dt className="uppercase tracking-[0.25em] text-slate-400">Days left</dt>
                        <dd className="text-sm font-semibold text-slate-100">{daysLeftLabel}</dd>
                      </div>
                      <div className="flex items-center justify-between">
                        <dt className="uppercase tracking-[0.25em] text-slate-400">Expires</dt>
                        <dd className="text-sm font-semibold text-slate-100">{expirationLabel}</dd>
                      </div>
                    </dl>
                  </article>
                );
              })}
            </div>

            <div className="hidden sm:mt-6 sm:block">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-white/5 text-left text-sm">
                  <thead className="text-xs uppercase tracking-[0.3em] text-slate-400">
                    <tr>
                      <th className="py-3 pr-4">UID</th>
                      <th className="py-3 pr-4">Nickname</th>
                      <th className="py-3 pr-4">
                        <button
                          type="button"
                          onClick={() => setIsDaysLeftDescending((previous) => !previous)}
                          className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-slate-300 transition-colors hover:text-slate-100"
                        >
                          Days Left
                          <span aria-hidden="true">{isDaysLeftDescending ? '↓' : '↑'}</span>
                        </button>
                      </th>
                      <th className="py-3 pr-4">
                        <button
                          type="button"
                          onClick={() =>
                            setStatusFilter((previous) => {
                              const currentIndex = STATUS_SEQUENCE.indexOf(previous);
                              const nextIndex = (currentIndex + 1) % STATUS_SEQUENCE.length;
                              return STATUS_SEQUENCE[nextIndex];
                            })
                          }
                          className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-slate-300 transition-colors hover:text-slate-100"
                        >
                          Status
                          {statusFilter !== 'all' && (
                            <span className="text-[10px] uppercase text-cyan-300">
                              (
                              {statusFilter === 'vip'
                                ? 'VIP'
                                : statusFilter}
                              )
                            </span>
                          )}
                        </button>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-sm">
                    {sortedUsers.map((user) => {
                      const daysLeftLabel =
                        user.daysLeft > 0
                          ? `${user.daysLeft} day${user.daysLeft === 1 ? '' : 's'}`
                          : 'Expired';
                      return (
                        <tr key={user.uid}>
                          <td className="py-4 pr-4 font-mono text-sm text-slate-100">{user.uid}</td>
                          <td className="py-4 pr-4 text-slate-100">{user.nickname}</td>
                          <td className="py-4 pr-4 text-slate-300">{daysLeftLabel}</td>
                          <td className="py-4 pr-4">
                            <span
                              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] ${
                                STATUS_STYLES[user.isVip ? 'vip' : user.status]
                              }`}
                            >
                              <span
                                className={`h-2 w-2 rounded-full ${
                                  user.isVip
                                    ? 'bg-blue-400'
                                    : user.status === 'active'
                                    ? 'bg-emerald-400'
                                    : 'bg-rose-400'
                                }`}
                              />
                              {user.isVip ? 'VIP' : user.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </section>
      </div>
    </div>
  );
}




