import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { LoanDetailClient } from './LoanDetailClient';

interface LoanDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function LoanDetailPage({ params }: LoanDetailPageProps) {
  const { id } = await params;

  let loan = null;

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('loans')
      .select(`
        *,
        items:loan_items(*, book:books(*))
      `)
      .eq('id', id)
      .single();

    loan = data;
  } catch (err) {
    console.warn('Error fetching loan detail:', err);
  }

  if (!loan) {
    notFound();
  }

  return <LoanDetailClient loan={loan} />;
}
