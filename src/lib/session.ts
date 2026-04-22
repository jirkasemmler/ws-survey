import 'server-only';
import { cookies } from 'next/headers';
import { getSupabaseAdmin } from './supabase-server';

const COOKIE_NAME = 'ws_survey_email';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

export async function setSessionEmail(email: string) {
  const cookieStore = await cookies();
  cookieStore.set({
    name: COOKIE_NAME,
    value: email,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getSessionEmail(): Promise<string | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(COOKIE_NAME);
  if (!cookie?.value) return null;

  const supabase = getSupabaseAdmin();
  const { data } = await supabase
    .from('allowed_emails')
    .select('email')
    .eq('email', cookie.value)
    .maybeSingle();

  return data ? cookie.value : null;
}
