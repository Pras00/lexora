'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ChevronDown,
  ChevronUp,
  Clock,
  AlertCircle,
  BookOpen,
  ClipboardList,
  CheckCircle2,
  XCircle,
  MapPin,
  Calendar,
  ShieldCheck,
  Plus,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { LoanRequestWithDetails, BookWithCategory } from '@/types';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { PickupPass } from '@/components/requests/PickupPass';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { EmptyState } from '@/components/shared/EmptyState';
import { formatDate, formatDateTime } from '@/lib/utils';
import { cancelLoanRequest } from '@/app/actions/requests';

interface RequestsClientProps {
  initialRequests: LoanRequestWithDetails[];
}

type FilterTab = 'all' | 'pending' | 'approved' | 'history';

export function RequestsClient({ initialRequests }: RequestsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [cancellingRequest, setCancellingRequest] = useState<LoanRequestWithDetails | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Auto-expand request jika diarahkan dengan query ?openId=... (misal sesaat setelah submit pengajuan baru)
  useEffect(() => {
    const openId = searchParams.get('openId') || searchParams.get('id');
    if (openId && initialRequests.some((r) => r.id === openId)) {
      setExpandedIds(new Set([openId]));
    }
  }, [searchParams, initialRequests]);

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Kalkulasi statistik kuota & tab filter
  const pendingRequests = useMemo(
    () => initialRequests.filter((r) => r.status === 'pending'),
    [initialRequests]
  );
  const approvedRequests = useMemo(
    () => initialRequests.filter((r) => r.status === 'approved'),
    [initialRequests]
  );
  const historyRequests = useMemo(
    () =>
      initialRequests.filter((r) =>
        ['completed', 'rejected', 'cancelled', 'expired'].includes(r.status)
      ),
    [initialRequests]
  );

  const activeHeldBooks = useMemo(() => {
    return [...pendingRequests, ...approvedRequests].reduce(
      (acc, r) => acc + (r.items?.length || 0),
      0
    );
  }, [pendingRequests, approvedRequests]);

  const maxQuota = 5;
  const remainingQuota = Math.max(0, maxQuota - activeHeldBooks);

  // Filter daftar pengajuan berdasarkan tab terpilih
  const filteredRequests = useMemo(() => {
    if (activeTab === 'pending') return pendingRequests;
    if (activeTab === 'approved') return approvedRequests;
    if (activeTab === 'history') return historyRequests;
    return initialRequests;
  }, [activeTab, initialRequests, pendingRequests, approvedRequests, historyRequests]);

  const handleCancelRequest = async () => {
    if (!cancellingRequest) return;
    setIsCancelling(true);
    setActionMessage(null);

    try {
      const res = await cancelLoanRequest(cancellingRequest.id);
      if (!res.success) {
        setActionMessage({
          type: 'error',
          text: res.error || 'Gagal membatalkan pengajuan.',
        });
        setIsCancelling(false);
        return;
      }

      setCancellingRequest(null);
      setActionMessage({
        type: 'success',
        text: `Pengajuan ${cancellingRequest.request_number} berhasil dibatalkan.`,
      });
      router.refresh();
    } catch (err: unknown) {
      console.error('Error cancelling loan request:', err);
      setActionMessage({
        type: 'error',
        text: 'Terjadi kesalahan sistem saat membatalkan pengajuan.',
      });
    } finally {
      setIsCancelling(false);
    }
  };

  if (initialRequests.length === 0) {
    return (
      <EmptyState
        icon={ClipboardList}
        title="Belum Ada Pengajuan Peminjaman"
        description="Anda belum memiliki riwayat pengajuan peminjaman buku fisik. Pilih koleksi favorit Anda dari katalog sekarang."
        action={
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold rounded-xl bg-primary hover:bg-primary-hover text-white shadow-xs transition-all active:scale-95"
          >
            <BookOpen className="w-4 h-4" />
            <span>Jelajahi Katalog Buku</span>
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Tab Filter Status Pengajuan ── */}
      <div className="flex flex-wrap items-center gap-2 pb-1">
        <button
          type="button"
          onClick={() => setActiveTab('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'all'
              ? 'bg-primary text-white shadow-2xs'
              : 'bg-surface border border-border text-muted hover:text-foreground hover:bg-surface-secondary'
          }`}
        >
          Semua Koleksi ({initialRequests.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('pending')}
          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'pending'
              ? 'bg-amber-600 text-white shadow-2xs'
              : 'bg-surface border border-border text-muted hover:text-foreground hover:bg-surface-secondary'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          <span>Menunggu Verifikasi ({pendingRequests.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('approved')}
          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'approved'
              ? 'bg-emerald-600 text-white shadow-2xs'
              : 'bg-surface border border-border text-muted hover:text-foreground hover:bg-surface-secondary'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>Siap Diambil di Loket ({approvedRequests.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('history')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'history'
              ? 'bg-slate-700 text-white shadow-2xs'
              : 'bg-surface border border-border text-muted hover:text-foreground hover:bg-surface-secondary'
          }`}
        >
          Riwayat Selesai & Batal ({historyRequests.length})
        </button>
      </div>

      {actionMessage && (
        <div
          className={`p-4 rounded-2xl border flex items-start gap-3 text-xs md:text-sm ${
            actionMessage.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-300'
              : 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400'
          }`}
        >
          {actionMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-600 dark:text-red-400" />
          )}
          <span>{actionMessage.text}</span>
        </div>
      )}

      {/* ── Grid 2-Kolom Seimbang (8 : 4 di Desktop) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ── Kolom Kiri: Daftar Kartu Pengajuan Accordion (8 Kolom) ── */}
        <div className="lg:col-span-8 space-y-4">
          {filteredRequests.length > 0 ? (
            <div className="space-y-4">
              {filteredRequests.map((req) => {
                const isExpanded = expandedIds.has(req.id);
                const canCancel = req.status === 'pending' || req.status === 'approved';
                const totalBooks = req.items?.length || 0;
                const bookItems = req.items || [];

                return (
                  <div
                    key={req.id}
                    className={`rounded-2xl border transition-all duration-200 bg-surface shadow-xs overflow-hidden ${
                      isExpanded
                        ? 'border-primary/50 shadow-sm ring-1 ring-primary/20'
                        : 'border-border hover:border-indigo-200 dark:hover:border-indigo-900/60'
                    }`}
                  >
                    {/* Header Kartu (Klik untuk Expand/Collapse) */}
                    <div
                      onClick={() => toggleExpand(req.id)}
                      className="p-5 sm:p-6 cursor-pointer select-none transition-colors hover:bg-surface-secondary/40 space-y-3"
                    >
                      {/* Top Row: Preview Sampul Mini + Nomor Pengajuan & Status */}
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3.5">
                          {/* Mini Stacked Covers (Visual Preview Buku) */}
                          <div className="flex items-center -space-x-4 shrink-0">
                            {bookItems.slice(0, 3).map((item, idx) => (
                              <div
                                key={item.id}
                                style={{ zIndex: 10 - idx }}
                                className="relative w-8 sm:w-9 h-11 sm:h-12 rounded-md overflow-hidden bg-surface-secondary border-2 border-surface shadow-xs shrink-0"
                              >
                                {item.book?.cover_url ? (
                                  <Image
                                    src={item.book.cover_url}
                                    alt={item.book.title}
                                    fill
                                    sizes="36px"
                                    className="object-cover"
                                  />
                                ) : (
                                  <div className="flex items-center justify-center h-full text-slate-400">
                                    <BookOpen className="w-3.5 h-3.5 opacity-40" />
                                  </div>
                                )}
                                <div className="absolute inset-y-0 left-0 w-1.5 bg-linear-to-r from-black/40 via-white/10 to-transparent pointer-events-none" />
                              </div>
                            ))}
                          </div>

                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-mono font-extrabold text-sm sm:text-base text-foreground tracking-tight">
                                {req.request_number}
                              </span>
                              <StatusBadge status={req.status} />
                            </div>

                            <p className="text-xs text-muted font-medium mt-0.5">
                              Diajukan: {formatDate(req.requested_at)} • {totalBooks} koleksi buku
                            </p>
                          </div>
                        </div>

                        {/* Tombol Toggle Rincian */}
                        <div className="shrink-0">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all ${
                              isExpanded
                                ? 'bg-primary text-white border-primary shadow-2xs'
                                : 'border-border bg-surface-secondary/70 text-foreground hover:bg-surface-secondary'
                            }`}
                          >
                            <span>{isExpanded ? 'Tutup Rincian' : 'Lihat Rincian'}</span>
                            {isExpanded ? (
                              <ChevronUp className="w-3.5 h-3.5" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5" />
                            )}
                          </span>
                        </div>
                      </div>

                      {/* Batas Ambil di Loket Banner (Jika Approved) */}
                      {req.pickup_deadline && req.status === 'approved' && (
                        <div className="flex items-center gap-2 p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 text-xs text-emerald-700 dark:text-emerald-300 font-semibold">
                          <Clock className="w-3.5 h-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                          <span>Batas Ambil di Loket: {formatDateTime(req.pickup_deadline)}</span>
                        </div>
                      )}
                    </div>

                    {/* ── Isi Rincian Dropdown (Accordion Body) ── */}
                    {isExpanded && (
                      <div className="border-t border-border bg-surface-secondary/20 p-5 sm:p-6 space-y-5 animate-in fade-in-50 duration-200">
                        {/* Bilah Status & Batas Waktu */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border/80">
                          <div className="space-y-1">
                            <span className="text-[11px] font-semibold text-muted uppercase tracking-wider block">
                              Status Sirkulasi Pengajuan
                            </span>
                            <div className="flex items-center gap-2">
                              <StatusBadge status={req.status} size="md" />
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-3">
                            {req.expires_at && req.status === 'pending' && (
                              <div className="text-left sm:text-right">
                                <span className="text-[11px] text-muted flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                                  Kedaluwarsa Otomatis:
                                </span>
                                <span className="text-xs font-bold text-foreground block mt-0.5">
                                  {formatDateTime(req.expires_at)}
                                </span>
                              </div>
                            )}

                            {canCancel && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCancellingRequest(req);
                                }}
                                className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all cursor-pointer"
                              >
                                Batalkan Pengajuan
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Tiket QR Pickup Pass (Jika Disetujui Pustakawan) */}
                        {req.status === 'approved' && req.pass && (
                          <div className="pt-1">
                            <PickupPass pass={req.pass} requestNumber={req.request_number} />
                          </div>
                        )}

                        {/* Daftar Koleksi Buku Dalam Pengajuan */}
                        <div className="space-y-3">
                          <h4 className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-1.5">
                            <BookOpen className="w-4 h-4 text-primary" />
                            <span>Koleksi Buku yang Diajukan ({totalBooks} buku)</span>
                          </h4>

                          <div className="space-y-3">
                            {bookItems.map((item) => {
                              const bookWithCategory = item.book as unknown as BookWithCategory;
                              const categoryName =
                                bookWithCategory.category?.name || 'Koleksi Perpustakaan';

                              return (
                                <div
                                  key={item.id}
                                  className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-surface shadow-2xs hover:border-border-strong transition-all"
                                >
                                  {/* Sampul Buku Proporsi Fisik */}
                                  <div className="relative w-14 sm:w-16 h-20 sm:h-22 rounded-xl overflow-hidden bg-surface-secondary shadow-xs border border-border/80 shrink-0">
                                    {item.book?.cover_url ? (
                                      <Image
                                        src={item.book.cover_url}
                                        alt={item.book.title}
                                        fill
                                        sizes="64px"
                                        className="object-cover"
                                      />
                                    ) : (
                                      <div className="flex items-center justify-center h-full text-slate-400">
                                        <BookOpen className="w-6 h-6 opacity-40" />
                                      </div>
                                    )}
                                    {/* Spine shadow realistis */}
                                    <div className="absolute inset-y-0 left-0 w-2.5 bg-linear-to-r from-black/40 via-white/10 to-transparent pointer-events-none" />
                                  </div>

                                  {/* Detail Metadata Buku */}
                                  <div className="flex-1 min-w-0 pr-1">
                                    <div className="flex flex-wrap items-center gap-2 mb-1">
                                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-surface-secondary text-muted border border-border/70">
                                        {categoryName}
                                      </span>
                                    </div>

                                    <h5 className="font-bold text-sm text-foreground truncate">
                                      {item.book?.title}
                                    </h5>

                                    <p className="text-xs text-muted font-medium mt-0.5 truncate">
                                      Karya <strong className="text-foreground">{item.book?.author}</strong>
                                      {item.book?.publisher ? ` · ${item.book.publisher}` : ''}
                                      {item.book?.published_year ? ` (${item.book.published_year})` : ''}
                                    </p>

                                    {item.book?.isbn && (
                                      <p className="font-mono text-[11px] text-muted mt-1">
                                        ISBN: {item.book.isbn}
                                      </p>
                                    )}

                                    {item.rejection_reason && (
                                      <p className="text-xs text-rose-600 dark:text-rose-400 mt-1.5 flex items-center gap-1 font-medium">
                                        <XCircle className="w-3.5 h-3.5 shrink-0" />
                                        <span>Alasan: {item.rejection_reason}</span>
                                      </p>
                                    )}
                                  </div>

                                  {/* Status Per Item Buku */}
                                  <div className="shrink-0">
                                    <StatusBadge status={item.status} />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 rounded-2xl border border-dashed border-border text-center space-y-2">
              <ClipboardList className="w-8 h-8 text-muted mx-auto opacity-40" />
              <p className="text-xs font-semibold text-foreground">
                Tidak ada pengajuan pada kategori filter ini.
              </p>
              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className="text-xs font-bold text-primary hover:underline cursor-pointer"
              >
                Lihat Semua Pengajuan
              </button>
            </div>
          )}
        </div>

        {/* ── Kolom Kanan: Sidebar Informasi Alur & Layanan Sirkulasi (4 Kolom) ── */}
        <div className="lg:col-span-4 space-y-5 sticky top-20">
          {/* Kartu Status Kuota Aktif */}
          <div className="p-5 sm:p-6 rounded-2xl border border-border bg-surface shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary" />
                <h4 className="font-bold text-sm text-foreground tracking-tight">
                  Kuota Peminjaman Anda
                </h4>
              </div>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">
                {activeHeldBooks} / {maxQuota} Buku
              </span>
            </div>

            {/* Meteran Progress Kuota */}
            <div>
              <div className="flex items-center justify-between text-xs font-medium text-muted mb-2">
                <span>Sedang Diajukan / Aktif:</span>
                <span className="font-bold text-foreground">{activeHeldBooks} buku</span>
              </div>
              <div className="w-full h-2 rounded-full bg-surface-secondary overflow-hidden flex">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-300"
                  style={{ width: `${(activeHeldBooks / maxQuota) * 100}%` }}
                />
              </div>
            </div>

            <p className="text-[11px] text-muted leading-relaxed">
              {remainingQuota > 0 ? (
                <>Anda masih memiliki sisa kuota untuk meminjam <strong>{remainingQuota} buku fisik</strong> lagi.</>
              ) : (
                <>Kuota maksimal (5 buku) telah tercapai. Harap selesaikan peminjaman aktif untuk menambah buku baru.</>
              )}
            </p>

            {remainingQuota > 0 && (
              <Link
                href="/catalog"
                className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 px-3 rounded-xl bg-surface-secondary hover:bg-primary hover:text-white text-xs font-bold text-foreground border border-border transition-all cursor-pointer group"
              >
                <Plus className="w-3.5 h-3.5 text-primary group-hover:text-white transition-colors" />
                <span>Tambah Koleksi dari Katalog</span>
              </Link>
            )}
          </div>

          {/* Kartu Alur 3 Langkah Sirkulasi Fisik */}
          <div className="p-5 sm:p-6 rounded-2xl border border-border bg-surface shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-border">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h4 className="font-bold text-sm text-foreground tracking-tight">
                Alur Sirkulasi Fisik Lexora
              </h4>
            </div>

            <div className="space-y-3.5 text-xs">
              {/* Step 1 */}
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <strong className="text-foreground font-semibold block">
                    Verifikasi Fisik di Rak
                  </strong>
                  <p className="text-[11px] text-muted mt-0.5 leading-relaxed">
                    Pustakawan memeriksa ketersediaan dan kondisi buku fisik dalam 1x24 jam kerja.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <strong className="text-foreground font-semibold block">
                    Penerbitan QR Pickup Pass
                  </strong>
                  <p className="text-[11px] text-muted mt-0.5 leading-relaxed">
                    Buku yang disetujui akan menerbitkan tiket QR dengan batas ambil 2 hari kerja.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <strong className="text-foreground font-semibold block">
                    Ambil di Loket Sirkulasi
                  </strong>
                  <p className="text-[11px] text-muted mt-0.5 leading-relaxed">
                    Tunjukkan QR Pass ke petugas loket untuk menerima buku fisik (durasi 14 hari).
                  </p>
                </div>
              </div>
            </div>

            {/* Loket Info Box */}
            <div className="pt-3 border-t border-border space-y-2 text-[11px] text-muted leading-relaxed">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                <span>
                  Loket Sirkulasi: <strong>Gedung Utama Perpustakaan Lexora</strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>Jam Layanan: Senin–Jumat (08.00–16.30 WIB)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Dialog Konfirmasi Pembatalan */}
      <ConfirmDialog
        isOpen={!!cancellingRequest}
        onClose={() => setCancellingRequest(null)}
        onConfirm={handleCancelRequest}
        title="Batalkan Pengajuan Peminjaman"
        description={`Apakah Anda yakin ingin membatalkan pengajuan ${cancellingRequest?.request_number}? Pengajuan yang telah dibatalkan tidak dapat diaktifkan kembali.`}
        confirmLabel="Ya, Batalkan"
        cancelLabel="Kembali"
        variant="danger"
        isLoading={isCancelling}
      />
    </div>
  );
}
