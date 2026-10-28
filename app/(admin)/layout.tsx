import { getCurrentUser } from '@/lib/auth';
import { AdminLayoutClient } from './AdminLayoutClient';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile } = await getCurrentUser();

  if (!user) {
    redirect('/login?redirectTo=/admin/dashboard');
  }

  const role = profile?.role || user.user_metadata?.role;
  if (role !== 'admin') {
    redirect('/dashboard');
  }

  return (
    <AdminLayoutClient user={{ email: user.email || undefined, profile }}>
      {children}
    </AdminLayoutClient>
  );
}
