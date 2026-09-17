'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  BookmarkCheck,
  History,
  AlertCircle,
  User,
  Library,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Katalog Buku', href: '/catalog', icon: BookOpen },
  { name: 'Pengajuan Saya', href: '/requests', icon: ClipboardList },
  { name: 'Buku Dipinjam', href: '/loans', icon: BookmarkCheck },
  { name: 'Riwayat Selesai', href: '/history', icon: History },
  { name: 'Daftar Denda', href: '/fines', icon: AlertCircle },
  { name: 'Profil Saya', href: '/profile', icon: User },
];

export function UserSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 bg-[var(--surface)] border-r border-[var(--border)] min-h-screen">
      {/* Brand Logo & Name */}
      <div className="flex items-center gap-2.5 h-16 px-6 border-b border-[var(--border)]">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-indigo-600 text-white shadow-sm">
          <Library className="w-5 h-5" />
        </div>
        <div>
          <span className="font-bold text-lg text-[var(--foreground)] tracking-tight">Lexora</span>
          <span className="block text-[10px] text-[var(--muted)] font-medium -mt-1">
            Perpustakaan Digital
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === '/dashboard'
              ? pathname === '/dashboard'
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3.5 py-2.5 text-sm font-medium rounded-xl transition-all',
                isActive
                  ? 'bg-indigo-50 text-indigo-700 font-semibold border border-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-900/50 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/60'
              )}
            >
              <Icon
                className={cn(
                  'w-4 h-4 transition-colors',
                  isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'
                )}
              />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-[var(--border)]">
        <div className="rounded-xl bg-slate-50 dark:bg-slate-900/60 p-3.5 border border-slate-200/80 dark:border-slate-800">
          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">Jam Layanan Fisik</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            Senin – Jumat: 08.00 – 16.30 WIB
          </p>
        </div>
      </div>
    </aside>
  );
}
