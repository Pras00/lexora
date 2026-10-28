import { getCurrentUser } from '@/lib/auth';
import { ProfileClient } from '@/app/(user)/profile/ProfileClient';

export const dynamic = 'force-dynamic';

export default async function AdminProfilePage() {
  const { user, profile } = await getCurrentUser();

  return (
    <ProfileClient
      userEmail={user?.email || 'admin@lexora.id'}
      initialProfile={profile}
    />
  );
}
