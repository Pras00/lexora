'use client';

import { useState } from 'react';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { TopBar } from '@/components/layout/TopBar';
import { MobileNav } from '@/components/layout/MobileNav';
import { Profile } from '@/types';
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

interface AdminLayoutClientProps {
  children: React.ReactNode;
  user: {
    email?: string;
    profile: Profile | null;
  };
}

export function AdminLayoutClient({ children, user }: AdminLayoutClientProps) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[var(--surface)]">
      {/* Sidebar Desktop Admin */}
      <AdminSidebar />

      {/* Drawer Mobile Admin */}
      <MobileNav
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        navigation={adminNavigation}
        isAdmin
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
