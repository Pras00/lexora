'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Check,
  X,
  BookOpen,
  Clock,
  AlertCircle,
  ShieldCheck,
  User,
  Phone,
  Calendar,
  CheckCircle2,
  XCircle,
  HelpCircle,
  CheckCheck,
  Ban,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { LoanRequestWithDetails, BookWithCategory } from '@/types';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { PickupPass } from '@/components/requests/PickupPass';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { formatDate, formatDateTime, formatCurrency } from '@/lib/utils';
import { reviewLoanRequest } from '@/app/actions/requests';

interface AdminRequestReviewClientProps {
  request: LoanRequestWithDetails;
  userActiveBooks?: number;
  userUnpaidFines?: number;
}

const REJECTION_PRESETS = [
  'Buku belum ditemukan di rak',
  'Fisik buku perlu perbaikan',
  'Sedang dipajang / reservasi',
  'Sedang digunakan internal loket',
];

export function AdminRequestReviewClient({
  request,
  userActiveBooks = 0,
  userUnpaidFines = 0,
}: AdminRequestReviewClientProps) {
  const router = useRouter();
  const [decisions, setDecisions] = useState<Record<string, { approved: boolean; reason: string }>>(() => {
    const initial: Record<string, { approved: boolean; reason: string }> = {};
    request.items?.forEach((item) => {
      const bookId = item.book_id || item.book?.id;
      if (!bookId) return;
      const isAvailable = (item.book?.available_stock ?? 0) > 0;
      initial[bookId] = {
        approved: isAvailable,
        reason: isAvailable ? '' : 'Stok fisik buku saat ini habis di rak.',
      };
    });
    return initial;
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isPending = request.status === 'pending';
  const totalBooks = request.items?.length || 0;

  const handleDecisionToggle = (bookId: string, approved: boolean) => {
    setDecisions((prev) => ({
      ...prev,
      [bookId]: {
        approved,
        reason: approved ? '' : prev[bookId]?.reason || REJECTION_PRESETS[0],
      },
    }));
  };

  const handleReasonPreset = (bookId: string, preset: string) => {
    setDecisions((prev) => ({
      ...prev,
      [bookId]: {
        ...prev[bookId],
        reason: preset,
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

  const handleSetAll = (approved: boolean) => {
    setDecisions((prev) => {
      const next = { ...prev };
      request.items?.forEach((item) => {
        const bookId = item.book_id || item.book?.id;
        if (!bookId) return;
        const isOutOfStock = (item.book?.available_stock ?? 0) <= 0;
        if (approved && isOutOfStock) return; // tidak bisa setuju jika stok habis
        next[bookId] = {
          approved,
          reason: approved ? '' : next[bookId]?.reason || REJECTION_PRESETS[0],
        };
      });
      return next;
    });
  };

  const approvedCount = useMemo(() => {
    return Object.values(decisions).filter((d) => d.approved).length;
  }, [decisions]);

  const rejectedCount = useMemo(() => {
    return Object.values(decisions).filter((d) => !d.approved).length;
  }, [decisions]);

  const handleSubmitDecision = async () => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await reviewLoanRequest(request.id, decisions);
      if (!res.success) {
        setErrorMsg(res.error || 'Gagal memproses persetujuan pengajuan.');
        setIsLoading(false);
        return;
      }

      setIsConfirmOpen(false);
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal memproses persetujuan pengajuan.';
      setErrorMsg(message);
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDescription = useMemo(() => {
    if (approvedCount > 0 && rejectedCount > 0) {
      return `Anda akan menyetujui ${approvedCount} buku dan menolak ${rejectedCount} buku untuk pengajuan ${request.request_number}. Tiket QR Pickup Pass akan otomatis diterbitkan untuk koleksi yang disetujui.`;
    } else if (approvedCount > 0 && rejectedCount === 0) {
      return `Seluruh koleksi (${approvedCount} buku) akan disetujui. Peminjam akan menerima tiket QR Pickup Pass dengan batas ambil fisik 2 hari kerja.`;
    } else {
      return `Seluruh koleksi (${rejectedCount} buku) akan ditolak. Pengajuan akan ditandai sebagai ditolak dan peminjam akan menerima notifikasi alasan penolakan.`;
    }
  }, [approvedCount, rejectedCount, request.request_number]);

  return (
    <div className="space-y-6">
      {/* Tombol Navigasi Kembali */}
      <Link
        href="/admin/requests"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-foreground transition-colors group cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        <span>Kembali ke Daftar Pengajuan</span>
      </Link>

      <PageHeader
        title={`Verifikasi Pengajuan: ${request.request_number}`}
        description={`Pemeriksaan fisik ketersediaan koleksi di rak untuk anggota perpustakaan.`}
      />

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 flex items-start gap-3 text-xs md:text-sm text-red-600 dark:text-red-400">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Grid Utama: 8 Kolom Kiri (Verifikasi Buku) & 4 Kolom Kanan (Profil Peminjam & Keputusan) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ── Kolom Kiri: Daftar Koleksi Buku yang Diverifikasi (8 Kolom) ── */}
        <div className="lg:col-span-8 space-y-4">
          {/* Header Bilah Ringkasan Pengajuan */}
          <div className="p-5 sm:p-6 rounded-2xl border border-border bg-surface shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-extrabold text-base text-foreground tracking-tight">
                    {request.request_number}
                  </span>
                  <StatusBadge status={request.status} />
                </div>
                <p className="text-xs text-muted font-medium mt-1">
                  Diajukan pada {formatDateTime(request.requested_at)} • Total {totalBooks} koleksi buku
                </p>
              </div>

              {request.expires_at && isPending && (
                <div className="text-left sm:text-right">
                  <span className="text-xs text-muted flex items-center gap-1 sm:justify-end">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    Batas Verifikasi Pustakawan:
                  </span>
                  <span className="text-xs font-bold text-foreground block mt-0.5">
                    {formatDateTime(request.expires_at)}
                  </span>
                </div>
              )}
            </div>

            {/* Tombol Pintas Setujui/Tolak Semua (Hanya saat status Pending) */}
            {isPending && totalBooks > 1 && (
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <span className="text-xs font-medium text-muted">
                  Aksi Massal Pustakawan:
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleSetAll(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border border-emerald-200 dark:border-emerald-900/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-all cursor-pointer"
                  >
                    <CheckCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Setujui Semua yang Tersedia</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSetAll(false)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all cursor-pointer"
                  >
                    <Ban className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                    <span>Tolak Semua</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Tiket QR Pickup Pass (Jika Pengajuan Sudah Disetujui Pustakawan) */}
          {request.pass && (
            <div className="pt-1">
              <PickupPass pass={request.pass} requestNumber={request.request_number} />
            </div>
          )}

          {/* List Kartu Verifikasi Per Buku */}
          <div className="space-y-4">
            {request.items?.map((item) => {
              const bookId = item.book_id || item.book?.id;
              if (!bookId) return null;

              const decision = decisions[bookId] || { approved: false, reason: '' };
              const isOutOfStock = (item.book?.available_stock ?? 0) <= 0;
              const bookWithCategory = item.book as unknown as BookWithCategory;
              const categoryName = bookWithCategory?.category?.name || 'Koleksi Umum';

              return (
                <div
                  key={item.id}
                  className={`rounded-2xl border p-5 sm:p-6 transition-all duration-200 bg-surface shadow-xs space-y-4 ${
                    isPending
                      ? decision.approved
                        ? 'border-emerald-200 dark:border-emerald-900/50 hover:border-emerald-300'
                        : 'border-rose-200 dark:border-rose-900/50 hover:border-rose-300'
                      : 'border-border'
                  }`}
                >
                  {/* Top Bar: Detail Buku & Kontrol Keputusan Pustakawan */}
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    {/* Visual Sampul & Metadata Buku */}
                    <div className="flex items-start gap-4 min-w-0 flex-1">
                      {/* Sampul Buku Fisik Realistis */}
                      <div className="relative w-16 sm:w-18 h-24 sm:h-26 rounded-xl overflow-hidden bg-surface-secondary shrink-0 shadow-xs border border-border/80">
                        {item.book?.cover_url ? (
                          <Image
                            src={item.book.cover_url}
                            alt={item.book.title}
                            fill
                            sizes="72px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-slate-400">
                            <BookOpen className="w-6 h-6 opacity-40" />
                          </div>
                        )}
                        {/* Spine shadow realistis */}
                        <div className="absolute inset-y-0 left-0 w-2 bg-linear-to-r from-black/40 via-white/10 to-transparent pointer-events-none" />
                      </div>

                      {/* Info Detail */}
                      <div className="min-w-0 flex-1 pr-2">
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-surface-secondary text-muted border border-border/70">
                            {categoryName}
                          </span>

                          {isOutOfStock ? (
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 px-2 py-0.5 rounded-full border border-rose-200 dark:border-rose-900/50">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                              Stok Habis di Rak (0)
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-900/40">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              Tersedia {item.book?.available_stock} di rak
                            </span>
                          )}
                        </div>

                        <h4 className="font-bold text-sm sm:text-base text-foreground line-clamp-1">
                          {item.book?.title}
                        </h4>

                        <p className="text-xs text-muted font-medium mt-0.5 truncate">
                          Karya <strong className="text-foreground">{item.book?.author}</strong>
                          {item.book?.publisher ? ` · ${item.book.publisher}` : ''}
                          {item.book?.published_year ? ` (${item.book.published_year})` : ''}
                        </p>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted mt-2">
                          <span className="font-mono">ISBN: {item.book?.isbn || '-'}</span>
                          {item.book?.price && (
                            <>
                              <span>•</span>
                              <span>Nilai Buku: {formatCurrency(item.book.price)}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Kontrol Segmented Switch Keputusan (Jika masih Pending) */}
                    {isPending ? (
                      <div className="shrink-0 flex flex-col items-end gap-1.5">
                        <span className="text-xs font-medium text-muted">
                          Keputusan Buku Ini:
                        </span>

                        <div className="inline-flex items-center p-1 rounded-xl bg-surface-secondary/80 border border-border gap-1">
                          {/* Tombol Setujui */}
                          <button
                            type="button"
                            onClick={() => handleDecisionToggle(bookId, true)}
                            disabled={isOutOfStock}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 transition-all cursor-pointer ${
                              decision.approved
                                ? 'bg-emerald-600 text-white shadow-2xs'
                                : isOutOfStock
                                ? 'opacity-40 cursor-not-allowed text-muted'
                                : 'text-muted hover:text-foreground hover:bg-surface'
                            }`}
                            title={isOutOfStock ? 'Tidak dapat disetujui karena stok habis di rak' : 'Setujui buku ini'}
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Setujui</span>
                          </button>

                          {/* Tombol Tolak */}
                          <button
                            type="button"
                            onClick={() => handleDecisionToggle(bookId, false)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 transition-all cursor-pointer ${
                              !decision.approved
                                ? 'bg-rose-600 text-white shadow-2xs'
                                : 'text-muted hover:text-foreground hover:bg-surface'
                            }`}
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Tolak</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="shrink-0 flex items-center">
                        <StatusBadge status={item.status} size="md" />
                      </div>
                    )}
                  </div>

                  {/* Panel Alasan Penolakan Terstruktur (Hanya Muncul Jika Buku Ini Ditolak) */}
                  <AnimatePresence initial={false}>
                    {isPending && !decision.approved && (
                      <motion.div
                        key={`rejection-panel-${bookId}`}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.22, ease: 'easeInOut' }}
                        className="overflow-hidden border-t border-border pt-4 mt-2"
                      >
                        <div className="p-4 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/40 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-rose-800 dark:text-rose-300 flex items-center gap-1.5">
                              <XCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                              Alasan Penolakan Buku Ini:
                            </span>
                            <span className="text-xs text-muted">
                              Pilih alasan standar atau tulis catatan
                            </span>
                          </div>

                          {/* Quick Chips Alasan Standar Pustakawan */}
                          <div className="flex flex-wrap items-center gap-1.5">
                            {REJECTION_PRESETS.map((preset) => {
                              const isSelected = decision.reason === preset;
                              return (
                                <button
                                  key={preset}
                                  type="button"
                                  onClick={() => handleReasonPreset(bookId, preset)}
                                  className={`px-3 py-1.5 text-xs rounded-xl border transition-all cursor-pointer ${
                                    isSelected
                                      ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800 font-semibold shadow-2xs'
                                      : 'bg-surface border-border text-muted hover:text-foreground hover:bg-surface-secondary font-medium'
                                  }`}
                                >
                                  {preset}
                                </button>
                              );
                            })}
                          </div>

                          {/* Input Catatan Tambahan Spesifik */}
                          <div className="space-y-1 pt-1">
                            <label className="text-xs text-muted block font-medium">
                              Catatan untuk peminjam (opsional):
                            </label>
                            <input
                              type="text"
                              value={decision.reason}
                              onChange={(e) => handleReasonChange(bookId, e.target.value)}
                              placeholder="Tuliskan catatan ramah untuk peminjam jika diperlukan..."
                              className="w-full px-3.5 py-2 text-xs rounded-xl border border-border bg-surface text-foreground placeholder:text-muted/70 focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs transition-all font-normal"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Catatan Alasan Penolakan untuk Request yang Sudah Diproses */}
                  {!isPending && item.status === 'rejected' && item.rejection_reason && (
                    <div className="p-3 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2">
                      <XCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
                      <span>
                        <strong>Alasan Penolakan:</strong> {item.rejection_reason}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Kolom Kanan: Panel Profil Peminjam & Konfirmasi Keputusan (4 Kolom Sticky) ── */}
        <div className="lg:col-span-4 space-y-5">
          {/* Kartu Profil Identitas Peminjam */}
          <div className="rounded-2xl border border-border bg-surface shadow-xs p-5 sm:p-6 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-border">
              <User className="w-4 h-4 text-primary" />
              <h3 className="font-bold text-sm text-foreground tracking-tight">
                Identitas Peminjam
              </h3>
            </div>

            {/* Nama & Nomor Anggota */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                {request.user?.full_name?.charAt(0) || 'U'}
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-sm text-foreground truncate">
                  {request.user?.full_name}
                </h4>
                <p className="font-mono text-xs text-muted mt-0.5">
                  ID: {request.user?.member_number}
                </p>
              </div>
            </div>

            {/* Metadata Kontak & Status Keanggotaan */}
            <div className="space-y-2.5 text-xs pt-1">
              {request.user?.phone && (
                <div className="flex items-center justify-between text-muted">
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-muted" />
                    Kontak Telepon:
                  </span>
                  <a
                    href={`tel:${request.user.phone}`}
                    className="font-medium text-foreground hover:text-primary transition-colors font-mono"
                  >
                    {request.user.phone}
                  </a>
                </div>
              )}

              <div className="flex items-center justify-between text-muted">
                <span>Status Keanggotaan:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 inline-flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  {request.user?.status === 'active' ? 'Aktif' : request.user?.status}
                </span>
              </div>

              <div className="flex items-center justify-between text-muted">
                <span>Riwayat No-Show:</span>
                <span className="font-medium text-foreground">
                  {request.user?.no_show_count ?? 0} kali pelanggaran
                </span>
              </div>

              <div className="flex items-center justify-between text-muted">
                <span>Pinjaman Fisik Aktif:</span>
                <span className="font-bold text-foreground">
                  {userActiveBooks} buku
                </span>
              </div>

              <div className="flex items-center justify-between text-muted">
                <span>Status Denda:</span>
                {userUnpaidFines > 0 ? (
                  <span className="font-bold text-rose-600 dark:text-rose-400">
                    Ada tunggakan {formatCurrency(userUnpaidFines)}
                  </span>
                ) : (
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    Lunas (Tidak ada denda)
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Kartu Ringkasan Verifikasi & Aksi Eksekusi */}
          <div className="sticky top-20 rounded-2xl border border-border bg-surface shadow-xs p-5 sm:p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <h3 className="font-bold text-sm text-foreground tracking-tight">
                  Ringkasan Keputusan
                </h3>
              </div>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">
                {totalBooks} Buku
              </span>
            </div>

            {/* Statistik Breakdown Disetujui vs Ditolak */}
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40">
                <span className="text-xs text-emerald-700 dark:text-emerald-300 font-medium block">
                  Disetujui
                </span>
                <span className="text-lg font-extrabold text-emerald-700 dark:text-emerald-300 font-mono mt-0.5 block">
                  {approvedCount}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40">
                <span className="text-xs text-rose-700 dark:text-rose-300 font-medium block">
                  Ditolak
                </span>
                <span className="text-lg font-extrabold text-rose-700 dark:text-rose-300 font-mono mt-0.5 block">
                  {rejectedCount}
                </span>
              </div>
            </div>

            {/* Ketentuan Konsekuensi Sirkulasi */}
            <div className="p-3.5 rounded-xl bg-surface-secondary/70 border border-border text-xs text-muted space-y-2 leading-relaxed">
              {approvedCount > 0 ? (
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    Sistem akan menerbitkan <strong>QR Pickup Pass</strong> untuk koleksi yang disetujui (batas ambil 2 hari kerja).
                  </span>
                </div>
              ) : (
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                  <span>
                    Seluruh buku ditolak. Pengajuan akan ditandai sebagai <strong>Ditolak</strong> dan tidak menerbitkan tiket pickup.
                  </span>
                </div>
              )}
            </div>

            {/* Tombol Simpan Keputusan Utama */}
            {isPending && (
              <div>
                <button
                  type="button"
                  onClick={() => setIsConfirmOpen(true)}
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs sm:text-sm font-bold shadow-xs hover:shadow-md transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Konfirmasi Keputusan Peminjaman</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <p className="text-center text-xs text-muted mt-2 leading-relaxed">
                  Periksa kembali fisik buku di rak sebelum mengonfirmasi keputusan sirkulasi.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dialog Konfirmasi Sebelum Eksekusi */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleSubmitDecision}
        title="Konfirmasi Keputusan Verifikasi"
        description={confirmDescription}
        confirmLabel={isLoading ? 'Memproses...' : 'Simpan Keputusan'}
        cancelLabel="Batal"
        variant={approvedCount === 0 ? 'danger' : 'primary'}
        isLoading={isLoading}
      />
    </div>
  );
}
