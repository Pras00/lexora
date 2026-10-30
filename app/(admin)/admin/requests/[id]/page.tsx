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
  let userActiveBooks = 0;
  let userUnpaidFines = 0;

  try {
    const rows = await sql`
      SELECT lr.*,
        json_build_object(
          'id', p.id,
          'full_name', p.full_name,
          'member_number', p.member_number,
          'phone', p.phone,
          'no_show_count', p.no_show_count,
          'status', p.status,
          'created_at', p.created_at
        ) as user,
        (
          SELECT json_agg(
            json_build_object(
              'id', lri.id,
              'book_id', lri.book_id,
              'status', lri.status,
              'rejection_reason', lri.rejection_reason,
              'book', json_build_object(
                'id', b.id,
                'title', b.title,
                'author', b.author,
                'cover_url', b.cover_url,
                'available_stock', b.available_stock,
                'isbn', b.isbn,
                'published_year', b.published_year,
                'publisher', b.publisher,
                'price', b.price,
                'category', json_build_object('name', c.name, 'slug', c.slug)
              )
            )
          )
          FROM loan_request_items lri
          JOIN books b ON lri.book_id = b.id
          LEFT JOIN categories c ON b.category_id = c.id
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

    if (rows && rows.length > 0) {
      request = rows[0] as unknown as LoanRequestWithDetails;

      if (request.user_id) {
        const stats = await sql`
          SELECT
            (
              SELECT COALESCE(COUNT(li.id), 0)
              FROM public.loans l
              JOIN public.loan_items li ON li.loan_id = l.id
              WHERE l.user_id = ${request.user_id}
                AND l.status IN ('active', 'overdue')
                AND li.status = 'borrowed'
            ) as active_loans_count,
            (
              SELECT COALESCE(SUM(amount), 0)
              FROM public.fines
              WHERE user_id = ${request.user_id}
                AND status = 'unpaid'
            ) as unpaid_fines_total
        `;
        if (stats && stats[0]) {
          userActiveBooks = Number(stats[0].active_loans_count || 0);
          userUnpaidFines = Number(stats[0].unpaid_fines_total || 0);
        }
      }
    }
  } catch (err) {
    console.warn('Error fetching request for admin review from NeonDB:', err);
  }

  if (!request) {
    notFound();
  }

  return (
    <AdminRequestReviewClient
      request={request}
      userActiveBooks={userActiveBooks}
      userUnpaidFines={userUnpaidFines}
    />
  );
}
