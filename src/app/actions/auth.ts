'use server';

import { getSupabaseAdmin } from '@/lib/supabase-server';
import { clearSession, setSessionEmail } from '@/lib/session';

export type LoginResult = { ok: true } | { ok: false; error: string };

export async function loginWithEmail(email: string): Promise<LoginResult> {
  const normalized = email.trim().toLowerCase();
  if (!normalized) {
    return { ok: false, error: 'Zadej svůj email.' };
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('allowed_emails')
    .select('email')
    .eq('email', normalized)
    .maybeSingle();

  if (error) {
    return { ok: false, error: 'Chyba při ověření: ' + error.message };
  }
  if (!data) {
    return {
      ok: false,
      error: 'Tenhle email nemáme na seznamu účastníků. Napiš organizátorovi.',
    };
  }

  await setSessionEmail(normalized);
  return { ok: true };
}

export async function logout(): Promise<void> {
  await clearSession();
}
