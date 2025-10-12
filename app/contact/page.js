'use client';

import Link from 'next/link';

const CONTACT_CHANNELS = [
  {
    label: 'WhatsApp',
    href: "https://wa.me/94701974205?text=I'm%20interested%20in%20the%20Like%20Access%20package!",
    description: 'Fastest way to reach the GEEKS FF support team for renewals and onboarding.',
    className:
      'border-emerald-400/60 bg-emerald-500/15 text-emerald-100 hover:bg-emerald-500/25',
  },
  {
    label: 'TikTok',
    href: 'https://www.tiktok.com/@geek_slc',
    description: 'Community updates, daily progress, and highlight clips.',
    className: 'border-pink-500/60 bg-pink-500/15 text-pink-100 hover:bg-pink-500/25',
  },
  {
    label: 'YouTube',
    href: 'https://youtube.com/@geekbgaming?si=fcsKXpWY4Wd5Tnjj',
    description: 'Long-form content, tutorials, and event breakdowns.',
    className: 'border-red-500/60 bg-red-500/15 text-red-100 hover:bg-red-500/25',
  },
];

export default function ContactPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.12),transparent_55%),radial-gradient(circle_at_bottom_right,rgba(236,72,153,0.12),transparent_60%),linear-gradient(140deg,rgba(8,15,40,1),rgba(11,9,36,1),rgba(17,6,31,1))]" />
      <div className="pointer-events-none absolute -left-32 top-24 h-72 w-72 rounded-full bg-cyan-400/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-12 h-64 w-64 rounded-full bg-fuchsia-500/30 blur-3xl" />

      <main className="relative mx-auto flex w-full max-w-4xl flex-col gap-10 px-4 pb-32 pt-28">
        <header className="text-center">
          <span className="text-xs uppercase tracking-[0.6em] text-cyan-300/80">Support hub</span>
          <h1 className="mt-6 text-4xl font-semibold leading-tight text-slate-50 md:text-5xl">
            Connect with GEEKS FF
          </h1>
          <p className="mt-4 text-base text-slate-300 md:text-lg">
            Need help with your likes package, want to register a new UID, or have questions about
            availability? Reach out through any of the channels below—we respond quickly.
          </p>
        </header>

        <section className="grid gap-6 md:grid-cols-2">
          {CONTACT_CHANNELS.map((channel) => (
            <article
              key={channel.label}
              className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-md"
            >
              <h2 className="text-xl font-semibold text-slate-50">{channel.label}</h2>
              <p className="mt-3 text-sm text-slate-300">{channel.description}</p>
              <a
                href={channel.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`mt-6 inline-flex items-center justify-center rounded-full border px-5 py-2 text-sm font-semibold transition-colors ${channel.className}`}
              >
                Message on {channel.label}
              </a>
            </article>
          ))}
        </section>

        <section className="rounded-3xl border border-white/10 bg-slate-900/60 px-6 py-8 text-slate-300 backdrop-blur-md md:px-8">
          <h2 className="text-lg font-semibold text-slate-100">Need a quick refresher?</h2>
          <p className="mt-3 text-sm leading-relaxed">
            Registered players can check remaining days and like limits from the{' '}
            <Link href="/" className="text-cyan-300 hover:text-cyan-200">
              home dashboard
            </Link>
            . New players can use WhatsApp to share their UID and receive onboarding instructions in
            minutes.
          </p>
        </section>
      </main>
    </div>
  );
}
