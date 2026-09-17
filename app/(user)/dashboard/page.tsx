import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatCard } from '@/components/dashboard/StatCard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  BookmarkCheck,
  Clock,
  CircleAlert,
  History,
  BookOpen,
  ArrowRight,
  QrCode,
} from 'lucide-react';

export default async function DashboardPage() {
  let activeLoansCount = 0;
  let pendingRequestsCount = 0;
  let unpaidFinesTotal = 0;
  let completedLoansCount = 0;
  let activePasses: any[] = [];
  let currentLoans: any[] = [];

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const [loansRes, requestsRes, finesRes, completedRes, passesRes] = await Promise.all([
        supabase
          .from('loans')
          .select('*, items:loan_items(*, book:books(*))')
          .eq('user_id', user.id)
          .eq('status', 'active'),
        supabase
          .from('loan_requests')
          .select('id')
          .eq('user_id', user.id)
          .eq('status', 'pending'),
        supabase
          .from('fines')
          .select('amount')
          .eq('user_id', user.id)
          .eq('status', 'unpaid'),
        supabase
          .from('loan_items')
          .select('id, loan:loans!inner(user_id)')
          .eq('loan.user_id', user.id)
          .eq('status', 'returned'),
        supabase
          .from('loan_requests')
          .select('*, pass:pickup_passes(*)')
          .eq('user_id', user.id)
          .eq('status', 'approved'),
      ]);

      if (loansRes.data) {
        currentLoans = loansRes.data;
        activeLoansCount = (loansRes.data as any[]).reduce(
          (acc, loan) => acc + (loan.items?.filter((i: any) => i.status === 'borrowed').length || 0),
          0
        );
      }

      if (requestsRes.data) {
        pendingRequestsCount = requestsRes.data.length;
      }

      if (finesRes.data) {
        unpaidFinesTotal = finesRes.data.reduce((acc, f) => acc + Number(f.amount), 0);
      }

      if (completedRes.data) {
        completedLoansCount = completedRes.data.length;
      }

      if (passesRes.data) {
        activePasses = passesRes.data;
      }
    }
  } catch (err) {
    console.warn('Dashboard data fetch fallback:', err);
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard Anggota"
        description="Pantau status peminjaman, batas pengembalian, dan aktivitas perpustakaan Anda."
        action={
          <Link
            href="/catalog"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            <span>Pinjam Buku Baru</span>
          </Link>
        }
      />

      {/* Grid 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Buku Dipinjam"
          value={activeLoansCount}
          description="Buku fisik aktif di tangan Anda"
          icon={BookmarkCheck}
          variant="primary"
        />
        <StatCard
          title="Pengajuan Menunggu"
          value={pendingRequestsCount}
          description="Menunggu review pustakawan"
          icon={Clock}
          variant="amber"
        />
        <StatCard
          title="Denda Belum Lunas"
          value={formatCurrency(unpaidFinesTotal)}
          description={unpaidFinesTotal > 0 ? 'Harap lunasi di loket sirkulasi' : 'Tidak ada tagihan denda'}
          icon={CircleAlert}
          variant={unpaidFinesTotal > 0 ? 'rose' : 'emerald'}
        />
        <StatCard
          title="Riwayat Selesai"
          value={completedLoansCount}
          description="Total buku berhasil dikembalikan"
          icon={History}
          variant="emerald"
        />
      </div>

      {/* Banner Pickup Pass Aktif Jika Ada */}
      {activePasses.length > 0 && (
        <div className="p-5 rounded-2xl border-2 border-indigo-500/40 bg-indigo-50/50 dark:bg-indigo-950/30 space-y-3">
          <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-semibold text-sm">
            <QrCode className="w-5 h-5" />
            <span>Kartu Pengambilan (Pickup Pass) Siap Digunakan!</span>
          </div>
          <p className="text-xs text-[var(--muted)] leading-relaxed">
            Pengajuan peminjaman Anda telah disetujui oleh pustakawan. Silakan buka kartu pengambilan dan tunjukkan kode QR di loket fisik perpustakaan.
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {activePasses.map((p) => (
              <Link
                key={p.id}
                href={`/requests/${p.id}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium transition-colors"
              >
                <span>Lihat Pass {p.request_number}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Section Buku yang Sedang Dipinjam */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-[var(--foreground)]">
            Daftar Pinjaman Sedang Berjalan
          </h3>
          <Link
            href="/loans"
            className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Lihat Semua
          </Link>
        </div>

        {currentLoans.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentLoans.slice(0, 4).flatMap((loan) =>
              loan.items?.map((item: any) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] flex items-center justify-between gap-3 shadow-xs"
                >
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold text-sm text-[var(--foreground)] truncate">
                      {item.book?.title}
                    </h4>
                    <p className="text-xs text-[var(--muted)] mt-0.5">{item.book?.author}</p>
                    <p className="text-[11px] text-[var(--muted)] mt-1.5">
                      Jatuh tempo: <strong className="text-[var(--foreground)]">{formatDate(item.due_date)}</strong>
                    </p>
                  </div>
                  <StatusBadge status={item.status} />
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="p-8 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-[var(--surface)] text-center flex flex-col items-center justify-center shadow-xs">
            <BookmarkCheck className="w-10 h-10 text-slate-300 dark:text-slate-600 mb-2 stroke-1" />
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              Belum ada buku yang sedang dipinjam
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
              Jelajahi koleksi literatur perpustakaan dan ajukan peminjaman buku favorit Anda sekarang.
            </p>
            <Link
              href="/catalog"
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold border border-indigo-100 dark:border-indigo-900/50 hover:bg-indigo-100 transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Buka Katalog Buku</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
