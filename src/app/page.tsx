import AuthedView from '@/components/AuthedView';
import LoginForm from '@/components/LoginForm';
import { getSessionEmail } from '@/lib/session';

export default async function Home() {
  const email = await getSessionEmail();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero / header */}
      <header className="relative overflow-hidden border-b border-slate-100 bg-gradient-to-br from-teal-50 via-white to-cyan-50">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-teal-400 via-cyan-400 to-teal-500" />
        <div className="mx-auto max-w-4xl px-6 py-10 md:py-16">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-2 w-2 rounded-full bg-teal-500" />
            <span className="text-xs font-semibold uppercase tracking-widest text-teal-700">
              Hack Your Way 2026 — Product Vibe Coding masterclass
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
        {email ? <AuthedView email={email} /> : <LoginForm />}
      </main>

      <footer className="border-t border-slate-100 py-8">
        <div className="mx-auto max-w-4xl px-6 text-center text-xs text-slate-400">
          Vyplněním pomáháš přizpůsobit workshop tobě.
        </div>
      </footer>
    </div>
  );
}
