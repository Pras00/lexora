'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowLeft, BookOpen, Clock, AlertCircle } from 'lucide-react';
import { LoanRequestWithDetails } from '@/types';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { PickupPass } from '@/components/requests/PickupPass';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { formatDate, formatDateTime } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';

interface RequestDetailClientProps {
  request: LoanRequestWithDetails;
}

export function RequestDetailClient({ request }: RequestDetailClientProps) {
  const router = useRouter();
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const canCancel = request.status === 'pending' || request.status === 'approved';

  const handleCancelRequest = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('loan_requests')
        .update({ status: 'cancelled' })
        .eq('id', request.id);

      if (error) throw error;

      // Jika sebelumnya approved, kembalikan available_stock buku yang sudah di-approve
      if (request.status === 'approved') {
        const approvedItems = request.items.filter((i) => i.status === 'approved');
        for (const item of approvedItems) {
          // Tambah kembali stok
          const { data: book } = await supabase
            .from('books')
            .select('available_stock')
            .eq('id', item.book_id)
            .single();

          if (book) {
            await supabase
              .from('books')
              .update({ available_stock: book.available_stock + 1 })
              .eq('id', item.book_id);
          }
        }

        // Batalkan pass jika ada
        await supabase
          .from('pickup_passes')
          .update({ status: 'cancelled' })
          .eq('request_id', request.id);
      }

      setIsCancelModalOpen(false);
      router.refresh();
    } catch (err) {
      console.error('Error cancelling request:', err);
      alert('Gagal membatalkan pengajuan.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Link
        href="/requests"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Kembali ke Daftar Pengajuan
      </Link>

      <PageHeader
        title={`Rincian Pengajuan ${request.request_number}`}
        description={`Diajukan pada ${formatDateTime(request.requested_at)}`}
        action={
          canCancel && (
            <button
              onClick={() => setIsCancelModalOpen(true)}
              className="px-3.5 py-2 text-xs font-semibold rounded-lg border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
            >
              Batalkan Pengajuan
            </button>
          )
        }
      />

      {/* Jika Status Approved & Memiliki Pass, tampilkan Kartu QR */}
      {request.status === 'approved' && request.pass && (
        <PickupPass pass={request.pass} requestNumber={request.request_number} />
      )}

      {/* Ringkasan Status Request */}
      <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
          <div>
            <p className="text-xs text-[var(--muted)]">Status Pengajuan:</p>
            <div className="mt-1">
              <StatusBadge status={request.status} size="md" />
            </div>
          </div>

          {request.expires_at && request.status === 'pending' && (
            <div className="text-right">
              <p className="text-xs text-[var(--muted)] flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                Kedaluwarsa Otomatis:
              </p>
              <p className="text-xs font-medium text-[var(--foreground)] mt-0.5">
                {formatDateTime(request.expires_at)}
              </p>
            </div>
          )}
        </div>

        {/* Daftar Buku dalam Pengajuan */}
        <h4 className="text-sm font-semibold text-[var(--foreground)] pt-2">
          Daftar Buku ({request.items?.length || 0} buku)
        </h4>

        <div className="space-y-3">
          {request.items?.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 p-4 rounded-xl border border-[var(--border)] bg-slate-50/50 dark:bg-slate-900/30"
            >
              <div className="relative w-12 h-16 bg-slate-200 dark:bg-slate-800 rounded-md overflow-hidden shrink-0">
                {item.book?.cover_url ? (
                  <Image
                    src={item.book.cover_url}
                    alt={item.book.title}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-400">
                    <BookOpen className="w-5 h-5" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h5 className="font-semibold text-xs md:text-sm text-[var(--foreground)] truncate">
                  {item.book?.title}
                </h5>
                <p className="text-xs text-[var(--muted)] mt-0.5">{item.book?.author}</p>
                {item.rejection_reason && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Alasan: {item.rejection_reason}
                  </p>
                )}
              </div>

              <div>
                <StatusBadge status={item.status} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dialog Konfirmasi Batal */}
      <ConfirmDialog
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={handleCancelRequest}
        title="Batalkan Pengajuan Peminjaman?"
        description="Apakah Anda yakin ingin membatalkan pengajuan ini? Tindakan ini tidak dapat dibatalkan kembali."
        confirmLabel="Ya, Batalkan"
        cancelLabel="Tetap Lanjutkan"
        variant="danger"
        isLoading={isLoading}
      />
    </div>
  );
}
