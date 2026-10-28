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
  user,
  title,
}: TopBarProps) {
  const isMember = user?.profile?.role !== 'admin';

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between h-16 px-5 md:px-6 bg-surface/80 backdrop-blur-md border-b border-border transition-colors">
      {/* Left */}
      <div className="flex items-center gap-3">
        {onToggleMobileSidebar && (
          <button
            onClick={onToggleMobileSidebar}
            className="md:hidden p-1.5 text-foreground hover:text-primary transition-colors cursor-pointer"
            aria-label="Buka menu navigasi"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        {title && (
          <h1 className="text-sm font-semibold text-foreground truncate">
            {title}
          </h1>
        )}
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {isMember && <CartButton />}
        <NotificationBell />
        <ThemeToggle />
        <div className="w-px h-5 bg-border mx-0.5" />
        {user && <UserMenu user={user} />}
      </div>
    </header>
  );
}
