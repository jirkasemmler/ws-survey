import Link from 'next/link';
import CommandBlock from '@/components/CommandBlock';

const COMMANDS = [
  'git clone git@github.com:jirkasemmler/prd-vibe-kit.git moje-appka',
  'cd moje-appka',
];

export const metadata = {
  title: 'Start — Workshop dotazník',
  description: 'Jak začít — naklonuj si workshop kit a začni stavět.',
};

export default function StartPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <header className="relative overflow-hidden border-b border-slate-100 bg-gradient-to-br from-teal-50 via-white to-cyan-50">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-teal-400 via-cyan-400 to-teal-500" />
        <div className="mx-auto max-w-4xl px-6 py-10 md:py-16">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-teal-700 hover:text-teal-900"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-3 w-3" aria-hidden>
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 0 1-1.414 0l-6-6a1 1 0 0 1 0-1.414l6-6a1 1 0 0 1 1.414 1.414L5.414 9H17a1 1 0 1 1 0 2H5.414l4.293 4.293a1 1 0 0 1 0 1.414Z"
                clipRule="evenodd"
              />
            </svg>
            Zpět na dotazník
          </Link>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-900 md:text-6xl">
            Začni{' '}
            <span className="bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent">
              stavět
            </span>
          </h1>
          <p className="mt-4 max-w-2xl text-base text-slate-600 md:text-lg">
            Pusť si terminál, naklonuj workshop kit a vlez do něj.{' '}
            <strong className="font-semibold text-slate-900">Hotovo za 30 sekund.</strong>
          </p>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-4xl px-6 py-10 md:py-16">
        {/* Step 1 */}
        <div className="mb-6">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 text-sm font-bold text-white shadow-sm">
              1
            </div>
            <h2 className="text-lg font-bold text-slate-900 md:text-xl">
              Spusť tyhle dva příkazy v terminálu
            </h2>
          </div>
          <p className="mb-4 ml-11 text-sm text-slate-600">
            Najeď myší na jakýkoliv řádek a klikni na ikonku schránky. Nebo zkopíruj
            oba najednou tlačítkem nahoře.
          </p>
        </div>

        <CommandBlock commands={COMMANDS} />

        {/* Step 2 */}
        <div className="mt-10">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 text-sm font-bold text-white shadow-sm">
              2
            </div>
            <h2 className="text-lg font-bold text-slate-900 md:text-xl">
              Otevři projekt v Claude Code
            </h2>
          </div>
          <div className="ml-11 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-700 md:text-base">
              V Claude Code napiš <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-sm text-teal-700">/hack-check</code>{' '}
              — agent ti ověří prerekvizity a založí ti vlastní GitHub repo.
            </p>
          </div>
        </div>

        {/* Tip */}
        <div className="mt-10 rounded-2xl border border-cyan-200 bg-gradient-to-br from-cyan-50 to-teal-50 p-5 md:p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-base shadow-sm">
              💡
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-bold text-cyan-900 md:text-base">
                Nepoužíváš SSH klíče u GitHubu?
              </h3>
              <p className="mt-1 text-sm text-cyan-900/80">
                Nahraď první příkaz HTTPS variantou:
              </p>
              <code className="mt-2 inline-block break-all rounded-md bg-white/70 px-3 py-1.5 font-mono text-xs text-slate-800 md:text-sm">
                git clone https://github.com/jirkasemmler/prd-vibe-kit.git moje-appka
              </code>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-100 py-8">
        <div className="mx-auto max-w-4xl px-6 text-center text-xs text-slate-400">
          Hack Your Way 2026 — Product Vibe Coding masterclass
        </div>
      </footer>
    </div>
  );
}
