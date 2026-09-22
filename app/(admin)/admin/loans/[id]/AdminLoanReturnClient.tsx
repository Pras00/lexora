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
import { createClient } from '@/lib/supabase/client';

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
  const supabase = createClient();

  const handleReturnItem = async (item: any) => {
    setProcessingItemId(item.id);
    setMsg(null);

    const condition = selectedConditions[item.id] || 'none';
    const now = new Date();

    try {
      // 1. Hitung Denda Keterlambatan
      const { daysOverdue, fineAmount: overdueFine } = calculateOverdueFine(item.due_date, now);

      // 2. Hitung Biaya Kerusakan / Kehilangan
      const replacementCost = calculateDamageReplacementCost(item.book.price, condition);

      // 3. Tentukan status baru item
      let newStatus: 'returned' | 'damaged' | 'lost' = 'returned';
      if (condition === 'lost') newStatus = 'lost';
      else if (condition === 'minor' || condition === 'major') newStatus = 'damaged';

      // 4. Update data loan_items
      const { error: itemUpdateError } = await supabase
        .from('loan_items')
        .update({
          status: newStatus,
          returned_at: now.toISOString(),
          damage_level: condition,
          replacement_cost: replacementCost,
        })
        .eq('id', item.id);

      if (itemUpdateError) throw itemUpdateError;

      // 5. Buat tagihan Denda Keterlambatan jika ada
      if (overdueFine > 0) {
        await supabase.from('fines').insert({
          loan_item_id: item.id,
          user_id: loan.user_id,
          type: 'overdue',
          amount: overdueFine,
          days_overdue: daysOverdue,
          status: 'unpaid',
        });
      }

      // 6. Buat tagihan Biaya Fisik jika rusak/hilang
      if (replacementCost > 0) {
        const fineType =
          condition === 'lost'
            ? 'lost'
            : condition === 'major'
            ? 'damage_major'
            : 'damage_minor';

        await supabase.from('fines').insert({
          loan_item_id: item.id,
          user_id: loan.user_id,
          type: fineType,
          amount: replacementCost,
          status: 'unpaid',
        });
      }

      // 7. Update stok inventori buku
      const { data: book } = await supabase
        .from('books')
        .select('available_stock, total_stock')
        .eq('id', item.book_id)
        .single();

      if (book) {
        if (condition === 'lost' || condition === 'major') {
          // Buku ditarik permanen / hilang: kurangi total_stock
          await supabase
            .from('books')
            .update({
              total_stock: Math.max(0, book.total_stock - 1),
            })
            .eq('id', item.book_id);
        } else {
          // Buku kembali dalam kondisi baik / rusak ringan yang bisa diperbaiki: kembalikan available_stock
          await supabase
            .from('books')
            .update({
              available_stock: book.available_stock + 1,
            })
            .eq('id', item.book_id);
        }
      }

      // 8. Cek Waitlist Antrean
      const { data: waitlistEntry } = await supabase
        .from('waitlist')
        .select('*')
        .eq('book_id', item.book_id)
        .eq('status', 'waiting')
        .order('position', { ascending: true })
        .limit(1)
        .single();

      if (waitlistEntry) {
        // Tandai peminjam pertama bahwa buku sudah tersedia
        await supabase
          .from('waitlist')
          .update({ status: 'notified' })
          .eq('id', waitlistEntry.id);

        await supabase.from('notifications').insert({
          user_id: waitlistEntry.user_id,
          type: 'waitlist_available',
          title: 'Buku Dalam Antrean Anda Tersedia!',
          message: `Buku "${item.book?.title}" yang Anda tunggu telah tersedia kembali di perpustakaan.`,
          related_id: item.book_id,
          related_type: 'book',
        });
      }

      // 9. Cek apakah semua buku dalam loan ini sudah selesai
      const { data: remainingBorrowed } = await supabase
        .from('loan_items')
        .select('id')
        .eq('loan_id', loan.id)
        .eq('status', 'borrowed');

      if (!remainingBorrowed || remainingBorrowed.length === 0) {
        await supabase
          .from('loans')
          .update({ status: 'completed' })
          .eq('id', loan.id);
      }

      setMsg({
        type: 'success',
        text: `Buku "${item.book?.title}" berhasil diproses! ${
          overdueFine > 0 ? `Denda keterlambatan: ${formatCurrency(overdueFine)}. ` : ''
        }${replacementCost > 0 ? `Biaya penggantian fisik: ${formatCurrency(replacementCost)}.` : ''}`,
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
