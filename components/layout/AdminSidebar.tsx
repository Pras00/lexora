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

interface AdminNavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface AdminNavGroup {
  label: string;
  items: AdminNavItem[];
}

const adminNavGroups: AdminNavGroup[] = [
  {
    label: 'Ringkasan',
    items: [
      { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    ],
  },
  {
    label: 'Layanan Loket Sirkulasi',
    items: [
      { name: 'Pengajuan', href: '/admin/requests', icon: Inbox },
      { name: 'Peminjaman', href: '/admin/loans', icon: ArrowRightLeft },
      { name: 'Denda & Sanksi', href: '/admin/fines', icon: CircleAlert },
    ],
  },
  {
    label: 'Inventori & Anggota',
    items: [
      { name: 'Katalog Buku', href: '/admin/books', icon: BookOpen },
      { name: 'Kategori', href: '/admin/categories', icon: Tags },
      { name: 'Anggota', href: '/admin/members', icon: Users },
      { name: 'Laporan', href: '/admin/reports', icon: BarChart3 },
    ],
  },
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

      {/* Navigation Groups */}
      <nav className="flex-1 px-3 py-4 space-y-4 overflow-y-auto">
        {adminNavGroups.map((group) => (
          <div key={group.label} className="space-y-1">
            <p className="px-3 text-xs font-semibold text-muted uppercase tracking-wider">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
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
                      'relative flex items-center gap-3 px-3.5 py-2 text-xs font-medium rounded-xl border border-transparent transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 group',
                      isActive
                        ? 'bg-primary/10 text-primary font-semibold'
                        : 'text-muted hover:text-foreground hover:bg-surface-secondary/70'
                    )}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-primary rounded-r" />
                    )}
                    <Icon
                      className={cn(
                        'w-4 h-4 shrink-0 transition-colors',
                        isActive
                          ? 'text-primary'
                          : 'text-muted group-hover:text-foreground'
                      )}
                    />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer Status Operasional Loket */}
      <div className="p-3 border-t border-border shrink-0">
        <div className="p-3 rounded-xl bg-surface-secondary/60 border border-border flex items-center justify-between gap-2 shadow-2xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <div className="min-w-0 leading-tight">
              <span className="text-xs font-bold text-foreground block truncate">
                Loket Sirkulasi
              </span>
              <span className="text-xs text-muted block truncate mt-0.5">
                08.00 – 16.30 WIB
              </span>
            </div>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-900/40 shrink-0">
            Buka
          </span>
        </div>
      </div>
    </aside>
  );
}
