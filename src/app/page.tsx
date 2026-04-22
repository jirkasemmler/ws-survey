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
    <main className="min-h-screen bg-slate-50 px-4 py-8 md:py-12">
      <div className="mx-auto max-w-xl">
        <header className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
            Workshop dotazník
          </h1>
          <p className="mt-1 text-slate-600 text-sm md:text-base">
            Krátký dotazník před workshopem — 5 otázek, max 5 minut.
          </p>
        </header>

        {email ? (
          <>
            <div className="mb-6 flex items-center justify-between rounded border border-slate-200 bg-white px-3 py-2">
              <span className="text-sm text-slate-700 truncate">
                Přihlášen/a jako <strong>{email}</strong>
              </span>
              <button
                onClick={handleLogout}
                className="ml-2 shrink-0 text-sm text-slate-600 underline hover:text-slate-900"
              >
                Odhlásit
              </button>
            </div>
            <SurveyForm email={email} />
          </>
        ) : (
          <LoginForm onLogin={handleLogin} />
        )}
      </div>
    </main>
  );
}
