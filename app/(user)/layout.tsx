import { createClient } from '@/lib/supabase/server';
import { UserLayoutClient } from './UserLayoutClient';

export const dynamic = 'force-dynamic';

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let userEmail = 'user@lexora.id';
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
    // Fallback jika belum terhubung env Supabase
    console.warn('Supabase not configured or unreachable:', error);
  }

  return (
    <UserLayoutClient user={{ email: userEmail, profile }}>
      {children}
    </UserLayoutClient>
  );
}
