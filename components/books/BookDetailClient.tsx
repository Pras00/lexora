'use client';

import Image from 'next/image';
import Link from 'next/link';
import { BookWithCategory } from '@/types';
import { useCartStore } from '@/stores/cart.store';
import { formatCurrency } from '@/lib/utils';
import {
  BookOpen,
  Check,
  Plus,
  ArrowLeft,
  Calendar,
  Building,
  Barcode,
  Info,
  ShieldAlert,
} from 'lucide-react';

interface BookDetailClientProps {
  book: BookWithCategory;
}

export function BookDetailClient({ book }: BookDetailClientProps) {
  const { addItem, hasItem } = useCartStore();
  const isAdded = hasItem(book.id);
  const isOutOfStock = book.available_stock <= 0;

  return (
    <div className="space-y-6">
      <Link
        href="/catalog"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Kembali ke Katalog
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-6 md:p-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
        {/* Cover Image */}
        <div className="relative h-80 md:h-[420px] w-full rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800">
          {book.cover_url ? (
            <Image
              src={book.cover_url}
              alt={book.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover"
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-[var(--muted)]">
              <BookOpen className="w-12 h-12 stroke-1 text-slate-400 mb-2" />
              <span className="text-xs">Tidak ada sampul</span>
            </div>
          )}
        </div>

        {/* Info Detail */}
        <div className="md:col-span-2 flex flex-col justify-between">
          <div>
            {book.category && (
              <span className="inline-block px-3 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 text-xs font-semibold mb-3">
                {book.category.name}
              </span>
            )}

            <h1 className="text-2xl md:text-3xl font-bold text-[var(--foreground)] tracking-tight">
              {book.title}
            </h1>

            <p className="text-sm font-medium text-[var(--muted)] mt-1.5">
              Karya <strong className="text-[var(--foreground)]">{book.author}</strong>
            </p>

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 my-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-[var(--border)] text-xs">
              <div className="flex items-center gap-2">
                <Barcode className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <div>
                  <p className="text-[var(--muted)]">ISBN</p>
                  <p className="font-mono font-medium text-[var(--foreground)]">{book.isbn}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <div>
                  <p className="text-[var(--muted)]">Penerbit</p>
                  <p className="font-medium text-[var(--foreground)] truncate">{book.publisher || '-'}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <div>
                  <p className="text-[var(--muted)]">Tahun Terbit</p>
                  <p className="font-medium text-[var(--foreground)]">{book.published_year || '-'}</p>
                </div>
              </div>
            </div>

            {/* Sinopsis */}
            <div>
              <h4 className="text-sm font-semibold text-[var(--foreground)] mb-2">Deskripsi Buku</h4>
              <p className="text-xs md:text-sm text-[var(--muted)] leading-relaxed">
                {book.description || 'Tidak ada deskripsi detail untuk buku ini.'}
              </p>
            </div>
          </div>

          {/* Action Bar Bawah */}
          <div className="mt-8 pt-6 border-t border-[var(--border)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    isOutOfStock
                      ? 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400'
                      : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                  }`}
                >
                  {isOutOfStock ? 'Stok Fisik Habis' : `Tersedia: ${book.available_stock} dari ${book.total_stock} buku`}
                </span>
              </div>
              <p className="text-[11px] text-[var(--muted)] mt-1 flex items-center gap-1">
                <ShieldAlert className="w-3 h-3 text-amber-500" />
                Estimasi nilai buku: {formatCurrency(book.price)} (acuan ganti rugi jika rusak/hilang)
              </p>
            </div>

            <button
              onClick={() => addItem(book)}
              disabled={isOutOfStock || isAdded}
              className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs md:text-sm font-medium transition-all ${
                isAdded
                  ? 'bg-emerald-600 text-white cursor-default'
                  : isOutOfStock
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Ada di Keranjang Peminjaman</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Tambah ke Keranjang Pinjam</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
