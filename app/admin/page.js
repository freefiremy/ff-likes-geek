'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

const AUTH_STORAGE_KEY = 'ff-admin-authenticated';
const LIKES_STORAGE_KEY = 'ff-admin-likes';
const USER_STORAGE_KEY = 'ff-admin-users';

const INITIAL_USERS = [
  { uid: '753524839', expiration: '2025-11-12T00:00:00Z', money: 500 },
  { uid: '928342415', expiration: '2025-07-30T00:00:00Z', money: 500 },
  { uid: '365436696', expiration: '2025-08-31T19:41:00Z', money: 500 },
  { uid: '5145644786', expiration: '2025-09-07T00:00:00Z', money: 500 },
  { uid: '2607412181', expiration: '2025-10-20T00:00:00Z', money: 500 },
  { uid: '198773251', expiration: '2025-11-07T00:00:00Z', money: 500 },
  { uid: '2874290965', expiration: '2026-07-14T12:27:00-05:30', money: 500 },
  { uid: '2138418869', expiration: '2026-05-01T00:00:00Z', money: 500 },
  { uid: '1710884148', expiration: '2025-08-04T00:00:00Z', money: 500 },
  { uid: '1153186180', expiration: '2025-09-17T00:00:00Z', money: 500 },
];

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

function parseMoney(value) {
  const numeric = Number.parseInt(value, 10);
  return Number.isFinite(numeric) ? numeric : 500;
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
  const [likesByUid, setLikesByUid] = useState({});
  const [usersState, setUsersState] = useState(INITIAL_USERS);
  const [newUid, setNewUid] = useState('');
  const [newDays, setNewDays] = useState('');
  const [newMoney, setNewMoney] = useState('500');
  const [formError, setFormError] = useState('');

  const currencyFormatter = useMemo(
    () => new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR' }),
    [],
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
      const storedLikes = JSON.parse(localStorage.getItem(LIKES_STORAGE_KEY) || '{}');
      if (storedLikes && typeof storedLikes === 'object') {
        setLikesByUid(storedLikes);
      }
    } catch (error) {
      console.warn('Failed to parse stored likes', error);
    }

    try {
      const storedUsers = JSON.parse(localStorage.getItem(USER_STORAGE_KEY) || 'null');
      if (Array.isArray(storedUsers) && storedUsers.length) {
        setUsersState(
          storedUsers.map((user) => ({
            ...user,
            money: parseMoney(user.money),
          })),
        );
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
      const isExpired =
        Number.isNaN(expirationDate.getTime()) ? false : expirationDate.getTime() < now;
      const likeCount = likesByUid[user.uid] ?? 0;
      return {
        ...user,
        likeCount,
        expirationDate,
        status: isExpired ? 'expired' : 'active',
        money: parseMoney(user.money),
      };
    });
  }, [likesByUid, usersState]);

  const statusSummary = useMemo(() => {
    return users.reduce(
      (totals, user) => {
        totals[user.status] += 1;
        return totals;
      },
      { active: 0, expired: 0 },
    );
  }, [users]);

  const handleLike = useCallback((uid) => {
    setLikesByUid((previous) => {
      const nextLikes = {
        ...previous,
        [uid]: (previous?.[uid] ?? 0) + 1,
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem(LIKES_STORAGE_KEY, JSON.stringify(nextLikes));
      }
      return nextLikes;
    });
  }, []);

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

      const moneyNumber = parseMoney(newMoney || '500');
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
      setNewMoney('500');
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
              Monitor active registrations, track expirations, and record likes per user.
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
                  placeholder="500"
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

            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full divide-y divide-white/5 text-left text-sm">
                <thead className="text-xs uppercase tracking-[0.3em] text-slate-400">
                  <tr>
                    <th className="py-3 pr-4">UID</th>
                    <th className="py-3 pr-4">Expiration</th>
                    <th className="py-3 pr-4">Status</th>
                    <th className="py-3 pr-4">Money (LKR)</th>
                    <th className="py-3 pr-4">Likes</th>
                    <th className="py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {users.map((user) => (
                    <tr key={user.uid}>
                      <td className="py-4 pr-4 font-mono text-sm text-slate-100">{user.uid}</td>
                      <td className="py-4 pr-4 text-slate-300">{formatExpiration(user.expiration)}</td>
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
                      <td className="py-4 pr-4 font-mono text-sm text-slate-200">
                        {currencyFormatter.format(user.money ?? 500)}
                      </td>
                      <td className="py-4 pr-4 font-semibold text-slate-100">{user.likeCount}</td>
                      <td className="py-4">
                        <button
                          type="button"
                          className="rounded-full border border-cyan-400/60 bg-cyan-500/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] text-cyan-100 transition-colors hover:bg-cyan-500/25"
                          onClick={() => handleLike(user.uid)}
                        >
                          Like
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <aside className="flex flex-col gap-6">
            <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 backdrop-blur-md">
              <h2 className="text-lg font-semibold text-slate-50">Status Chart</h2>
              <p className="mt-1 text-sm text-slate-400">
                Each bar represents a registered UID. Color indicates active vs expired status.
              </p>
              <div className="mt-6 flex h-48 items-end justify-between gap-2">
                {users.map((user) => (
                  <div key={user.uid} className="group flex w-full flex-col items-center gap-2">
                    <div
                      className={`relative flex w-full items-end justify-center rounded-t-full ${
                        user.status === 'active' ? 'bg-emerald-400/60' : 'bg-rose-400/60'
                      } transition-transform group-hover:scale-[1.05]`}
                      style={{ minHeight: '48px', height: `${Math.max(48, user.likeCount * 12 + 48)}px` }}
                      title={`UID ${user.uid} · ${user.status} · Likes ${user.likeCount}`}
                    >
                      <span className="mb-2 text-xs font-semibold text-slate-900">
                        {user.likeCount}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-slate-400">
                      {user.uid.slice(-4)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 text-sm text-slate-300 backdrop-blur-md">
              <h3 className="text-base font-semibold text-slate-50">Quick Actions</h3>
              <ul className="mt-4 space-y-2 text-xs leading-relaxed text-slate-400">
                <li>• Register new UIDs with duration and payment, defaults to LKR 500.</li>
                <li>• Click a UID’s Like button to record an additional like.</li>
                <li>• Status updates automatically once a registration expires.</li>
                <li>• Likes and registrations persist locally via secure browser storage.</li>
                <li>• Log out to clear dashboard access on this device.</li>
              </ul>
            </div>
          </aside>
        </section>
      </div>
    </div>
  );
}
