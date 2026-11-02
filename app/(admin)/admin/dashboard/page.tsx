import Link from 'next/link';
import Image from 'next/image';
import { sql } from '@/lib/db/neon';
import { processExpiredRequests } from '@/lib/services/request-expiry';
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
  Clock,
} from 'lucide-react';

interface LoanRequestBook {
  id: string;
  title: string;
  cover_url: string | null;
}

interface LoanRequestItemWithBook {
  id: string;
  book: LoanRequestBook | null;
}

interface UserProfile {
  full_name: string;
  member_number: string;
}

interface RecentLoanRequest {
  id: string;
  request_number: string;
  requested_at: string;
  expires_at?: string | null;
  pickup_deadline?: string | null;
  status: string;
  user: UserProfile | null;
  items: LoanRequestItemWithBook[] | null;
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
      // 1. Jalankan On-Demand Auto-Expire
      await processExpiredRequests();

      const [booksData, requestsCount, loansCount, finesCount, recentReq] =
        await Promise.all([
          sql`SELECT COALESCE(SUM(total_stock), 0) as total, COALESCE(SUM(available_stock), 0) as available FROM books`,
          sql`SELECT count(*) as count FROM loan_requests WHERE status = 'pending'`,
          sql`SELECT count(*) as count FROM loans WHERE status = 'active'`,
          sql`SELECT count(*) as count FROM fines WHERE status = 'unpaid'`,
          sql`
            SELECT lr.id, lr.request_number, lr.requested_at, lr.expires_at, lr.pickup_deadline, lr.status,
              json_build_object('full_name', p.full_name, 'member_number', p.member_number) as user,
              (
                SELECT json_agg(
                  json_build_object(
                    'id', lri.id,
                    'book', json_build_object(
                      'id', b.id,
                      'title', b.title,
                      'cover_url', b.cover_url
                    )
                  )
                )
                FROM loan_request_items lri
                JOIN books b ON lri.book_id = b.id
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-foreground">
                Pengajuan Peminjaman Terbaru
              </h3>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-surface-secondary text-muted border border-border">
                5 Terakhir
              </span>
            </div>
            <p className="text-xs text-muted mt-0.5">
              Antrean reservasi buku pemustaka yang memerlukan tindakan pustakawan.
            </p>
          </div>
          <Link
            href="/admin/requests"
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-hover transition-colors"
          >
            <span>Lihat Semua Pengajuan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentRequests.length > 0 ? (
          <div className="rounded-2xl border border-border bg-surface overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-surface-secondary/70 border-b border-border text-muted text-xs font-semibold">
                  <tr>
                    <th className="px-5 py-3 text-left">No. Pengajuan</th>
                    <th className="px-5 py-3 text-left">Peminjam</th>
                    <th className="px-5 py-3 text-left">Koleksi Diminta</th>
                    <th className="px-5 py-3 text-center">Waktu Pengajuan</th>
                    <th className="px-5 py-3 text-center">Batas Waktu</th>
                    <th className="px-5 py-3 text-center">Status</th>
                    <th className="px-5 py-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/70 text-foreground">
                  {recentRequests.map((req) => {
                    const bookItems = req.items || [];
                    const isPending = req.status === 'pending';

                    return (
                      <tr
                        key={req.id}
                        className="hover:bg-surface-secondary/40 transition-colors"
                      >
                        {/* No. Pengajuan */}
                        <td className="px-5 py-3.5 text-left font-semibold text-xs text-foreground whitespace-nowrap">
                          {req.request_number}
                        </td>

                        {/* Identitas Peminjam */}
                        <td className="px-5 py-3.5 text-left">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-semibold text-xs shrink-0">
                              {req.user?.full_name?.charAt(0) || 'U'}
                            </div>
                            <div>
                              <div className="font-medium text-foreground">
                                {req.user?.full_name || 'Anggota'}
                              </div>
                              <div className="text-xs text-muted">
                                {req.user?.member_number || '-'}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Koleksi Buku Diminta + Mini Cover Stacks */}
                        <td className="px-5 py-3.5 text-left">
                          <div className="flex items-center gap-2.5">
                            {/* Mini Stacks Cover */}
                            <div className="flex items-center -space-x-3 shrink-0">
                              {bookItems.slice(0, 3).map((item, idx) => (
                                <div
                                  key={item.id}
                                  style={{ zIndex: 10 - idx }}
                                  className="relative w-6 h-8 rounded-md overflow-hidden bg-surface-secondary border border-surface shadow-xs shrink-0"
                                >
                                  {item.book?.cover_url ? (
                                    <Image
                                      src={item.book.cover_url}
                                      alt={item.book.title}
                                      fill
                                      sizes="24px"
                                      className="object-cover"
                                    />
                                  ) : (
                                    <div className="flex items-center justify-center h-full text-slate-400">
                                      <BookOpen className="w-3 h-3 opacity-40" />
                                    </div>
                                  )}
                                  <div className="absolute inset-y-0 left-0 w-1 bg-linear-to-r from-black/40 via-white/10 to-transparent pointer-events-none" />
                                </div>
                              ))}
                            </div>

                            <div className="text-left">
                              <span className="font-medium text-foreground block">
                                {bookItems.length} Buku
                              </span>
                              <span className="text-xs text-muted truncate max-w-44 block font-serif">
                                {bookItems[0]?.book?.title || 'Koleksi Perpustakaan'}
                                {bookItems.length > 1 ? ` (+${bookItems.length - 1})` : ''}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Waktu Pengajuan */}
                        <td className="px-5 py-3.5 text-center text-muted">
                          <span className="font-medium text-foreground block">
                            {formatDate(req.requested_at)}
                          </span>
                          <span className="text-xs text-muted block">
                            {new Date(req.requested_at).toLocaleTimeString('id-ID', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })} WIB
                          </span>
                        </td>

                        {/* Batas Ambil / Batas Verifikasi */}
                        <td className="px-5 py-3.5 text-center">
                          <div className="flex justify-center">
                            {isPending ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900/40 whitespace-nowrap">
                                <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                                <span>Batas: {req.expires_at ? formatDate(req.expires_at) : '2 Hari Kerja'}</span>
                              </span>
                            ) : req.pickup_deadline && req.status === 'approved' ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/40 whitespace-nowrap">
                                <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                <span>Batas: {formatDate(req.pickup_deadline)}</span>
                              </span>
                            ) : ['expired', 'not_picked_up'].includes(req.status) ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40 whitespace-nowrap">
                                <Clock className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                                <span>
                                  Lewat: {formatDate(req.pickup_deadline || req.expires_at || req.requested_at)}
                                </span>
                              </span>
                            ) : (
                              <span className="text-muted text-xs">-</span>
                            )}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-5 py-3.5 text-center">
                          <div className="flex justify-center">
                            <StatusBadge status={req.status} />
                          </div>
                        </td>

                        {/* Tombol Aksi */}
                        <td className="px-5 py-3.5 text-center">
                          <div className="flex justify-center">
                            <Link
                              href={`/admin/requests/${req.id}`}
                              className={`inline-flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                                isPending
                                  ? 'bg-primary text-white hover:bg-primary-hover shadow-2xs active:scale-95'
                                  : 'border border-border bg-surface-secondary text-foreground hover:bg-surface-secondary/80'
                              }`}
                            >
                              <span>{isPending ? 'Verifikasi' : 'Rincian'}</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
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
