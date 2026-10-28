import Link from 'next/link';
import { sql } from '@/lib/db/neon';
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
    if (process.env.DATABASE_URL) {
      const [booksData, requestsCount, loansCount, finesCount, recentReq] =
        await Promise.all([
          sql`SELECT COALESCE(SUM(total_stock), 0) as total, COALESCE(SUM(available_stock), 0) as available FROM books`,
          sql`SELECT count(*) as count FROM loan_requests WHERE status = 'pending'`,
          sql`SELECT count(*) as count FROM loans WHERE status = 'active'`,
          sql`SELECT count(*) as count FROM fines WHERE status = 'unpaid'`,
          sql`
            SELECT lr.id, lr.request_number, lr.requested_at, lr.status,
              json_build_object('full_name', p.full_name, 'member_number', p.member_number) as user,
              (
                SELECT json_agg(json_build_object('id', lri.id))
                FROM loan_request_items lri
                WHERE lri.request_id = lr.id
              ) as items
            FROM loan_requests lr
            LEFT JOIN profiles p ON lr.user_id = p.id
            ORDER BY lr.created_at DESC
            LIMIT 5
          `,
        ]);

      if (booksData[0]) {
        totalBooks = Number(booksData[0].total);
        availableBooks = Number(booksData[0].available);
      }
      if (requestsCount[0]) pendingRequestsCount = Number(requestsCount[0].count);
      if (loansCount[0]) activeLoansCount = Number(loansCount[0].count);
      if (finesCount[0]) unpaidFinesCount = Number(finesCount[0].count);
      if (recentReq) recentRequests = recentReq as unknown as RecentLoanRequest[];
    }
  } catch (err) {
    console.warn('Admin dashboard fetch error from NeonDB:', err);
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
          variant="rose"
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
