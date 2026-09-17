'use client';

import { Bell } from 'lucide-react';
import { useNotificationStore } from '@/stores/notification.store';
import Link from 'next/link';

export function NotificationBell() {
  const { unreadCount } = useNotificationStore();

  return (
    <Link
      href="/dashboard"
      className="relative flex items-center justify-center w-9 h-9 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none"
      title="Notifikasi"
    >
      <Bell className="w-4 h-4 text-[var(--foreground)]" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-4 h-4 px-1 text-[10px] font-bold text-white bg-red-500 rounded-full">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </Link>
  );
}
