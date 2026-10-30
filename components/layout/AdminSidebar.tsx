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
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { LexoraLogo } from '@/components/shared/LexoraLogo';

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
    <aside className="hidden md:flex flex-col w-64 bg-surface border-r border-border h-screen sticky top-0 shrink-0">
      {/* Admin Brand Logo & Badge */}
      <Link
        href="/"
        title="Kembali ke Beranda"
        className="flex items-center h-16 px-6 border-b border-border hover:bg-surface-secondary/60 transition-colors group cursor-pointer shrink-0"
      >
        <LexoraLogo size="md" badge="Admin" subtitle="Panel Pustakawan" />
      </Link>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
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
    </aside>
  );
}
