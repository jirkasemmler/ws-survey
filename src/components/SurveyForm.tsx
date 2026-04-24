'use client';

import { useEffect, useState, useTransition } from 'react';
import { getMyResponse, saveResponse } from '@/app/actions/responses';

const AI_OPTIONS = [
  { value: 'zkusil', label: 'Něco jsem zkusil/a', hint: 'Občas si něco vyzkouším' },
  { value: 'pravidelne', label: 'Pravidelně používám', hint: 'Mám v workflow' },
  { value: 'denne', label: 'Používám denně, profi', hint: 'Je to můj hlavní tool' },
];

const OS_OPTIONS = [
  { value: 'windows', label: 'Windows' },
  { value: 'mac', label: 'Mac' },
  { value: 'linux', label: 'Linux' },
];

const CLAUDE_PREF_OPTIONS = [
  { value: 'cli', label: 'Claude CLI', hint: 'Claude Code v terminálu' },
  { value: 'desktop', label: 'Claude Desktop', hint: 'Desktop aplikace' },
];

const inputClass =
  'w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 disabled:opacity-50';

export default function SurveyForm() {
  const [loading, setLoading] = useState(true);
  const [saving, startSaving] = useTransition();
  const [message, setMessage] = useState<{ type: 'ok' | 'error'; text: string } | null>(null);
  const [existed, setExisted] = useState(false);
  const [q1, setQ1] = useState('');
  const [q2, setQ2] = useState('');
  const [q3, setQ3] = useState('');
  const [q4, setQ4] = useState('');
  const [q5NeedsHelp, setQ5NeedsHelp] = useState(false);
  const [q5Detail, setQ5Detail] = useState('');
  const [q6, setQ6] = useState('');

  useEffect(() => {
    let cancelled = false;
    getMyResponse().then((result) => {
      if (cancelled) return;
      if (!result.ok) {
        setMessage({ type: 'error', text: 'Chyba při načítání: ' + result.error });
      } else if (result.response) {
        const r = result.response;
        setQ1(r.q1_expectation ?? '');
        setQ2(r.q2_ai_experience ?? '');
        setQ3(r.q3_app_idea ?? '');
        setQ4(r.q4_os ?? '');
        const help = r.q5_help_needed ?? '';
        if (help.trim() !== '') {
          setQ5NeedsHelp(true);
          setQ5Detail(help);
        }
        setQ6(r.q6_claude_pref ?? '');
        setExisted(true);
      }
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    startSaving(async () => {
      const payload = {
        q1_expectation: q1.trim() || null,
        q2_ai_experience: q2 || null,
        q3_app_idea: q3.trim() || null,
        q4_os: q4 || null,
        q5_help_needed: q5NeedsHelp ? q5Detail.trim() || null : null,
        q6_claude_pref: q6 || null,
      };
      const result = await saveResponse(payload);
      if (!result.ok) {
        setMessage({ type: 'error', text: 'Chyba při ukládání: ' + result.error });
        return;
      }
      setMessage({
        type: 'ok',
        text: result.existed
          ? 'Odpovědi aktualizovány. Díky!'
          : 'Díky za vyplnění! Odpovědi uloženy.',
      });
      setExisted(true);
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-12 shadow-sm">
        <div className="flex items-center gap-3 text-slate-500">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-teal-500" />
          Načítám tvé odpovědi…
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {message && (
        <div
          className={`flex gap-2 rounded-xl border px-4 py-3 text-sm ${
            message.type === 'error'
              ? 'border-red-200 bg-red-50 text-red-800'
              : 'border-teal-200 bg-teal-50 text-teal-800'
          }`}
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="mt-0.5 h-4 w-4 shrink-0" aria-hidden>
            {message.type === 'error' ? (
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm0-11a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 7Zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
                clipRule="evenodd"
              />
            ) : (
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z"
                clipRule="evenodd"
              />
            )}
          </svg>
          <span>{message.text}</span>
        </div>
      )}

      {existed && !message && (
        <div className="flex gap-2 rounded-xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm text-cyan-900">
          <svg viewBox="0 0 20 20" fill="currentColor" className="mt-0.5 h-4 w-4 shrink-0" aria-hidden>
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 2.066A1.75 1.75 0 0 0 10.747 15H11a.75.75 0 0 0 0-1.5h-.253a.25.25 0 0 1-.244-.304l.459-2.066A1.75 1.75 0 0 0 9.253 9H9Z"
              clipRule="evenodd"
            />
          </svg>
          <span>Už jsi dotazník vyplnil/a. Můžeš odpovědi upravit — uložení je přepíše.</span>
        </div>
      )}

      <Card index={1} title="Jaké je tvé očekávání od workshopu?" type="freetext">
        <textarea
          value={q1}
          onChange={(e) => setQ1(e.target.value)}
          rows={3}
          required
          placeholder="Napiš, s čím přicházíš a co si chceš odnést…"
          className={inputClass}
        />
      </Card>

      <Card
        index={2}
        title="Jakou máš zkušenost s AI-assisted vývojem?"
        subtitle="Claude Code, Cursor, Copilot a podobně"
        type="volba"
      >
        <div className="space-y-2">
          {AI_OPTIONS.map((opt) => (
            <OptionRow
              key={opt.value}
              name="q2"
              value={opt.value}
              label={opt.label}
              hint={opt.hint}
              checked={q2 === opt.value}
              onChange={setQ2}
            />
          ))}
        </div>
      </Card>

      <Card
        index={3}
        title="Máš nápad na appku, co si chceš odnést?"
        subtitle="Popiš max dvěma větami"
        type="freetext"
      >
        <textarea
          value={q3}
          onChange={(e) => setQ3(e.target.value)}
          rows={2}
          required
          placeholder="Stručně co bys chtěl/a postavit…"
          className={inputClass}
        />
      </Card>

      <Card index={4} title="Jaký máš OS?" type="volba">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {OS_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className={`flex cursor-pointer items-center justify-center rounded-xl border px-4 py-3 text-sm font-medium transition ${
                q4 === opt.value
                  ? 'border-teal-500 bg-teal-50 text-teal-900 ring-2 ring-teal-500/20'
                  : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400'
              }`}
            >
              <input
                type="radio"
                name="q4"
                value={opt.value}
                checked={q4 === opt.value}
                onChange={(e) => setQ4(e.target.value)}
                required
                className="sr-only"
              />
              {opt.label}
            </label>
          ))}
        </div>
      </Card>

      <Card
        index={5}
        title="Budeš chtít pomoct s instalací nějakého toolu?"
        subtitle="Pokud ano, napiš čeho a kdy se stavíš"
        type="volba"
      >
        <div className="space-y-2">
          <OptionRow
            name="q5"
            value="no"
            label="Ne, v pohodě"
            checked={!q5NeedsHelp}
            onChange={() => {
              setQ5NeedsHelp(false);
              setQ5Detail('');
            }}
          />
          <OptionRow
            name="q5"
            value="yes"
            label="Ano — napíšu detaily"
            checked={q5NeedsHelp}
            onChange={() => setQ5NeedsHelp(true)}
          />
        </div>
        {q5NeedsHelp && (
          <textarea
            value={q5Detail}
            onChange={(e) => setQ5Detail(e.target.value)}
            rows={2}
            required
            placeholder="Např. Potřebuju Node.js a Git, stavím se v úterý v 17:00."
            className={`mt-3 ${inputClass}`}
          />
        )}
      </Card>

      <Card
        index={6}
        title="Preferuješ Claude CLI nebo Claude Desktop?"
        subtitle="Se kterou variantou chceš pracovat na workshopu"
        type="volba"
      >
        <div className="space-y-2">
          {CLAUDE_PREF_OPTIONS.map((opt) => (
            <OptionRow
              key={opt.value}
              name="q6"
              value={opt.value}
              label={opt.label}
              hint={opt.hint}
              checked={q6 === opt.value}
              onChange={setQ6}
            />
          ))}
        </div>
      </Card>

      <div className="sticky bottom-4 z-10 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 px-4 py-4 text-base font-semibold text-white shadow-lg shadow-teal-500/20 transition hover:from-teal-600 hover:to-cyan-600 hover:shadow-xl hover:shadow-teal-500/30 focus:outline-none focus:ring-2 focus:ring-teal-500/40 disabled:opacity-60"
        >
          {saving ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Ukládám…
            </>
          ) : existed ? (
            <>
              Uložit změny
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden>
                <path
                  fillRule="evenodd"
                  d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                  clipRule="evenodd"
                />
              </svg>
            </>
          ) : (
            <>
              Odeslat odpovědi
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden>
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 0 1 1.414 0l6 6a1 1 0 0 1 0 1.414l-6 6a1 1 0 0 1-1.414-1.414L14.586 11H3a1 1 0 1 1 0-2h11.586l-4.293-4.293a1 1 0 0 1 0-1.414Z"
                  clipRule="evenodd"
                />
              </svg>
            </>
          )}
        </button>
      </div>
    </form>
  );
}

type CardProps = {
  index: number;
  title: string;
  subtitle?: string;
  type: 'freetext' | 'volba';
  children: React.ReactNode;
};

function Card({ index, title, subtitle, type, children }: CardProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
      <div className="mb-4 flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 text-sm font-bold text-white shadow-sm">
          {index}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-bold text-slate-900 md:text-lg">{title}</h3>
          {subtitle && <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>}
        </div>
        <span className="shrink-0 rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
          {type}
        </span>
      </div>
      {children}
    </section>
  );
}

type OptionRowProps = {
  name: string;
  value: string;
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (value: string) => void;
};

function OptionRow({ name, value, label, hint, checked, onChange }: OptionRowProps) {
  return (
    <label
      className={`flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 transition ${
        checked
          ? 'border-teal-500 bg-teal-50 ring-2 ring-teal-500/20'
          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
      }`}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        required
        className="sr-only"
      />
      <span
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
          checked ? 'border-teal-500 bg-teal-500' : 'border-slate-300 bg-white'
        }`}
        aria-hidden
      >
        {checked && <span className="h-2 w-2 rounded-full bg-white" />}
      </span>
      <span className="min-w-0 flex-1">
        <span className={`block text-sm font-semibold ${checked ? 'text-teal-900' : 'text-slate-900'}`}>
          {label}
        </span>
        {hint && (
          <span className={`mt-0.5 block text-xs ${checked ? 'text-teal-700' : 'text-slate-500'}`}>
            {hint}
          </span>
        )}
      </span>
    </label>
  );
}
