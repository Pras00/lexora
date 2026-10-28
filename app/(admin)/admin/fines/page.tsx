import { sql } from '@/lib/db/neon';
import { AdminFinesClient } from './AdminFinesClient';

export const dynamic = 'force-dynamic';

export default async function AdminFinesPage() {
  let fines: any[] = [];

  try {
    const rows = await sql`
      SELECT 
        f.*,
        row_to_json(p.*) as "user",
        CASE 
          WHEN li.id IS NOT NULL THEN
            json_build_object(
              'id', li.id,
              'loan_id', li.loan_id,
              'book_id', li.book_id,
              'due_date', li.due_date,
              'returned_at', li.returned_at,
              'status', li.status,
              'extension_count', li.extension_count,
              'damage_level', li.damage_level,
              'replacement_cost', li.replacement_cost,
              'book', CASE WHEN b.id IS NOT NULL THEN row_to_json(b.*) ELSE NULL END
            )
          ELSE NULL
        END as loan_item
      FROM public.fines f
      LEFT JOIN public.profiles p ON p.id = f.user_id
      LEFT JOIN public.loan_items li ON li.id = f.loan_item_id
      LEFT JOIN public.books b ON b.id = li.book_id
      ORDER BY f.created_at DESC
    `;

    if (rows) fines = rows as any[];
  } catch (err) {
    console.warn('Error fetching fines from NeonDB:', err);
  }

  return <AdminFinesClient fines={fines} />;
}
