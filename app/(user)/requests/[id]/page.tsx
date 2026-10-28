import { notFound } from 'next/navigation';
import { sql } from '@/lib/db/neon';
import { RequestDetailClient } from './RequestDetailClient';
import { LoanRequestWithDetails } from '@/types';

interface RequestDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function RequestDetailPage({ params }: RequestDetailPageProps) {
  const { id } = await params;

  let request: LoanRequestWithDetails | null = null;

  try {
    const rows = await sql`
      SELECT lr.*,
        (
          SELECT json_agg(
            json_build_object(
              'id', lri.id,
              'status', lri.status,
              'rejection_reason', lri.rejection_reason,
              'book', json_build_object('id', b.id, 'title', b.title, 'author', b.author, 'cover_url', b.cover_url)
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
        ) as pass,
        (
          SELECT row_to_json(p.*)
          FROM profiles p
          WHERE p.id = lr.user_id
          LIMIT 1
        ) as user
      FROM loan_requests lr
      WHERE lr.id::text = ${id}
      LIMIT 1
    `;

    if (rows && rows.length > 0) {
      request = rows[0] as unknown as LoanRequestWithDetails;
    }
  } catch (err) {
    console.warn('Error fetching request detail from NeonDB:', err);
  }

  if (!request) {
    notFound();
  }

  return <RequestDetailClient request={request} />;
}
