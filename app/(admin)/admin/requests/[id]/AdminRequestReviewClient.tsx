'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Check, X, BookOpen, Clock, AlertCircle, ShieldCheck } from 'lucide-react';
import { LoanRequestWithDetails } from '@/types';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { PickupPass } from '@/components/requests/PickupPass';
import { formatDate, formatDateTime } from '@/lib/utils';
import { calculatePickupDeadline } from '@/lib/working-days';
import { generatePickupCode } from '@/lib/pickup-code';
import { createClient } from '@/lib/supabase/client';

interface AdminRequestReviewClientProps {
  request: LoanRequestWithDetails;
}

export function AdminRequestReviewClient({ request }: AdminRequestReviewClientProps) {
  const router = useRouter();
  const [decisions, setDecisions] = useState<Record<string, { approved: boolean; reason: string }>>(() => {
    const initial: Record<string, { approved: boolean; reason: string }> = {};
    request.items?.forEach((item) => {
      initial[item.book_id] = {
        approved: item.book?.available_stock > 0,
        reason: item.book?.available_stock <= 0 ? 'Stok fisik buku saat ini habis.' : '',
      };
    });
    return initial;
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const supabase = createClient();

  const isPending = request.status === 'pending';

  const handleDecisionToggle = (bookId: string, approved: boolean) => {
    setDecisions((prev) => ({
      ...prev,
      [bookId]: {
        ...prev[bookId],
        approved,
        reason: approved ? '' : prev[bookId]?.reason || 'Stok tidak mencukupi.',
      },
    }));
  };

  const handleReasonChange = (bookId: string, reason: string) => {
    setDecisions((prev) => ({
      ...prev,
      [bookId]: {
        ...prev[bookId],
        reason,
      },
    }));
  };

  const handleSubmitDecision = async () => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const approvedBookIds = Object.entries(decisions)
        .filter(([_, d]) => d.approved)
        .map(([bookId]) => bookId);

      // Skenario A: Semua Ditolak
      if (approvedBookIds.length === 0) {
        // Update request jadi rejected
        await supabase
          .from('loan_requests')
          .update({
            status: 'rejected',
            admin_id: user?.id || null,
            processed_at: new Date().toISOString(),
          })
          .eq('id', request.id);

        for (const item of request.items) {
          await supabase
            .from('loan_request_items')
            .update({
              status: 'rejected',
              rejection_reason: decisions[item.book_id]?.reason || 'Ditolak oleh petugas.',
            })
            .eq('id', item.id);
        }

        router.refresh();
        return;
      }

      // Skenario B: Ada yang Disetujui (Atomic RPC)
      const pickupDeadline = calculatePickupDeadline(new Date(), 2);
      const pickupCode = generatePickupCode();

      // Panggil atomic RPC function di Supabase
      const { error: rpcError } = await supabase.rpc('approve_loan_request', {
        p_request_id: request.id,
        p_admin_id: user?.id || null,
        p_approved_book_ids: approvedBookIds,
        p_pickup_deadline: pickupDeadline.toISOString(),
        p_pickup_code: pickupCode,
      });

      if (rpcError) {
        throw new Error(rpcError.message);
      }

      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal memproses persetujuan pengajuan.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Link
        href="/admin/requests"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Kembali ke Semua Pengajuan
      </Link>

      <PageHeader
        title={`Verifikasi Pengajuan: ${request.request_number}`}
        description={`Diajukan oleh ${request.user?.full_name} (${request.user?.member_number}) pada ${formatDateTime(request.requested_at)}`}
      />

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 flex items-start gap-3 text-xs text-red-600 dark:text-red-400">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Jika sudah approved dan punya pass */}
      {request.pass && (
        <div className="max-w-xl">
          <PickupPass pass={request.pass} requestNumber={request.request_number} />
        </div>
      )}

      {/* Tabel Item yang Ditinjau */}
      <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] space-y-5">
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
          <h3 className="font-semibold text-sm text-[var(--foreground)]">
            Daftar Buku yang Diminta ({request.items?.length || 0} buku)
          </h3>
          <StatusBadge status={request.status} />
        </div>

        <div className="space-y-4">
          {request.items?.map((item) => {
            const decision = decisions[item.book_id] || { approved: false, reason: '' };
            const isOutOfStock = item.book?.available_stock <= 0;

            return (
              <div
                key={item.id}
                className="p-5 rounded-2xl border border-[var(--border)] bg-slate-50/50 dark:bg-slate-900/30 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <div className="relative w-14 h-18 bg-slate-200 dark:bg-slate-800 rounded-lg overflow-hidden shrink-0">
                    {item.book?.cover_url ? (
                      <Image
                        src={item.book.cover_url}
                        alt={item.book.title}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-slate-400">
                        <BookOpen className="w-6 h-6" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <h4 className="font-semibold text-sm text-[var(--foreground)] truncate">
                      {item.book?.title}
                    </h4>
                    <p className="text-xs text-[var(--muted)] mt-0.5">{item.book?.author}</p>
                    <div className="flex items-center gap-3 text-xs mt-1.5">
                      <span className={item.book?.available_stock > 0 ? 'text-emerald-600 font-medium' : 'text-red-500 font-medium'}>
                        Stok Tersedia: {item.book?.available_stock}
                      </span>
                      <span className="text-[var(--muted)] font-mono">ISBN: {item.book?.isbn}</span>
                    </div>
                  </div>
                </div>

                {/* Kontrol Keputusan Petugas jika masih Pending */}
                {isPending ? (
                  <div className="flex flex-col gap-2 shrink-0 md:w-72">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleDecisionToggle(item.book_id, true)}
                        disabled={isOutOfStock}
                        className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                          decision.approved
                            ? 'bg-emerald-600 text-white'
                            : isOutOfStock
                            ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                            : 'border border-[var(--border)] hover:bg-emerald-50 text-[var(--foreground)]'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Setujui</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDecisionToggle(item.book_id, false)}
                        className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                          !decision.approved
                            ? 'bg-red-600 text-white'
                            : 'border border-[var(--border)] hover:bg-red-50 text-[var(--foreground)]'
                        }`}
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Tolak</span>
                      </button>
                    </div>

                    {!decision.approved && (
                      <input
                        type="text"
                        placeholder="Alasan penolakan..."
                        value={decision.reason}
                        onChange={(e) => handleReasonChange(item.book_id, e.target.value)}
                        className="w-full px-2.5 py-1 text-xs rounded border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)]"
                      />
                    )}
                  </div>
                ) : (
                  <div>
                    <StatusBadge status={item.status} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Submit Keputusan Petugas */}
        {isPending && (
          <div className="pt-4 border-t border-[var(--border)] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleSubmitDecision}
              disabled={isLoading}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs md:text-sm font-semibold shadow-xs transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Memproses Transaksi...' : 'Konfirmasi Keputusan Peminjaman'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
