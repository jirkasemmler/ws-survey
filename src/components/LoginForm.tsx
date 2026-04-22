'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase';

type Props = {
  onLogin: (email: string) => void;
};

export default function LoginForm({ onLogin }: Props) {
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const normalized = email.trim().toLowerCase();
    if (!normalized) {
      setError('Zadej svůj email.');
      return;
    }
    setChecking(true);
    setError(null);
    const { data, error: queryError } = await supabase
      .from('allowed_emails')
      .select('email')
      .eq('email', normalized)
      .maybeSingle();
    setChecking(false);
    if (queryError) {
      setError('Chyba při ověření: ' + queryError.message);
      return;
    }
    if (!data) {
      setError('Tento email není na seznamu účastníků workshopu.');
      return;
    }
    onLogin(normalized);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          Tvůj email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
          disabled={checking}
          placeholder="jmeno@firma.cz"
          className="w-full rounded border border-slate-300 px-3 py-2 text-base focus:border-slate-500 focus:outline-none disabled:opacity-50"
        />
        <p className="mt-1 text-sm text-slate-500">
          Pustíme tě jen pokud jsi na seznamu účastníků.
        </p>
      </div>

      {error && (
        <div className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={checking}
        className="w-full rounded bg-slate-900 px-4 py-2 font-medium text-white hover:bg-slate-700 disabled:opacity-50"
      >
        {checking ? 'Ověřuji…' : 'Pokračovat'}
      </button>
    </form>
  );
}
