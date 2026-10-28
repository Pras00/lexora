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
    <aside className="hidden md:flex flex-col w-64 bg-surface border-r border-border min-h-screen shrink-0">
      {/* Admin Brand Logo & Badge */}
      <Link
        href="/"
        title="Kembali ke Beranda"
        className="flex items-center gap-2.5 h-16 px-6 border-b border-border hover:bg-surface-secondary/60 transition-colors group cursor-pointer"
      >
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary text-white shadow-xs group-hover:scale-105 transition-transform">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-lg text-foreground tracking-tight">Lexora</span>
            <span className="px-1.5 py-0.5 text-xs font-semibold uppercase tracking-wider rounded bg-primary/10 text-primary">
              Admin
            </span>
          </div>
          <span className="block text-xs text-muted font-medium -mt-1">
            Panel Pustakawan
          </span>
        </div>
      </Link>

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
                  ? 'bg-primary/10 text-primary font-semibold border border-primary/20 shadow-xs'
                  : 'text-muted hover:text-foreground hover:bg-surface-secondary'
              )}
            >
              <Icon
                className={cn(
                  'w-4 h-4 transition-colors',
                  isActive ? 'text-primary' : 'text-muted'
                )}
              />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Quick link ke portal user */}
      <div className="p-4 border-t border-border">
        <Link
          href="/catalog"
          className="flex items-center justify-center gap-2 w-full py-2.5 px-3 text-xs font-semibold rounded-xl border border-border text-foreground hover:bg-surface-secondary transition-colors shadow-xs"
        >
          <span>Buka Tampilan Anggota</span>
        </Link>
      </div>
    </aside>
  );
}
