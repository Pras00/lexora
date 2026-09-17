import { createClient } from '@/lib/supabase/server';
import { AdminRequestsClient } from './AdminRequestsClient';
import { LoanRequestWithDetails } from '@/types';

export default async function AdminRequestsPage() {
  let requests: LoanRequestWithDetails[] = [];

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('loan_requests')
      .select(`
        *,
        user:profiles(*),
        items:loan_request_items(*, book:books(*))
      `)
      .order('created_at', { ascending: false });

    if (data) requests = data as unknown as LoanRequestWithDetails[];
  } catch (err) {
    console.warn('Error fetching admin requests:', err);
  }

  return <AdminRequestsClient initialRequests={requests} />;
}
