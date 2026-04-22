'use server';

import { getSupabaseAdmin } from '@/lib/supabase-server';
import { getSessionEmail } from '@/lib/session';

export type ResponseData = {
  q1_expectation: string | null;
  q2_ai_experience: string | null;
  q3_app_idea: string | null;
  q4_os: string | null;
  q5_help_needed: string | null;
};

export type LoadResult =
  | { ok: true; response: ResponseData | null }
  | { ok: false; error: string };

export type SaveResult =
  | { ok: true; existed: boolean }
  | { ok: false; error: string };

export async function getMyResponse(): Promise<LoadResult> {
  const email = await getSessionEmail();
  if (!email) return { ok: false, error: 'Nejsi přihlášen/a.' };

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('responses')
    .select('q1_expectation, q2_ai_experience, q3_app_idea, q4_os, q5_help_needed')
    .eq('email', email)
    .maybeSingle();

  if (error) return { ok: false, error: error.message };
  return { ok: true, response: data ?? null };
}

export async function saveResponse(payload: ResponseData): Promise<SaveResult> {
  const email = await getSessionEmail();
  if (!email) return { ok: false, error: 'Nejsi přihlášen/a.' };

  const supabase = getSupabaseAdmin();

  const { data: existing } = await supabase
    .from('responses')
    .select('id')
    .eq('email', email)
    .maybeSingle();

  const { error } = await supabase
    .from('responses')
    .upsert({ ...payload, email }, { onConflict: 'email' });

  if (error) return { ok: false, error: error.message };
  return { ok: true, existed: !!existing };
}
