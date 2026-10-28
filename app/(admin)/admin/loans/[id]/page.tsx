import { notFound } from 'next/navigation';
import { sql } from '@/lib/db/neon';
import { AdminLoanReturnClient } from './AdminLoanReturnClient';

interface AdminLoanDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminLoanDetailPage({ params }: AdminLoanDetailPageProps) {
  const { id } = await params;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let loan: any = null;

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
              'book', json_build_object('id', b.id, 'title', b.title, 'author', b.author, 'price', b.price, 'cover_url', b.cover_url, 'isbn', b.isbn)
            )
          )
          FROM loan_items li
          JOIN books b ON li.book_id = b.id
          WHERE li.loan_id = l.id
        ) as items
      FROM loans l
      LEFT JOIN profiles p ON l.user_id = p.id
      WHERE l.id::text = ${id}
      LIMIT 1
    `;

    if (rows && rows.length > 0) loan = rows[0];
  } catch (err) {
    console.warn('Error fetching loan return detail from NeonDB:', err);
  }

  if (!loan) {
    notFound();
  }

  return <AdminLoanReturnClient loan={loan} />;
}
