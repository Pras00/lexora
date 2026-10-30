import { sql } from '@/lib/db/neon';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatCard } from '@/components/dashboard/StatCard';
import { formatCurrency } from '@/lib/utils';
import { TrendingUp, CheckCircle, AlertTriangle, Coins } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminReportsPage() {
  let totalLoans = 0;
  let totalReturned = 0;
  let totalFineCollected = 0;
  let totalFineOutstanding = 0;

  try {
    const [loanStats, fineStats] = await Promise.all([
      sql`
        SELECT 
          COUNT(*)::int as total_loans,
          COUNT(CASE WHEN status = 'returned' THEN 1 END)::int as total_returned,
          COUNT(CASE WHEN status = 'overdue' THEN 1 END)::int as total_overdue
        FROM public.loan_items
      `,
      sql`
        SELECT 
          COALESCE(SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END), 0)::int as total_fine_collected,
          COALESCE(SUM(CASE WHEN status = 'unpaid' THEN amount ELSE 0 END), 0)::int as total_fine_outstanding
        FROM public.fines
      `,
    ]);

    if (loanStats && loanStats.length > 0) {
      totalLoans = Number(loanStats[0].total_loans) || 0;
      totalReturned = Number(loanStats[0].total_returned) || 0;
    }

    if (fineStats && fineStats.length > 0) {
      totalFineCollected = Number(fineStats[0].total_fine_collected) || 0;
      totalFineOutstanding = Number(fineStats[0].total_fine_outstanding) || 0;
    }
  } catch (err) {
    console.warn('Error fetching reports data from NeonDB:', err);
  }

  const returnRate = totalLoans > 0 ? Math.round((totalReturned / totalLoans) * 100) : 100;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Laporan & Statistik Sirkulasi"
        description="Analisis performa sirkulasi peminjaman, tingkat pengembalian, dan rekapitulasi denda perpustakaan."
      />

      {/* Grid Statistik Utama */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Transaksi Buku"
          value={totalLoans}
          description="Akumulasi seluruh buku yang dipinjam"
          icon={TrendingUp}
          variant="primary"
        />
        <StatCard
          title="Tingkat Pengembalian"
          value={`${returnRate}%`}
          description={`${totalReturned} buku berhasil kembali utuh`}
          icon={CheckCircle}
          variant="emerald"
        />
        <StatCard
          title="Denda Terkumpul"
          value={formatCurrency(totalFineCollected)}
          description="Total kas denda masuk loket"
          icon={Coins}
          variant="emerald"
        />
        <StatCard
          title="Denda Belum Terbayar"
          value={formatCurrency(totalFineOutstanding)}
          description="Piutang denda aktif anggota"
          icon={AlertTriangle}
          variant="rose"
        />
      </div>

      {/* Ringkasan Performa Layanan */}
      <div className="p-6 rounded-2xl border border-border bg-surface space-y-4">
        <h3 className="font-semibold text-sm text-foreground">
          Pedoman & Standar Kepatuhan Sirkulasi Lexora
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-foreground leading-relaxed">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-border">
            <h4 className="font-bold text-foreground mb-1">Durasi Peminjaman</h4>
            <p>14 hari kalender dengan batas perpanjangan otomatis maksimal 1 kali (+7 hari) jika tidak ada daftar antrean.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-border">
            <h4 className="font-bold text-foreground mb-1">Ketepatan Ambil (Pickup)</h4>
            <p>2 hari kerja setelah status disetujui. Kegagalan ambil 3 kali berturut-turut memicu suspensi akun 7 hari.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-border">
            <h4 className="font-bold text-foreground mb-1">Tarif Denda Harian</h4>
            <p>Rp 1.000 / buku / hari dihitung H+1 setelah tanggal jatuh tempo berakhir.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
