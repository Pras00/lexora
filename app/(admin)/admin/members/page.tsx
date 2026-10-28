import { sql } from '@/lib/db/neon';
import { AdminMembersClient } from './AdminMembersClient';
import { Profile } from '@/types';

export const dynamic = 'force-dynamic';

export default async function AdminMembersPage() {
  let members: Profile[] = [];

  try {
    const rows = await sql`
      SELECT *
      FROM public.profiles
      ORDER BY created_at DESC
    `;
    if (rows) members = rows as unknown as Profile[];
  } catch (err) {
    console.warn('Error fetching members from NeonDB:', err);
  }

  return <AdminMembersClient initialMembers={members} />;
}
