'use client';

import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-xl border border-border bg-surface shadow-2xs" />
    );
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.88 }}
      whileHover={{ scale: 1.05 }}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="relative flex items-center justify-center w-9 h-9 rounded-xl border border-border bg-surface hover:bg-surface-secondary text-foreground transition-colors duration-200 shadow-2xs hover:shadow-xs focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer overflow-hidden group"
      aria-label={isDark ? 'Beralih ke mode terang' : 'Beralih ke mode gelap'}
      title={isDark ? 'Beralih ke mode terang' : 'Beralih ke mode gelap'}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.div
            key="moon"
            initial={{ scale: 0.3, rotate: -75, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0.3, rotate: 75, opacity: 0 }}
            transition={{
              type: 'spring',
              stiffness: 380,
              damping: 22,
            }}
            className="flex items-center justify-center"
          >
            <Moon className="w-4 h-4 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ scale: 0.3, rotate: 75, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0.3, rotate: -75, opacity: 0 }}
            transition={{
              type: 'spring',
              stiffness: 380,
              damping: 22,
            }}
            className="flex items-center justify-center"
          >
            <Sun className="w-4 h-4 text-amber-500 group-hover:text-amber-600 transition-colors" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
