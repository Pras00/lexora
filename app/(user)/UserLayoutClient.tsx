'use client';

import { useState } from 'react';
import { UserSidebar } from '@/components/layout/UserSidebar';
import { TopBar } from '@/components/layout/TopBar';
import { MobileNav } from '@/components/layout/MobileNav';
import { Profile } from '@/types';
import {
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  BookmarkCheck,
  History,
  AlertCircle,
  User,
} from 'lucide-react';

const userNavigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Katalog Buku', href: '/catalog', icon: BookOpen },
  { name: 'Pengajuan Saya', href: '/requests', icon: ClipboardList },
  { name: 'Buku Dipinjam', href: '/loans', icon: BookmarkCheck },
  { name: 'Riwayat Selesai', href: '/history', icon: History },
  { name: 'Daftar Denda', href: '/fines', icon: AlertCircle },
  { name: 'Profil Saya', href: '/profile', icon: User },
];

interface UserLayoutClientProps {
  children: React.ReactNode;
  user: {
    email?: string;
    profile: Profile | null;
  };
}

export function UserLayoutClient({ children, user }: UserLayoutClientProps) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[var(--background)]">
      {/* Sidebar Desktop */}
      <UserSidebar />

      {/* Drawer Mobile */}
      <MobileNav
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        navigation={userNavigation}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar
          onToggleMobileSidebar={() => setIsMobileNavOpen(true)}
          user={user}
        />
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
