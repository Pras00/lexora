import { getCurrentUser } from '@/lib/auth';
import { UserLayoutClient } from './UserLayoutClient';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile } = await getCurrentUser();

  // Pengguna yang belum login dialihkan ke halaman login
  if (!user) {
    redirect('/login');
  }

  return (
    <UserLayoutClient user={{ email: user.email || undefined, profile }}>
      {children}
    </UserLayoutClient>
  );
}
