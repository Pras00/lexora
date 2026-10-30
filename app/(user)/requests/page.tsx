import { Suspense } from 'react';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { sql } from '@/lib/db/neon';
import { PageHeader } from '@/components/shared/PageHeader';
import { BookOpen } from 'lucide-react';
import { LoanRequestWithDetails } from '@/types';
import { RequestsClient } from './RequestsClient';

export default async function RequestsPage() {
  let requests: LoanRequestWithDetails[] = [];
  let activeLoansCount = 0;

  try {
    const { user } = await getCurrentUser();

    if (user && process.env.DATABASE_URL) {
      const [data, loansCountRes] = await Promise.all([
        sql`
        SELECT lr.*,
          (
            SELECT json_agg(
              json_build_object(
                'id', lri.id,
                'status', lri.status,
                'rejection_reason', lri.rejection_reason,
                'book', json_build_object(
                  'id', b.id,
                  'title', b.title,
                  'author', b.author,
                  'cover_url', b.cover_url,
                  'published_year', b.published_year,
                  'publisher', b.publisher,
                  'isbn', b.isbn,
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
          ) as pass,
          (
            SELECT row_to_json(p.*)
            FROM profiles p
            WHERE p.id = lr.user_id
            LIMIT 1
          ) as user
        FROM loan_requests lr
        WHERE lr.user_id = ${user.id}
        ORDER BY lr.created_at DESC
      `,
        sql`
          SELECT COALESCE(COUNT(li.id), 0) as count
          FROM public.loans l
          JOIN public.loan_items li ON li.loan_id = l.id
          WHERE l.user_id = ${user.id}
            AND l.status IN ('active', 'overdue')
            AND li.status = 'borrowed'
        `,
      ]);

      if (data) {
        requests = data as unknown as LoanRequestWithDetails[];
      }
      if (loansCountRes && loansCountRes[0]) {
        activeLoansCount = Number(loansCountRes[0].count || 0);
      }
    }
  } catch (err) {
    console.warn('Error fetching requests from NeonDB:', err);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pengajuan Peminjaman Saya"
        description="Pantau status persetujuan pustakawan dan kartu pengambilan (pickup pass) buku Anda."
        action={
          <Link
            href="/catalog"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-primary hover:bg-primary-hover text-white shadow-xs transition-all active:scale-95"
          >
            <BookOpen className="w-4 h-4" />
            <span>Ajukan Buku Baru</span>
          </Link>
        }
      />

      <Suspense fallback={<div className="h-40 flex items-center justify-center text-xs text-muted">Memuat pengajuan...</div>}>
        <RequestsClient initialRequests={requests} activeLoansCount={activeLoansCount} />
      </Suspense>
    </div>
  );
}
