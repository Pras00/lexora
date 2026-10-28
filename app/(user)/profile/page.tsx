import { getCurrentUser } from '@/lib/auth';
import { ProfileClient } from './ProfileClient';

export default async function ProfilePage() {
  const { user, profile } = await getCurrentUser();
  const userEmail = user?.email || 'member@lexora.id';

  return <ProfileClient userEmail={userEmail} initialProfile={profile} />;
}
