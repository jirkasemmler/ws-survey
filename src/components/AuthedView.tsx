'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { logout } from '@/app/actions/auth';
import SurveyForm from './SurveyForm';

type Props = {
  email: string;
};

export default function AuthedView({ email }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await logout();
      router.refresh();
    });
  };

  return (
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
          disabled={pending}
          className="ml-3 shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50"
        >
          {pending ? 'Odhlašuji…' : 'Odhlásit'}
        </button>
      </div>
      <SurveyForm />
    </>
  );
}
