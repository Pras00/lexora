import { createClient } from '@/lib/supabase/server';
import { AdminLoansClient } from './AdminLoansClient';

export default async function AdminLoansPage() {
  let activeLoans: any[] = [];

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('loans')
      .select(`
        *,
        user:profiles(*),
        items:loan_items(*, book:books(*))
      `)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (data) activeLoans = data;
  } catch (err) {
    console.warn('Error fetching active loans:', err);
  }

  return <AdminLoansClient activeLoans={activeLoans} />;
}
