'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Book, Plus, Check, BookOpen } from 'lucide-react';
import { BookWithCategory } from '@/types';
import { useCartStore } from '@/stores/cart.store';
import { formatCurrency } from '@/lib/utils';

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
    addItem(book);
  };

  return (
    <div className="group flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden transition-all duration-200 hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-900">
      {/* Cover Buku */}
      <Link href={`/catalog/${book.id}`} className="relative h-52 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden block">
        {book.cover_url && !imgError ? (
          <Image
            src={book.cover_url}
            alt={book.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-[var(--muted)] p-4 text-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
            <BookOpen className="w-10 h-10 stroke-1 mb-2 text-indigo-500 opacity-60" />
            <span className="text-xs font-medium text-[var(--muted)] line-clamp-2">{book.title}</span>
          </div>
        )}

        {/* Kategori Badge */}
        {book.category && (
          <span className="absolute top-3 left-3 px-2.5 py-1 text-[11px] font-medium rounded-md bg-black/60 text-white backdrop-blur-xs">
            {book.category.name}
          </span>
        )}
      </Link>

      {/* Konten Buku */}
      <div className="flex-1 flex flex-col p-4 justify-between">
        <div>
          <Link href={`/catalog/${book.id}`}>
            <h3 className="font-semibold text-sm md:text-base text-[var(--foreground)] line-clamp-1 group-hover:text-indigo-600 transition-colors" title={book.title}>
              {book.title}
            </h3>
          </Link>
          <p className="text-xs text-[var(--muted)] mt-1 truncate">
            {book.author} {book.published_year ? `• ${book.published_year}` : ''}
          </p>
        </div>

        {/* Info Stok & Action */}
        <div className="mt-4 pt-3 border-t border-[var(--border)] flex items-center justify-between">
          <div>
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                isOutOfStock
                  ? 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400'
                  : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
              }`}
            >
              {isOutOfStock ? 'Stok Habis' : `Stok: ${book.available_stock}`}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock || isAdded}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              isAdded
                ? 'bg-emerald-600 text-white cursor-default'
                : isOutOfStock
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs hover:shadow-sm'
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
