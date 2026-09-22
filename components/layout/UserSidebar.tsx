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
    <aside className="hidden md:flex flex-col w-64 bg-[var(--surface)] border-r border-[var(--border)] h-screen sticky top-0 flex-shrink-0">
      {/* Brand */}
      <div className="flex items-center gap-3 h-16 px-6 border-b border-[var(--border)]">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-sm">
          <Library className="w-4 h-4" />
        </div>
        <span className="font-extrabold text-lg tracking-tight text-[var(--foreground)]">
          Lexora
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-4">
        <p className="text-[11px] font-bold tracking-wider uppercase text-[var(--foreground)] px-3 mb-3">
          Menu Utama
        </p>
        <div className="space-y-1">
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
                  'flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl transition-all',
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 font-bold dark:bg-indigo-500/10 dark:text-indigo-400'
                    : 'text-[var(--foreground)] font-semibold hover:text-[var(--foreground)] hover:bg-[var(--surface)]'
                )}
              >
                <Icon
                  className={cn(
                    'w-4 h-4 flex-shrink-0',
                    isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-[var(--foreground)]'
                  )}
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Sidebar footer */}
      <div className="p-4 border-t border-[var(--border)]">
        <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
          <p className="text-xs font-bold text-[var(--foreground)] mb-1">
            Jam Layanan
          </p>
          <p className="text-xs font-medium text-[var(--foreground)]">
            Senin – Jumat<br />
            08.00 – 16.30 WIB
          </p>
        </div>
      </div>
    </aside>
  );
}
