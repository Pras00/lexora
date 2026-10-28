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
    <aside className="hidden md:flex flex-col w-64 bg-surface border-r border-border h-screen sticky top-0 shrink-0">
      {/* Brand */}
      <div className="flex items-center gap-3 h-16 px-6 border-b border-border">
        <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center shadow-xs">
          <Library className="w-4 h-4" />
        </div>
        <span className="font-extrabold text-lg tracking-tight text-foreground">
          Lexora
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-4">
        <p className="text-xs font-bold tracking-wider uppercase text-muted px-3 mb-3">
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
                    ? 'bg-primary/10 text-primary font-bold'
                    : 'text-muted font-medium hover:text-foreground hover:bg-surface-secondary'
                )}
              >
                <Icon
                  className={cn(
                    'w-4 h-4 shrink-0',
                    isActive ? 'text-primary' : 'text-muted'
                  )}
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Sidebar footer */}
      <div className="p-4 border-t border-border">
        <div className="p-4 rounded-2xl bg-surface-secondary border border-border">
          <p className="text-xs font-bold text-foreground mb-1">
            Jam Layanan
          </p>
          <p className="text-xs font-medium text-muted">
            Senin – Jumat<br />
            08.00 – 16.30 WIB
          </p>
        </div>
      </div>
    </aside>
  );
}
