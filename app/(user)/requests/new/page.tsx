import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { getUserActiveHeldBooksCount } from '@/app/actions/requests';
import { NewRequestClient } from './NewRequestClient';

export default async function NewRequestPage() {
  const { user } = await getCurrentUser();
  if (!user) {
    redirect('/auth/login');
  }

  const existingHeldBooks = await getUserActiveHeldBooksCount(user.id);

  return <NewRequestClient existingHeldBooks={existingHeldBooks} />;
}
