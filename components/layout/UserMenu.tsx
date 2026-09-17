'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Bell, LogOut, Settings, ShieldCheck } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Profile } from '@/types';

interface UserMenuProps {
  user: {
    email?: string;
    profile?: Profile | null;
  };
}

export function UserMenu({ user }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const supabase = createClient();

  const fullName = user.profile?.full_name || 'Anggota Perpustakaan';
  const email = user.email || 'user@lexora.id';
  const role = user.profile?.role || 'member';

  // Inisial untuk avatar fallback
  const initials = fullName
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  // Tutup dropdown jika klik di luar
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setIsOpen(false);
    router.push('/login');
    router.refresh();
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-[var(--primary)] transition-all focus:outline-none"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="w-9 h-9 rounded-full bg-indigo-600 text-white font-medium text-sm flex items-center justify-center shadow-sm">
          {initials}
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute right-0 mt-2 w-64 rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-lg py-2 z-50 text-sm"
          >
            {/* Header info user */}
            <div className="px-4 py-3 border-b border-[var(--border)]">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-[var(--foreground)] truncate">{fullName}</p>
                {role === 'admin' && (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300">
                    <ShieldCheck className="w-3 h-3 mr-0.5" />
                    Admin
                  </span>
                )}
              </div>
              <p className="text-xs text-[var(--muted)] truncate mt-0.5">{email}</p>
              {user.profile?.member_number && (
                <p className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 mt-1">
                  No: {user.profile.member_number}
                </p>
              )}
            </div>

            {/* Menu item links */}
            <div className="py-1">
              <Link
                href="/profile"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2 text-[var(--foreground)] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Settings className="w-4 h-4 text-[var(--muted)]" />
                <span>Pengaturan Akun</span>
              </Link>
              <Link
                href="/dashboard"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2 text-[var(--foreground)] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Bell className="w-4 h-4 text-[var(--muted)]" />
                <span>Notifikasi</span>
              </Link>
            </div>

            {/* Tombol Logout (merah) */}
            <div className="pt-1 border-t border-[var(--border)]">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-2.5 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors text-left font-medium"
              >
                <LogOut className="w-4 h-4" />
                <span>Keluar</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
