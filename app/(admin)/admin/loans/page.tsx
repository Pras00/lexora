import { sql } from '@/lib/db/neon';
import { AdminLoansClient } from './AdminLoansClient';
import { LoanWithDetails } from '@/types';

export default async function AdminLoansPage() {
  let activeLoans: LoanWithDetails[] = [];

  try {
    const rows = await sql`
      SELECT l.*,
        json_build_object('id', p.id, 'full_name', p.full_name, 'member_number', p.member_number, 'phone', p.phone) as user,
        (
          SELECT json_agg(
            json_build_object(
              'id', li.id,
              'status', li.status,
              'due_date', li.due_date,
              'book', json_build_object('id', b.id, 'title', b.title, 'author', b.author, 'cover_url', b.cover_url, 'isbn', b.isbn)
            )
          )
          FROM loan_items li
          JOIN books b ON li.book_id = b.id
          WHERE li.loan_id = l.id
        ) as items
      FROM loans l
      LEFT JOIN profiles p ON l.user_id = p.id
      WHERE l.status = 'active'
      ORDER BY l.created_at DESC
    `;

    if (rows) activeLoans = rows as unknown as LoanWithDetails[];
  } catch (err) {
    console.warn('Error fetching active loans from NeonDB:', err);
  }

  return <AdminLoansClient activeLoans={activeLoans} />;
}
