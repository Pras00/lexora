import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { AdminLoanReturnClient } from './AdminLoanReturnClient';

interface AdminLoanDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminLoanDetailPage({ params }: AdminLoanDetailPageProps) {
  const { id } = await params;

  let loan = null;

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('loans')
      .select(`
        *,
        user:profiles(*),
        items:loan_items(*, book:books(*))
      `)
      .eq('id', id)
      .single();

    loan = data;
  } catch (err) {
    console.warn('Error fetching loan return detail:', err);
  }

  if (!loan) {
    notFound();
  }

  return <AdminLoanReturnClient loan={loan} />;
}
