import { createClient } from '@/lib/supabase/server';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import { formatCurrency, formatDate } from '@/lib/utils';
import { CircleAlert, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default async function FinesPage() {
  let fines: any[] = [];
  let totalUnpaid = 0;

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data } = await supabase
        .from('fines')
        .select(`
          *,
          loan_item:loan_items(*, book:books(*))
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (data) {
        fines = data;
        totalUnpaid = data
          .filter((f) => f.status === 'unpaid')
          .reduce((acc, f) => acc + Number(f.amount), 0);
      }
    }
  } catch (err) {
    console.warn('Error fetching fines:', err);
  }

  const unpaidFines = fines.filter((f) => f.status === 'unpaid');
  const paidFines = fines.filter((f) => f.status === 'paid');

  const fineTypeLabels: Record<string, string> = {
    overdue: 'Keterlambatan Pengembalian (Rp 1.000/hari)',
    damage_minor: 'Kerusakan Ringan (0.5x Nilai Buku)',
    damage_major: 'Kerusakan Berat (1.5x Nilai Buku)',
    lost: 'Buku Hilang (2.0x Nilai Buku)',
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Daftar Denda & Kewajiban"
        description="Informasi denda keterlambatan atau ganti rugi fisik buku perpustakaan."
      />

      {/* Info Banner Total Denda */}
      {totalUnpaid > 0 ? (
        <div className="p-6 rounded-2xl border-2 border-red-500/40 bg-red-50/50 dark:bg-red-950/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-red-600 dark:text-red-400 uppercase tracking-wider">
              Total Denda Aktif Belum Lunas
            </span>
            <p className="text-3xl font-extrabold text-red-600 dark:text-red-400 mt-1">
              {formatCurrency(totalUnpaid)}
            </p>
            <p className="text-xs text-[var(--muted)] mt-1">
              Akun Anda terkunci untuk mengajukan peminjaman buku baru sampai denda ini diselesaikan.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-xs text-[var(--muted)] max-w-sm">
            <p className="font-semibold text-[var(--foreground)] mb-1">Cara Pembayaran:</p>
            <p>
              Harap datang ke loket sirkulasi fisik perpustakaan dan lakukan pembayaran tunai/QRIS kepada petugas jaga untuk verifikasi pelunasan.
            </p>
          </div>
        </div>
      ) : (
        <div className="p-5 rounded-2xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/40 dark:bg-emerald-950/20 flex items-center gap-3 text-emerald-800 dark:text-emerald-300 text-xs md:text-sm font-medium">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Selamat! Anda tidak memiliki tagihan denda keterlambatan atau ganti rugi yang aktif.</span>
        </div>
      )}

      {/* Tabel Denda Belum Lunas */}
      {unpaidFines.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-[var(--foreground)]">Denda yang Perlu Diselesaikan</h3>
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-[var(--border)] text-[var(--muted)] uppercase font-semibold">
                  <tr>
                    <th className="px-5 py-3.5">Buku Terkait</th>
                    <th className="px-5 py-3.5">Jenis Denda</th>
                    <th className="px-5 py-3.5">Keterlambatan</th>
                    <th className="px-5 py-3.5">Jumlah Nominal</th>
                    <th className="px-5 py-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)] text-[var(--foreground)]">
                  {unpaidFines.map((fine) => (
                    <tr key={fine.id}>
                      <td className="px-5 py-4 font-semibold">
                        {fine.loan_item?.book?.title || 'Buku Perpustakaan'}
                      </td>
                      <td className="px-5 py-4 text-[var(--muted)]">
                        {fineTypeLabels[fine.type] || fine.type}
                      </td>
                      <td className="px-5 py-4">
                        {fine.days_overdue ? `${fine.days_overdue} hari` : '-'}
                      </td>
                      <td className="px-5 py-4 font-mono font-bold text-red-600 dark:text-red-400">
                        {formatCurrency(fine.amount)}
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={fine.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Riwayat Denda yang Sudah Lunas */}
      {paidFines.length > 0 && (
        <div className="space-y-3 pt-4">
          <h3 className="text-sm font-bold text-[var(--foreground)]">Riwayat Denda Lunas</h3>
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-[var(--border)] text-[var(--muted)] uppercase font-semibold">
                  <tr>
                    <th className="px-5 py-3.5">Buku Terkait</th>
                    <th className="px-5 py-3.5">Jenis Denda</th>
                    <th className="px-5 py-3.5">Jumlah Nominal</th>
                    <th className="px-5 py-3.5">Tanggal Pelunasan</th>
                    <th className="px-5 py-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)] text-[var(--foreground)]">
                  {paidFines.map((fine) => (
                    <tr key={fine.id} className="opacity-75">
                      <td className="px-5 py-4 font-medium">
                        {fine.loan_item?.book?.title || 'Buku Perpustakaan'}
                      </td>
                      <td className="px-5 py-4 text-[var(--muted)]">
                        {fineTypeLabels[fine.type] || fine.type}
                      </td>
                      <td className="px-5 py-4 font-mono">
                        {formatCurrency(fine.amount)}
                      </td>
                      <td className="px-5 py-4 text-[var(--muted)]">
                        {formatDate(fine.paid_at)}
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={fine.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {fines.length === 0 && (
        <EmptyState
          icon={CircleAlert}
          title="Tidak Ada Catatan Denda"
          description="Rekam jejak peminjaman Anda sangat baik! Tidak ada catatan denda aktif maupun historis."
        />
      )}
    </div>
  );
}
