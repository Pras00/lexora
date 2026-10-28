import { sql } from '@/lib/db/neon';
import { AdminRequestsClient } from './AdminRequestsClient';
import { LoanRequestWithDetails } from '@/types';

export default async function AdminRequestsPage() {
  let requests: LoanRequestWithDetails[] = [];

  try {
    const rows = await sql`
      SELECT lr.*,
        json_build_object('id', p.id, 'full_name', p.full_name, 'member_number', p.member_number, 'phone', p.phone) as user,
        (
          SELECT json_agg(
            json_build_object(
              'id', lri.id,
              'status', lri.status,
              'rejection_reason', lri.rejection_reason,
              'book', json_build_object('id', b.id, 'title', b.title, 'author', b.author, 'cover_url', b.cover_url, 'available_stock', b.available_stock)
            )
          )
          FROM loan_request_items lri
          JOIN books b ON lri.book_id = b.id
          WHERE lri.request_id = lr.id
        ) as items
      FROM loan_requests lr
      LEFT JOIN profiles p ON lr.user_id = p.id
      ORDER BY lr.created_at DESC
    `;

    if (rows) requests = rows as unknown as LoanRequestWithDetails[];
  } catch (err) {
    console.warn('Error fetching admin requests from NeonDB:', err);
  }

  return <AdminRequestsClient initialRequests={requests} />;
}
