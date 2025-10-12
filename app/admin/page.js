'use client';

import { Buffer } from 'buffer';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

const AUTH_STORAGE_KEY = 'ff-admin-authenticated';
const USER_STORAGE_KEY = 'ff-admin-users';
const DEFAULT_MONEY = 500;

const ENCODED_REGISTRY = {
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

const INITIAL_USERS = buildInitialUsersFromRegistry(ENCODED_REGISTRY);

const sleepyTrails = {
  info: ['aHR0cHM6Ly9hcGkuYWxsb3JpZ2lucy53aW4vcmF3P3VybD0='],
  infoPath: ['aHR0cDovLzIxNy4xNTQuMjM5LjIzOjEzOTg0L2luZm89'],
};

const DATE_FORMAT_OPTIONS = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
};

const STATUS_STYLES = {
  active: 'bg-emerald-500/15 text-emerald-200 border-emerald-400/40',
  expired: 'bg-rose-500/15 text-rose-200 border-rose-400/40',
};

function decodeBase64(value) {
  if (typeof window !== 'undefined' && typeof window.atob === 'function') {
    return window.atob(value);
  }
  return Buffer.from(value, 'base64').toString('utf-8');
}

const joinParts = (parts) => parts.map(decodeBase64).join('');

function parseMoney(value) {
  const numeric = Number.parseInt(value, 10);
  return Number.isFinite(numeric) ? numeric : DEFAULT_MONEY;
}

function buildInitialUsersFromRegistry(registry) {
  if (!registry || typeof registry !== 'object') {
    return [];
  }

  return Object.entries(registry).map(([encodedUid, encodedPayload]) => {
    const uid = decodeBase64(encodedUid);
    let expiration = new Date().toISOString();
    let money = DEFAULT_MONEY;

    try {
      const decodedPayload = JSON.parse(decodeBase64(encodedPayload));
      if (decodedPayload?.expiration) {
        expiration = decodedPayload.expiration;
      }
      if (decodedPayload?.money !== undefined) {
        money = parseMoney(decodedPayload.money);
      }
    } catch {
      // swallow decode errors and keep fallback values
    }

    return {
      uid,
      expiration,
      money,
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
    });
  });

  const merged = baselineUsers.map((user) => {
    const override = storedMap.get(user.uid);
    if (override) {
      storedMap.delete(user.uid);
      return { ...user, ...override };
    }
    return { ...user };
  });

  storedMap.forEach((user) => {
    merged.push({ ...user });
  });

  return merged;
}

