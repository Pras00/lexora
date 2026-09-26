'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Plus, Check, BookOpen } from 'lucide-react';
import { BookWithCategory } from '@/types';
import { useCartStore } from '@/stores/cart.store';

interface BookCardProps {
  book: BookWithCategory;
}

export function BookCard({ book }: BookCardProps) {
  const { addItem, hasItem } = useCartStore();
  const isAdded = hasItem(book.id);
  const isOutOfStock = book.available_stock <= 0;
  const [imgError, setImgError] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isOutOfStock && !isAdded) {
      addItem(book);
    }
  };

  return (
    <div className="group flex flex-col rounded-2xl border border-border bg-surface overflow-hidden transition-all duration-200 hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700/60 hover:-translate-y-0.5">
      {/* Cover Buku */}
      <Link
        href={`/catalog/${book.id}`}
        className="relative h-56 w-full bg-surface-secondary overflow-hidden block"
      >
        {book.cover_url && !imgError ? (
          <Image
            src={book.cover_url}
            alt={book.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
            <BookOpen className="w-10 h-10 stroke-1 mb-2 text-indigo-500 opacity-60" />
            <span className="text-xs font-medium text-foreground line-clamp-2">
              {book.title}
            </span>
          </div>
        )}

        {/* Kategori Badge */}
        {book.category && (
          <span className="absolute top-3 left-3 px-2.5 py-1 text-[11px] font-semibold rounded-full bg-slate-900/70 text-white backdrop-blur-md shadow-xs">
            {book.category.name}
          </span>
        )}
      </Link>

      {/* Konten Buku */}
      <div className="flex-1 flex flex-col p-4 justify-between">
        <div>
          <Link href={`/catalog/${book.id}`}>
            <h3
              className="font-bold text-sm md:text-base text-foreground line-clamp-1 group-hover:text-primary transition-colors"
              title={book.title}
            >
              {book.title}
            </h3>
          </Link>
          <p className="text-xs font-medium text-muted mt-1 truncate">
            {book.author} {book.published_year ? `• ${book.published_year}` : ''}
          </p>
        </div>

        {/* Info Stok & Action */}
        <div className="mt-4 pt-3 border-t border-border flex items-center justify-between gap-2">
          <div>
            <span
              className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                isOutOfStock
                  ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400'
                  : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
              }`}
            >
              {isOutOfStock ? 'Stok Habis' : `Tersedia: ${book.available_stock}`}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock || isAdded}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              isAdded
                ? 'bg-emerald-600 text-white cursor-default'
                : isOutOfStock
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                : 'bg-primary hover:bg-primary-hover text-white shadow-xs hover:shadow-sm active:scale-95'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Dipilih</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Pinjam</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
