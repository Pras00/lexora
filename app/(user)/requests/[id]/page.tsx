import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { RequestDetailClient } from './RequestDetailClient';
import { LoanRequestWithDetails } from '@/types';

interface RequestDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function RequestDetailPage({ params }: RequestDetailPageProps) {
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
      // Supabase passes is 1-to-1 relation (can be single or array)
      const passData = Array.isArray(data.pass) ? data.pass[0] : data.pass;
      request = {
        ...data,
        pass: passData || null,
      } as unknown as LoanRequestWithDetails;
    }
  } catch (err) {
    console.warn('Error fetching request detail:', err);
  }

  if (!request) {
    notFound();
  }

  return <RequestDetailClient request={request} />;
}
