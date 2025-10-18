'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const GLITCH_MESSAGES = [
  'You entered the wrong code...',
  'Unauthorized tunnel detected.',
  'We are watching you.',
  'No shortcuts this way.',
  'Security breach attempt logged.',
  'We’re going to punish you... hahaha!',
  'Sit tight while we decide your fate.',
  'Did you think it would be that easy?',
  'Bad code. Worse consequences.',
  'Access denied. Try fear instead.',
  'You poked the wrong bear...',
];

const spawnLifetime = () => 900 + Math.random() * 1600;
const randomBetween = (min, max) => min + Math.random() * (max - min);

export default function RecoveryChamber() {
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [showForgive, setShowForgive] = useState(false);

  useEffect(() => {
    const reinforce = () => {
      try {
        history.pushState(null, '', window.location.href);
      } catch {
        // noop
      }
    };
    reinforce();
    window.addEventListener('popstate', reinforce);
    return () => window.removeEventListener('popstate', reinforce);
  }, []);

  useEffect(() => {
    const blockKeys = (event) => {
      if (['Escape', 'F5', 'F11'].includes(event.key)) {
        event.preventDefault();
      }
    };
    window.addEventListener('keydown', blockKeys);
    return () => window.removeEventListener('keydown', blockKeys);
  }, []);

  useEffect(() => {
    let active = true;
    const emitMessage = () => {
      if (!active) return;
      const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      const text = GLITCH_MESSAGES[Math.floor(Math.random() * GLITCH_MESSAGES.length)];
      const top = randomBetween(12, 82);
      const left = randomBetween(10, 90);
      const rotate = randomBetween(-18, 18);
      setMessages((previous) => [
        ...previous.slice(-12),
        { id, text, top, left, rotate },
      ]);
      const lifespan = spawnLifetime();
      window.setTimeout(() => {
        setMessages((current) => current.filter((message) => message.id !== id));
      }, lifespan);
    };

    const initial = window.setTimeout(() => emitMessage(), 50);
    const interval = window.setInterval(() => emitMessage(), randomBetween(1200, 1900));
    return () => {
      active = false;
      window.clearTimeout(initial);
      window.clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => setShowForgive(true), 60_000);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black text-red-200">
      <div className="pointer-events-none absolute inset-0 animate-pulse bg-[radial-gradient(circle_at_center,rgba(255,0,0,0.12),transparent_65%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(180deg,rgba(255,255,255,0.03)_0px,rgba(255,255,255,0.03)_1px,transparent_1px,transparent_4px)] mix-blend-soft-light" />
      <div className="relative z-10 flex h-full w-full flex-col items-center justify-center gap-6 px-6 py-16">
        <div className="relative flex h-48 w-full max-w-3xl items-center justify-center">
          {messages.map((message) => (
            <span
              key={message.id}
              className="pointer-events-none select-none text-center text-xl font-semibold uppercase tracking-[0.35em] text-red-200/90 drop-shadow-[0_0_14px_rgba(255,0,0,0.5)] transition-opacity duration-300"
              style={{
                top: `${message.top}%`,
                left: `${message.left}%`,
                transform: `translate(-50%, -50%) rotate(${message.rotate}deg)`,
                position: 'absolute',
              }}
            >
              {message.text}
            </span>
          ))}
        </div>
        <p className="text-sm uppercase tracking-[0.5em] text-red-300/80">
          Unauthorized channel locked. Await judgement.
        </p>
        {showForgive ? (
          <button
            type="button"
            onClick={() => router.replace('/')}
            className="mt-12 inline-flex items-center justify-center rounded-full border border-red-500/60 bg-red-500/20 px-6 py-3 text-xs font-semibold uppercase tracking-[0.4em] text-red-100 transition-colors hover:bg-red-500/35"
          >
            We&apos;ll forgive you this time... hahahaha
          </button>
        ) : (
          <div className="mt-12 text-xs uppercase tracking-[0.5em] text-red-400">
            Punishment buffer: recalculating...
          </div>
        )}
      </div>
    </div>
  );
}
