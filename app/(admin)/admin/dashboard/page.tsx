import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatCard } from '@/components/dashboard/StatCard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { formatDate } from '@/lib/utils';
import { EmptyState } from '@/components/shared/EmptyState';
import {
  BookOpen,
  Inbox,
  ArrowRightLeft,
  CircleAlert,
  ArrowRight,
  Plus,
  QrCode,
  Sparkles,
} from 'lucide-react';

interface LoanRequestItem {
  id: string;
}

interface UserProfile {
  full_name: string;
  member_number: string;
}

interface RecentLoanRequest {
  id: string;
  request_number: string;
  requested_at: string;
  status: string;
  user: UserProfile | null;
  items: LoanRequestItem[];
}

export default async function AdminDashboardPage() {
  let totalBooks = 0;
  let availableBooks = 0;
  let pendingRequestsCount = 0;
  let activeLoansCount = 0;
  let unpaidFinesCount = 0;
  let recentRequests: RecentLoanRequest[] = [];

  try {
    const supabase = await createClient();

    const [booksRes, requestsRes, loansRes, finesRes, recentReqRes] =
      await Promise.all([
        supabase.from('books').select('total_stock, available_stock'),
        supabase.from('loan_requests').select('id').eq('status', 'pending'),
        supabase.from('loans').select('id').eq('status', 'active'),
        supabase.from('fines').select('id').eq('status', 'unpaid'),
        supabase
          .from('loan_requests')
          .select('*, user:profiles(*), items:loan_request_items(*)')
          .order('created_at', { ascending: false })
          .limit(5),
      ]);

    if (booksRes.data) {
      totalBooks = booksRes.data.reduce((acc, b) => acc + b.total_stock, 0);
      availableBooks = booksRes.data.reduce(
        (acc, b) => acc + b.available_stock,
        0
      );
    }

    if (requestsRes.data) pendingRequestsCount = requestsRes.data.length;
    if (loansRes.data) activeLoansCount = loansRes.data.length;
    if (finesRes.data) unpaidFinesCount = finesRes.data.length;
    if (recentReqRes.data) {
      recentRequests = recentReqRes.data as unknown as RecentLoanRequest[];
    }
  } catch (err) {
    console.warn('Admin dashboard fetch error:', err);
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard Pustakawan"
        description="Ringkasan operasional sirkulasi, ketersediaan inventori, dan status layanan perpustakaan."
        action={
          <div className="flex items-center gap-2.5">
            <Link
              href="/admin/loans"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border bg-surface hover:bg-surface-secondary text-xs font-bold text-foreground transition-all shadow-xs cursor-pointer"
            >
              <QrCode className="w-4 h-4 text-primary" />
              <span>Scan Loket Pickup</span>
            </Link>
            <Link
              href="/admin/books/new"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Buku</span>
            </Link>
          </div>
        }
      />

      {/* Grid Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Pengajuan Menunggu"
          value={pendingRequestsCount}
          description="Perlu verifikasi & persetujuan loket"
          icon={Inbox}
          variant={pendingRequestsCount > 0 ? 'amber' : 'default'}
        />
        <StatCard
          title="Peminjaman Aktif"
          value={activeLoansCount}
          description="Buku fisik sedang di tangan pemustaka"
          icon={ArrowRightLeft}
          variant="primary"
        />
        <StatCard
          title="Stok Fisik Tersedia"
          value={`${availableBooks} / ${totalBooks}`}
          description="Buku siap di rak perpustakaan"
          icon={BookOpen}
          variant="emerald"
        />
        <StatCard
          title="Denda Belum Lunas"
          value={`${unpaidFinesCount} Tagihan`}
          description="Menunggu konfirmasi pelunasan loket"
          icon={CircleAlert}
          variant={unpaidFinesCount > 0 ? 'rose' : 'default'}
        />
      </div>

      {/* Section Pengajuan Terbaru */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-foreground">
              Pengajuan Peminjaman Terbaru
            </h3>
            <p className="text-xs text-muted mt-0.5">
              Antrean reservasi buku pemustaka yang memerlukan tindakan pustakawan.
            </p>
          </div>
          <Link
            href="/admin/requests"
            className="text-xs font-bold text-primary hover:underline transition-colors"
          >
            Lihat Semua Pengajuan →
          </Link>
        </div>

        {recentRequests.length > 0 ? (
          <div className="rounded-2xl border border-border bg-surface overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-surface-secondary border-b border-border text-muted uppercase font-bold tracking-wider text-[11px]">
                  <tr>
                    <th className="px-5 py-3.5">No. Pengajuan</th>
                    <th className="px-5 py-3.5">Nama Anggota</th>
                    <th className="px-5 py-3.5">Jumlah Buku</th>
                    <th className="px-5 py-3.5">Waktu Reservasi</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 text-foreground">
                  {recentRequests.map((req) => (
                    <tr
                      key={req.id}
                      className="hover:bg-slate-500/5 transition-colors"
                    >
                      <td className="px-5 py-4 font-mono font-bold text-foreground">
                        {req.request_number}
                      </td>
                      <td className="px-5 py-4">
                        <div className="font-bold text-sm text-foreground">
                          {req.user?.full_name || 'Anggota'}
                        </div>
                        <div className="text-[11px] text-muted font-mono mt-0.5">
                          {req.user?.member_number || '-'}
                        </div>
                      </td>
                      <td className="px-5 py-4 font-medium text-foreground">
                        {req.items?.length || 0} buku
                      </td>
                      <td className="px-5 py-4 text-muted">
                        {formatDate(req.requested_at)}
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={req.status} />
                      </td>
                      <td className="px-5 py-4 text-right">
                        <Link
                          href={`/admin/requests/${req.id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-primary text-white hover:bg-primary-hover transition-colors shadow-xs"
                        >
                          <span>Proses</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <EmptyState
            icon={Inbox}
            title="Belum Ada Pengajuan Masuk"
            description="Saat ini semua pengajuan peminjaman buku pemustaka telah selesai diproses."
          />
        )}
      </div>
    </div>
  );
}
