'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';

type Props = {
  email: string;
};

const AI_OPTIONS = [
  { value: 'zkusil', label: 'Něco jsem zkusil/a' },
  { value: 'pravidelne', label: 'Pravidelně používám' },
  { value: 'denne', label: 'Používám denně, profi' },
];

const OS_OPTIONS = [
  { value: 'windows', label: 'Windows' },
  { value: 'mac', label: 'Mac' },
  { value: 'linux', label: 'Linux' },
];

export default function SurveyForm({ email }: Props) {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [existed, setExisted] = useState(false);
  const [q1, setQ1] = useState('');
  const [q2, setQ2] = useState('');
  const [q3, setQ3] = useState('');
  const [q4, setQ4] = useState('');
  const [q5NeedsHelp, setQ5NeedsHelp] = useState(false);
  const [q5Detail, setQ5Detail] = useState('');

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from('responses')
        .select('*')
        .eq('email', email)
        .maybeSingle();
      if (error) {
        setMessage('Chyba při načítání: ' + error.message);
      } else if (data) {
        setQ1(data.q1_expectation ?? '');
        setQ2(data.q2_ai_experience ?? '');
        setQ3(data.q3_app_idea ?? '');
        setQ4(data.q4_os ?? '');
        const help = data.q5_help_needed ?? '';
        if (help.trim() !== '') {
          setQ5NeedsHelp(true);
          setQ5Detail(help);
        }
        setExisted(true);
      }
      setLoading(false);
    };
    load();
  }, [email, supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    const payload = {
      email,
      q1_expectation: q1.trim() || null,
      q2_ai_experience: q2 || null,
      q3_app_idea: q3.trim() || null,
      q4_os: q4 || null,
      q5_help_needed: q5NeedsHelp ? q5Detail.trim() || null : null,
    };
    const { error } = await supabase
      .from('responses')
      .upsert(payload, { onConflict: 'email' });
    setSaving(false);
    if (error) {
      setMessage('Chyba při ukládání: ' + error.message);
      return;
    }
    setMessage(existed ? 'Odpovědi aktualizovány.' : 'Díky za vyplnění! Odpovědi uloženy.');
    setExisted(true);
  };

  if (loading) {
    return <p className="text-slate-500">Načítám odpovědi…</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {existed && (
        <div className="rounded border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-800">
          Už jsi dotazník vyplnil/a. Změny se po uložení přepíšou.
        </div>
      )}

      <div>
        <label htmlFor="q1" className="block text-sm font-medium mb-1">
          1. Jaké je tvé očekávání od workshopu?
        </label>
        <textarea
          id="q1"
          value={q1}
          onChange={(e) => setQ1(e.target.value)}
          rows={3}
          required
          className="w-full rounded border border-slate-300 px-3 py-2 text-base focus:border-slate-500 focus:outline-none"
        />
      </div>

      <fieldset>
        <legend className="block text-sm font-medium mb-2">
          2. Jakou zkušenost máš s AI-assisted vývojem (Claude Code, Cursor, Copilot...)?
        </legend>
        <div className="space-y-2">
          {AI_OPTIONS.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2">
              <input
                type="radio"
                name="q2"
                value={opt.value}
                checked={q2 === opt.value}
                onChange={(e) => setQ2(e.target.value)}
                required
                className="h-4 w-4"
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="q3" className="block text-sm font-medium mb-1">
          3. Máš nápad na appku, co si chceš odnést? Popiš max dvěma větami.
        </label>
        <textarea
          id="q3"
          value={q3}
          onChange={(e) => setQ3(e.target.value)}
          rows={2}
          required
          className="w-full rounded border border-slate-300 px-3 py-2 text-base focus:border-slate-500 focus:outline-none"
        />
      </div>

      <fieldset>
        <legend className="block text-sm font-medium mb-2">4. Jaký máš OS?</legend>
        <div className="space-y-2">
          {OS_OPTIONS.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2">
              <input
                type="radio"
                name="q4"
                value={opt.value}
                checked={q4 === opt.value}
                onChange={(e) => setQ4(e.target.value)}
                required
                className="h-4 w-4"
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="block text-sm font-medium mb-2">
          5. Budeš chtít pomoct s instalací nějakého toolu?
        </legend>
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="q5"
              checked={!q5NeedsHelp}
              onChange={() => {
                setQ5NeedsHelp(false);
                setQ5Detail('');
              }}
              className="h-4 w-4"
            />
            <span>Ne, v pohodě</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="q5"
              checked={q5NeedsHelp}
              onChange={() => setQ5NeedsHelp(true)}
              className="h-4 w-4"
            />
            <span>Ano — napíšu čeho a kdy se stavím</span>
          </label>
        </div>
        {q5NeedsHelp && (
          <textarea
            value={q5Detail}
            onChange={(e) => setQ5Detail(e.target.value)}
            rows={2}
            required
            placeholder="Co potřebuješ doinstalovat a kdy se stavíš?"
            className="mt-2 w-full rounded border border-slate-300 px-3 py-2 text-base focus:border-slate-500 focus:outline-none"
          />
        )}
      </fieldset>

      {message && (
        <div
          className={`rounded border px-3 py-2 text-sm ${
            message.startsWith('Chyba')
              ? 'border-red-200 bg-red-50 text-red-800'
              : 'border-green-200 bg-green-50 text-green-800'
          }`}
        >
          {message}
        </div>
      )}

      <button
        type="submit"
        disabled={saving}
        className="w-full rounded bg-slate-900 px-4 py-2 font-medium text-white hover:bg-slate-700 disabled:opacity-50"
      >
        {saving ? 'Ukládám…' : existed ? 'Uložit změny' : 'Odeslat odpovědi'}
      </button>
    </form>
  );
}
