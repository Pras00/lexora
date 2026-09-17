import { createClient } from '@/lib/supabase/server';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatCard } from '@/components/dashboard/StatCard';
import { formatCurrency } from '@/lib/utils';
import { BarChart3, TrendingUp, CheckCircle, AlertTriangle, Coins } from 'lucide-react';

export default async function AdminReportsPage() {
  let totalLoans = 0;
  let totalReturned = 0;
  let totalOverdue = 0;
  let totalFineCollected = 0;
  let totalFineOutstanding = 0;

  try {
    const supabase = await createClient();

    const [itemsRes, finesRes] = await Promise.all([
      supabase.from('loan_items').select('id, status'),
      supabase.from('fines').select('amount, status'),
    ]);

    if (itemsRes.data) {
      totalLoans = itemsRes.data.length;
      totalReturned = itemsRes.data.filter((i) => i.status === 'returned').length;
      totalOverdue = itemsRes.data.filter((i) => i.status === 'overdue').length;
    }

    if (finesRes.data) {
      totalFineCollected = finesRes.data
        .filter((f) => f.status === 'paid')
        .reduce((acc, f) => acc + Number(f.amount), 0);

      totalFineOutstanding = finesRes.data
        .filter((f) => f.status === 'unpaid')
        .reduce((acc, f) => acc + Number(f.amount), 0);
    }
  } catch (err) {
    console.warn('Error fetching reports data:', err);
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
      <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] space-y-4">
        <h3 className="font-semibold text-sm text-[var(--foreground)]">
          Pedoman & Standar Kepatuhan Sirkulasi Lexora
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-[var(--muted)] leading-relaxed">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-[var(--border)]">
            <h4 className="font-bold text-[var(--foreground)] mb-1">Durasi Peminjaman</h4>
            <p>14 hari kalender dengan batas perpanjangan otomatis maksimal 1 kali (+7 hari) jika tidak ada daftar antrean.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-[var(--border)]">
            <h4 className="font-bold text-[var(--foreground)] mb-1">Ketepatan Ambil (Pickup)</h4>
            <p>2 hari kerja setelah status disetujui. Kegagalan ambil 3 kali berturut-turut memicu suspensi akun 7 hari.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-[var(--border)]">
            <h4 className="font-bold text-[var(--foreground)] mb-1">Tarif Denda Harian</h4>
            <p>Rp 1.000 / buku / hari dihitung H+1 setelah tanggal jatuh tempo berakhir.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
