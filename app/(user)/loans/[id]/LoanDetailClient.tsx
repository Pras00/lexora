'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Clock, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { formatDate } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';

interface LoanDetailClientProps {
  loan: any;
}

export function LoanDetailClient({ loan }: LoanDetailClientProps) {
  const router = useRouter();
  const [extendingItemId, setExtendingItemId] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const supabase = createClient();

  const handleExtendItem = async (item: any) => {
    // 1. Validasi batas maksimal perpanjangan (maks 1x)
    if (item.extension_count >= 1) {
      setStatusMsg({
        type: 'error',
        text: 'Buku ini sudah pernah diperpanjang 1 kali (batas maksimal perpanjangan).',
      });
      return;
    }

    // 2. Validasi apakah sudah overdue
    const isOverdue = new Date(item.due_date) < new Date();
    if (isOverdue) {
      setStatusMsg({
        type: 'error',
        text: 'Buku yang sudah melewati batas waktu (overdue) tidak dapat diperpanjang secara mandiri. Harap kembalikan buku ke loket.',
      });
      return;
    }

    setExtendingItemId(item.id);
    setStatusMsg(null);

    try {
      // 3. Cek apakah ada antrean waitlist untuk buku ini
      const { data: waitlist } = await supabase
        .from('waitlist')
        .select('id')
        .eq('book_id', item.book_id)
        .eq('status', 'waiting');

      const hasWaitlist = waitlist && waitlist.length > 0;

      if (hasWaitlist) {
        // Ada antrean peminjam lain
        setStatusMsg({
          type: 'error',
          text: 'Perpanjangan tidak dapat dilakukan karena terdapat anggota lain dalam daftar tunggu antrean buku ini.',
        });
        setExtendingItemId(null);
        return;
      }

      // 4. Auto-approve: Tambah 7 hari dari due_date saat ini
      const oldDue = new Date(item.due_date);
      const newDue = new Date(oldDue);
      newDue.setDate(newDue.getDate() + 7);

      const { error: updateError } = await supabase
        .from('loan_items')
        .update({
          due_date: newDue.toISOString(),
          extension_count: item.extension_count + 1,
        })
        .eq('id', item.id);

      if (updateError) throw updateError;

      // Catat record di loan_extensions
      await supabase.from('loan_extensions').insert({
        loan_item_id: item.id,
        user_id: loan.user_id,
        status: 'auto_approved',
        old_due_date: oldDue.toISOString(),
        new_due_date: newDue.toISOString(),
        processed_at: new Date().toISOString(),
      });

      setStatusMsg({
        type: 'success',
        text: `Berhasil diperpanjang 7 hari! Tanggal jatuh tempo baru: ${formatDate(newDue)}.`,
      });

      router.refresh();
    } catch (err: any) {
      setStatusMsg({
        type: 'error',
        text: err.message || 'Gagal memproses perpanjangan buku.',
      });
    } finally {
      setExtendingItemId(null);
    }
  };

  return (
    <div className="space-y-6">
      <Link
        href="/loans"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--foreground)] hover:text-[var(--foreground)] transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Kembali ke Daftar Pinjaman Aktif
      </Link>

      <PageHeader
        title="Kelola Peminjaman Buku"
        description={`Pengambilan buku fisik dilakukan pada ${formatDate(loan.pickup_confirmed_at)}`}
      />

      {statusMsg && (
        <div
          className={`p-4 rounded-xl border flex items-start gap-3 text-xs md:text-sm ${
            statusMsg.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-300'
              : 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400'
          }`}
        >
          {statusMsg.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          )}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Daftar Item Buku */}
      <div className="space-y-4">
        {loan.items?.map((item: any) => {
          const isOverdue = new Date(item.due_date) < new Date() && item.status === 'borrowed';
          const canExtend = item.extension_count === 0 && !isOverdue && item.status === 'borrowed';

          return (
            <div
              key={item.id}
              className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2.5">
                  <h4 className="font-semibold text-base text-[var(--foreground)]">
                    {item.book?.title}
                  </h4>
                  <StatusBadge status={isOverdue ? 'overdue' : item.status} />
                </div>
                <p className="text-xs text-[var(--foreground)]">Pengarang: {item.book?.author}</p>
                <div className="flex flex-wrap items-center gap-4 text-xs mt-3 text-[var(--foreground)]">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    Batas Kembali: <strong className="text-[var(--foreground)]">{formatDate(item.due_date)}</strong>
                  </span>
                  <span>
                    Status Perpanjangan:{' '}
                    <strong>{item.extension_count > 0 ? 'Sudah 1x (Maksimal)' : 'Belum pernah'}</strong>
                  </span>
                </div>
              </div>

              <div>
                <button
                  onClick={() => handleExtendItem(item)}
                  disabled={!canExtend || extendingItemId === item.id}
                  className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                    canExtend
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${extendingItemId === item.id ? 'animate-spin' : ''}`} />
                  <span>
                    {extendingItemId === item.id
                      ? 'Memproses...'
                      : item.extension_count > 0
                      ? 'Maksimal 1x Perpanjangan'
                      : isOverdue
                      ? 'Tidak Dapat Diperpanjang'
                      : 'Perpanjang +7 Hari'}
                  </span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
