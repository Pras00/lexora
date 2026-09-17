'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BookOpen, BookmarkCheck, ArrowRight, BookMarked } from 'lucide-react';
import { BookWithCategory } from '@/types';
import { useCartStore } from '@/stores/cart.store';

interface HighlightBookCardProps {
  book: BookWithCategory;
  isLoggedIn: boolean;
}

export function HighlightBookCard({ book, isLoggedIn }: HighlightBookCardProps) {
  const router = useRouter();
  const { addItem, hasItem } = useCartStore();
  const [imgError, setImgError] = useState(false);
  const isAdded = hasItem(book.id);

  const handleBorrowClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn) {
      // Belum login -> Arahkan ke login dengan redirect kembali ke buku ini
      router.push(`/login?redirectTo=/catalog/${book.id}`);
      return;
    }

    // Sudah login -> Masukkan ke keranjang dan arahkan ke formulir pengajuan
    addItem(book);
    router.push('/requests/new');
  };

  return (
    <div className="group flex flex-col rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-[var(--surface)] overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-indigo-300 dark:hover:border-indigo-800">
      {/* Cover Container */}
      <Link
        href={`/catalog/${book.id}`}
        className="relative h-64 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden block"
      >
        {book.cover_url && !imgError ? (
          <Image
            src={book.cover_url}
            alt={book.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-[var(--muted)] p-4 text-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
            <BookOpen className="w-12 h-12 stroke-1 mb-2 text-indigo-500 opacity-60" />
            <span className="text-xs font-medium text-[var(--muted)] line-clamp-2">
              {book.title}
            </span>
          </div>
        )}

        {/* Kategori Badge */}
        {book.category && (
          <span className="absolute top-3 left-3 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-black/70 text-white backdrop-blur-md shadow-xs">
            {book.category.name}
          </span>
        )}

        {/* Stock Status Badge */}
        <span
          className={`absolute bottom-3 right-3 px-3 py-1.5 text-xs font-semibold rounded-lg backdrop-blur-md shadow-xs ${
            book.available_stock > 0
              ? 'bg-emerald-600/90 text-white'
              : 'bg-rose-600/90 text-white'
          }`}
        >
          {book.available_stock > 0
            ? `Tersedia ${book.available_stock} Eks.`
            : 'Stok Habis'}
        </span>
      </Link>

      {/* Book Information & Action */}
      <div className="flex-1 flex flex-col p-5 justify-between gap-4">
        <div>
          <Link href={`/catalog/${book.id}`}>
            <h3
              className="font-bold text-lg text-[var(--foreground)] line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug"
              title={book.title}
            >
              {book.title}
            </h3>
          </Link>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1.5 truncate">
            {book.author} • {book.published_year}
          </p>
          {book.description && (
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-2.5 line-clamp-2 leading-relaxed">
              {book.description}
            </p>
          )}
        </div>

        {/* Action Button */}
        <div className="pt-3.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleBorrowClick}
            disabled={book.available_stock <= 0}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold shadow-xs transition-all cursor-pointer ${
              book.available_stock <= 0
                ? 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-600 cursor-not-allowed'
                : isAdded
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-md'
            }`}
          >
            {isAdded ? (
              <>
                <BookmarkCheck className="w-4 h-4" />
                <span>Di Keranjang Pinjam</span>
              </>
            ) : (
              <>
                <BookMarked className="w-4 h-4" />
                <span>Pinjam Sekarang</span>
              </>
            )}
          </button>

          <Link
            href={`/catalog/${book.id}`}
            className="flex items-center justify-center w-11 h-11 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 transition-colors"
            title="Lihat Detail Buku"
          >
            <ArrowRight className="w-4.5 h-4.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
