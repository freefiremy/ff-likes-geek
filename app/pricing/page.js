'use client';

import { useState } from 'react';

const CURRENCY_OPTIONS = [
  {
    id: 'USD',
    label: 'USD',
    format: (value) => `USD ${value}`,
  },
  {
    id: 'MYR',
    label: 'MYR',
    format: (value) => `RM ${value}`,
  },
  {
    id: 'LKR',
    label: 'LKR',
    format: (value) => `LKR ${value.toLocaleString('en-US')}`,
  },
];

const CURRENCY_LOOKUP = CURRENCY_OPTIONS.reduce((acc, option) => {
  acc[option.id] = option;
  return acc;
}, {});

const PLANS = [
  {
    name: 'Starter Spark',
    prices: { USD: 2, LKR: 500, MYR: 7 },
    days: 30,
    likes: 3000,
    savings: 'Standard rate package. Perfect for getting started!',
    description: 'Perfect for getting started!',
    target: 'Perfect for new Free Fire players who want an initial like boost.',
  },
  {
    name: 'Growth Accelerator',
    prices: { USD: 6, LKR: 1500, MYR: 21 },
    days: 100,
    likes: 10000,
    savings:
      'Save 10% compared to Starter Spark per-like rate. Share more daily likes than your crew and stay ahead.',
    description:
      'Ideal for Free Fire squads aiming to send daily likes and level up their fame.',
    target: 'For Free Fire duos and squads who want to deliver more likes every day.',
  },
  {
    name: 'Momentum Builder',
    prices: { USD: 8, LKR: 2000, MYR: 28 },
    days: 150,
    likes: 15000,
    savings:
      'Save 20% compared to Starter Spark per-like rate. Stack more daily likes and sustain your momentum.',
    description: 'A powerful boost for long-term growth.',
    target: 'Built for Free Fire players who want steady like streaks and legendary status.',
  },
  {
    name: 'Power Surge',
    prices: { USD: 16, LKR: 4000, MYR: 56 },
    days: 370,
    likes: 37000,
    savings:
      'Save 35% compared to Starter Spark per-like rate. For serious Free Fire grinders ready to outshine every leaderboard.',
    description:
      'For serious Free Fire grinders ready to outshine every leaderboard.',
    target: 'Designed for serious Free Fire grinders ready to dominate every season.',
  },
];

const FAQ_ITEMS = [
  {
    question: "What does 'likes' mean?",
    answer:
      'Likes represent engagement delivered to your profile. Each package guarantees genuine interactions that help your content gain visibility.',
  },
  {
    question: 'How do I upgrade my plan?',
    answer:
      'You can upgrade at any time by selecting a higher tier. Reach out to our support team and we will transition you with zero downtime.',
  },
  {
    question: 'Do you offer refunds?',
    answer:
      'Yes. Every package is covered by our money-back guarantee. If you are not satisfied, we will refund you.',
  },
];

const CheckIcon = () => (
  <svg
    className="h-4 w-4 text-blue-500"
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M16.707 5.293a1 1 0 010 1.414l-7.25 7.25a1 1 0 01-1.414 0l-3-3a1 1 0 111.414-1.414L8.5 11.086l6.543-6.543a1 1 0 011.414 0z"
      clipRule="evenodd"
    />
  </svg>
);

