'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CircleAlert, CheckCircle2, Search } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import { formatCurrency, formatDate } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';

interface AdminFinesClientProps {
  fines: any[];
}

export function AdminFinesClient({ fines }: AdminFinesClientProps) {
  const router = useRouter();
  const [filter, setFilter] = useState<'unpaid' | 'paid' | 'all'>('unpaid');
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const supabase = createClient();

  const filteredFines = fines.filter((f) => {
    if (filter === 'all') return true;
    return f.status === filter;
  });

  const handleConfirmPayment = async (fineId: string) => {
    if (!confirm('Konfirmasi bahwa anggota telah melunasi denda ini di loket perpustakaan?')) return;

    setConfirmingId(fineId);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { error } = await supabase
        .from('fines')
        .update({
          status: 'paid',
          paid_at: new Date().toISOString(),
          confirmed_by: user?.id || null,
        })
        .eq('id', fineId);

      if (error) throw error;
      router.refresh();
    } catch (err: any) {
      alert('Gagal mengonfirmasi pelunasan: ' + err.message);
    } finally {
      setConfirmingId(null);
    }
  };

  const fineTypeLabels: Record<string, string> = {
    overdue: 'Keterlambatan (Rp 1.000/hari)',
    damage_minor: 'Kerusakan Ringan (0.5x)',
    damage_major: 'Kerusakan Berat (1.5x)',
    lost: 'Buku Hilang (2.0x)',
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manajemen Denda & Sanksi Finansial"
        description="Pantau dan konfirmasi pelunasan denda keterlambatan serta biaya ganti rugi fisik koleksi perpustakaan."
      />

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-[var(--border)] w-fit text-xs font-medium">
        <button
          onClick={() => setFilter('unpaid')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            filter === 'unpaid'
              ? 'bg-white dark:bg-slate-800 text-red-600 font-bold shadow-xs'
              : 'text-[var(--muted)] hover:text-[var(--foreground)]'
          }`}
        >
          Belum Lunas ({fines.filter((f) => f.status === 'unpaid').length})
        </button>
        <button
          onClick={() => setFilter('paid')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            filter === 'paid'
              ? 'bg-white dark:bg-slate-800 text-emerald-600 font-bold shadow-xs'
              : 'text-[var(--muted)] hover:text-[var(--foreground)]'
          }`}
        >
          Sudah Lunas ({fines.filter((f) => f.status === 'paid').length})
        </button>
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            filter === 'all'
              ? 'bg-white dark:bg-slate-800 text-[var(--foreground)] font-bold shadow-xs'
              : 'text-[var(--muted)] hover:text-[var(--foreground)]'
          }`}
        >
          Semua ({fines.length})
        </button>
      </div>

      {/* Tabel Denda */}
      {filteredFines.length > 0 ? (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-[var(--border)] text-[var(--muted)] uppercase font-semibold">
                <tr>
                  <th className="px-5 py-3.5">Nama Anggota</th>
                  <th className="px-5 py-3.5">Buku Terkait</th>
                  <th className="px-5 py-3.5">Kategori Denda</th>
                  <th className="px-5 py-3.5">Nominal</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)] text-[var(--foreground)]">
                {filteredFines.map((fine) => (
                  <tr key={fine.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                    <td className="px-5 py-4 font-semibold">
                      <div className="text-sm">{fine.user?.full_name}</div>
                      <div className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400">
                        {fine.user?.member_number}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-[var(--muted)] max-w-xs truncate">
                      {fine.loan_item?.book?.title || 'Buku Perpustakaan'}
                    </td>
                    <td className="px-5 py-4 text-[var(--muted)]">
                      <div>{fineTypeLabels[fine.type] || fine.type}</div>
                      {fine.days_overdue > 0 && (
                        <div className="text-[11px] text-amber-600">
                          {fine.days_overdue} hari telat
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4 font-mono font-bold text-sm">
                      {formatCurrency(fine.amount)}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={fine.status} />
                    </td>
                    <td className="px-5 py-4 text-right">
                      {fine.status === 'unpaid' ? (
                        <button
                          onClick={() => handleConfirmPayment(fine.id)}
                          disabled={confirmingId === fine.id}
                          className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors disabled:opacity-50"
                        >
                          {confirmingId === fine.id ? 'Menyimpan...' : 'Konfirmasi Lunas'}
                        </button>
                      ) : (
                        <span className="text-[11px] text-[var(--muted)]">
                          Lunas {formatDate(fine.paid_at)}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState
          icon={CircleAlert}
          title="Tidak Ada Data Denda"
          description="Tidak ditemukan catatan tagihan denda untuk filter ini."
        />
      )}
    </div>
  );
}
