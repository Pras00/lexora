import { createClient } from '@/lib/supabase/server';
import { AdminMembersClient } from './AdminMembersClient';
import { Profile } from '@/types';

export default async function AdminMembersPage() {
  let members: Profile[] = [];

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) members = data;
  } catch (err) {
    console.warn('Error fetching members:', err);
  }

  return <AdminMembersClient initialMembers={members} />;
}
