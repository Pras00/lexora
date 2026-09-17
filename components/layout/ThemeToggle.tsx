'use client';

import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Selalu tampilkan tombol fisik bahkan sebelum mount agar tidak pernah kosong/hilang
  if (!mounted) {
    return (
      <button
        type="button"
        className="flex items-center justify-center w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-[var(--surface)] text-slate-500 shadow-xs cursor-pointer"
        aria-label="Ganti mode tema"
      >
        <Sun className="w-4 h-4 text-amber-500" />
      </button>
    );
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="flex items-center justify-center w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-[var(--surface)] hover:bg-slate-100 dark:hover:bg-slate-800 text-[var(--foreground)] transition-all shadow-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
      aria-label="Ganti mode tema"
      title={isDark ? 'Beralih ke mode terang' : 'Beralih ke mode gelap'}
    >
      {isDark ? (
        <Moon className="w-4 h-4 text-indigo-400 transition-all duration-300" />
      ) : (
        <Sun className="w-4 h-4 text-amber-500 transition-all duration-300" />
      )}
    </button>
  );
}
