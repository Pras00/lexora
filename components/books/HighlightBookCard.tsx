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
      router.push(`/login?redirectTo=/catalog/${book.id}`);
      return;
    }

    addItem(book);
    router.push('/requests/new');
  };

  const inStock = book.available_stock > 0;

  return (
    <div className="group flex flex-col bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden hover:border-indigo-200 dark:hover:border-indigo-800 transition-all duration-300 shadow-sm hover:shadow-md">
      {/* Cover */}
      <Link
        href={`/catalog/${book.id}`}
        className="relative h-64 w-full bg-slate-100 dark:bg-slate-800/50 block overflow-hidden"
        aria-label={`Lihat detail ${book.title}`}
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
          <div className="flex flex-col items-center justify-center h-full text-[var(--foreground)] p-4 text-center bg-[var(--surface)]">
            <BookOpen className="w-10 h-10 stroke-1 mb-2 opacity-40" />
            <span className="text-xs font-medium line-clamp-2">{book.title}</span>
          </div>
        )}

        {/* Kategori label */}
        {book.category && (
          <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-bold tracking-wide uppercase bg-white/90 dark:bg-slate-900/90 text-indigo-700 dark:text-indigo-400 rounded-full backdrop-blur-sm shadow-xs border border-indigo-100 dark:border-indigo-900/50">
            {book.category.name}
          </span>
        )}

        {/* Stock badge */}
        <span
          className={`absolute bottom-3 right-3 px-2.5 py-1 text-[10px] font-bold tracking-wide rounded-full backdrop-blur-sm shadow-xs border ${
            inStock
              ? 'bg-emerald-500/90 text-white border-emerald-600/50'
              : 'bg-rose-500/90 text-white border-rose-600/50'
          }`}
        >
          {inStock ? `${book.available_stock} Tersedia` : 'Habis'}
        </span>
      </Link>

      {/* Info */}
      <div className="flex-1 flex flex-col p-5 gap-3">
        <div>
          <Link href={`/catalog/${book.id}`}>
            <h3 className="font-bold text-lg leading-tight text-[var(--foreground)] group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2" title={book.title}>
              {book.title}
            </h3>
          </Link>
          <p className="text-sm font-medium text-[var(--foreground)] mt-1.5">
            {book.author} · {book.published_year}
          </p>
          {book.description && (
            <p className="text-sm text-[var(--foreground)] mt-2 line-clamp-2 leading-relaxed">
              {book.description}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="pt-4 mt-auto flex items-center gap-2">
          <button
            type="button"
            onClick={handleBorrowClick}
            disabled={!inStock}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-bold rounded-xl transition-all cursor-pointer ${
              !inStock
                ? 'bg-[var(--surface)] text-[var(--foreground)] cursor-not-allowed border border-[var(--border)]'
                : isAdded
                ? 'bg-emerald-100 text-emerald-700 border border-emerald-200 hover:bg-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-900/50'
                : 'bg-indigo-50 text-indigo-700 border border-indigo-100 hover:bg-indigo-100 dark:bg-indigo-950/50 dark:text-indigo-400 dark:border-indigo-900/50 dark:hover:bg-indigo-900/60'
            }`}
          >
            {isAdded ? (
              <>
                <BookmarkCheck className="w-4 h-4" />
                <span>Di Keranjang</span>
              </>
            ) : (
              <>
                <BookMarked className="w-4 h-4" />
                <span>Pinjam</span>
              </>
            )}
          </button>

          <Link
            href={`/catalog/${book.id}`}
            className="flex items-center justify-center w-11 h-11 rounded-xl border border-[var(--border)] text-[var(--foreground)] hover:border-indigo-200 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:border-indigo-800 dark:hover:text-indigo-400 dark:hover:bg-indigo-950/50 transition-all"
            title="Lihat Detail"
          >
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
