import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { sql } from '@/lib/db/neon';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import { formatDate } from '@/lib/utils';
import { ClipboardList, ArrowRight, BookOpen } from 'lucide-react';
import { LoanRequestWithDetails } from '@/types';

export default async function RequestsPage() {
  let requests: LoanRequestWithDetails[] = [];

  try {
    const { user } = await getCurrentUser();

    if (user && process.env.DATABASE_URL) {
      const data = await sql`
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
        WHERE lr.user_id = ${user.id}
        ORDER BY lr.created_at DESC
      `;

      if (data) {
        requests = data as unknown as LoanRequestWithDetails[];
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
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            <span>Ajukan Buku Baru</span>
          </Link>
        }
      />

      {requests.length > 0 ? (
        <div className="space-y-4">
          {requests.map((req) => (
            <div
              key={req.id}
              className="p-5 rounded-2xl border border-border bg-surface hover:border-indigo-200 dark:hover:border-indigo-900 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2.5 mb-1.5">
                  <span className="font-mono font-bold text-sm text-foreground">
                    {req.request_number}
                  </span>
                  <StatusBadge status={req.status} />
                </div>
                <p className="text-xs text-foreground">
                  Diajukan pada: {formatDate(req.requested_at)} • {req.items?.length || 0} buku
                </p>
                {req.pickup_deadline && req.status === 'approved' && (
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mt-1">
                    Batas Ambil di Loket: {formatDate(req.pickup_deadline)}
                  </p>
                )}
              </div>

              <Link
                href={`/requests/${req.id}`}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl border border-border hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-foreground"
              >
                <span>Lihat Rincian</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={ClipboardList}
          title="Belum Ada Pengajuan Peminjaman"
          description="Anda belum memiliki riwayat pengajuan peminjaman buku. Pilih buku dari katalog sekarang."
          action={
            <Link
              href="/catalog"
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
            >
              Buka Katalog Koleksi
            </Link>
          }
        />
      )}
    </div>
  );
}
