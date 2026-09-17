'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BookOpen,
  Tags,
  Inbox,
  ArrowRightLeft,
  Users,
  CircleAlert,
  BarChart3,
  ShieldCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const adminNavigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Katalog Buku', href: '/admin/books', icon: BookOpen },
  { name: 'Kategori', href: '/admin/categories', icon: Tags },
  { name: 'Pengajuan', href: '/admin/requests', icon: Inbox },
  { name: 'Peminjaman', href: '/admin/loans', icon: ArrowRightLeft },
  { name: 'Anggota', href: '/admin/members', icon: Users },
  { name: 'Denda & Sanksi', href: '/admin/fines', icon: CircleAlert },
  { name: 'Laporan', href: '/admin/reports', icon: BarChart3 },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 bg-[var(--surface)] border-r border-[var(--border)] min-h-screen">
      {/* Admin Brand Logo & Badge */}
      <div className="flex items-center gap-2.5 h-16 px-6 border-b border-[var(--border)]">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-indigo-600 text-white shadow-sm">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-lg text-[var(--foreground)] tracking-tight">Lexora</span>
            <span className="px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300">
              Admin
            </span>
          </div>
          <span className="block text-[10px] text-[var(--muted)] font-medium -mt-1">
            Panel Pustakawan
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {adminNavigation.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === '/admin/dashboard'
              ? pathname === '/admin/dashboard'
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

      {/* Quick link ke portal user */}
      <div className="p-4 border-t border-[var(--border)]">
        <Link
          href="/catalog"
          className="flex items-center justify-center gap-2 w-full py-2.5 px-3 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-xs"
        >
          <span>Buka Tampilan Anggota</span>
        </Link>
      </div>
    </aside>
  );
}