function formatExpiration(expiration) {
  const date = new Date(expiration);
  if (Number.isNaN(date.getTime())) {
    return 'Unknown';
  }
  return date.toLocaleString('en-US', DATE_FORMAT_OPTIONS);
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [usersState, setUsersState] = useState(INITIAL_USERS);
  const [newUid, setNewUid] = useState('');
  const [newDays, setNewDays] = useState('');
  const [newMoney, setNewMoney] = useState(String(DEFAULT_MONEY));
  const [formError, setFormError] = useState('');
  const [profileStats, setProfileStats] = useState({});
  const [profileFetchError, setProfileFetchError] = useState('');
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [isDaysLeftDescending, setIsDaysLeftDescending] = useState(true);

  const infoEndpoint = useMemo(() => joinParts(sleepyTrails.info), []);
  const infoPath = useMemo(() => joinParts(sleepyTrails.infoPath), []);

  const buildInfoUrl = useCallback(
    (id) => `${infoEndpoint}${encodeURIComponent(`${infoPath}${id}`)}`,
    [infoEndpoint, infoPath],
  );

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

  const fetchProfileStats = useCallback(
    async (uid) => {
      let lastError;
      for (let attempt = 0; attempt < 2; attempt += 1) {
        try {
          const response = await fetch(buildInfoUrl(uid));
          if (!response.ok) {
            throw new Error(`Profile API responded with status ${response.status}`);
          }
          const data = await response.json();
          const likes = Number(data?.basicInfo?.liked);
          const nickname = data?.basicInfo?.nickname;
          const levelValue = Number(data?.basicInfo?.level);
          return {
            likes: Number.isFinite(likes) ? likes : null,
            likesBefore: null,
            nickname: typeof nickname === 'string' && nickname.trim() ? nickname : 'Unknown',
            level: Number.isFinite(levelValue) ? levelValue : null,
          };
        } catch (error) {
          lastError = error;
          await new Promise((resolve) => setTimeout(resolve, 350));
        }
      }
      throw lastError instanceof Error ? lastError : new Error('Failed to load profile.');
    },
    [buildInfoUrl],
  );

  useEffect(() => {
    if (!usersState.length) {
      setProfileStats({});
      return;
    }

    let ignore = false;

    setProfileFetchError('');
    setIsProfileLoading(true);
    setProfileStats((prev) => {
      const next = {};
      usersState.forEach(({ uid }) => {
        next[uid] = { ...prev[uid], loading: true, error: undefined };
      });
      return next;
    });

    async function loadProfiles() {
      try {
        const results = [];
        for (const { uid } of usersState) {
          if (ignore) {
            return;
          }
          try {
            const stats = await fetchProfileStats(uid);
            results.push([uid, { ...stats, loading: false }]);
          } catch (error) {
            results.push([
              uid,
              {
                likes: null,
                likesBefore: null,
                loading: false,
                error:
                  error instanceof Error
                    ? error.message
                    : 'Unable to fetch profile data.',
              },
            ]);
          }
        }

        if (ignore) {
          return;
        }

        const resultsMap = Object.fromEntries(results);
        const next = {};
        usersState.forEach(({ uid }) => {
          next[uid] = resultsMap[uid] ?? { likes: null, likesBefore: null, loading: false };
        });
        setProfileStats(next);
        setIsProfileLoading(false);
      } catch (error) {
        if (!ignore) {
          setProfileFetchError(
            error instanceof Error ? error.message : 'Unable to load profile data.',
          );
          setIsProfileLoading(false);
        }
      }
    }

    loadProfiles();

    return () => {
      ignore = true;
    };
  }, [usersState, fetchProfileStats]);

  const refreshProfile = useCallback(
    async (uid) => {
      setProfileStats((prev) => ({
        ...prev,
        [uid]: { ...prev[uid], loading: true, error: undefined },
      }));
      try {
        const stats = await fetchProfileStats(uid);
        setProfileStats((prev) => ({
          ...prev,
          [uid]: { ...stats, loading: false },
        }));
      } catch (error) {
        setProfileStats((prev) => ({
          ...prev,
          [uid]: {
            ...prev[uid],
            loading: false,
            error:
              error instanceof Error ? error.message : 'Unable to refresh profile data.',
          },
        }));
      }
    },
    [fetchProfileStats],
  );

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
      const profile = profileStats[user.uid];
      return {
        ...user,
        profile,
        expirationDate,
        status: isExpired ? 'expired' : 'active',
        daysLeft,
        money: parseMoney(user.money),
      };
    });
  }, [profileStats, usersState]);

  const filteredUsers = useMemo(() => {
    if (statusFilter === 'all') {
      return users;
    }
    return users.filter((user) => user.status === statusFilter);
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
        totals[user.status] += 1;
        return totals;
      },
      { active: 0, expired: 0 },
    );
  }, [users]);

  const handleRegisterUser = useCallback(
    (event) => {
      event.preventDefault();
      setFormError('');

      const trimmedUid = newUid.trim();
      if (!trimmedUid) {
        setFormError('Enter a UID before registering.');
        return;
      }
      if (!/^\d+$/.test(trimmedUid) || trimmedUid.length < 8 || trimmedUid.length > 11) {
        setFormError('UID must be 8-11 digits.');
        return;
      }
      if (usersState.some((user) => user.uid === trimmedUid)) {
        setFormError('This UID is already registered.');
        return;
      }

      const daysNumber = Number.parseInt(newDays, 10);
      if (Number.isNaN(daysNumber) || daysNumber <= 0) {
        setFormError('Provide a valid number of days (greater than 0).');
        return;
      }

      const moneyNumber = parseMoney(newMoney || String(DEFAULT_MONEY));
      if (moneyNumber < 0) {
        setFormError('Money should be a positive number.');
        return;
      }

      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + daysNumber);

      setUsersState((previous) => [
        ...previous,
        {
          uid: trimmedUid,
          expiration: expirationDate.toISOString(),
          money: moneyNumber,
        },
      ]);
      setNewUid('');
      setNewDays('');
      setNewMoney(String(DEFAULT_MONEY));
    },
    [newDays, newMoney, newUid, usersState],
  );

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
              Monitor active registrations, track expirations, and sync likes directly from the
              profile service.
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
                  Active: {statusSummary.active} · Expired: {statusSummary.expired}
                </p>
              </div>
              {isProfileLoading && (
                <span className="text-xs uppercase tracking-[0.3em] text-slate-400">
                  Syncing likes…
                </span>
              )}
            </div>

            <form
              onSubmit={handleRegisterUser}
              className="mt-6 grid gap-4 rounded-2xl border border-white/10 bg-slate-950/50 p-5 sm:grid-cols-[2fr,1fr,1fr,auto] sm:items-end"
            >
              <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-slate-300">
                UID
                <input
                  type="tel"
                  inputMode="numeric"
                  pattern="\d*"
                  value={newUid}
                  onChange={(event) => setNewUid(event.target.value.replace(/\D/g, '').slice(0, 11))}
                  placeholder="Digits only"
                  className="rounded-xl border border-white/10 bg-slate-900/70 px-4 py-2 text-sm font-medium text-slate-100 placeholder:text-slate-500 focus:border-cyan-400/60 focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
                  autoComplete="off"
                />
              </label>
              <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-slate-300">
                Days
                <input
                  type="number"
                  min={1}
                  value={newDays}
                  onChange={(event) =>
                    setNewDays(event.target.value.replace(/\D/g, '').slice(0, 3))
                  }
                  placeholder="30"
                  className="rounded-xl border border-white/10 bg-slate-900/70 px-4 py-2 text-sm font-medium text-slate-100 placeholder:text-slate-500 focus:border-cyan-400/60 focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
                />
              </label>
              <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-slate-300">
                Money (LKR)
                <input
                  type="number"
                  min={0}
                  value={newMoney}
                  onChange={(event) =>
                    setNewMoney(event.target.value.replace(/\D/g, '').slice(0, 6))
                  }
                  placeholder={String(DEFAULT_MONEY)}
                  className="rounded-xl border border-white/10 bg-slate-900/70 px-4 py-2 text-sm font-medium text-slate-100 placeholder:text-slate-500 focus:border-cyan-400/60 focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
                />
              </label>
              <button
                type="submit"
                className="h-12 rounded-full border border-cyan-400/60 bg-cyan-500/15 px-6 text-xs font-semibold uppercase tracking-[0.3em] text-cyan-100 transition-colors hover:bg-cyan-500/25"
              >
                Register
              </button>
              {formError && (
                <p className="text-xs text-rose-300 sm:col-span-4">{formError}</p>
              )}
            </form>

            {profileFetchError && (
              <p className="mt-4 rounded-xl border border-rose-500/50 bg-rose-500/10 px-4 py-3 text-xs text-rose-200">
                {profileFetchError}
              </p>
            )}

            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full divide-y divide-white/5 text-left text-sm">
                <thead className="text-xs uppercase tracking-[0.3em] text-slate-400">
                  <tr>
                    <th className="py-3 pr-4">UID</th>
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
                          setStatusFilter((previous) =>
                            previous === 'all' ? 'active' : previous === 'active' ? 'expired' : 'all',
                          )
                        }
                        className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-slate-300 transition-colors hover:text-slate-100"
                      >
                        Status
                        {statusFilter !== 'all' && (
                          <span className="text-[10px] uppercase text-cyan-300">({statusFilter})</span>
                        )}
                      </button>
                    </th>
                    <th className="py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {sortedUsers.map((user) => {
                    const profile = user.profile || {};
                    const isLoading = profile.loading;
                    const daysLeftLabel =
                      user.daysLeft > 0
                        ? `${user.daysLeft} day${user.daysLeft === 1 ? '' : 's'}`
                        : 'Expired';
                    return (
                      <tr key={user.uid}>
                        <td className="py-4 pr-4 font-mono text-sm text-slate-100">{user.uid}</td>
                        <td className="py-4 pr-4 text-slate-300">{daysLeftLabel}</td>
                        <td className="py-4 pr-4">
                          <span
                            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] ${
                              STATUS_STYLES[user.status]
                            }`}
                          >
                            <span
                              className={`h-2 w-2 rounded-full ${
                                user.status === 'active' ? 'bg-emerald-400' : 'bg-rose-400'
                              }`}
                            />
                            {user.status}
                          </span>
                        </td>
                        <td className="py-4">
                          <div className="flex flex-col gap-2">
                            <button
                              type="button"
                              className="rounded-full border border-white/15 bg-slate-900/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] text-slate-200 transition-colors hover:bg-slate-800/90 disabled:cursor-not-allowed disabled:opacity-60"
                              onClick={() => refreshProfile(user.uid)}
                              disabled={isLoading}
                            >
                              Refresh
                            </button>
                            {profile.error && (
                              <span className="text-[10px] uppercase tracking-[0.25em] text-rose-300">
                                {profile.error}
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </section>
      </div>
    </div>
  );
}

