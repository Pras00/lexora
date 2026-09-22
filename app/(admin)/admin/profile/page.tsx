import { createClient } from '@/lib/supabase/server';
import { ProfileClient } from '@/app/(user)/profile/ProfileClient';

export default async function AdminProfilePage() {
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
  } catch (err) {
    console.warn('Error fetching profile:', err);
  }

  return <ProfileClient userEmail={userEmail} initialProfile={profile} />;
}
