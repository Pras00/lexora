'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LogOut, Settings, ShieldCheck, LayoutDashboard } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Profile } from '@/types';

interface UserMenuProps {
  user: {
    id?: string;
    email?: string;
    user_metadata?: {
      full_name?: string;
      role?: string;
    };
    profile?: Profile | null;
  };
}

export function UserMenu({ user }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  const fullName =
    user.profile?.full_name ||
    user.user_metadata?.full_name ||
    user.email?.split('@')[0] ||
    'Anggota';
  const email = user.email || 'user@lexora.id';
  const role =
    user.profile?.role ||
    user.user_metadata?.role ||
    'member';

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
    window.location.href = '/';
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Logo Profile Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all focus:outline-none cursor-pointer"
        aria-expanded={isOpen}
        aria-haspopup="true"
        title="Menu Profil"
      >
        <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs hover:bg-indigo-700 transition-colors">
          <User className="w-5 h-5" />
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute right-0 mt-2 w-64 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-[var(--surface)] shadow-xl py-2 z-50 text-sm"
          >
            {/* Header info user */}
            <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-[var(--foreground)] truncate">{fullName}</p>
                {role === 'admin' && (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300">
                    <ShieldCheck className="w-3 h-3 mr-0.5" />
                    Admin
                  </span>
                )}
              </div>
              <p className="text-xs text-[var(--muted)] truncate mt-0.5">{email}</p>
            </div>

            {/* Menu item links */}
            <div className="py-1">
              {/* 1. Dashboard */}
              <Link
                href={role === 'admin' ? '/admin/dashboard' : '/dashboard'}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-[var(--foreground)] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <LayoutDashboard className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Dashboard</span>
              </Link>

              {/* 2. Account Setting */}
              <Link
                href="/profile"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-[var(--foreground)] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Settings className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                <span>Account Setting</span>
              </Link>
            </div>

            {/* 3. Logout */}
            <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={handleSignOut}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors text-left font-medium cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
