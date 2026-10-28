import { notFound } from 'next/navigation';
import { sql } from '@/lib/db/neon';
import { LoanDetailClient } from './LoanDetailClient';

interface LoanDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function LoanDetailPage({ params }: LoanDetailPageProps) {
  const { id } = await params;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let loan: any = null;

  try {
    const rows = await sql`
      SELECT l.*,
        (
          SELECT json_agg(
            json_build_object(
              'id', li.id,
              'status', li.status,
              'due_date', li.due_date,
              'extension_count', li.extension_count,
              'returned_at', li.returned_at,
              'damage_level', li.damage_level,
              'replacement_cost', li.replacement_cost,
              'book', json_build_object('id', b.id, 'title', b.title, 'author', b.author, 'cover_url', b.cover_url, 'isbn', b.isbn)
            )
          )
          FROM loan_items li
          JOIN books b ON li.book_id = b.id
          WHERE li.loan_id = l.id
        ) as items
      FROM loans l
      WHERE l.id::text = ${id}
      LIMIT 1
    `;

    if (rows && rows.length > 0) {
      loan = rows[0];
    }
  } catch (err) {
    console.warn('Error fetching loan detail from NeonDB:', err);
  }

  if (!loan) {
    notFound();
  }

  return <LoanDetailClient loan={loan} />;
}