export default function PricingPage() {
  const [currency, setCurrency] = useState('USD');
  const currencyMeta = CURRENCY_LOOKUP[currency];

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.12),transparent_55%),radial-gradient(circle_at_bottom_right,rgba(236,72,153,0.12),transparent_60%),linear-gradient(140deg,rgba(8,15,40,1),rgba(11,9,36,1),rgba(17,6,31,1))]" />
      <div className="pointer-events-none absolute -left-36 top-24 h-72 w-72 rounded-full bg-blue-400/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-28 bottom-12 h-64 w-64 rounded-full bg-purple-500/30 blur-3xl" />

      <main className="relative mx-auto flex w-full max-w-6xl flex-col gap-16 px-4 pb-32 pt-24 md:px-8">
        <header className="text-center">
          <span className="text-xs uppercase tracking-[0.6em] text-blue-300/80">
            Pricing
          </span>
          <h1 className="mt-6 text-4xl font-semibold leading-tight text-slate-50 md:text-5xl">
            Choose Your Plan
          </h1>
          <p className="mt-4 text-base text-slate-300 md:text-lg">
            Boost your engagement with our tailored packages.
          </p>
        </header>

        <div className="flex flex-col items-center gap-3 text-xs uppercase tracking-[0.3em] text-slate-400 md:flex-row md:justify-center">
          <span>Select currency</span>
          <div className="flex gap-2">
            {CURRENCY_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setCurrency(option.id)}
                className={`rounded-full border px-4 py-1 text-[11px] font-semibold transition-colors ${
                  option.id === currency
                    ? 'border-blue-400/70 bg-blue-500/20 text-blue-100'
                    : 'border-white/15 bg-slate-900/70 text-slate-300 hover:bg-slate-900/90'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {PLANS.map((plan, index) => (
            <article
              key={plan.name}
              className="group flex h-full flex-col rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-lg backdrop-blur-md transition-transform duration-200 hover:-translate-y-2 hover:border-blue-400/60"
            >
              <header className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-50">
                  {plan.name}
                </h2>
                <span className="text-xs font-medium uppercase tracking-[0.3em] text-blue-300/90">
                  Plan {index + 1}
                </span>
              </header>
              <p className="mt-4 text-2xl font-semibold text-blue-300">
                {currencyMeta.format(plan.prices[currency])}
              </p>
              <p className="mt-1 text-sm text-slate-300">
                {plan.likes.toLocaleString('en-US')} likes / {plan.days} days
              </p>
              <ul className="mt-6 space-y-3 text-sm text-slate-200 flex-1">
                <li className="flex items-start gap-2">
                  <CheckIcon />
                  <span>{plan.description}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckIcon />
                  <span>{plan.savings}</span>
                </li>
              </ul>
              <button
                type="button"
                className="mt-8 inline-flex items-center justify-center rounded-full bg-blue-500 px-5 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300"
              >
                Get Started
              </button>
            </article>
          ))}
        </section>

        <section className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 backdrop-blur-md md:p-8">
          <h2 className="text-xl font-semibold text-slate-50 md:text-2xl">
            Compare Plans
          </h2>
          <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-white/10 text-left text-sm text-slate-200">
                <thead className="bg-slate-900/80 text-xs uppercase tracking-[0.3em] text-slate-400">
                  <tr>
                    <th className="px-4 py-3">Plan</th>
                    <th className="px-4 py-3">Price</th>
                    <th className="px-4 py-3">Likes</th>
                    <th className="px-4 py-3">Savings</th>
                    <th className="px-4 py-3">Best for</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 bg-slate-900/60">
                  {PLANS.map((plan) => (
                    <tr key={plan.name} className="transition-colors hover:bg-slate-900/80">
                      <td className="px-4 py-3 font-medium text-slate-50">{plan.name}</td>
                      <td className="px-4 py-3 text-blue-300">
                        {currencyMeta.format(plan.prices[currency])}
                      </td>
                      <td className="px-4 py-3">
                        {plan.likes.toLocaleString('en-US')} likes / {plan.days} days
                      </td>
                      <td className="px-4 py-3">{plan.savings}</td>
                      <td className="px-4 py-3 text-slate-300">{plan.target}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 backdrop-blur-md md:p-8">
          <h2 className="text-xl font-semibold text-slate-50 md:text-2xl">
            Frequently Asked Questions
          </h2>
          <dl className="mt-6 grid gap-6 md:grid-cols-2">
            {FAQ_ITEMS.map((item) => (
              <div key={item.question} className="rounded-2xl border border-white/10 bg-slate-950/60 p-5 text-sm text-slate-200">
                <dt className="font-semibold text-slate-50">{item.question}</dt>
                <dd className="mt-2 text-slate-300">{item.answer}</dd>
              </div>
            ))}
          </dl>
        </section>
      </main>
    </div>
  );
}






