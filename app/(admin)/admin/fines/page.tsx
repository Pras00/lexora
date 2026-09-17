import { createClient } from '@/lib/supabase/server';
import { AdminFinesClient } from './AdminFinesClient';

export default async function AdminFinesPage() {
  let fines: any[] = [];

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('fines')
      .select(`
        *,
        user:profiles(*),
        loan_item:loan_items(*, book:books(*))
      `)
      .order('created_at', { ascending: false });

    if (data) fines = data;
  } catch (err) {
    console.warn('Error fetching fines:', err);
  }

  return <AdminFinesClient fines={fines} />;
}
