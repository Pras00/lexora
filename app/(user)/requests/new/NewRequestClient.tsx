'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  Trash2,
  BookOpen,
  Clock,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Plus,
  ShieldAlert,
  MapPin,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { useCartStore } from '@/stores/cart.store';
import { PageHeader } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { createLoanRequest } from '@/app/actions/requests';
import { formatCurrency } from '@/lib/utils';
import { BookWithCategory } from '@/types';

export function NewRequestClient() {
  const router = useRouter();
  const { items, removeItem, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-64 flex flex-col items-center justify-center gap-2 text-xs text-muted">
        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <span>Memuat keranjang peminjaman...</span>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Keranjang Peminjaman"
          description="Daftar koleksi buku yang ingin Anda ajukan untuk dipinjam dari perpustakaan Lexora."
        />
        <EmptyState
          icon={BookOpen}
          title="Keranjang Anda Masih Kosong"
          description="Jelajahi ribuan koleksi buku fisik kami dan tambahkan buku favorit Anda ke dalam keranjang."
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
      </div>
    );
  }

  const totalSelected = items.length;
  const maxQuota = 5;
  const remainingQuota = maxQuota - totalSelected;
  const totalValue = items.reduce(
    (acc, curr) => acc + (Number(curr.book.price) || 0),
    0
  );

  const handleSubmitRequest = async () => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const bookIds = items.map((item) => item.book.id);
      const res = await createLoanRequest(bookIds);

      if (!res.success) {
        setErrorMsg(res.error || 'Gagal membuat pengajuan peminjaman.');
        return;
      }

      // Sukses: Bersihkan keranjang dan alihkan ke detail pengajuan
      clearCart();
      router.push(`/requests/${res.requestId}`);
      router.refresh();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Terjadi kesalahan sistem.';
      setErrorMsg(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Konfirmasi Pengajuan Peminjaman"
        description="Periksa kembali buku pilihan Anda sebelum mengirimkan pengajuan reservasi fisik ke loket sirkulasi."
      />

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 flex items-start gap-3 text-xs md:text-sm text-red-600 dark:text-red-400">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* ── Kolom Kiri: Koleksi Buku di Keranjang (2 Kolom di Desktop) ── */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between pb-1">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-foreground">
                Koleksi yang Diajukan
              </h3>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                {totalSelected} dari {maxQuota} buku
              </span>
            </div>
            <button
              type="button"
              onClick={clearCart}
              className="text-xs font-medium text-muted hover:text-rose-600 transition-colors cursor-pointer"
            >
              Kosongkan Keranjang
            </button>
          </div>

          {/* List Kartu Buku */}
          <div className="space-y-3">
            {items.map(({ book }) => {
              const bookWithCategory = book as unknown as BookWithCategory;
              const categoryName =
                bookWithCategory.category?.name || 'Koleksi Perpustakaan';

              return (
                <div
                  key={book.id}
                  className="group relative flex items-center gap-4 p-4 sm:p-5 rounded-2xl border border-border bg-surface hover:border-indigo-300 dark:hover:border-indigo-800/60 shadow-xs transition-all duration-200"
                >
                  {/* Sampul Buku Proporsi Fisik Realistis */}
                  <Link
                    href={`/catalog/${book.id}`}
                    className="relative w-18 sm:w-21 h-26 sm:h-30 rounded-xl overflow-hidden bg-surface-secondary shrink-0 shadow-xs border border-border/60 block group-hover:scale-102 transition-transform duration-200"
                  >
                    {book.cover_url ? (
                      <Image
                        src={book.cover_url}
                        alt={book.title}
                        fill
                        sizes="100px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-slate-400 p-2 text-center bg-slate-100 dark:bg-slate-800">
                        <BookOpen className="w-6 h-6 mb-1 opacity-50" />
                        <span className="text-[10px] line-clamp-1">{book.title}</span>
                      </div>
                    )}
                    {/* Spine Shadow Realistis */}
                    <div className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-black/35 via-white/10 to-transparent pointer-events-none z-10" />
                  </Link>

                  {/* Informasi Detail Buku */}
                  <div className="flex-1 min-w-0 pr-1">
                    {/* Kategori Badge & Status Stok */}
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-surface-secondary text-muted border border-border/70">
                        {categoryName}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Tersedia {book.available_stock} di rak
                      </span>
                    </div>

                    {/* Judul Buku */}
                    <Link href={`/catalog/${book.id}`}>
                      <h4
                        className="font-bold text-sm sm:text-base text-foreground line-clamp-1 group-hover:text-primary transition-colors"
                        title={book.title}
                      >
                        {book.title}
                      </h4>
                    </Link>

                    {/* Pengarang & Penerbit */}
                    <p className="text-xs text-muted font-medium mt-0.5 truncate">
                      Karya <strong className="text-foreground">{book.author}</strong>
                      {book.publisher ? ` · ${book.publisher}` : ''}
                      {book.published_year ? ` (${book.published_year})` : ''}
                    </p>

                    {/* Metadata Bottom Row: ISBN & Estimasi Nilai Tanggungan */}
                    <div className="flex flex-wrap items-center gap-3 text-xs mt-2.5">
                      <span className="font-mono text-[11px] text-muted">
                        ISBN: {book.isbn}
                      </span>
                      <span className="text-muted/40">•</span>
                      <span className="inline-flex items-center gap-1 text-[11px] text-muted">
                        <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
                        Nilai Buku: {formatCurrency(book.price)}
                      </span>
                    </div>
                  </div>

                  {/* Tombol Hapus Buku */}
                  <button
                    type="button"
                    onClick={() => removeItem(book.id)}
                    className="p-2 sm:p-2.5 text-muted hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-all cursor-pointer shrink-0 border border-transparent hover:border-rose-200 dark:hover:border-rose-900/40"
                    title={`Hapus ${book.title} dari keranjang`}
                    aria-label={`Hapus ${book.title}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Slot Tambah Buku Lain (Jika Kuota Belum Penuh) */}
          {remainingQuota > 0 && (
            <Link
              href="/catalog"
              className="group flex flex-col sm:flex-row items-center justify-between p-4 sm:p-5 rounded-2xl border-2 border-dashed border-border hover:border-primary/50 bg-surface/40 hover:bg-surface-secondary/40 transition-all duration-200 gap-3"
            >
              <div className="flex items-center gap-3.5 text-center sm:text-left">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                    Tambah Koleksi Buku Lainnya
                  </h5>
                  <p className="text-xs text-muted font-medium mt-0.5">
                    Masih ada kuota untuk <strong>{remainingQuota} buku</strong> lagi dalam pengajuan ini.
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-primary bg-primary/10 rounded-xl group-hover:bg-primary group-hover:text-white transition-all shrink-0">
                <span>Buka Katalog</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </Link>
          )}
        </div>

        {/* ── Kolom Kanan: Ikhtisar Peminjaman & Konfirmasi ── */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 rounded-2xl border border-border bg-surface shadow-xs p-5 sm:p-6 space-y-5">
            {/* Header Ringkasan */}
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary" />
                <h3 className="font-bold text-sm text-foreground tracking-tight">
                  Ikhtisar Peminjaman
                </h3>
              </div>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">
                {totalSelected} Buku
              </span>
            </div>

            {/* Meteran Kuota Peminjaman */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold mb-2">
                <span className="text-muted">Kuota Peminjaman</span>
                <span className="text-foreground">
                  {totalSelected} <span className="text-muted">/ {maxQuota} buku</span>
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-surface-secondary overflow-hidden flex">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-300"
                  style={{ width: `${(totalSelected / maxQuota) * 100}%` }}
                />
              </div>
            </div>

            {/* Key-Value Details */}
            <div className="space-y-3 pt-1 text-xs">
              <div className="flex items-center justify-between text-muted">
                <span>Durasi Peminjaman</span>
                <strong className="text-foreground font-semibold flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-primary" />
                  14 Hari Kalender
                </strong>
              </div>
              <div className="flex items-center justify-between text-muted">
                <span>Batas Ambil Fisik</span>
                <strong className="text-foreground font-semibold flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  2 Hari Kerja
                </strong>
              </div>
              <div className="flex items-start justify-between text-muted gap-2">
                <span>Lokasi Pengambilan</span>
                <strong className="text-foreground font-semibold text-right flex items-center gap-1 shrink-0">
                  <MapPin className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                  Loket Sirkulasi Lexora
                </strong>
              </div>
              <div className="pt-3 border-t border-border flex items-baseline justify-between">
                <div>
                  <span className="font-semibold text-foreground block">
                    Total Estimasi Nilai Buku
                  </span>
                  <span className="text-[10px] text-muted">
                    Acuan ganti rugi jika hilang/rusak
                  </span>
                </div>
                <span className="font-extrabold text-sm text-foreground font-mono">
                  {formatCurrency(totalValue)}
                </span>
              </div>
            </div>

            {/* Catatan Ketentuan Singkat */}
            <div className="p-3.5 rounded-xl bg-surface-secondary/70 border border-border/80 text-[11px] text-muted space-y-2 leading-relaxed">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Tunjukkan <strong>QR Pickup Pass</strong> di loket fisik saat buku disetujui pustakawan.</span>
              </div>
              <div className="flex items-start gap-2">
                <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                <span>Denda keterlambatan berlaku <strong>Rp 1.000 / buku / hari</strong> jika lewat masa pinjam.</span>
              </div>
            </div>

            {/* Tombol Submit Utama */}
            <div>
              <button
                type="button"
                onClick={handleSubmitRequest}
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs sm:text-sm font-bold shadow-xs hover:shadow-md transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Memproses Pengajuan...</span>
                  </>
                ) : (
                  <>
                    <span>Kirim Pengajuan Peminjaman</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
              <p className="text-center text-[11px] text-muted mt-2.5 leading-relaxed">
                Pustakawan akan memverifikasi kesiapan fisik buku Anda dalam waktu 1x24 jam kerja.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
