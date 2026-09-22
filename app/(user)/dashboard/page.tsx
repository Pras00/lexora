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

interface BookInfo {
  title: string;
  author: string;
}

interface LoanItem {
  id: string;
  status: string;
  due_date: string;
  book: BookInfo | null;
}

interface CurrentLoan {
  id: string;
  status: string;
  items: LoanItem[];
}

interface ActivePass {
  id: string;
  request_number: string;
}

export default async function DashboardPage() {
  let activeLoansCount = 0;
  let pendingRequestsCount = 0;
  let unpaidFinesTotal = 0;
  let completedLoansCount = 0;
  let activePasses: ActivePass[] = [];
  let currentLoans: CurrentLoan[] = [];

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const [loansRes, requestsRes, finesRes, completedRes, passesRes] =
        await Promise.all([
          supabase
            .from('loans')
            .select(
              'id, status, items:loan_items(id, status, due_date, book:books(title, author))'
            )
            .eq('user_id', user.id)
            .eq('status', 'active')
            .limit(10),
          supabase
            .from('loan_requests')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .eq('status', 'pending'),
          supabase
            .from('fines')
            .select('amount')
            .eq('user_id', user.id)
            .eq('status', 'unpaid'),
          supabase
            .from('loans')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .eq('status', 'completed'),
          supabase
            .from('loan_requests')
            .select(
              'id, request_number, pass:pickup_passes(id, pickup_code, expires_at)'
            )
            .eq('user_id', user.id)
            .eq('status', 'approved')
            .limit(5),
        ]);

      if (loansRes.data) {
        currentLoans = loansRes.data as unknown as CurrentLoan[];
        activeLoansCount = currentLoans.reduce(
          (acc, loan) =>
            acc +
            (loan.items?.filter((i: LoanItem) => i.status === 'borrowed').length ||
              0),
          0
        );
      }
      if (requestsRes.count != null) pendingRequestsCount = requestsRes.count;
      if (finesRes.data)
        unpaidFinesTotal = finesRes.data.reduce(
          (acc, f) => acc + Number(f.amount),
          0
        );
      if (completedRes.count != null) completedLoansCount = completedRes.count;
      if (passesRes.data) activePasses = passesRes.data as unknown as ActivePass[];
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
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-sm transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            <span>Pinjam Buku Baru</span>
          </Link>
        }
      />

      {/* ── 4 Stat Cards ──────────────────────────────────────────── */}
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
          description={
            unpaidFinesTotal > 0
              ? 'Harap lunasi di loket sirkulasi'
              : 'Tidak ada tagihan denda'
          }
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

      {/* ── Pickup Pass Banner ────────────────────────────────────── */}
      {activePasses.length > 0 && (
        <div className="rounded-2xl border border-indigo-200 bg-indigo-50 dark:bg-indigo-900/20 dark:border-indigo-800/50 p-5 shadow-sm">
          <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-bold text-sm mb-2">
            <QrCode className="w-5 h-5" />
            <span>Kartu Pengambilan Siap Digunakan</span>
          </div>
          <p className="text-sm font-medium text-[var(--muted)] leading-relaxed mb-4">
            Pengajuan peminjaman Anda telah disetujui. Silakan tunjukkan kode
            QR di loket fisik perpustakaan.
          </p>
          <div className="flex flex-wrap gap-2">
            {activePasses.map((p) => (
              <Link
                key={p.id}
                href={`/requests/${p.id}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-sm transition-colors"
              >
                <span>Lihat Pass {p.request_number}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ── Pinjaman Berjalan ────────────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-[var(--foreground)]">
            Pinjaman Sedang Berjalan
          </h3>
          <Link
            href="/loans"
            className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 hover:underline transition-colors"
          >
            Lihat Semua
          </Link>
        </div>

        {currentLoans.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentLoans.slice(0, 4).flatMap((loan) =>
              loan.items?.map((item: LoanItem) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm flex items-center justify-between gap-4 hover:border-indigo-200 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-bold text-[var(--foreground)] truncate">
                      {item.book?.title}
                    </h4>
                    <p className="text-xs font-medium text-[var(--muted)] mt-0.5">
                      {item.book?.author}
                    </p>
                    <p className="text-xs font-medium text-[var(--muted)] mt-2">
                      Jatuh tempo:{' '}
                      <strong className="text-[var(--foreground)]">
                        {formatDate(item.due_date)}
                      </strong>
                    </p>
                  </div>
                  <StatusBadge status={item.status} />
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="border border-dashed border-[var(--border-strong)] rounded-3xl bg-[var(--surface)] p-10 text-center">
            <BookmarkCheck className="w-10 h-10 text-slate-300 dark:text-slate-600 mb-4 mx-auto stroke-1" />
            <p className="text-base font-bold text-[var(--foreground)] mb-1">
              Belum ada buku yang sedang dipinjam
            </p>
            <p className="text-sm text-[var(--muted)] max-w-sm mx-auto mb-5">
              Jelajahi koleksi literatur dan ajukan peminjaman buku favorit Anda.
            </p>
            <Link
              href="/catalog"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-bold bg-indigo-50 text-indigo-700 rounded-xl hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-300 dark:hover:bg-indigo-900/50 transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              <span>Buka Katalog Buku</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
