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

  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      className="relative flex items-center justify-center w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-[var(--surface)] hover:bg-slate-100 dark:hover:bg-slate-800 text-[var(--foreground)] transition-all duration-200 shadow-xs hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer overflow-hidden"
      aria-label="Ganti mode tema"
      title={mounted && resolvedTheme === 'dark' ? 'Beralih ke mode terang' : 'Beralih ke mode gelap'}
    >
      {/* Ikon Matahari: berputar dan mengecil saat berganti ke dark mode */}
      <Sun className="w-4 h-4 text-amber-500 transition-all duration-500 ease-out transform rotate-0 scale-100 opacity-100 dark:-rotate-90 dark:scale-0 dark:opacity-0" />

      {/* Ikon Bulan: berputar masuk dan membesar saat berganti ke dark mode */}
      <Moon className="absolute w-4 h-4 text-indigo-400 transition-all duration-500 ease-out transform rotate-90 scale-0 opacity-0 dark:rotate-0 dark:scale-100 dark:opacity-100" />
    </button>
  );
}
