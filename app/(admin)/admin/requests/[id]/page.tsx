import { notFound } from 'next/navigation';
import { sql } from '@/lib/db/neon';
import { AdminRequestReviewClient } from './AdminRequestReviewClient';
import { LoanRequestWithDetails } from '@/types';

interface AdminRequestDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminRequestDetailPage({ params }: AdminRequestDetailPageProps) {
  const { id } = await params;

  let request: LoanRequestWithDetails | null = null;

  try {
    const rows = await sql`
      SELECT lr.*,
        json_build_object('id', p.id, 'full_name', p.full_name, 'member_number', p.member_number, 'phone', p.phone, 'no_show_count', p.no_show_count, 'status', p.status) as user,
        (
          SELECT json_agg(
            json_build_object(
              'id', lri.id,
              'status', lri.status,
              'rejection_reason', lri.rejection_reason,
              'book', json_build_object('id', b.id, 'title', b.title, 'author', b.author, 'cover_url', b.cover_url, 'available_stock', b.available_stock, 'isbn', b.isbn)
            )
          )
          FROM loan_request_items lri
          JOIN books b ON lri.book_id = b.id
          WHERE lri.request_id = lr.id
        ) as items,
        (
          SELECT row_to_json(pp.*)
          FROM pickup_passes pp
          WHERE pp.request_id = lr.id
          LIMIT 1
        ) as pass
      FROM loan_requests lr
      LEFT JOIN profiles p ON lr.user_id = p.id
      WHERE lr.id::text = ${id}
      LIMIT 1
    `;

    if (rows && rows.length > 0) request = rows[0] as unknown as LoanRequestWithDetails;
  } catch (err) {
    console.warn('Error fetching request for admin review from NeonDB:', err);
  }

  if (!request) {
    notFound();
  }

  return <AdminRequestReviewClient request={request} />;
}
