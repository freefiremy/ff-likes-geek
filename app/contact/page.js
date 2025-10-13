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
          <h2 className="text-lg font-semibold text-slate-100">
            Boost Your Presence with Our Exclusive Like Packages
          </h2>
          <p className="mt-3 text-sm leading-relaxed">
            Unlock the potential to grow your social influence with our affordable and flexible Like
            packages. Choose a package that suits your needs and see how much you can save compared
            to regular rates. Plus, enjoy a money-back guarantee to ensure your satisfaction!
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {[
              {
                name: 'Starter Spark',
                price: 'Rs. 500',
                likes: '3,000',
                savings: '[insert %]',
                blurb: 'Perfect for getting started!',
              },
              {
                name: 'Growth Accelerator',
                price: 'Rs. 1,500',
                likes: '10,000',
                savings: '[insert %]',
                blurb: 'Ideal for businesses or influencers looking to accelerate engagement.',
              },
              {
                name: 'Momentum Builder',
                price: 'Rs. 2,000',
                likes: '15,000',
                savings: '[insert %]',
                blurb: 'A powerful boost for long-term growth.',
              },
              {
                name: 'Power Surge',
                price: 'Rs. 4,000',
                likes: '37,000',
                savings: '[insert %]',
                blurb: 'For the serious influencer ready to dominate their niche.',
              },
            ].map((pkg) => (
              <article
                key={pkg.name}
                className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 text-slate-200"
              >
                <h3 className="text-base font-semibold text-slate-50">{pkg.name}</h3>
                <p className="mt-2 text-sm text-cyan-200">Price: {pkg.price}</p>
                <p className="text-sm text-cyan-200">Likes: {pkg.likes}</p>
                <p className="text-sm text-cyan-300">Save: {pkg.savings} off regular rates</p>
                <p className="mt-2 text-xs text-slate-300">{pkg.blurb}</p>
              </article>
            ))}
          </div>

          <div className="mt-6 grid gap-3 rounded-2xl border border-white/10 bg-slate-950/50 p-5">
            <h3 className="text-base font-semibold text-slate-100">Why Choose Us?</h3>
            <ul className="space-y-2 text-sm leading-relaxed text-slate-300">
              <li>
                <strong className="text-slate-100">Money-Back Guarantee:</strong> If you’re not
                satisfied with our services, you’ll get your money back—no questions asked.
              </li>
              <li>
                <strong className="text-slate-100">Reliable &amp; Fast Delivery:</strong> Get the
                likes you need quickly, with no delays.
              </li>
              <li>
                <strong className="text-slate-100">Save More:</strong> With each tier, you’re
                getting better value and a higher number of likes at a much lower cost than the
                regular market rate.
              </li>
              <li>
                <strong className="text-slate-100">Transparency:</strong> You can always see how
                much you’re saving compared to standard rates.
              </li>
            </ul>
            <p className="text-xs text-slate-400">
              Want to know which package is best for you? Reach out via WhatsApp and we’ll help you
              choose the perfect fit.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
