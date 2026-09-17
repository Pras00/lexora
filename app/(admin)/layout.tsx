import { createClient } from '@/lib/supabase/server';
import { AdminLayoutClient } from './AdminLayoutClient';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let userEmail = 'admin@lexora.id';
  let profile = null;

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      userEmail = user.email || userEmail;
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      profile = data;
    }
  } catch (error) {
    console.warn('Supabase not configured or unreachable:', error);
  }

  return (
    <AdminLayoutClient user={{ email: userEmail, profile }}>
      {children}
    </AdminLayoutClient>
  );
}
