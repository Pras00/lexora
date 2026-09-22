import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatCard } from '@/components/dashboard/StatCard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { formatDate } from '@/lib/utils';
import {
  BookOpen,
  Inbox,
  ArrowRightLeft,
  Users,
  CircleAlert,
  ArrowRight,
  Plus,
  QrCode,
} from 'lucide-react';

export default async function AdminDashboardPage() {
  let totalBooks = 0;
  let availableBooks = 0;
  let pendingRequestsCount = 0;
  let activeLoansCount = 0;
  let totalMembers = 0;
  let unpaidFinesCount = 0;
  let recentRequests: any[] = [];

  try {
    const supabase = await createClient();

    const [booksRes, requestsRes, loansRes, membersRes, finesRes, recentReqRes] =
      await Promise.all([
        supabase.from('books').select('total_stock, available_stock'),
        supabase.from('loan_requests').select('id').eq('status', 'pending'),
        supabase.from('loans').select('id').eq('status', 'active'),
        supabase.from('profiles').select('id').eq('role', 'member'),
        supabase.from('fines').select('id').eq('status', 'unpaid'),
        supabase
          .from('loan_requests')
          .select('*, user:profiles(*), items:loan_request_items(*)')
          .order('created_at', { ascending: false })
          .limit(5),
      ]);

    if (booksRes.data) {
      totalBooks = booksRes.data.reduce((acc, b) => acc + b.total_stock, 0);
      availableBooks = booksRes.data.reduce((acc, b) => acc + b.available_stock, 0);
    }

    if (requestsRes.data) pendingRequestsCount = requestsRes.data.length;
    if (loansRes.data) activeLoansCount = loansRes.data.length;
    if (membersRes.data) totalMembers = membersRes.data.length;
    if (finesRes.data) unpaidFinesCount = finesRes.data.length;
    if (recentReqRes.data) recentRequests = recentReqRes.data;
  } catch (err) {
    console.warn('Admin dashboard fetch error:', err);
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard Pustakawan"
        description="Ringkasan operasional sirkulasi, ketersediaan inventori, dan status layanan perpustakaan."
        action={
          <div className="flex items-center gap-2">
            <Link
              href="/admin/loans"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-[var(--foreground)] transition-colors"
            >
              <QrCode className="w-4 h-4 text-indigo-600" />
              <span>Scan Loket Pickup</span>
            </Link>
            <Link
              href="/admin/books/new"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors"
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
          description="Perlu diverifikasi pustakawan"
          icon={Inbox}
          variant={pendingRequestsCount > 0 ? 'amber' : 'default'}
        />
        <StatCard
          title="Peminjaman Fisik Aktif"
          value={activeLoansCount}
          description="Buku sedang di tangan peminjam"
          icon={ArrowRightLeft}
          variant="primary"
        />
        <StatCard
          title="Koleksi Fisik Tersedia"
          value={`${availableBooks} / ${totalBooks}`}
          description="Buku siap di rak perpustakaan"
          icon={BookOpen}
          variant="emerald"
        />
        <StatCard
          title="Denda Belum Terbayar"
          value={`${unpaidFinesCount} Tagihan`}
          description="Perlu konfirmasi pelunasan"
          icon={CircleAlert}
          variant={unpaidFinesCount > 0 ? 'rose' : 'default'}
        />
      </div>

      {/* Section Pengajuan Terbaru */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-[var(--foreground)]">
            Pengajuan Peminjaman Terbaru
          </h3>
          <Link
            href="/admin/requests"
            className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Lihat Semua Pengajuan
          </Link>
        </div>

        {recentRequests.length > 0 ? (
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-[var(--border)] text-[var(--foreground)] uppercase font-semibold">
                  <tr>
                    <th className="px-5 py-3.5">No. Pengajuan</th>
                    <th className="px-5 py-3.5">Nama Anggota</th>
                    <th className="px-5 py-3.5">Buku</th>
                    <th className="px-5 py-3.5">Waktu Pengajuan</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-() text-[var(--foreground)]">
                  {recentRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                      <td className="px-5 py-4 font-mono font-bold">
                        {req.request_number}
                      </td>
                      <td className="px-5 py-4">
                        <div className="font-semibold">{req.user?.full_name}</div>
                        <div className="text-[11px] text-[var(--foreground)] font-mono">
                          {req.user?.member_number}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-[var(--foreground)]">
                        {req.items?.length || 0} buku
                      </td>
                      <td className="px-5 py-4 text-[var(--foreground)]">
                        {formatDate(req.requested_at)}
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={req.status} />
                      </td>
                      <td className="px-5 py-4 text-right">
                        <Link
                          href={`/admin/requests/${req.id}`}
                          className="inline-flex items-center gap-1 font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
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
          <div className="p-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] text-center text-xs text-[var(--foreground)]">
            Belum ada pengajuan masuk.
          </div>
        )}
      </div>
    </div>
  );
}
