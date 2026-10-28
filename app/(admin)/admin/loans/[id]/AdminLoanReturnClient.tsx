'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, AlertCircle, Clock, BookOpen } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { formatDate, formatCurrency } from '@/lib/utils';
import { calculateOverdueFine, calculateDamageReplacementCost } from '@/lib/fine-calculator';
import { DamageLevel } from '@/types';
import { returnLoanItem } from '@/app/actions/loans';

interface AdminLoanReturnClientProps {
  loan: any;
}

export function AdminLoanReturnClient({ loan }: AdminLoanReturnClientProps) {
  const router = useRouter();
  const [selectedConditions, setSelectedConditions] = useState<Record<string, DamageLevel>>(() => {
    const init: Record<string, DamageLevel> = {};
    loan.items?.forEach((item: any) => {
      init[item.id] = 'none';
    });
    return init;
  });

  const [processingItemId, setProcessingItemId] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleReturnItem = async (item: any) => {
    setProcessingItemId(item.id);
    setMsg(null);

    const condition = selectedConditions[item.id] || 'none';

    try {
      const res = await returnLoanItem(loan.id, item.id, condition);
      if (!res.success) {
        setMsg({
          type: 'error',
          text: res.error || 'Gagal memproses pengembalian buku.',
        });
        return;
      }

      setMsg({
        type: 'success',
        text: `Buku "${item.book?.title}" berhasil diproses kembali ke perpustakaan.`,
      });

      router.refresh();
    } catch (err: any) {
      setMsg({
        type: 'error',
        text: err.message || 'Gagal memproses pengembalian buku.',
      });
    } finally {
      setProcessingItemId(null);
    }
  };

  return (
    <div className="space-y-6">
      <Link
        href="/admin/loans"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--foreground)] hover:text-[var(--foreground)] transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Kembali ke Daftar Peminjaman
      </Link>

      <PageHeader
        title="Proses Pengembalian Koleksi Fisik"
        description={`Peminjam: ${loan.user?.full_name} (${loan.user?.member_number}) • Diambil pada: ${formatDate(loan.pickup_confirmed_at)}`}
      />

      {msg && (
        <div
          className={`p-4 rounded-xl border flex items-start gap-3 text-xs md:text-sm ${
            msg.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-300'
              : 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400'
          }`}
        >
          {msg.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          )}
          <span>{msg.text}</span>
        </div>
      )}

      {/* Daftar Item Buku yang Perlu Dikembalikan */}
      <div className="space-y-4">
        {loan.items?.map((item: any) => {
          const isBorrowed = item.status === 'borrowed' || item.status === 'overdue';
          const condition = selectedConditions[item.id] || 'none';
          const { daysOverdue, fineAmount } = calculateOverdueFine(item.due_date);
          const replacementCost = calculateDamageReplacementCost(item.book?.price || 0, condition);

          return (
            <div
              key={item.id}
              className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-xs space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[var(--border)] gap-2">
                <div>
                  <h4 className="font-semibold text-base text-[var(--foreground)]">
                    {item.book?.title}
                  </h4>
                  <p className="text-xs text-[var(--foreground)]">{item.book?.author} • Nilai buku: {formatCurrency(item.book?.price)}</p>
                </div>
                <StatusBadge status={item.status} />
              </div>

              {isBorrowed ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-medium text-[var(--foreground)] mb-1">
                      Kondisi Fisik Buku Kembali:
                    </label>
                    <select
                      value={condition}
                      onChange={(e) =>
                        setSelectedConditions((prev) => ({
                          ...prev,
                          [item.id]: e.target.value as DamageLevel,
                        }))
                      }
                      className="w-full px-3 py-2 text-xs rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-indigo-600 font-medium"
                    >
                      <option value="none">Kondisi Baik / Utuh</option>
                      <option value="minor">Rusak Ringan (Ganti Rugi 0.5x)</option>
                      <option value="major">Rusak Berat (Ganti Rugi 1.5x)</option>
                      <option value="lost">Buku Hilang (Ganti Rugi 2.0x)</option>
                    </select>
                  </div>

                  <div className="text-xs text-[var(--foreground)] space-y-1">
                    <p>
                      Jatuh tempo: <strong className="text-[var(--foreground)]">{formatDate(item.due_date)}</strong>
                    </p>
                    {daysOverdue > 0 ? (
                      <p className="text-red-600 font-semibold">
                        Terlambat {daysOverdue} hari (Denda: {formatCurrency(fineAmount)})
                      </p>
                    ) : (
                      <p className="text-emerald-600 font-medium">Tepat waktu (Tanpa denda telat)</p>
                    )}
                    {replacementCost > 0 && (
                      <p className="text-red-600 font-semibold">
                        Biaya Kerusakan: {formatCurrency(replacementCost)}
                      </p>
                    )}
                  </div>

                  <div className="flex items-end justify-end">
                    <button
                      onClick={() => handleReturnItem(item)}
                      disabled={processingItemId === item.id}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors disabled:opacity-50"
                    >
                      {processingItemId === item.id ? 'Menyimpan...' : 'Konfirmasi Penerimaan'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-[var(--foreground)]">
                  Buku ini telah dikembalikan pada {formatDate(item.returned_at)} (Kondisi: {item.damage_level}).
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
