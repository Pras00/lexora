import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import { formatDate } from '@/lib/utils';
import { ClipboardList, ArrowRight, BookOpen } from 'lucide-react';
import { LoanRequestWithDetails } from '@/types';

export default async function RequestsPage() {
  let requests: LoanRequestWithDetails[] = [];

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data } = await supabase
        .from('loan_requests')
        .select(`
          *,
          user:profiles(*),
          items:loan_request_items(*, book:books(*)),
          pass:pickup_passes(*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (data) {
        requests = data as unknown as LoanRequestWithDetails[];
      }
    }
  } catch (err) {
    console.warn('Error fetching requests:', err);
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
              className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] hover:border-indigo-200 dark:hover:border-indigo-900 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2.5 mb-1.5">
                  <span className="font-mono font-bold text-sm text-[var(--foreground)]">
                    {req.request_number}
                  </span>
                  <StatusBadge status={req.status} />
                </div>
                <p className="text-xs text-[var(--foreground)]">
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
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl border border-[var(--border)] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-[var(--foreground)]"
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
