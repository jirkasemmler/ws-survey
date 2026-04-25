'use client';

import { useState } from 'react';

type Props = {
  commands: string[];
};

export default function CommandBlock({ commands }: Props) {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const copy = async (text: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 1500);
    } catch {
      /* clipboard not available */
    }
  };

  const copyAll = async () => {
    try {
      await navigator.clipboard.writeText(commands.join('\n'));
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 1500);
    } catch {
      /* clipboard not available */
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl bg-slate-900 shadow-2xl shadow-slate-900/20 ring-1 ring-slate-800/50">
      {/* Title bar */}
      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/50 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-red-500/80" />
            <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
            <span className="h-3 w-3 rounded-full bg-green-500/80" />
          </div>
          <span className="hidden font-mono text-xs text-slate-400 sm:inline">terminál</span>
        </div>
        <button
          onClick={copyAll}
          className="inline-flex items-center gap-1.5 rounded-md border border-slate-700 bg-slate-800/60 px-2.5 py-1 text-xs font-medium text-slate-300 transition hover:border-teal-500/50 hover:bg-slate-800 hover:text-teal-300"
        >
          {copiedAll ? (
            <>
              <CheckIcon />
              Zkopírováno
            </>
          ) : (
            <>
              <ClipboardIcon />
              Zkopírovat vše
            </>
          )}
        </button>
      </div>

      {/* Body */}
      <div className="space-y-1 p-4 font-mono text-sm md:text-base">
        {commands.map((cmd, idx) => (
          <div
            key={idx}
            className="group flex items-center gap-3 rounded-lg px-2 py-2 transition hover:bg-slate-800/60"
          >
            <span className="select-none text-teal-400">$</span>
            <code className="flex-1 overflow-x-auto whitespace-nowrap text-slate-100">
              {cmd}
            </code>
            <button
              onClick={() => copy(cmd, idx)}
              aria-label="Zkopírovat příkaz"
              className="shrink-0 rounded-md p-1.5 text-slate-500 opacity-0 transition hover:bg-slate-700 hover:text-teal-300 focus:opacity-100 group-hover:opacity-100"
            >
              {copiedIdx === idx ? <CheckIcon className="text-teal-400" /> : <ClipboardIcon />}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ClipboardIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      className={`h-4 w-4 ${className}`}
      aria-hidden
    >
      <path
        fillRule="evenodd"
        d="M7.5 3.75A1.5 1.5 0 0 1 9 2.25h2A1.5 1.5 0 0 1 12.5 3.75v.75h2.25A2.25 2.25 0 0 1 17 6.75v9.5A2.25 2.25 0 0 1 14.75 18.5H5.25A2.25 2.25 0 0 1 3 16.25v-9.5A2.25 2.25 0 0 1 5.25 4.5H7.5v-.75ZM9 3.75h2v1.5H9v-1.5Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function CheckIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      className={`h-4 w-4 ${className}`}
      aria-hidden
    >
      <path
        fillRule="evenodd"
        d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
        clipRule="evenodd"
      />
    </svg>
  );
}
