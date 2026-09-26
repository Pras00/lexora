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
  Calendar,
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

function getDueUrgency(dueDateStr: string) {
  const now = new Date();
  const due = new Date(dueDateStr);
  const diffTime = due.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      text: `Terlambat ${Math.abs(diffDays)} hari`,
      className:
        'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200 dark:border-rose-900/50',
    };
  } else if (diffDays === 0) {
    return {
      text: 'Jatuh tempo hari ini',
      className:
        'bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-900/50',
    };
  } else if (diffDays <= 2) {
    return {
      text: `${diffDays} hari lagi`,
      className:
        'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-900/50',
    };
  } else {
    return {
      text: `${diffDays} hari tersisa`,
      className:
        'bg-slate-50 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700',
    };
  }
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
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold bg-primary text-white rounded-xl hover:bg-primary-hover shadow-sm transition-colors"
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
        <div className="relative overflow-hidden rounded-2xl border border-indigo-200 bg-linear-to-r from-indigo-50 to-indigo-100/50 dark:from-indigo-950/40 dark:to-slate-900 dark:border-indigo-900/60 p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-xs shrink-0 mt-0.5">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-foreground">
                    QR Pickup Pass Siap Digunakan
                  </h4>
                  <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-600 text-white">
                    Siap Ambil
                  </span>
                </div>
                <p className="text-xs text-muted mt-1 max-w-xl leading-relaxed">
                  Pengajuan peminjaman Anda telah diverifikasi oleh pustakawan.
                  Tunjukkan kode QR di loket fisik untuk pengambilan buku.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {activePasses.map((p) => (
                <Link
                  key={p.id}
                  href={`/requests/${p.id}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-primary text-white rounded-xl hover:bg-primary-hover shadow-xs transition-all active:scale-95"
                >
                  <span>Pass #{p.request_number}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Pinjaman Berjalan ────────────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-foreground">
              Pinjaman Sedang Berjalan
            </h3>
            <p className="text-xs text-muted mt-0.5">
              Daftar buku yang sedang Anda bawa beserta batas waktu pengembalian.
            </p>
          </div>
          <Link
            href="/loans"
            className="text-xs font-bold text-primary hover:underline transition-colors"
          >
            Lihat Semua Pinjaman →
          </Link>
        </div>

        {currentLoans.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentLoans.slice(0, 4).flatMap((loan) =>
              loan.items?.map((item: LoanItem) => {
                const urgency = getDueUrgency(item.due_date);

                return (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-surface border border-border shadow-xs flex items-center justify-between gap-4 hover:border-indigo-300 dark:hover:border-indigo-800 transition-all hover:shadow-sm"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${urgency.className}`}
                        >
                          {urgency.text}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-foreground truncate">
                        {item.book?.title || 'Judul Buku'}
                      </h4>
                      <p className="text-xs font-medium text-muted mt-0.5">
                        {item.book?.author || 'Pengarang'}
                      </p>
                      <div className="flex items-center gap-1.5 text-xs text-muted mt-2.5">
                        <Calendar className="w-3.5 h-3.5 text-muted" />
                        <span>Batas kembali:</span>
                        <strong className="text-foreground font-semibold">
                          {formatDate(item.due_date)}
                        </strong>
                      </div>
                    </div>
                    <StatusBadge status={item.status} />
                  </div>
                );
              })
            )}
          </div>
        ) : (
          <div className="border border-dashed border-border-strong rounded-3xl bg-surface p-10 text-center">
            <BookmarkCheck className="w-10 h-10 text-slate-300 dark:text-slate-600 mb-3 mx-auto stroke-1" />
            <h4 className="text-base font-bold text-foreground mb-1">
              Tidak Ada Pinjaman Aktif
            </h4>
            <p className="text-xs text-muted max-w-sm mx-auto mb-5 leading-relaxed">
              Anda tidak memiliki tanggungan peminjaman buku fisik saat ini.
              Jelajahi katalog untuk menemukan bacaan menarik berikutnya.
            </p>
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold bg-primary text-white rounded-xl hover:bg-primary-hover shadow-xs transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              <span>Jelajahi Koleksi Buku</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
