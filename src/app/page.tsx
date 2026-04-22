'use client';

import { useEffect, useState } from 'react';
import LoginForm from '@/components/LoginForm';
import SurveyForm from '@/components/SurveyForm';

const STORAGE_KEY = 'ws-survey-email';

export default function Home() {
  const [email, setEmail] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setEmail(saved);
    setReady(true);
  }, []);

  const handleLogin = (loggedEmail: string) => {
    localStorage.setItem(STORAGE_KEY, loggedEmail);
    setEmail(loggedEmail);
  };

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setEmail(null);
  };

  if (!ready) return null;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero / header */}
      <header className="relative overflow-hidden border-b border-slate-100 bg-gradient-to-br from-teal-50 via-white to-cyan-50">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-teal-400 via-cyan-400 to-teal-500" />
        <div className="mx-auto max-w-4xl px-6 py-10 md:py-16">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-2 w-2 rounded-full bg-teal-500" />
            <span className="text-xs font-semibold uppercase tracking-widest text-teal-700">
              Hack Your Way 2026
            </span>
          </div>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-900 md:text-6xl">
            Workshop{' '}
            <span className="bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent">
              dotazník
            </span>
          </h1>
          <p className="mt-4 max-w-2xl text-base text-slate-600 md:text-lg">
            Pět rychlých otázek, ať víme, s čím přicházíš. Zabere to{' '}
            <strong className="font-semibold text-slate-900">maximálně 3 minuty</strong>.
          </p>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-2xl px-6 py-10 md:py-16">
        {email ? (
          <>
            <div className="mb-6 flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 text-xs font-bold text-white">
                  {email.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-slate-500">Přihlášen/a jako</p>
                  <p className="truncate text-sm font-medium text-slate-900">{email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="ml-3 shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              >
                Odhlásit
              </button>
            </div>
            <SurveyForm email={email} />
          </>
        ) : (
          <LoginForm onLogin={handleLogin} />
        )}
      </main>

      <footer className="border-t border-slate-100 py-8">
        <div className="mx-auto max-w-4xl px-6 text-center text-xs text-slate-400">
          Vyplněním pomáháš přizpůsobit workshop tobě.
        </div>
      </footer>
    </div>
  );
}
