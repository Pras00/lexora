import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { AdminRequestReviewClient } from './AdminRequestReviewClient';
import { LoanRequestWithDetails } from '@/types';

interface AdminRequestDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminRequestDetailPage({ params }: AdminRequestDetailPageProps) {
  const { id } = await params;

  let request: LoanRequestWithDetails | null = null;

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('loan_requests')
      .select(`
        *,
        user:profiles(*),
        items:loan_request_items(*, book:books(*)),
        pass:pickup_passes(*)
      `)
      .eq('id', id)
      .single();

    if (data) {
      const passData = Array.isArray(data.pass) ? data.pass[0] : data.pass;
      request = {
        ...data,
        pass: passData || null,
      } as unknown as LoanRequestWithDetails;
    }
  } catch (err) {
    console.warn('Error fetching request for admin review:', err);
  }

  if (!request) {
    notFound();
  }

  return <AdminRequestReviewClient request={request} />;
}
