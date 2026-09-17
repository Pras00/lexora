'use client';

import { Menu } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { UserMenu } from './UserMenu';
import { NotificationBell } from './NotificationBell';
import { CartButton } from './CartButton';
import { Profile } from '@/types';

interface TopBarProps {
  onToggleMobileSidebar?: () => void;
  user?: {
    email?: string;
    profile?: Profile | null;
  };
  title?: string;
}

export function TopBar({
  onToggleMobileSidebar,
  user = {
    email: 'user@lexora.id',
    profile: {
      id: '',
      full_name: 'Member Lexora',
      phone: null,
      member_number: 'LX-0001',
      role: 'member',
      status: 'active',
      no_show_count: 0,
      suspended_until: null,
      created_at: '',
      updated_at: '',
    },
  },
  title,
}: TopBarProps) {
  const isMember = user.profile?.role !== 'admin';

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between h-16 px-4 md:px-6 bg-[var(--surface)] border-b border-[var(--border)] transition-colors">
      {/* Kiri: Toggle mobile & Title */}
      <div className="flex items-center gap-3">
        {onToggleMobileSidebar && (
          <button
            onClick={onToggleMobileSidebar}
            className="md:hidden p-2 rounded-lg text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Buka menu navigasi"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        {title && (
          <h1 className="text-base md:text-lg font-semibold text-[var(--foreground)] truncate">
            {title}
          </h1>
        )}
      </div>

      {/* Kanan: Cart (khusus member), Notif, Theme Toggle, User Profile */}
      <div className="flex items-center gap-2.5">
        {isMember && <CartButton />}
        <NotificationBell />
        <ThemeToggle />
        <div className="h-5 w-[1px] bg-[var(--border)] mx-1" />
        <UserMenu user={user} />
      </div>
    </header>
  );
}
